import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Chat } from "@/models/chat.model";
import { PDF } from "@/models/pdf.model";
import { compare } from "@/lib/password";
import { verifyOTP } from "@/lib/otp";
import { UTApi } from "uploadthing/server";
import { Embedding } from "@/models/embedding.model";
import { Flashcard } from "@/models/flashcard.model";
import { Quiz } from "@/models/quiz.model";
import { Summary } from "@/models/summary.model";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { verificationValue } = body;

    await connectDB();
    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.provider === "google") {
      const isValidOtp = await verifyOTP(user.email, verificationValue);
      if (!isValidOtp) {
        return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
      }
    } else {
      const isPasswordValid = await compare(verificationValue, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
      }
    }

    const userPdfs = await PDF.find({ userId: user._id });
    const publicIds = userPdfs.map((pdf) => pdf.publicId).filter(Boolean);

    if (publicIds.length > 0) {
      await new UTApi().deleteFiles(publicIds);
    }

    await Promise.all([
      Chat.deleteMany({ userId: user._id }),
      PDF.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id),
      Embedding.deleteMany({ userId: user._id }),
      Flashcard.deleteMany({ userId: user._id }),
      Quiz.deleteMany({ userId: user._id }),
      Summary.deleteMany({ userId: user._id })
    ]);

    return NextResponse.json({ message: "Account deleted successfully" });

  } catch (err: unknown) {
    console.error("Delete Account Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}