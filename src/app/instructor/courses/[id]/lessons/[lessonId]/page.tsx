import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { updateLesson } from "../../../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default async function EditLesson({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  const { data: course } = await sb.from("courses").select("id, title").eq("id", id).eq("instructor_id", user.id).maybeSingle();
  if (!course) notFound();
  const { data: lesson } = await sb.from("lessons").select("*").eq("id", lessonId).eq("course_id", id).maybeSingle();
  if (!lesson) notFound();
  const { data: all } = await sb.from("lessons").select("module_title").eq("course_id", id);
  const modules = Array.from(new Set((all ?? []).map((l: any) => l.module_title).filter(Boolean))) as string[];

  return (
    <GlassShell active="courses" variant="instructor">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href={`/instructor/courses/${id}`} className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
          <ArrowLeft size={16} /> {course.title}
        </Link>
        <h1 className="text-3xl font-extrabold">Edit lesson</h1>

        <form action={updateLesson.bind(null, lessonId, id)} className="glass space-y-5 p-6">
          <label className="block text-sm">Lesson title
            <input name="title" defaultValue={lesson.title} required className={field} />
          </label>
          <label className="block text-sm">Module
            <input name="module_title" list="modules" defaultValue={lesson.module_title ?? ""} placeholder="e.g. Module 1: HTML" className={field} />
            <datalist id="modules">{modules.map((m) => <option key={m} value={m} />)}</datalist>
          </label>
          <label className="block text-sm">Video link (YouTube)
            <input name="video_url" defaultValue={lesson.video_url ?? ""} className={field} />
          </label>
          <label className="block text-sm">Lesson text
            <textarea name="content" rows={5} defaultValue={lesson.content ?? ""} className={field} />
          </label>
          <div className="flex gap-3">
            <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">Save lesson</button>
            <Link href={`/instructor/courses/${id}`} className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/25">Cancel</Link>
          </div>
        </form>
      </div>
    </GlassShell>
  );
}