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
  isPinned: boolean;
  isShared: boolean;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: number[];
}

export interface ChatItem {
  _id: string;
  isPinned: boolean;
  isShared?: boolean;
  updatedAt: Date;
  pdfId: {
    _id: string;
    title: string;
  };
}