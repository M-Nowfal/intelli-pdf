import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PRO_ACCESS_LIMIT, RAZORPAY_KEY_SECRET } from "@/utils/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await connectDB();

      await User.findByIdAndUpdate(session.user.id, {
        $set: {
          "subscription.tier": "pro",
          "subscription.expiresAt": new Date(PRO_ACCESS_LIMIT),
          "subscription.lastOrderId": razorpay_order_id,
          "stats.aiCredits": 1000
        }
      });

      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (err: unknown) {
    console.error("Verification Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}