import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateWithMistral } from "@/lib/mistral";
import { generateWithGemini } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Profile, Product } from "@/types/database";

export interface GenerateRequest {
  imageUrl: string;
  productName: string;
  category: string;
  keyFeatures: string;
  platform: string;
  toneOfVoice: string;
}

export interface GenerationResult {
  marketplace: string;
  instagram: string;
  website: string;
}

const toneDescriptions: Record<string, string> = {
  casual: "santai, friendly, dan mudah dipahami",
  professional: "formal, terpercaya, dan informatif",
  persuasive: "meyakinkan, menggugah emosi, dan mendorong pembelian",
  genz: "kekinian, menggunakan bahasa gaul, emoji, dan relatable untuk anak muda",
};

const categoryContext: Record<string, string> = {
  fashion: "produk fashion/pakaian",
  electronics: "produk elektronik/gadget",
  home: "produk rumah tangga/dekorasi",
  food: "produk makanan/minuman",
  beauty: "produk kecantikan/kesehatan",
  sports: "produk olahraga/outdoor",
  other: "produk",
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateRequest = await req.json();
    const { imageUrl, productName, category, keyFeatures, toneOfVoice } = body;

    if (!imageUrl || !productName || !category || !keyFeatures || !toneOfVoice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user profile with AI model preference
    const supabase = createServerSupabaseClient();
    const profileResult = await supabase
      .from("profiles")
      .select("id, ai_model")
      .eq("clerk_id", userId)
      .single();

    const profile = profileResult.data as Pick<Profile, "id" | "ai_model"> | null;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const aiModel = profile.ai_model || "mistral";
    const toneDesc = toneDescriptions[toneOfVoice] || toneDescriptions.casual;
    const categoryDesc = categoryContext[category] || categoryContext.other;

    const prompt = `Kamu adalah copywriter profesional yang ahli membuat deskripsi produk untuk e-commerce Indonesia.

ANALISIS GAMBAR PRODUK:
Perhatikan gambar produk dengan seksama. Identifikasi:
- Warna, bentuk, dan desain produk
- Material atau bahan yang terlihat
- Fitur visual yang menonjol
- Kesan premium/casual/modern dari produk

INFORMASI PRODUK:
- Nama Produk: ${productName}
- Kategori: ${categoryDesc}
- Fitur Utama: ${keyFeatures}
- Tone of Voice: ${toneDesc}

TUGAS:
Buatkan 3 variasi deskripsi produk dalam Bahasa Indonesia dengan tone "${toneOfVoice}":

1. **MARKETPLACE** (untuk Shopee/Tokopedia):
   - Panjang: 150-200 kata
   - Format: Paragraf pembuka yang menarik + bullet points fitur + call-to-action
   - Sertakan kata kunci SEO yang relevan
   - Gunakan emoji secukupnya (2-3 emoji)

2. **INSTAGRAM** (untuk caption):
   - Panjang: 80-120 kata
   - Format: Hook yang catchy + deskripsi singkat + hashtag relevan (5-7 hashtag)
   - Engaging dan shareable
   - Gunakan emoji yang sesuai

3. **WEBSITE** (untuk landing page):
   - Panjang: 100-150 kata
   - Format: Headline persuasif + paragraf yang menjelaskan value proposition + benefit utama
   - Fokus pada storytelling dan emotional appeal
   - Professional dan meyakinkan

PENTING:
- Sesuaikan gaya bahasa dengan tone "${toneOfVoice}"
- Integrasikan detail visual dari gambar ke dalam deskripsi
- Buat setiap variasi unik dan tidak repetitif
- Gunakan Bahasa Indonesia yang natural

Berikan response dalam format JSON seperti ini (tanpa markdown code block):
{
  "marketplace": "deskripsi untuk marketplace...",
  "instagram": "caption untuk instagram...",
  "website": "deskripsi untuk website..."
}`;

    // Generate based on selected AI model
    let text: string;
    if (aiModel === "gemini") {
      text = await generateWithGemini(imageUrl, prompt);
    } else {
      text = await generateWithMistral(imageUrl, prompt);
    }

    // Parse JSON from response
    let generationResult: GenerationResult;
    try {
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      generationResult = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Save product to database
    const productResult = await supabase
      .from("products")
      .insert({
        user_id: profile.id,
        image_url: imageUrl,
        product_name: productName,
        category,
        key_features: keyFeatures,
      })
      .select()
      .single();

    const product = productResult.data as Product | null;

    if (productResult.error || !product) {
      console.error("Error saving product:", productResult.error);
      return NextResponse.json(
        { error: "Failed to save product" },
        { status: 500 }
      );
    }

    // Save all generations
    const generations = [
      { platform: "marketplace", result_text: generationResult.marketplace },
      { platform: "instagram", result_text: generationResult.instagram },
      { platform: "website", result_text: generationResult.website },
    ].map((g) => ({
      product_id: product.id,
      platform: g.platform,
      tone_of_voice: toneOfVoice,
      result_text: g.result_text,
    }));

    const { error: genError } = await supabase
      .from("generations")
      .insert(generations);

    if (genError) {
      console.error("Error saving generations:", genError);
    }

    return NextResponse.json({
      success: true,
      data: generationResult,
      productId: product.id,
      model: aiModel,
    });
  } catch (error) {
    console.error("Generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate description", details: errorMessage },
      { status: 500 }
    );
  }
}
