import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user profile
    const profileResult = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    const profile = profileResult.data as Pick<Profile, "id"> | null;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profile.id;

    // Get total products
    const productsResult = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId);

    const totalProducts = productsResult.count || 0;

    // Get user's product IDs for generations count
    const userProductsResult = await supabase
      .from("products")
      .select("id")
      .eq("user_id", profileId);

    const userProducts = (userProductsResult.data || []) as { id: string }[];

    let totalGenerations = 0;
    if (userProducts.length > 0) {
      const productIds = userProducts.map((p) => p.id);
      const genResult = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .in("product_id", productIds);
      totalGenerations = genResult.count || 0;
    }

    // Get this month's products
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthResult = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId)
      .gte("created_at", startOfMonth.toISOString());

    const thisMonthProducts = thisMonthResult.count || 0;

    // Get recent products
    const recentResult = await supabase
      .from("products")
      .select("*")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false })
      .limit(6);

    const recentProducts = recentResult.data || [];

    return NextResponse.json({
      totalProducts,
      totalGenerations,
      thisMonthProducts,
      recentProducts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
