import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("_id");

    if (!user) {
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    return NextResponse.json({ isValid: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("Autherization Failed:", err);
    return NextResponse.json(
      { message: "Autherization failed", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}