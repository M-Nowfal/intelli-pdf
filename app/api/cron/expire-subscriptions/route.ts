import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectDB();

    const result = await User.updateMany(
      {
        "subscription.tier": "pro",
        "subscription.expiresAt": { $lt: new Date() }
      },
      {
        $set: {
          "subscription.tier": "free",
          "subscription.expiresAt": null
        }
      }
    );

    console.log(`CRON SUCCESS: Demoted ${result.modifiedCount} expired subscriptions.`);
    
    return NextResponse.json({ 
      success: true, 
      demotedCount: result.modifiedCount 
    });

  } catch (err: unknown) {
    console.error("CRON FAILURE:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}