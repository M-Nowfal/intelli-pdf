import { Schema } from "mongoose";

interface IFlashcard {
  _id: string;
  pdfId: string | Schema.Types.ObjectId;
  question: string;
  answer: string;
}
