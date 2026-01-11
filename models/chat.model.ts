import { IChat } from "@/types/chat";
import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema<IChat>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    pdfId: { 
      type: Schema.Types.ObjectId, 
      ref: "PDF",
      required: true
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["assistant", "user"]
        },
        content: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema);
