import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Flashcard } from "@/models/flashcard.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cards = await Flashcard.find({ userId: session.user?.id });

    return NextResponse.json(cards || []);
  } catch (err: unknown) {
    console.error("Fetch Flashcards Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}