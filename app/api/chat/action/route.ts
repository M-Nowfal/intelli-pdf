import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { Chat } from "@/models/chat.model";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { chatId } = await req.json();
    
    if (!chatId) {
      return NextResponse.json({ message: "ChatId is required" }, { status: 400 });
    }
    
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: session.user?.id },
      { $set: { messages: [] } },
      { new: true }
    );
    
    if (!updatedChat) {
      return NextResponse.json({ message: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("Chat Action API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
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
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ message: "ChatId is required" }, { status: 400 });
    }

    const deletedChat = await Chat.findOneAndDelete({
      _id: chatId,
      userId: session.user?.id
    });

    if (!deletedChat) {
      return NextResponse.json({ message: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("Chat Action API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}