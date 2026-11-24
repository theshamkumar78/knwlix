import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  PlayCircle,
  Users,
  Award,
  BookOpen,
  Copy,
  Eye,
  AlertCircle,
  Plus,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import {
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
  moveLesson,
  duplicateCourseAction,
} from "../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900";

const badgeTone: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
};

export default async function ManageCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  const { data: course } = await sb
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("instructor_id", user.id)
    .maybeSingle();

  if (!course) notFound();

  // Fetch course lessons
  const { data } = await sb
    .from("lessons")
    .select("id, title, order_index, video_url, module_title")
    .eq("course_id", id)
    .order("order_index");
  const lessons: any[] = data ?? [];

  // Fetch enrolled students count
  const { count: studentsCount } = await sb
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", id);
  const students = studentsCount ?? 0;

  // Compute Completion Rate
  const { data: progressData } = await sb
    .from("lesson_progress")
    .select("student_id")
    .eq("course_id", id)
    .eq("completed", true);

  const studentDoneMap = new Map<string, number>();
  (progressData ?? []).forEach((p: any) => {
    studentDoneMap.set(p.student_id, (studentDoneMap.get(p.student_id) || 0) + 1);
  });

  const totalLessonsCount = lessons.length;
  let finishersCount = 0;
  if (totalLessonsCount > 0) {
    studentDoneMap.forEach((count) => {
      if (count >= totalLessonsCount) finishersCount++;
    });
  }
  const completionRate = students > 0 ? Math.round((finishersCount * 100) / students) : 0;

  const modules = Array.from(
    new Set(lessons.map((l) => l.module_title).filter(Boolean))
  ) as string[];

  return (
    <GlassShell active="courses" variant="instructor">
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={14} /> Back to My Courses
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/instructor/courses/${course.id}/preview`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              <Eye size={14} /> Preview as student
            </Link>

            <form action={duplicateCourseAction.bind(null, course.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <Copy size={14} /> Duplicate
              </button>
            </form>
          </div>
        </div>

        {/* Rejection Alert Banner (if rejected by Admin) */}
        {course.status === "rejected" && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
            <AlertCircle className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900 dark:text-rose-100">Course Rejected by Admin</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                <span className="font-semibold">Reason:</span>{" "}
                {course.rejection_reason || "Course does not meet Knowlix publishing guidelines."}
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 pt-1">
                Please make the required changes in your lessons or course details below and click &quot;Submit for review&quot; again.
              </p>
            </div>
          </div>
        )}

        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{course.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage curriculum and publish settings</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
              badgeTone[course.status] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {course.status}
          </span>
        </header>

        {/* Per-Course Stats Cards */}
        <section aria-label="Course stats" className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users size={14} className="text-blue-600 dark:text-blue-400" /> Enrolled Students
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{students}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" /> Total Lessons
            </p>
            <p className="mt-2 text-3xl font-black text-blue-600 dark:text-blue-400">{lessons.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award size={14} className="text-emerald-600 dark:text-emerald-400" /> Completion Rate
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{completionRate}%</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {finishersCount} of {students} students completed 100%
            </p>
          </div>
        </section>

        {/* Course Details Edit Form */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Details</h2>
          {course.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt=""
              className="mt-4 h-32 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
          )}
          <form
            action={updateCourse.bind(null, course.id)}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Title
              </label>
              <input
                name="title"
                defaultValue={course.title}
                required
                minLength={3}
                className={field}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={course.description ?? ""}
                rows={4}
                className={field}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={course.category ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  defaultValue={course.level}
                  className={field}
                >
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <input
                  name="duration"
                  defaultValue={course.duration ?? ""}
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                New Thumbnail (optional)
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                Save Draft
              </button>
              <button
                type="submit"
                name="submit"
                value="1"
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                Submit for Review
              </button>
            </div>
          </form>

          {course.status === "draft" && (
            <form action={deleteCourse.bind(null, course.id)} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline">
                Delete this course
              </button>
            </form>
          )}
        </section>

        {/* Lessons List & Add Lesson */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lessons ({lessons.length})</h2>
          <ul className="mt-4 space-y-2">
            {lessons.length ? (
              lessons.map((l, i) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-700/60 dark:bg-slate-900/60"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {l.title}
                      </span>
                      {l.module_title && (
                        <span className="block truncate text-xs text-blue-600 dark:text-blue-400">
                          {l.module_title}
                        </span>
                      )}
                    </span>
                    {l.video_url && (
                      <PlayCircle
                        size={15}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                        aria-label="Has video"
                      />
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <form action={moveLesson.bind(null, l.id, course.id, "up")}>
                      <button
                        disabled={i === 0}
                        aria-label="Move up"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </form>
                    <form action={moveLesson.bind(null, l.id, course.id, "down")}>
                      <button
                        disabled={i === lessons.length - 1}
                        aria-label="Move down"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </form>
                    <Link
                      href={`/instructor/courses/${course.id}/lessons/${l.id}`}
                      className="rounded-lg px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                    >
                      Edit
                    </Link>
                    <form action={deleteLesson.bind(null, l.id, course.id)}>
                      <button className="rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
                        Delete
                      </button>
                    </form>
                  </span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500 dark:text-slate-400">
                No lessons yet. Add your first lesson below.
              </li>
            )}
          </ul>

          <form
            action={addLesson.bind(null, course.id)}
            className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Add a New Lesson</h3>
            <input
              name="title"
              placeholder="Lesson title"
              required
              className={field}
            />
            <input
              name="module_title"
              list="modules"
              placeholder="Module (optional), e.g. Module 1: Introduction"
              className={field}
            />
            <datalist id="modules">
              {modules.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <input
              name="video_url"
              placeholder="Video link (YouTube URL or MP4 file)"
              className={field}
            />
            <textarea
              name="content"
              rows={3}
              placeholder="Lesson text content & notes (optional)"
              className={field}
            />
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus size={14} /> Add Lesson
            </button>
          </form>
        </section>
      </div>
    </GlassShell>
  );
}
