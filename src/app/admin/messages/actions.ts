"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function setMessageRead(id: string, read: boolean) {
  const { sb } = await requireRole(["admin"]);
  const { error } = await sb.from("contact_messages").update({ is_read: read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const { sb } = await requireRole(["admin"]);
  const { error } = await sb.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}