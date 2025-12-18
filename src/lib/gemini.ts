import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
}

function getMimeType(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

export async function generateWithGemini(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const imageBase64 = await fetchImageAsBase64(imageUrl);
  const mimeType = getMimeType(imageUrl);

  const result = await geminiModel.generateContent([
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
    { text: prompt },
  ]);

  return result.response.text();
}
