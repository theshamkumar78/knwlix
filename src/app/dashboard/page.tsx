import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function Dashboard() {
  const { sb, user, profile } = await requireRole([
    "student",
    "instructor",
    "admin",
  ]);
  if (profile.role === "instructor") redirect("/instructor");
  if (profile.role === "admin") redirect("/admin");

  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, enrolled_at, courses(title, slug, thumbnail_url, category)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false });
  const ids = (enr ?? []).map((e: any) => e.course_id);

  const { data: lessons } = ids.length
    ? await sb
        .from("lessons")
        .select("id, course_id, title, order_index")
        .in("course_id", ids)
        .order("order_index")
    : { data: [] as any[] };
  const { data: prog } = await sb
    .from("lesson_progress")
    .select("lesson_id, course_id, completed_at")
    .eq("student_id", user.id)
    .eq("completed", true);

  // Fetch issued certificates for this student
  const { data: certs } = await sb
    .from("certificates")
    .select("id, code, issued_at, course_id, courses(title)")
    .eq("student_id", user.id)
    .order("issued_at", { ascending: false });

  const doneSet = new Set((prog ?? []).map((p: any) => p.lesson_id));

  const courses = (enr ?? []).map((e: any) => {
    const ls = (lessons ?? []).filter((l: any) => l.course_id === e.course_id);
    const done = ls.filter((l: any) => doneSet.has(l.id)).length;
    const total = ls.length || 10;
    const pct = Math.min(100, Math.round((done * 100) / total));
    const next = ls.find((l: any) => !doneSet.has(l.id));
    return {
      id: e.course_id as string,
      title: (e.courses?.title ?? "Course") as string,
      slug: (e.courses?.slug ?? "") as string,
      thumbnail: (e.courses?.thumbnail_url ?? "/images/category-banners.jpeg") as string,
      category: (e.courses?.category ?? "General") as string,
      total,
      done,
      pct,
      next,
    };
  });

  const totalLessons = courses.reduce((s, c) => s + c.total, 0);
  const totalDone = courses.reduce((s, c) => s + c.done, 0);

  // 7-day activity data
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const counts = days.map(
    (d) =>
      (prog ?? []).filter((p: any) => p.completed_at?.slice(0, 10) === d)
        .length
  );
  const max = Math.max(1, ...counts);
  const weekTotal = counts.reduce((a, b) => a + b, 0);

  const name = profile.full_name ?? user.email?.split("@")[0] ?? "Sham";

  return (
    <GlassShell active="home" variant="student">
      <div className="space-y-8">
        {/* 1. Header (PDF Page 4) */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {name}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Keep learning and achieve your goals.
            </p>
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* 2. 3 Stat Cards in a row (PDF Page 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Courses
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600 dark:text-blue-400">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Lessons
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {totalDone}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800/90">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Certificates
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {certs?.length ?? 0}
            </p>
          </div>
        </div>

        {/* 3. Weekly Learning Activity Graph (PDF & User Request 7) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Learning Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {weekTotal} lessons completed in the last 7 days
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
              This Week
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
            {counts.map((n, i) => {
              const heightPct = Math.max((n / max) * 100, 10);
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex justify-center items-end h-full">
                    <div
                      className={`w-full max-w-[40px] rounded-xl transition-all duration-300 ${
                        isToday || n > 0
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm shadow-blue-500/20 group-hover:from-blue-700 group-hover:to-indigo-600"
                          : "bg-slate-100 dark:bg-slate-700/60 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${isToday ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
                    {dayLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. My Courses Section (PDF Page 4) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
            <Link
              href="/dashboard/courses"
              prefetch={true}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 dark:border-slate-800 dark:bg-slate-800/90"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700 shadow-xs">
                      <Image
                        src={c.thumbnail}
                        alt={c.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {c.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {c.done} of {c.total} lessons completed
                      </p>

                      {/* Progress Bar (PDF Page 4) */}
                      <div className="mt-3 flex items-center gap-3 w-48 sm:w-64">
                        <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${c.pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {c.pct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/courses#c-${c.id}`}
                    prefetch={true}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <BookOpen size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No enrolled courses yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Explore our catalog of university-grade courses and start learning today.
              </p>
              <Link
                href="/courses"
                prefetch={true}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
              >
                <span>Browse Courses</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* 5. Certificates Section */}
        {certs && certs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Certificates</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                {certs.length} Earned
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c: any) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between dark:border-slate-800 dark:bg-slate-800/90"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <Award size={13} /> Certified
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {c.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
                      {(c.courses as any)?.title ?? "Completed Course"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Issued on{" "}
                      {new Date(c.issued_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 text-xs">
                    <Link
                      href={`/dashboard/certificate/${c.course_id}`}
                      prefetch={true}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      View Certificate →
                    </Link>
                    <Link
                      href={`/verify/${c.code}`}
                      target="_blank"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1"
                    >
                      Verify <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassShell>
  );
}
