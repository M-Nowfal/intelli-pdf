import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Embedding } from "@/models/embedding.model";
import { connectDB } from "@/lib/db";
import { pipeline } from "@huggingface/transformers";

let embedder: any = null;

const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "fp32", device: "wasm" }
    );
  }
  return embedder;
};

export async function getEmbeddings(text: string) {
  try {
    const generateEmbedding = await getEmbedder();

    const output = await generateEmbedding(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (err: unknown) {
    console.error("Local query embedding failed:", err);
    throw err;
  }
}

export async function generateAndStoreEmbeddings(
  pdfId: string,
  userId: string,
  pages: { text: string; pageNumber: number }[]
) {
  try {
    await connectDB();
    const generateEmbedding = await getEmbedder();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const embeddingData = [];
    console.log(`Processing PDF ${pdfId} with @huggingface/transformers...`);

    for (const page of pages) {
      const cleanedText = page.text.replace(/\s+/g, " ").trim();
      if (cleanedText.length < 10) continue;

      const chunks = await splitter.createDocuments([cleanedText]);

      for (const chunk of chunks) {
        const output = await generateEmbedding(chunk.pageContent, {
          pooling: "mean",
          normalize: true,
        });

        embeddingData.push({
          pdfId,
          userId,
          content: chunk.pageContent,
          embedding: Array.from(output.data),
          metadata: { pageNumber: page.pageNumber },
        });
      }
    }

    if (embeddingData.length > 0) {
      await Embedding.insertMany(embeddingData);
    }

    console.log(`Successfully stored ${embeddingData.length} local embeddings.`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Local document embedding failed:", err);
    throw err;
  }
}