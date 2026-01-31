import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) 
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("+password");

    if (!user || !user.password) {
      return NextResponse.json({ message: "User not found or uses Google login" }, { status: 404 });
    }

    const isValid = await compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
    }

    user.password = await hash(newPassword);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}