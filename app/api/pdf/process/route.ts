import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { PDF } from "@/models/pdf.model";
import { generateAndStoreEmbeddings } from "@/lib/embeddings";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { fileUrl, fileKey, fileName, fileSize } = await req.json();
    if (!fileUrl) return NextResponse.json({ message: "Missing file URL" }, { status: 400 });

    const res = await fetch(fileUrl);
    const buffer = Buffer.from(await res.arrayBuffer());

    const parsed = await pdfParse(buffer);
    const extractedText = parsed.text;
    const pageCount = parsed.numpages;

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({
        message: "This PDF contains no readable text. It might be a scanned image.",
        error: "OCR_REQUIRED"
      }, { status: 422 });
    }

    await connectDB();

    const newPDF = await PDF.create({
      userId: session.user.id,
      title: fileName,
      fileUrl: fileUrl,
      publicId: fileKey,
      pages: pageCount,
      fileSize: fileSize,
    });

    await generateAndStoreEmbeddings(newPDF._id.toString(), extractedText);

    return NextResponse.json({ success: true, pdfId: newPDF._id });
  } catch (err: any) {
    console.error("Processing Error:", err);
    return NextResponse.json({ 
      message: "Failed to process PDF", 
      error: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 });
  }
}