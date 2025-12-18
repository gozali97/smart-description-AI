import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id);

    // Get total generations
    const { count: totalGenerations } = await supabase
      .from("generations")
      .select("*, products!inner(user_id)", { count: "exact", head: true })
      .eq("products.user_id", profile.id);

    // Get this month's products
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: thisMonthProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .gte("created_at", startOfMonth.toISOString());

    // Get recent products
    const { data: recentProducts } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(6);

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalGenerations: totalGenerations || 0,
      thisMonthProducts: thisMonthProducts || 0,
      recentProducts: recentProducts || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
