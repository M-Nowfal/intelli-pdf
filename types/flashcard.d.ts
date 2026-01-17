import { Schema } from "mongoose";

interface IFlashcard {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  pdfId: string | Schema.Types.ObjectId;
  question: string;
  answer: string;
}
