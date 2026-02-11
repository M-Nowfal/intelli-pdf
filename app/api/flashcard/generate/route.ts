import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Flashcard } from "@/models/flashcard.model";
import { Embedding } from "@/models/embedding.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { COST, GOOGLE_API_KEY } from "@/utils/constants";
import mongoose from "mongoose";
import { GENERATE_FLASHCARD_PROMPT } from "@/lib/prompts";
import { User } from "@/models/user.model";
import { calculateStreak } from "@/lib/study-streak";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { pdfId, count } = await req.json();

    if (!pdfId) {
      return NextResponse.json({ message: "PDF ID is required" }, { status: 400 });
    }

    if (parseInt(count) < 3 || parseInt(count) > 50) {
      return NextResponse.json({ message: "Count must be between 3 - 50" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (user.stats.aiCredits < COST) {
      return NextResponse.json(
        { message: "Insufficient credits. Please upgrade your plan." },
        { status: 402 }
      );
    }

    const contextDocs = await Embedding.find({ pdfId: new mongoose.Types.ObjectId(pdfId) }).select("content");

    if (!contextDocs.length) return new NextResponse("No content found to generate cards", { status: 404 });

    const contextText = contextDocs.map((doc) => doc.content).join("\n\n");

    const prompt = GENERATE_FLASHCARD_PROMPT(contextText, count);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const newCardsData = JSON.parse(cleanedJson);

    let flashcardDoc = await Flashcard.findOne({ userId: session.user.id, pdfId });

    if (flashcardDoc) {
      flashcardDoc.cards.push(...newCardsData);
      await flashcardDoc.save();

      await User.findByIdAndUpdate(session.user.id, {
        $inc: {
          "stats.flashcardsMastered": 1,
          "stats.aiCredits": -20
        }
      });
    } else {
      flashcardDoc = await Flashcard.create({
        userId: session.user.id,
        pdfId,
        cards: newCardsData,
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

    return NextResponse.json(flashcardDoc.cards);

  } catch (err: unknown) {
    console.error("Generate Flashcards Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}