import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { sendCreditAwardedMail } from "@/helpers/referral.helper";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isVerified && user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });

      if (referrer) {
        await User.findByIdAndUpdate(referrer._id, {
          $inc: { "stats.aiCredits": 500 }
        });
        await sendCreditAwardedMail(referrer.email, referrer.name);
      }
    }

    user.isVerified = true;
    await user.save();

    const res = NextResponse.json({ success: true });

    res.cookies.delete("otp_flow");

    return res;
  } catch (err: unknown) {
    console.error("OTP Verification Error:", err);
    return NextResponse.json(
      { message: "Verification failed", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
