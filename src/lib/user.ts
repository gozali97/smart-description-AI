import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "./supabase";

export async function syncUser() {
  const user = await currentUser();

  if (!user) return null;

  // Use service role client to bypass RLS
  const supabase = createServerSupabaseClient();

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // If not found (PGRST116 = no rows), create new profile
  if (selectError && selectError.code !== "PGRST116") {
    console.error("Error fetching profile:", selectError.message, selectError.code);
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      avatar_url: user.imageUrl,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", error.message, error.code, error.details);
    return null;
  }

  return profile;
}

export async function getProfile() {
  const user = await currentUser();

  if (!user) return null;

  const supabase = createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  return profile;
}
