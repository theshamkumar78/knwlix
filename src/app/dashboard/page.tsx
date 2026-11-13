import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import ProgressRing from "@/components/dashboard/ProgressRing";

const tones = ["#5eead4", "#fbbf24", "#f472b6", "#a78bfa", "#38bdf8"];

export default async function Dashboard() {
  const { sb, user, profile } = await requireRole(["student", "instructor", "admin"]);
  if (profile.role === "instructor") redirect("/instructor");
  if (profile.role === "admin") redirect("/admin");

  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, enrolled_at, courses(title, slug)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false });
  const ids = (enr ?? []).map((e: any) => e.course_id);

  const { data: lessons } = ids.length
    ? await sb.from("lessons").select("id, course_id, title, order_index").in("course_id", ids).order("order_index")
    : { data: [] as any[] };
  const { data: prog } = await sb
    .from("lesson_progress")
    .select("lesson_id, course_id, completed_at")
    .eq("student_id", user.id)
    .eq("completed", true);

  const doneSet = new Set((prog ?? []).map((p: any) => p.lesson_id));

  const courses = (enr ?? []).map((e: any, i: number) => {
    const ls = (lessons ?? []).filter((l: any) => l.course_id === e.course_id);
    const done = ls.filter((l: any) => doneSet.has(l.id)).length;
    const pct = ls.length ? Math.round((done * 100) / ls.length) : 0;
    const next = ls.find((l: any) => !doneSet.has(l.id));
    const last =
      (prog ?? [])
        .filter((p: any) => p.course_id === e.course_id)
        .map((p: any) => p.completed_at ?? "")
        .sort()
        .pop() ?? "";
    return { id: e.course_id as string, title: (e.courses?.title ?? "Course") as string, total: ls.length, done, pct, next, last: last as string, tone: tones[i % tones.length] };
  });

  const resume = courses.filter((c) => c.next).sort((a, b) => b.last.localeCompare(a.last))[0];
  const totalLessons = courses.reduce((s, c) => s + c.total, 0);
  const totalDone = courses.reduce((s, c) => s + c.done, 0);
  const overall = totalLessons ? Math.round((totalDone * 100) / totalLessons) : 0;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const counts = days.map((d) => (prog ?? []).filter((p: any) => p.completed_at?.slice(0, 10) === d).length);
  const weekTotal = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...counts);

  const name = profile.full_name ?? user.email?.split("@")[0] ?? "learner";
  const left = resume ? resume.total - resume.done : 0;

  return (
    <GlassShell active="home">
      <div className="space-y-5">
        <header>
          <p className="text-sm text-white/70">Knowlix · Student</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Welcome back, {name}</h1>
        </header>

        <section className="glass relative overflow-hidden p-7 md:flex md:items-center md:justify-between md:gap-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-violet/40 blur-3xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {resume ? "Continue where you left off" : courses.length ? "All caught up" : "Get started"}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold">
              {resume ? resume.title : courses.length ? "You finished every lesson" : "Start your first course"}
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              {resume
                ? `Next lesson: ${resume.next.title}. ${left} lesson${left === 1 ? "" : "s"} to go.`
                : courses.length
                  ? "Browse more courses to keep learning."
                  : "Browse courses and enroll to see your progress here."}
            </p>
            <Link
              href={resume ? `/dashboard/courses#c-${resume.id}` : "/courses"}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5"
            >
              {resume ? "Resume lesson" : "Browse courses"} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative mt-6 shrink-0 text-center md:mt-0">
            <ProgressRing pct={overall} size={150} stroke={12} gradient />
            <p className="mt-2 text-xs text-white/70">Overall progress</p>
          </div>
        </section>

        <section aria-label="Your stats" className="grid gap-4 sm:grid-cols-3">
          <div className="glass lift p-5">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-300" />Enrolled courses</p>
            <p className="mt-1 text-3xl font-extrabold">{courses.length}</p>
          </div>
          <div className="glass lift p-5">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-300" />Lessons completed</p>
            <p className="mt-1 text-3xl font-extrabold">{totalDone}</p>
          </div>
          <div className="glass lift p-5">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-pink-400" />This week · {weekTotal}</p>
            <div className="mt-3 flex h-[70px] items-end gap-2" aria-hidden="true">
              {counts.map((n, i) => (
                <i key={i} className="flex-1 rounded-md bg-gradient-to-b from-teal-300 to-violet" style={{ height: `${Math.max((n / max) * 100, 8)}%`, opacity: n ? 1 : 0.35 }} />
              ))}
            </div>
          </div>
        </section>

        <section aria-label="My courses">
          <h2 className="mb-3 text-xl font-bold">My courses</h2>
          {courses.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <Link key={c.id} href={`/dashboard/courses#c-${c.id}`} className="glass lift flex items-center gap-4 p-5 text-white">
                  <ProgressRing pct={c.pct} size={64} stroke={6} color={c.tone} />
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{c.title}</h3>
                    <p className="text-sm text-white/70">{c.done} of {c.total} lessons</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="glass p-8 text-center text-white/70">
              You have not enrolled in any course yet. <Link href="/courses" className="font-semibold text-amber-300 underline">Browse courses</Link>
            </p>
          )}
        </section>
      </div>
    </GlassShell>
  );
}