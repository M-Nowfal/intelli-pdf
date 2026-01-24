import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { PDF } from "@/models/pdf.model";
import { Flashcard } from "@/models/flashcard.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const [
      user,
      totalDocuments,
      documentsThisWeek,
      totalFlashCards
    ] = await Promise.all([
      User.findById(userId),
      PDF.countDocuments({ userId }),
      PDF.countDocuments({ 
        userId, 
        createdAt: { $gte: oneWeekAgo }
      }),
      Flashcard.countDocuments({ userId })
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const stats = {
      totalDocuments: totalDocuments,
      weeklyUploads: documentsThisWeek,
      flashcardsMastered: totalFlashCards,
      studyStreak: user.stats?.studyStreak || { streak: 0, lastStudyDate: null },
      aiCredits: user.stats?.aiCredits || 0
    };

    return NextResponse.json({ success: true, stats });

  } catch (err: unknown) {
    console.error("Stats Fetch Error:", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}