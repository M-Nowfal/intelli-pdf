import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.referralCode) {
      const newCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      user.referralCode = newCode;
      await user.save();
    }

    return NextResponse.json({ referralCode: user.referralCode });

  } catch (err: unknown) {
    console.error("Credit Claim Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
