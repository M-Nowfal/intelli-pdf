import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { PRO_ACCESS_LIMIT } from "@/utils/constants";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const paymentData = event.payload.payment.entity;
    
    const userId = paymentData.notes.userId;
    const orderId = paymentData.order_id;

    await connectDB();
    
    await User.findByIdAndUpdate(userId, {
      $set: {
        "subscription.tier": "pro",
        "subscription.expiresAt": new Date(PRO_ACCESS_LIMIT),
        "subscription.lastOrderId": orderId,
        "stats.aiCredits": 1000
      }
    });

    console.log(`Successfully upgraded user: ${userId}`);
  }

  return new NextResponse("OK", { status: 200 });
}