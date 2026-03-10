import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/chat.model";
import { APP_URL } from "@/utils/constants";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId, isShared } = await req.json();

    if (!chatId) {
      return NextResponse.json({ message: "Chat ID is required" }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: session.user.id },
      { $set: { isShared } },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ message: "Chat not found or unauthorized" }, { status: 404 });
    }

    const baseUrl = APP_URL;
    const shareUrl = `${baseUrl}/share/chat/${chat._id}`;

    return NextResponse.json({
      success: true,
      isShared: chat.isShared,
      shareUrl
    });
  } catch (err: unknown) {
    console.error("Share chat error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const chat = await Chat.findOne({ _id: searchParams.get("chatid"), isShared: true })
      .populate("pdfId", "title")
      .lean();

    if (!chat?.isShared) {
      return NextResponse.json(
        { message: "The owner has stopped sharing this chat." },
        { status: 403 }
      );
    }

    if (!chat) {
      return NextResponse.json(
        { message: "Chat not found or is not public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, chat });
  } catch (err: unknown) {
    console.error("Error fetching shared chat:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}