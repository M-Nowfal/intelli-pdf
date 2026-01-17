import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Summary } from "@/models/summary.model";
import { PDF } from "@/models/pdf.model";
import { Embedding } from "@/models/embedding.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/utils/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GENERATE_SUMMARY_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: pdfId } = await params;

    if (!pdfId) {
      return new NextResponse("PDF ID is required", { status: 400 });
    }

    await connectDB();

    const existingSummary = await Summary.findOne(
      { pdfId, userId: session.user?.id }
    ).populate("pdfId", "title");

    if (existingSummary) {
      return NextResponse.json({
        summary: existingSummary.content,
        pdfTitle: existingSummary.pdfId.title,
        source: "database"
      });
    }

    const pdfRecord = await PDF.findById(pdfId);
    if (!pdfRecord) {
      return new NextResponse("PDF not found", { status: 404 });
    }

    const embeddings = await Embedding.find({ pdfId }).sort({
      'metadata.pageNumber': 1,
      'metadata.loc.lines.from': 1
    });

    if (!embeddings || embeddings.length === 0) {
      return new NextResponse("No content found for this PDF (Processings might be incomplete)", { status: 404 });
    }

    const fullText = embeddings
      .map((e) => e.content)
      .join("\n")
      .substring(0, 30000);

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = GENERATE_SUMMARY_PROMPT(fullText);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiSummary = response.text();

    try {
      await Summary.create({
        pdfId,
        userId: session.user.id,
        content: aiSummary,
      });

      return NextResponse.json({
        summary: aiSummary,
        pdfTitle: pdfRecord.title,
        source: "generated"
      });
    } catch (err: any) {
      if (err.code === 11000) {
        const winnerSummary = await Summary.findOne({ pdfId });
        return NextResponse.json({
          summary: winnerSummary?.content || aiSummary,
          pdfTitle: pdfRecord.title,
          source: "database-race-resolved"
        });
      }
      throw err;
    }
  } catch (err: unknown) {
    console.error("[SUMMARY_ERROR]", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
