import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { Flashcard } from "@/models/flashcard.model";
import { User } from "@/models/user.model";
import "@/models/pdf.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cards = await Flashcard.find({ userId: session.user?.id })
      .populate("pdfId", "title _id")
      .sort({ createdAt: -1 });

    return NextResponse.json(cards || []);
  } catch (err: unknown) {
    console.error("Fetch Flashcards Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const flashCardId = searchParams.get("flashCardId");

    if (!flashCardId) {
      return NextResponse.json({ message: "Flash Card ID is required" }, { status: 400 });
    }

    const deletedCard = await Flashcard.findByIdAndDelete(flashCardId);

    if (!deletedCard) {
      return NextResponse.json({ message: "FlashCard not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(
      session.user.id,
      [{
        $set: {
          "stats.flashcardsMastered": {
            $max: [0, { $subtract: ["$stats.flashcardsMastered", 1] }]
          }
        }
      }],
      { new: true, updatePipeline: true }
    );

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("Delete Flashcards Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}