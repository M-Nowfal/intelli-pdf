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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pdfId, amount } = await req.json();

    if (!pdfId || !amount) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const existingQuiz = await Quiz.findOne({ userId: session.user.id, pdfId });
    if (existingQuiz) {
      return NextResponse.json(existingQuiz);
    }

    const embeddingDocs = await Embedding.find({ pdfId }).limit(15);

    if (!embeddingDocs || embeddingDocs.length === 0) {
      return NextResponse.json({ message: "No content found for this PDF" }, { status: 404 });
    }

    const contextText = embeddingDocs.map((doc) => doc.content).join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = GENERATE_QUIZ_PROMPT(contextText, amount);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanedText);

    const newQuiz = await Quiz.create({
      userId: session.user.id,
      pdfId: pdfId,
      questions: questions,
      score: 0
    });

    return NextResponse.json({ quizId: newQuiz._id, questions: newQuiz.questions });

  } catch (err: unknown) {
    console.error("Quiz Generation Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}