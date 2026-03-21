import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { differenceInCalendarDays } from "date-fns";
import { DAILY_CREDIT_AWARD } from "@/utils/constants";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user?.subscription?.tier === "pro") {
      const proExpiryDate = new Date(user.subscription.expiresAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return NextResponse.json({
        success: true,
        message: `You have unlimited credits upto ${proExpiryDate}`
      }, { status: 200 });
    }

    const now = new Date();
    const lastClaim = user.stats.lastClaimedAt ? new Date(user.stats.lastClaimedAt) : new Date(user.createdAt);

    const daysSinceLastClaim = differenceInCalendarDays(now, lastClaim);

    if (daysSinceLastClaim < 1) {
      return NextResponse.json({
        success: false,
        message: "You have already claimed your credits for today. Come back tomorrow!"
      }, { status: 400 });
    }

    const creditsToAward = daysSinceLastClaim * DAILY_CREDIT_AWARD;

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { "stats.aiCredits": creditsToAward },
      $set: { "stats.lastClaimedAt": now }
    });

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAward,
      daysCounted: daysSinceLastClaim,
      message: `Success! You claimed ${creditsToAward} credits for ${daysSinceLastClaim} day(s).`
    });

  } catch (err: unknown) {
    console.error("Credit Claim Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}