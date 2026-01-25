import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { PDF } from "@/models/pdf.model";
import { Embedding } from "@/models/embedding.model";
import { Flashcard } from "@/models/flashcard.model";
import { Chat } from "@/models/chat.model";
import { Summary } from "@/models/summary.model";
import { Quiz } from "@/models/quiz.model";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pdfs = await PDF.find({ userId: session.user?.id }).sort({ createdAt: -1 });

    return NextResponse.json(pdfs);
  } catch (err: unknown) {
    return NextResponse.json({
      message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("id");

    if (!pdfId) {
      return NextResponse.json({ message: "Missing PDF ID" }, { status: 400 });
    }

    await connectDB();

    const pdf = await PDF.findOne({ _id: pdfId, userId: session.user?.id });
    if (!pdf) {
      return NextResponse.json({ message: "PDF not found or access denied" }, { status: 404 });
    }

    if (pdf.publicId) {
      try {
        await utapi.deleteFiles(pdf.publicId);
      } catch (deleteError) {
        console.error("Failed to delete file from UploadThing:", deleteError);
      }
    }

    await Promise.all([
      PDF.findByIdAndDelete(pdfId),
      Embedding.deleteMany({ pdfId }),
      Flashcard.deleteMany({ pdfId }),
      Chat.deleteMany({ pdfId }),
      Summary.deleteMany({ pdfId }),
      Quiz.deleteMany({ pdfId }),
    ]);

    return NextResponse.json({ success: true, message: `PDF "${pdf.title}" deleted successfully` });

  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({
      message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}