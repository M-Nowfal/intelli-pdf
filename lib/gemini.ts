import { GOOGLE_API_KEY } from "@/utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function getEmbeddings(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const result = await model.embedContent({
      content: {
        parts: [{ text }],
        role: "user"
      },
      outputDimensionality: 768,
    } as any);

    return result.embedding.values;
  } catch (err) {
    console.error("Embedding generation failed:", err);
    throw err;
  }
}