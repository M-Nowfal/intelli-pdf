import { Schema } from "mongoose";

interface IEmbedding {
  _id: string;
  pdfId: string | Schema.Types.ObjectId;
  content: string;
  embedding: number[];
  metadata: {
    pageNumber?: number;
    loc?: { lines: { from: number; to: number } };
  }
}
