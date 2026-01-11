import { IPDF } from "@/types/pdf";
import { Schema, model, models } from "mongoose";

const PDFSchema = new Schema<IPDF>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    title: {
      type: String,
      trim: true,
      required: true
    },
    fileUrl: {
      type: String,
      trim: true,
      required: true
    },
    publicId: {
      type: String,
      trim: true,
      required: true
    },
    pages: {
      type: Number,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export const PDF = models.PDF || model<IPDF>("PDF", PDFSchema);
