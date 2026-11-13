"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const clean = (v: FormDataEntryValue | null) => String(v ?? "").trim() || null;

async function getUser() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  return { sb, user };
}

async function uploadThumbnail(sb: Awaited<ReturnType<typeof createClient>>, userId: string, file: File | null) {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await sb.storage.from("thumbnails").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return sb.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
}

export async function createCourse(fd: FormData) {
  const { sb, user } = await getUser();
  const title = String(fd.get("title") ?? "").trim();
  if (title.length < 3) throw new Error("Title too short");
  const thumbnail_url = await uploadThumbnail(sb, user.id, fd.get("thumbnail") as File | null);
  const { error } = await sb.from("courses").insert({
    instructor_id: user.id,
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    description: String(fd.get("description") ?? ""),
    category: String(fd.get("category") ?? ""),
    level: String(fd.get("level") ?? "beginner"),
    duration: String(fd.get("duration") ?? ""),
    thumbnail_url,
    status: fd.get("submit") ? "pending" : "draft",
  });
  if (error) throw new Error(error.message);
  redirect("/instructor/courses");
}

export async function updateCourse(id: string, fd: FormData) {
  const { sb, user } = await getUser();
  const title = String(fd.get("title") ?? "").trim();
  if (title.length < 3) throw new Error("Title too short");
  const thumb = await uploadThumbnail(sb, user.id, fd.get("thumbnail") as File | null);
  const patch: Record<string, any> = {
    title,
    description: String(fd.get("description") ?? ""),
    category: String(fd.get("category") ?? ""),
    level: String(fd.get("level") ?? "beginner"),
    duration: String(fd.get("duration") ?? ""),
    status: fd.get("submit") ? "pending" : "draft",
  };
  if (thumb) patch.thumbnail_url = thumb;
  const { error } = await sb.from("courses").update(patch).eq("id", id).eq("instructor_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/instructor/courses");
  redirect("/instructor/courses");
}

export async function deleteCourse(id: string) {
  const { sb, user } = await getUser();
  const { error } = await sb.from("courses").delete().eq("id", id).eq("instructor_id", user.id);
  if (error) throw new Error(error.message);
  redirect("/instructor/courses");
}

export async function addLesson(courseId: string, fd: FormData) {
  const { sb } = await getUser();
  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Lesson title required");
  const { data: last } = await sb
    .from("lessons")
    .select("order_index")
    .eq("course_id", courseId)
    .order("order_index", { ascending: false })
    .limit(1);
  const next = (last?.[0]?.order_index ?? 0) + 1;
  const { error } = await sb.from("lessons").insert({
    course_id: courseId,
    title,
    module_title: clean(fd.get("module_title")),
    video_url: clean(fd.get("video_url")),
    content: clean(fd.get("content")),
    order_index: next,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function updateLesson(lessonId: string, courseId: string, fd: FormData) {
  const { sb } = await getUser();
  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Lesson title required");
  const { error } = await sb
    .from("lessons")
    .update({
      title,
      module_title: clean(fd.get("module_title")),
      video_url: clean(fd.get("video_url")),
      content: clean(fd.get("content")),
    })
    .eq("id", lessonId);
  if (error) throw new Error(error.message);
  revalidatePath(`/instructor/courses/${courseId}`);
  redirect(`/instructor/courses/${courseId}`);
}

export async function moveLesson(lessonId: string, courseId: string, dir: "up" | "down") {
  const { sb } = await getUser();
  const { data } = await sb
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .order("order_index")
    .order("created_at");
  const ids = (data ?? []).map((l: any) => l.id as string);
  const i = ids.indexOf(lessonId);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((id, k) => sb.from("lessons").update({ order_index: k + 1 }).eq("id", id)));
  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const { sb } = await getUser();
  const { error } = await sb.from("lessons").delete().eq("id", lessonId);
  if (error) throw new Error(error.message);
  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function updateInstructorProfile(fd: FormData) {
  const { sb, user } = await getUser();
  const full_name = String(fd.get("full_name") ?? "").trim();
  if (full_name.length < 2) throw new Error("Name is too short");

  const { error: e1 } = await sb.from("profiles").update({ full_name }).eq("id", user.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await sb
    .from("instructor_profiles")
    .upsert({ id: user.id, headline: clean(fd.get("headline")), bio: clean(fd.get("bio")), experience: clean(fd.get("experience")) });
  if (e2) throw new Error(e2.message);

  revalidatePath("/", "layout");
  redirect("/instructor/profile?saved=1");
}