
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  ExternalLink,
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

  const { data: certs } = await sb
    .from("certificates")
    .select("id, code, issued_at, course_id, courses(title)")
    .eq("student_id", user.id)
    .order("issued_at", { ascending: false });

  const doneSet = new Set((prog ?? []).map((p: any) => p.lesson_id));

  const courses = (enr ?? []).map((e: any) => {
    const ls = (lessons ?? []).filter(
      (l: any) => l.course_id === e.course_id
    );

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

  const totalDone = courses.reduce((s, c) => s + c.done, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const counts = days.map((d) =>
    (prog ?? []).filter(
      (p: any) => p.completed_at?.slice(0, 10) === d
    ).length
  );

  const max = Math.max(1, ...counts);
  const weekTotal = counts.reduce((a, b) => a + b, 0);

  const name =
    profile.full_name ?? user.email?.split("@")[0] ?? "Sham";

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800";

  const headingClass =
    "font-bold text-slate-900 dark:text-slate-100";

  const mutedClass =
    "text-slate-600 dark:text-slate-300";

  return (
    <GlassShell active="home" variant="student">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome back, {name}! 👋
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Keep learning and achieve your goals.
            </p>
          </div>

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Enrolled Courses
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600 dark:text-blue-400">
              {courses.length}
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Completed Lessons
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {totalDone}
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Certificates
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {certs?.length ?? 0}
            </p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Weekly Learning Activity
              </h2>
              <p className={`mt-0.5 text-xs ${mutedClass}`}>
                {weekTotal} lessons completed in the last 7 days
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              This Week
            </span>
          </div>

          <div className="flex h-40 items-end justify-between gap-3 px-2 pt-4">
            {counts.map((n, i) => {
              const heightPct = Math.max((n / max) * 100, 10);
              const isToday = i === 6;

              return (
                <div
                  key={i}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className={`w-full max-w-[40px] rounded-xl transition-all duration-300 ${
                        isToday || n > 0
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm shadow-blue-500/20"
                          : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      isToday
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {dayLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Courses
            </h2>

            <Link
              href="/dashboard/courses"
              prefetch={true}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                  className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex min-w-0 items-center gap-5">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm dark:bg-slate-700">
                      <Image
                        src={c.thumbnail}
                        alt={c.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {c.category}
                      </span>

                      <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                        {c.title}
                      </h3>

                      <p className={`mt-1 text-xs ${mutedClass}`}>
                        {c.done} of {c.total} lessons completed
                      </p>

                      <div className="mt-3 flex w-48 items-center gap-3 sm:w-64">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
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
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800">
              <BookOpen
                size={36}
                className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
              />

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No enrolled courses yet
              </h3>

              <p className={`mx-auto mt-1 max-w-sm text-xs ${mutedClass}`}>
                Explore our catalog of university-grade courses and start learning today.
              </p>

              <Link
                href="/courses"
                prefetch={true}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <span>Browse Courses</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Certificates */}
        {certs && certs.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your Certificates
              </h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {certs.length} Earned
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c: any) => (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <Award size={13} />
                        Certified
                      </span>

                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {c.code}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-1 font-bold text-slate-900 dark:text-white">
                      {(c.courses as any)?.title ?? "Completed Course"}
                    </h3>

                    <p className={`mt-1 text-xs ${mutedClass}`}>
                      Issued on{" "}
                      {new Date(c.issued_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
                    <Link
                      href={`/dashboard/certificate/${c.course_id}`}
                      prefetch={true}
                      className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Certificate →
                    </Link>

                    <Link
                      href={`/verify/${c.code}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
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
