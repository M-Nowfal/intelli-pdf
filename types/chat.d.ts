import { Types } from "mongoose";

export interface IChatMessage {
  _id: string | Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  sources: number[];
  createdAt: Date;
}

export interface IChat {
  _id: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  pdfId: string | Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}