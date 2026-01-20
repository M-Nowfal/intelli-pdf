import { IEmbedding } from "@/types/embedding";
import { Schema, model, models } from "mongoose";

const EmbeddingSchema = new Schema<IEmbedding>({
  pdfId: { 
    type: Schema.Types.ObjectId, 
    ref: "PDF",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true,
    index: true
  },
  metadata: {
    pageNumber: Number
  }
});

export const Embedding = models.Embedding || model<IEmbedding>("Embedding", EmbeddingSchema);
