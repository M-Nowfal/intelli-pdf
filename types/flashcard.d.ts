import { Schema } from "mongoose";

export interface IFlashcardItem {
  _id: string;
  question: string;
  answer: string;
}

export interface IFlashcard {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  pdfId: string | Schema.Types.ObjectId;
  cards: IFlashcardItem[];
}