import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Embedding } from "@/models/embedding.model";
import { connectDB } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/utils/constants";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

type PageData = {
  text: string;
  pageNumber: number;
};

export async function generateAndStoreEmbeddings(
  pdfId: string,
  userId: string,
  pages: PageData[]
) {
  try {
    await connectDB();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const embeddingData = [];

    console.log(`Processing ${pages.length} pages for PDF ${pdfId}...`);

    for (const page of pages) {
      const cleanedText = page.text.replace(/\s+/g, " ").trim();
      
      if (cleanedText.length < 10) continue;

      const chunks = await splitter.createDocuments([cleanedText]);

      for (const chunk of chunks) {
        const result = await model.embedContent(chunk.pageContent);
        const vector = result.embedding.values;

        embeddingData.push({
          pdfId: pdfId,
          userId,
          content: chunk.pageContent,
          embedding: vector,
          metadata: {
            pageNumber: page.pageNumber,
          },
        });
      }
    }

    if (embeddingData.length > 0) {
      await Embedding.insertMany(embeddingData);
    }

    console.log(`Stored ${embeddingData.length} chunks for PDF ${pdfId}`);
    return { success: true };

  } catch (err: unknown) {
    console.error("Error generating embeddings:", err);
    throw err;
  }
}