import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Quiz } from "@/models/quiz.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { quizId, score } = await req.json();

    await connectDB();

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizId, userId: session.user.id },
      { score: score },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, score: updatedQuiz.score });

  } catch (err: unknown) {
    console.error("Quiz Submit Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}