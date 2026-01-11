import { IFlashcard } from "@/types/flashcard";
import { Schema, model, models } from "mongoose";

const FlashcardSchema = new Schema<IFlashcard>(
  {
    pdfId: { 
      type: Schema.Types.ObjectId, 
      ref: "PDF",
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    }
  }
);

export const Flashcard = models.Flashcard || model<IFlashcard>("Flashcard", FlashcardSchema);
