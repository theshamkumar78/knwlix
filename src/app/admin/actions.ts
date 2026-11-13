"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
export async function setCourseStatus(id: string, status: "published" | "rejected") {
  const { sb } = await requireRole(["admin"]);
  const { error } = await sb.from("courses").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
export async function setUserRole(id: string, role: "student" | "instructor") {
  const { sb } = await requireRole(["admin"]);
  const { error } = await sb.from("profiles").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

