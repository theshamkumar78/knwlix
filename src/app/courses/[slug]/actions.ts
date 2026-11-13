"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function enrollWithDetails(courseId: string, slug: string, fd: FormData) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/courses/${slug}/enroll`);

  const full_name = String(fd.get("full_name") ?? "").trim();
  if (full_name.length < 2) throw new Error("Please enter your full name");
  const t = (k: string) => String(fd.get(k) ?? "").trim() || null;

  const { error: e1 } = await sb.from("profiles").update({ full_name }).eq("id", user.id);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await sb
    .from("student_profiles")
    .upsert({ id: user.id, phone: t("phone"), city: t("city"), education: t("education"), goal: t("goal") });
  if (e2) throw new Error(e2.message);

  const { error: e3 } = await sb.from("enrollments").insert({ student_id: user.id, course_id: courseId });
  if (e3 && e3.code !== "23505") throw new Error(e3.message); // 23505 = already enrolled

  revalidatePath("/", "layout");
  redirect(`/dashboard/courses#c-${courseId}`);
}