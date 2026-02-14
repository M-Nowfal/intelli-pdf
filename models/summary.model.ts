import { ISummary } from "@/types/summary";
import { Schema, model, models } from "mongoose";

const SummarySchema = new Schema<ISummary>(
  {
    pdfId: {
      type: Schema.Types.ObjectId,
      ref: "PDF"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  }
);

SummarySchema.index({ pdfId: 1 });

export const Summary = models.Summary || model<ISummary>("Summary", SummarySchema);
