import { Schema } from "mongoose";

interface ISummary {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  pdfId: string | Schema.Types.ObjectId;
  content: string;
}
