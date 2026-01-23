import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Quiz } from "@/models/quiz.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();

    const quizzes = await Quiz.find({ userId: session.user.id })
      .populate("pdfId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(quizzes);
  } catch (err: unknown) {
    console.error("Quiz List Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}