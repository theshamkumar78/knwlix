import Link from "next/link";
import { Plus, BookOpen, ArrowRight } from "lucide-react";
import GlassShell from "@/components/dashboard/GlassShell";
import { requireRole } from "@/lib/auth";

export default async function InstructorDashboard() {
  const { sb, user, profile } = await requireRole(["instructor", "admin"]);

  // FIX: sirf apne courses
  const { data: courses } = await sb
    .from("courses")
    .select("id, title, category, status, created_at, lessons(count)")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });

  const cids = (courses ?? []).map((c) => c.id);

  // FIX: enrollments se student count
  const { data: enr } = cids.length
    ? await sb
        .from("enrollments")
        .select("student_id, course_id")
        .in("course_id", cids)
    : { data: [] as any[] };

  const studentsByCourse = new Map<string, number>();
  (enr ?? []).forEach((e: any) => {
    studentsByCourse.set(e.course_id, (studentsByCourse.get(e.course_id) ?? 0) + 1);
  });

  const list = (courses ?? []).map((c: any) => ({
    ...c,
    lessons: c.lessons?.[0]?.count ?? 0,
    students: studentsByCourse.get(c.id) ?? 0,
  }));

  const studentsCount = new Set((enr ?? []).map((e: any) => e.student_id)).size;
  const name = profile.full_name ?? user.email?.split("@")[0] ?? "Instructor";

  const badgeTone: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  };

  return (
    <GlassShell active="home" variant="instructor">
      <div className="space-y-8">
        {/* 1. Header (PDF Page 5) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Instructor Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your courses and students
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/instructor/courses/create"
              prefetch={true}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              <Plus size={16} /> Add Course
            </Link>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* 2. 3 Stat Cards in a row (PDF Page 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Courses
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600 dark:text-blue-400">
              {list.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {studentsCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Earnings
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600 dark:text-blue-400">
              $0
            </p>
          </div>
        </div>

        {/* 3. My Courses List (PDF Page 5) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
            <Link
              href="/instructor/courses"
              prefetch={true}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {list.length > 0 ? (
            <div className="space-y-4">
              {list.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-800/90"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold shrink-0">
                      <BookOpen size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.students} Students • {c.lessons} Lessons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        badgeTone[c.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.status}
                    </span>
                    <Link
                      href={`/instructor/courses/${c.id}`}
                      prefetch={true}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition"
                    >
                      <span>Manage</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <BookOpen size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No courses created yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Ready to share your knowledge? Create your first course in minutes.
              </p>
              <Link
                href="/instructor/courses/create"
                prefetch={true}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
              >
                <Plus size={14} />
                <span>Create Course</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </GlassShell>
  );
}
