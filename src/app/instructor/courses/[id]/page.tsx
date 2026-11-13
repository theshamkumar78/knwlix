import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, PlayCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { updateCourse, deleteCourse, addLesson, deleteLesson, moveLesson } from "../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";
const badge: Record<string, string> = {
  draft: "bg-white/15 text-white/80",
  pending: "bg-amber-400/20 text-amber-200",
  published: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};

export default async function ManageCourse({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);
  const { data: course } = await sb.from("courses").select("*").eq("id", id).eq("instructor_id", user.id).maybeSingle();
  if (!course) notFound();
  const { data } = await sb
    .from("lessons")
    .select("id, title, order_index, video_url, module_title")
    .eq("course_id", id)
    .order("order_index");
  const lessons: any[] = data ?? [];
  const { count: students } = await sb.from("enrollments").select("id", { count: "exact", head: true }).eq("course_id", id);
  const modules = Array.from(new Set(lessons.map((l) => l.module_title).filter(Boolean))) as string[];

  return (
    <GlassShell active="courses" variant="instructor">
      <div className="space-y-6">
        <Link href="/instructor/courses" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
          <ArrowLeft size={16} /> My courses
        </Link>

        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold">{course.title}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[course.status] ?? badge.draft}`}>{course.status}</span>
          <span className="text-sm text-white/70">{lessons.length} lessons · {students ?? 0} students</span>
        </header>

        <section className="glass p-6">
          <h2 className="text-xl font-bold">Course details</h2>
          {course.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.thumbnail_url} alt="" className="mt-4 h-32 rounded-2xl object-cover" />
          )}
          <form action={updateCourse.bind(null, course.id)} className="mt-4 space-y-4">
            <label className="block text-sm">Title
              <input name="title" defaultValue={course.title} required minLength={3} className={`mt-1 ${field}`} />
            </label>
            <label className="block text-sm">Description
              <textarea name="description" defaultValue={course.description ?? ""} rows={4} className={`mt-1 ${field}`} />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm">Category
                <input name="category" defaultValue={course.category ?? ""} className={`mt-1 ${field}`} />
              </label>
              <label className="block text-sm">Level
                <select name="level" defaultValue={course.level} className={`mt-1 ${field} [&>option]:text-slate-900`}>
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              </label>
              <label className="block text-sm">Duration
                <input name="duration" defaultValue={course.duration ?? ""} className={`mt-1 ${field}`} />
              </label>
            </div>
            <label className="block text-sm">New thumbnail (optional)
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                className={`mt-1 ${field} file:mr-4 file:rounded-full file:border-0 file:bg-white/15 file:px-4 file:py-2 file:text-white`}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/25">Save draft</button>
              <button name="submit" value="1" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
                Submit for review
              </button>
            </div>
          </form>
          {course.status === "draft" && (
            <form action={deleteCourse.bind(null, course.id)} className="mt-4">
              <button className="text-sm text-rose-300 underline">Delete this course</button>
            </form>
          )}
        </section>

        <section className="glass p-6">
          <h2 className="text-xl font-bold">Lessons</h2>
          <ul className="mt-4 space-y-2">
            {lessons.length ? (
              lessons.map((l, i) => (
                <li key={l.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{l.title}</span>
                      {l.module_title && <span className="block truncate text-xs text-teal-300">{l.module_title}</span>}
                    </span>
                    {l.video_url && <PlayCircle size={16} className="shrink-0 text-teal-300" aria-label="Has video" />}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <form action={moveLesson.bind(null, l.id, course.id, "up")}>
                      <button disabled={i === 0} aria-label="Move up" className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-30">
                        <ArrowUp size={16} />
                      </button>
                    </form>
                    <form action={moveLesson.bind(null, l.id, course.id, "down")}>
                      <button disabled={i === lessons.length - 1} aria-label="Move down" className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-30">
                        <ArrowDown size={16} />
                      </button>
                    </form>
                    <Link href={`/instructor/courses/${course.id}/lessons/${l.id}`} className="rounded-full px-3 py-1.5 text-sm font-semibold text-amber-300 transition hover:bg-white/10">
                      Edit
                    </Link>
                    <form action={deleteLesson.bind(null, l.id, course.id)}>
                      <button className="rounded-full px-3 py-1.5 text-sm text-rose-300 transition hover:bg-white/10">Delete</button>
                    </form>
                  </span>
                </li>
              ))
            ) : (
              <li className="text-white/70">No lessons yet. Add your first lesson below.</li>
            )}
          </ul>

          <form action={addLesson.bind(null, course.id)} className="mt-6 space-y-3 rounded-2xl bg-white/5 p-5">
            <h3 className="font-semibold">Add a new lesson</h3>
            <input name="title" placeholder="Lesson title" required className={field} />
            <input name="module_title" list="modules" placeholder="Module (optional), e.g. Module 1: HTML" className={field} />
            <datalist id="modules">{modules.map((m) => <option key={m} value={m} />)}</datalist>
            <input name="video_url" placeholder="Video link (YouTube, optional)" className={field} />
            <textarea name="content" rows={3} placeholder="Lesson text (optional)" className={field} />
            <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
              Add lesson
            </button>
          </form>
        </section>
      </div>
    </GlassShell>
  );
}