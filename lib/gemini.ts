import { pipeline } from "@huggingface/transformers";

let embedder: any = null;

const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "fp32" }
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