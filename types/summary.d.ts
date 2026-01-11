import { Schema } from "mongoose";

interface ISummary {
  _id: string;
  pdfId: string | Schema.Types.ObjectId;
  content: string;
}
