import { IFlashcard } from "@/types/flashcard";
import { Schema, model, models } from "mongoose";

const FlashcardSchema = new Schema<IFlashcard>(
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
    cards: [
      {
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
    ]
  },
  { timestamps: true }
);

FlashcardSchema.index({ pdfId: 1 });

export const Flashcard = models.Flashcard || model<IFlashcard>("Flashcard", FlashcardSchema);