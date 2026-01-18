import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Flashcard } from "@/models/flashcard.model";
import { Embedding } from "@/models/embedding.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/utils/constants";
import mongoose from "mongoose";
import { GENERATE_FLASHCARD_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { pdfId, count } = await req.json();

    if (!pdfId) {
      return NextResponse.json({ message: "PDF ID is required" }, { status: 400 });
    }

    if (parseInt(count) < 1 || parseInt(count) > 20) {
      return NextResponse.json({ message: "Count must be between 1 - 20" }, { status: 400 });
    }

    await connectDB();

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
    } else {
      flashcardDoc = await Flashcard.create({
        userId: session.user.id,
        pdfId,
        cards: newCardsData,
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