import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { checkDailyLimit, generateOTP, sendOTP, storeOTP } from "@/lib/otp";
import { hash } from "@/lib/password";
import crypto from "crypto";
import { otpFlowOptions } from "@/utils/options";

async function sendOtpAndPrepareFlow(email: string, res: NextResponse) {
  const otp = generateOTP();

  await storeOTP(email, otp);
  await sendOTP(email, otp);

  const otpFlowToken = crypto.randomUUID();

  res.cookies.set("otp_flow", otpFlowToken, otpFlowOptions);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    const res = NextResponse.json({ success: true });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        await sendOtpAndPrepareFlow(email, res);
        return res;
      }

      return NextResponse.json(
        { error: "User already exists, Login or use different email" },
        { status: 400 }
      );
    }

    const allowed = await checkDailyLimit(email);

    if (!allowed) {
      return NextResponse.json(
        { error: "OTP limit exceeded for today" },
        { status: 429 }
      );
    }

    const hashedPassword = await hash(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      stats: {
        totalDocuments: 0,
        flashcardsMastered: 0,
        studyStreak: {
          streak: 0,
          lastActive: Date.now()
        },
        aiCredits: 1000
      },
      provider: "credentials"
    });

    await sendOtpAndPrepareFlow(email, res);

    return res;
  } catch (err: unknown) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
