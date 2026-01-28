import { GOOGLE_API_KEY } from "@/utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function getEmbeddings(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.warn("New model failed, falling back to stable embedding-001");
    
    const fallbackModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await fallbackModel.embedContent(text);
    return result.embedding.values;
  }
}
