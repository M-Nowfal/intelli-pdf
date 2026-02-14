import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Quiz } from "@/models/quiz.model";
import { Embedding } from "@/models/embedding.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { COST, GOOGLE_API_KEY } from "@/utils/constants";
import { GENERATE_QUIZ_PROMPT } from "@/lib/prompts";
import { PDF } from "@/models/pdf.model";
import { User } from "@/models/user.model";
import { calculateStreak } from "@/lib/study-streak";

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

    if (parseInt(amount) < 3 || parseInt(amount) > 50) {
      return NextResponse.json({ message: "Amount must be between 3 - 50" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (user.stats.aiCredits < COST) {
      return NextResponse.json(
        { message: "Insufficient credits. Please upgrade your plan." },
        { status: 402 }
      );
    }

    const embeddingDocs = await Embedding.find({ pdfId });

    if (!embeddingDocs || embeddingDocs.length === 0) {
      return NextResponse.json({ message: "No content found for this PDF" }, { status: 404 });
    }

    const contextText = embeddingDocs.map((doc) => doc.content).join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let quizDoc = await Quiz.findOne({ userId: session.user.id, pdfId });

    const prompt = GENERATE_QUIZ_PROMPT(contextText, amount, quizDoc?.questions || []);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const newQuestions = JSON.parse(cleanedText);

    if (quizDoc) {
      quizDoc.questions.push(...newQuestions);
      await quizDoc.save();
    } else {
      const pdfIdAndTitle = await PDF.findById(pdfId).select("title");

      quizDoc = await Quiz.create({
        userId: session.user.id,
        pdfId: pdfIdAndTitle,
        questions: newQuestions,
        score: 0
      });

      const { newStreak, today } = await calculateStreak(session.user.id);

      await User.findByIdAndUpdate(session.user.id, {
        $inc: {
          "stats.aiCredits": -20
        },
        $set: {
          "stats.studyStreak.streak": newStreak,
          "stats.studyStreak.lastActive": today
        }
      });
    }

    return NextResponse.json(quizDoc);
  } catch (err: unknown) {
    console.error("Quiz Generation Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}