"use server";
import { createClient } from "@/lib/supabase/server";

export async function sendContactMessage(fd: FormData): Promise<{ ok: boolean; error?: string }> {
  // chhupa hua khana: sirf spam bots bharte hain
  if (String(fd.get("company") ?? "")) return { ok: true };

  const full_name = String(fd.get("full_name") ?? "").trim().slice(0, 100);
  const email = String(fd.get("email") ?? "").trim().slice(0, 200);
  const subject = String(fd.get("subject") ?? "").trim().slice(0, 150);
  const message = String(fd.get("message") ?? "").trim().slice(0, 2000);

  if (full_name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email." };
  if (message.length < 5) return { ok: false, error: "Please write a longer message." };

  const sb = await createClient();
  const { error } = await sb
    .from("contact_messages")
    .insert({ full_name, email, subject: subject || null, message });
  if (error) return { ok: false, error: "Could not send your message. Please try again." };
  return { ok: true };
}