import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Embedding } from "@/models/embedding.model";
import { connectDB } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/utils/constants";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateAndStoreEmbeddings(
  pdfId: string,
  fullText: string
) {
  try {
    await connectDB();

    const cleanedText = fullText.replace(/\s+/g, " ").trim();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([cleanedText]);

    const embeddingPromises = docs.map(async (doc) => {
      const result = await model.embedContent(doc.pageContent);
      const vector = result.embedding.values;

      return {
        pdfId: pdfId,
        content: doc.pageContent,
        embedding: vector,
        metadata: {
          loc: doc.metadata.loc,
        }
      };
    });

    const embeddingData = await Promise.all(embeddingPromises);

    await Embedding.insertMany(embeddingData);

    console.log(`Stored ${embeddingData.length} chunks for PDF ${pdfId}`);
    return { success: true };

  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}