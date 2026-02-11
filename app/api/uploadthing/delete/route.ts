import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { UTApi } from "uploadthing/server";
import { PDF } from "@/models/pdf.model";

const utapi = new UTApi();

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return new NextResponse("File uploaded id is required.", { status: 400 });
    }

    try {
      await utapi.deleteFiles(publicId);
    } catch (deleteError) {
      console.error("Failed to delete file from UploadThing:", deleteError);
    }

    await PDF.findOneAndDelete({ publicId });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("UploadThing deletion Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}