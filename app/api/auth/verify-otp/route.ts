import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, otp } = await req.json();

  const isValid = await verifyOTP(email, otp);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  await connectDB();
  await User.updateOne({ email }, { isVerified: true });

  const res = NextResponse.json({ success: true });

  res.cookies.delete("otp_flow");

  return res;
}
