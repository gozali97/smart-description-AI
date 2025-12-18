import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});

export async function generateWithMistral(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const response = await mistral.chat.complete({
    model: "pixtral-12b-2409",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            imageUrl: imageUrl,
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  throw new Error("Invalid response from Mistral");
}
