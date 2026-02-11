import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { PDF } from "@/models/pdf.model";
import { differenceInCalendarDays } from "date-fns";

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

    const [user, documentsThisWeek] = await Promise.all([
      User.findById(userId),
      PDF.countDocuments({ userId, createdAt: { $gte: oneWeekAgo } }),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let currentStreak = user.stats.studyStreak.streak;
    const lastActive = user.stats.studyStreak.lastActive
      ? new Date(user.stats.studyStreak.lastActive)
      : null;

    if (lastActive) {
      const daysDifference = differenceInCalendarDays(now, lastActive);

      if (daysDifference > 1) {
        currentStreak = 0;

        await User.findByIdAndUpdate(userId, { "stats.studyStreak.streak": 0 });
      }
    }

    const stats = {
      totalDocuments: user.stats.totalDocuments,
      weeklyUploads: documentsThisWeek,
      flashcardsMastered: user.stats.flashcardsMastered,
      studyStreak: {
        streak: currentStreak,
        lastActive: user.stats.studyStreak.lastActive
      },
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