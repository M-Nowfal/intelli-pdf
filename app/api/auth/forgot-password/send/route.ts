import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import {
  generateOTP,
  sendOTP,
  storeOTP,
  checkDailyLimit,
  canResendOTP
} from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email." },
        { status: 404 }
      );
    }

    const canResend = await canResendOTP(email);
    if (!canResend) {
      return NextResponse.json(
        { message: "Please wait 1 minute before requesting another code." },
        { status: 429 }
      );
    }

    const dailyLimit = await checkDailyLimit(email);
    if (!dailyLimit) {
      return NextResponse.json(
        { message: "Daily limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    await storeOTP(email, otp);

    sendOTP(email, otp).catch(err => console.error("Email send failed:", err));

    return NextResponse.json({ success: true, message: "OTP sent successfully" });

  } catch (err: unknown) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}