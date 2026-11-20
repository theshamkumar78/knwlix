"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleLesson(
  lessonId: string,
  courseId: string,
  completed: boolean
) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { error } = await sb.from("lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "student_id,lesson_id" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard", "layout");
}

export async function submitCourseReview(
  courseId: string,
  rating: number,
  reviewText: string
) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const cleanRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
  const cleanReview = String(reviewText ?? "").trim().slice(0, 1000) || null;

  const { error } = await sb.from("course_reviews").upsert(
    {
      course_id: courseId,
      student_id: user.id,
      rating: cleanRating,
      review_text: cleanReview,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "student_id,course_id" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateProfile(fd: FormData) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const full_name = String(fd.get("full_name") ?? "").trim();
  if (full_name.length < 2) throw new Error("Name is too short");
  const { error } = await sb
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/dashboard/profile?saved=1");
}

export async function updateStudentProfile(fd: FormData) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const full_name = String(fd.get("full_name") ?? "").trim();
  if (full_name.length < 2) throw new Error("Name is too short");
  const t = (k: string) => String(fd.get(k) ?? "").trim() || null;

  const { error: e1 } = await sb
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await sb.from("student_profiles").upsert({
    id: user.id,
    phone: t("phone"),
    city: t("city"),
    education: t("education"),
    goal: t("goal"),
    bio: t("bio"),
  });
  if (e2) throw new Error(e2.message);

  revalidatePath("/", "layout");
  redirect("/dashboard/profile?saved=1");
}
