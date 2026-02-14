import { IQuiz } from "@/types/quiz";
import { Schema, model, models } from "mongoose";

const QuizSchema = new Schema<IQuiz>(
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
    questions: [
      {
        question: String,
        options: [String],
        answer: String,
      },
    ],
    score: Number,
  }
);

QuizSchema.index({ pdfId: 1 });

export const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema);
