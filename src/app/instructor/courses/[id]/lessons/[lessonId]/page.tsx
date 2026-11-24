import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { updateLesson } from "../../../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900";

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
        <Link href={`/instructor/courses/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition">
          <ArrowLeft size={14} /> Back to {course.title}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Edit Lesson</h1>

        <form action={updateLesson.bind(null, lessonId, id)} className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lesson title
            <input name="title" defaultValue={lesson.title} required className={field} />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Module
            <input name="module_title" list="modules" defaultValue={lesson.module_title ?? ""} placeholder="e.g. Module 1: HTML" className={field} />
            <datalist id="modules">{modules.map((m) => <option key={m} value={m} />)}</datalist>
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Video link (YouTube)
            <input name="video_url" defaultValue={lesson.video_url ?? ""} placeholder="https://www.youtube.com/watch?v=..." className={field} />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lesson text
            <textarea name="content" rows={5} defaultValue={lesson.content ?? ""} className={field} />
          </label>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">Save Lesson</button>
            <Link href={`/instructor/courses/${id}`} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition">Cancel</Link>
          </div>
        </form>
      </div>
    </GlassShell>
  );
}