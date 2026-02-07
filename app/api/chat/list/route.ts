import { Chat } from "@/models/chat.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import "@/models/pdf.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const chatLists = await Chat.find({ userId: session.user?.id })
      .select("pdfId -_id")
      .populate("pdfId", "title _id");
      
    return NextResponse.json(chatLists || []);

  } catch (err: unknown) {
    console.error("Chat List API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}