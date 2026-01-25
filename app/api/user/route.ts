import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/user.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await User.findById(session.user.id, "provider -_id");

    return NextResponse.json(user);

  } catch (err: unknown) {
    console.error("User fetch Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ message: "Name is Required" }, { status: 400 });
    }

    await User.findByIdAndUpdate(session.user?.id, {
      $set: { name }
    });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("User Updation Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}