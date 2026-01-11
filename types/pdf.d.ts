import { Schema } from "mongoose";

interface IPDF {
  _id: string;
  userId: string | Schema.Types.ObjectId;
  title: string;
  fileUrl: string;
  publicId: string;
  pages: number;
  fileSize: number;
  createdAt: Date;
}
