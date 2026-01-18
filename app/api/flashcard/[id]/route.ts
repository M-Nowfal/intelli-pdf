import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Flashcard } from "@/models/flashcard.model";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id: pdfId } = await params;

    if (!pdfId) return new NextResponse("PDF ID is required", { status: 400 });

    await connectDB();

    const flashcardDoc = await Flashcard.findOne({ userId: session.user.id, pdfId });

    if (!flashcardDoc) {
      return NextResponse.json([]);
    }

    return NextResponse.json(flashcardDoc.cards.reverse());

  } catch (err: unknown) {
    console.error("Fetch Flashcards Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id: pdfId } = await params;
    const { cardId } = await req.json();

    if (!pdfId || !cardId) {
      return new NextResponse("PDF ID and Card ID are required", { status: 400 });
    }

    await connectDB();

    const result = await Flashcard.updateOne(
      { userId: session.user.id, pdfId },
      { $pull: { cards: { _id: cardId } } }
    );

    if (result.modifiedCount === 0) {
      return new NextResponse("Card not found", { status: 404 });
    }

    return new NextResponse("Deleted", { status: 200 });

  } catch (err: unknown) {
    console.error("Delete Flashcard Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}