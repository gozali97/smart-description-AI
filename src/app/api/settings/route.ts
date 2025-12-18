import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_model")
      .eq("clerk_id", userId)
      .single();

    return NextResponse.json({
      aiModel: profile?.ai_model || "mistral",
    });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { aiModel } = await req.json();

    if (!["gemini", "mistral"].includes(aiModel)) {
      return NextResponse.json({ error: "Invalid AI model" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ ai_model: aiModel, updated_at: new Date().toISOString() })
      .eq("clerk_id", userId);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }

    return NextResponse.json({ success: true, aiModel });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
