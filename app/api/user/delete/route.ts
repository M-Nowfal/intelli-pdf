import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { generateOTP, storeOTP, sendOTP, verifyOTP } from "@/lib/otp";
import { compare } from "@/lib/password";
import { Chat } from "@/models/chat.model";
import { PDF } from "@/models/pdf.model";
import { Embedding } from "@/models/embedding.model";
import { Flashcard } from "@/models/flashcard.model";
import { Quiz } from "@/models/quiz.model";
import { Summary } from "@/models/summary.model";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.provider === "google") {
      const otp = generateOTP();
      await storeOTP(user.email, otp);
      await sendOTP(user.email, otp);

      return NextResponse.json({
        type: "OTP",
        message: "Verification code sent to your email."
      });
    }

    return NextResponse.json({
      type: "PASSWORD",
      message: "Please enter your password to confirm."
    });

  } catch (error) {
    console.error("Delete Initiation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { verificationValue, type } = await req.json();

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("+password");

    if (type === "OTP") {
      const isValidOtp = await verifyOTP(session?.user?.email, verificationValue);

      if (!isValidOtp) {
        return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
      }
    } else if (type === "PASSWORD") {
      const isValid = await compare(verificationValue, user.password);
      if (!isValid) {
        return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
      }
    }

    const userPdfs = await PDF.find({ userId: user._id });

    const fileKeys = userPdfs.map((pdf: any) => pdf.publicId).filter(Boolean);

    const deletePromises: Promise<any>[] = [
      Chat.deleteMany({ userId: user._id }),
      PDF.deleteMany({ userId: user._id }),
      Embedding.deleteMany({ userId: user._id }),
      Flashcard.deleteMany({ userId: user._id }),
      Quiz.deleteMany({ userId: user._id }),
      Summary.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id)
    ];

    if (fileKeys.length > 0) {
      deletePromises.push(utapi.deleteFiles(fileKeys));
    }

    await Promise.all(deletePromises);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete Confirmation Error:", error);
    return NextResponse.json({ message: "Error deleting account" }, { status: 500 });
  }
}