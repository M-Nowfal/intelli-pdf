import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Quiz } from "@/models/quiz.model";
import { Embedding } from "@/models/embedding.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/utils/constants";
import { GENERATE_QUIZ_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    let quiz = await Quiz.findOne({ pdfId: id, userId: session.user.id }).populate("pdfId", "title");

    if (quiz) {
      return NextResponse.json(quiz);
    }

    const embeddingDocs = await Embedding.find({ pdfId: id }).limit(15);

    if (!embeddingDocs || embeddingDocs.length === 0) {
      return NextResponse.json({ message: "No content found for this PDF to generate quiz" }, { status: 404 });
    }

    const contextText = embeddingDocs.map((doc) => doc.content).join("\n\n");

    const defaultAmount = 5;
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = GENERATE_QUIZ_PROMPT(contextText, defaultAmount);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanedText);

    const newQuiz = await Quiz.create({
      userId: session.user.id,
      pdfId: id,
      questions: questions,
      score: 0
    });

    const populatedQuiz = await Quiz.findById(newQuiz._id).populate("pdfId", "title");

    return NextResponse.json(populatedQuiz);

  } catch (err: unknown) {
    console.error("Quiz Fetch/Generate Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  await connectDB();

  await Quiz.findOneAndDelete({ pdfId: id, userId: session.user?.id });

  return NextResponse.json({ success: true });
}