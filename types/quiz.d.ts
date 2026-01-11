import { Schema } from "mongoose";

interface IQuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface IQuiz {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  pdfId: string | Schema.Types.ObjectId;
  questions: IQuizQuestion[];
  score?: number;
}
