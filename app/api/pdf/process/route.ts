import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { PDF } from "@/models/pdf.model";
import { generateAndStoreEmbeddings } from "@/lib/embeddings";
import pdfParse from "pdf-parse";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl, fileKey, fileName, fileSize } = await req.json();
    if (!fileUrl) return NextResponse.json({ message: "Missing file URL" }, { status: 400 });

    await connectDB();

    const existingPDF = await PDF.findOne({
      userId: session.user.id,
      title: fileName
    });

    if (existingPDF) {
      try {
        await utapi.deleteFiles(fileKey);
      } catch (deleteError) {
        console.error("Failed to delete duplicate file from UploadThing:", deleteError);
      }

      return NextResponse.json(
        { message: "Duplicate file: You have already uploaded a PDF with this name." },
        { status: 409 }
      );
    }

    const res = await fetch(fileUrl);
    const buffer = Buffer.from(await res.arrayBuffer());

    const pages: { text: string; pageNumber: number }[] = [];

    const parsed = await pdfParse(buffer, {
      pagerender: function (pageData: any) {
        return pageData.getTextContent().then(function (textContent: any) {
          let text = "";
          for (let item of textContent.items) {
            text += item.str + " ";
          }

          pages.push({
            text: text,
            pageNumber: pageData.pageIndex + 1
          });

          return text;
        });
      }
    });

    const extractedText = parsed.text;
    const pageCount = parsed.numpages;

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({
        message: "This PDF contains no readable text. It might be a scanned image.",
        error: "OCR_REQUIRED"
      }, { status: 422 });
    }

    const newPDF = await PDF.create({
      userId: session.user.id,
      title: fileName,
      fileUrl: fileUrl,
      publicId: fileKey,
      pages: pageCount,
      fileSize: fileSize,
    });

    await generateAndStoreEmbeddings(newPDF._id.toString(), session.user.id, pages);

    return NextResponse.json({ success: true, newPDF });

  } catch (err: unknown) {
    console.error("Processing Error:", err);
    return NextResponse.json({
      message: "Failed to process PDF",
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}