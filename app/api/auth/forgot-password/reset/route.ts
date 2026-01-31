import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { verifyOTP } from "@/lib/otp";
import { hash } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" }, 
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await hash(password);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}