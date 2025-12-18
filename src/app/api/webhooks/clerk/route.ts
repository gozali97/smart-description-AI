import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";
    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim() || null;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", id)
      .single();

    if (existing) {
      await supabase
        .from("profiles")
        .update({
          email,
          full_name: fullName,
          avatar_url: image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_id", id);
    } else {
      await supabase.from("profiles").insert({
        clerk_id: id,
        email,
        full_name: fullName,
        avatar_url: image_url,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await supabase.from("profiles").delete().eq("clerk_id", id);
    }
  }

  return new Response("OK", { status: 200 });
}
