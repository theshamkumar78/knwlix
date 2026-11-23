
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  });

const cardClass =
  "grid items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800/90 md:grid-cols-[2fr_1.4fr_1.6fr]";

export default async function Students({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  const { data: courses } = await sb
    .from("courses")
    .select("id, title")
    .eq("instructor_id", user.id)
    .order("title");

  const ids = (courses ?? []).map((c: any) => c.id);
  const activeIds = course && ids.includes(course) ? [course] : ids;

  const { data: enr } = activeIds.length
    ? await sb
        .from("enrollments")
        .select("course_id, student_id, enrolled_at")
        .in("course_id", activeIds)
        .order("enrolled_at", { ascending: false })
    : { data: [] as any[] };

  const studentIds = Array.from(
    new Set((enr ?? []).map((e: any) => e.student_id))
  );

  const { data: profs } = studentIds.length
    ? await sb
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds)
    : { data: [] as any[] };

  const { data: les } = activeIds.length
    ? await sb
        .from("lessons")
        .select("id, course_id")
        .in("course_id", activeIds)
    : { data: [] as any[] };

  const { data: prog } = activeIds.length
    ? await sb
        .from("lesson_progress")
        .select("student_id, course_id")
        .in("course_id", activeIds)
        .eq("completed", true)
    : { data: [] as any[] };

  const rows = (enr ?? []).map((e: any) => {
    const p = (profs ?? []).find((x: any) => x.id === e.student_id);
    const total = (les ?? []).filter(
      (l: any) => l.course_id === e.course_id
    ).length;

    const done = (prog ?? []).filter(
      (x: any) =>
        x.student_id === e.student_id && x.course_id === e.course_id
    ).length;

    return {
      key: `${e.course_id}-${e.student_id}`,
      sid: e.student_id as string,
      name:
        p?.full_name ??
        `Student ${String(e.student_id).slice(0, 4)}`,
      course:
        (courses ?? []).find((c: any) => c.id === e.course_id)?.title ??
        "Course",
      when: e.enrolled_at as string,
      total,
      done,
      pct: total ? Math.round((done * 100) / total) : 0,
    };
  });

  return (
    <GlassShell active="home" variant="instructor">
      <div className="space-y-6">
        <header>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Knowlix · Instructor
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
            Enrolled students
          </h1>

          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {studentIds.length} student
            {studentIds.length === 1 ? "" : "s"} · {rows.length} enrollment
            {rows.length === 1 ? "" : "s"}
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/instructor/students"
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              !course
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            All courses
          </Link>

          {(courses ?? []).map((c: any) => (
            <Link
              key={c.id}
              href={`/instructor/students?course=${c.id}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                course === c.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>

        {rows.length ? (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.key} className={cardClass}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-white font-bold">
                    {r.name.charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <Link
                      href={`/instructor/students/${r.sid}`}
                      className="block truncate font-bold text-slate-900 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-400"
                    >
                      {r.name}
                    </Link>

                    <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                      {r.course}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-violet"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {r.done}/{r.total} lessons · {r.pct}%
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enrolled on
                  </p>

                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {fmt(r.when)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-400">
            No students have enrolled yet.
          </p>
        )}
      </div>
    </GlassShell>
  );
}
