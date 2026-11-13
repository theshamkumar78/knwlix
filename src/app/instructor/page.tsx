import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";

const badge: Record<string, string> = {
  draft: "bg-white/15 text-white/80",
  pending: "bg-amber-400/20 text-amber-200",
  published: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};

export default async function InstructorHome() {
  const { sb, user, profile } = await requireRole(["instructor", "admin"]);

  const { data: courses } = await sb
    .from("courses")
    .select("id, title, status, created_at")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });
  const ids = (courses ?? []).map((c: any) => c.id);

  const { data: enr } = ids.length
    ? await sb.from("enrollments").select("course_id, student_id").in("course_id", ids)
    : { data: [] as any[] };
  const { data: les } = ids.length
    ? await sb.from("lessons").select("id, course_id").in("course_id", ids)
    : { data: [] as any[] };

  const list = (courses ?? []).map((c: any) => ({
    ...c,
    students: (enr ?? []).filter((e: any) => e.course_id === c.id).length,
    lessons: (les ?? []).filter((l: any) => l.course_id === c.id).length,
  }));
  const published = list.filter((c) => c.status === "published").length;
  const pending = list.filter((c) => c.status === "pending").length;
  const students = new Set((enr ?? []).map((e: any) => e.student_id)).size;
  const name = profile.full_name ?? user.email?.split("@")[0] ?? "instructor";

  return (
    <GlassShell active="home" variant="instructor">
      <div className="space-y-5">
        <header>
          <p className="text-sm text-white/70">Knowlix · Instructor</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Welcome back, {name}</h1>
        </header>

        <section className="glass relative overflow-hidden p-7 md:flex md:items-center md:justify-between md:gap-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-violet/40 blur-3xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {pending ? `${pending} awaiting review` : "Your teaching space"}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold">
              {list.length ? "Keep your courses growing" : "Create your first course"}
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              Add lessons, upload a thumbnail and submit for review. Approved courses become visible to every student.
            </p>
            <Link
              href="/instructor/courses/create"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5"
            >
              <Plus size={16} /> Create course
            </Link>
          </div>

          <Link
            href="/instructor/students"
            aria-label="View enrolled students"
            className="group relative mt-6 block shrink-0 text-center md:mt-0"
          >
            <div className="grid h-36 w-36 place-items-center rounded-full border-[10px] border-white/15 bg-white/5 transition group-hover:scale-105 group-hover:border-teal-300/60">
              <div>
                <p className="text-4xl font-extrabold">{students}</p>
                <p className="text-xs text-white/70">student{students === 1 ? "" : "s"}</p>
              </div>
            </div>
            <p className="mt-2 text-xs font-semibold text-amber-300">View students →</p>
          </Link>
        </section>

        <section aria-label="Your stats" className="grid gap-4 sm:grid-cols-3">
          <Link href="/instructor/courses" className="glass lift block p-5 text-white">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-300" />Total courses</p>
            <p className="mt-1 text-3xl font-extrabold">{list.length}</p>
            <p className="mt-2 text-xs font-semibold text-amber-300">View all →</p>
          </Link>
          <Link href="/instructor/courses?status=published" className="glass lift block p-5 text-white">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />Published</p>
            <p className="mt-1 text-3xl font-extrabold">{published}</p>
            <p className="mt-2 text-xs font-semibold text-amber-300">View published →</p>
          </Link>
          <Link href="/instructor/courses?status=pending" className="glass lift block p-5 text-white">
            <p className="text-sm text-white/70"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-300" />Pending review</p>
            <p className="mt-1 text-3xl font-extrabold">{pending}</p>
            <p className="mt-2 text-xs font-semibold text-amber-300">View pending →</p>
          </Link>
        </section>

        <section aria-label="Recent courses">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your courses</h2>
            <Link href="/instructor/courses" className="flex items-center gap-1 text-sm font-semibold text-amber-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {list.length ? (
            <div className="space-y-3">
              {list.slice(0, 5).map((c) => (
                <Link key={c.id} href={`/instructor/courses/${c.id}`} className="glass lift flex items-center justify-between gap-4 p-4 text-white">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{c.title}</h3>
                    <p className="text-sm text-white/70">{c.lessons} lessons · {c.students} students</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[c.status] ?? badge.draft}`}>{c.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="glass p-8 text-center text-white/70">No courses yet. Click “Create course” to start.</p>
          )}
        </section>
      </div>
    </GlassShell>
  );
}