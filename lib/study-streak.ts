import { User } from "@/models/user.model";
import { subDays, isSameDay } from "date-fns";

export async function calculateStreak(userId: string): Promise<{ newStreak: number, today: Date }> {
  try {
    const user = await User.findById(userId);
    const lastActive = user.stats.studyStreak.lastActive ? new Date(user.stats.studyStreak.lastActive) : new Date(0);
    const today = new Date();

    let newStreak = user.stats.studyStreak.streak;

    if (isSameDay(lastActive, today)) {
      // Already studied today, do nothing
    } else if (isSameDay(lastActive, subDays(today, 1))) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    return { newStreak, today };
  } catch (err: unknown) {
    console.error("Something went wrong.", err);
    throw err;
  }
}