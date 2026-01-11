import { Schema } from "mongoose";

interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface IChat {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  pdfId: string | Schema.Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
}
