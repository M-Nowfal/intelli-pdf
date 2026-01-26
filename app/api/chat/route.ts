import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import { Embedding } from "@/models/embedding.model";
import { Chat } from "@/models/chat.model";
import { getEmbeddings } from "@/lib/gemini";
import mongoose from "mongoose";
import { COST, GOOGLE_API_KEY } from "@/utils/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { GENERATE_CHAT_PROMPT } from "@/lib/prompts";
import { User } from "@/models/user.model";

export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messages, pdfId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userQuestion = lastMessage.content;

    await connectDB();

    const user = await User.findById(session.user.id);

    if (user.stats.aiCredits < COST - 10) {
      return NextResponse.json(
        { message: "Insufficient credits. Please upgrade your plan." },
        { status: 402 }
      );
    }

    let chat = await Chat.findOne({ userId: session.user?.id, pdfId });

    if (!chat) {
      chat = new Chat({
        userId: session.user?.id,
        pdfId,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      content: userQuestion,
    });

    await chat.save();

    const queryVector = await getEmbeddings(userQuestion);
    const similarDocs = await Embedding.aggregate([
      {
        $vectorSearch: {
          index: "vector_search",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 4,
          filter: {
            pdfId: new mongoose.Types.ObjectId(pdfId),
          },
        },
      },
      {
        $project: { _id: 0, content: 1, metadata: 1 },
      },
    ]);

    const pageNumbers = Array.from(
      new Set(
        similarDocs.map(doc => doc.metadata?.pageNumber)
          .filter(num => num !== undefined && num !== null)
      )
    ).sort((a, b) => a - b);

    const contextText = similarDocs.map((doc) => doc.content).join("\n\n");

    const prompt = GENERATE_CHAT_PROMPT(contextText, userQuestion);

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const streamingResponse = await model.generateContentStream(prompt);

    let fullAiResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of streamingResponse.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              fullAiResponse += chunkText;
              controller.enqueue(encoder.encode(chunkText));
            }
          }

          await Chat.updateOne(
            { _id: chat._id },
            {
              $push: {
                messages: {
                  role: "assistant",
                  content: fullAiResponse,
                  sources: pageNumbers
                }
              }
            }
          );

          await User.findByIdAndUpdate(session.user.id, {
            $inc: {
              "stats.aiCredits": -10
            }
          });

          controller.close();
        } catch (err: unknown) {
          controller.error(err);
        }
      },
    });

    const response = new NextResponse(stream,
      {
        headers: {
          "x-chat-id": chat._id.toString(),
          "x-sources": JSON.stringify(pageNumbers)
        }
      });

    return response;

  } catch (err: unknown) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");

    if (!pdfId) {
      return NextResponse.json({ message: "PDF ID is required" }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findOne({
      userId: session.user?.id,
      pdfId: pdfId
    }).select("messages");

    if (!chat) {
      return NextResponse.json([]);
    }

    return NextResponse.json(chat);

  } catch (err: unknown) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}