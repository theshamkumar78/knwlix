import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { setCourseStatus } from "./actions";
import GlassShell from "@/components/dashboard/GlassShell";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi",
  });

export default async function Admin() {
  const { sb } = await requireRole(["admin"]);

  const { data: courses } = await sb.from("courses").select("id, category, status");
  const { data: pending } = await sb
    .from("courses")
    .select("id, title, category, level, created_at, profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const { data: people } = await sb.from("profiles").select("role");
  const { count: enrollments } = await sb.from("enrollments").select("id", { count: "exact", head: true });

  const published = (courses ?? []).filter((c: any) => c.status === "published");
  const instructors = (people ?? []).filter((p: any) => p.role === "instructor").length;
  const students = (people ?? []).filter((p: any) => p.role === "student").length;

  // subject ke hisaab se published courses ginna
  const subjectMap = new Map<string, { name: string; n: number }>();
  published.forEach((c: any) => {
    const name = (c.category ?? "").trim() || "General";
    const key = name.toLowerCase();
    subjectMap.set(key, { name, n: (subjectMap.get(key)?.n ?? 0) + 1 });
  });
  const subjects = Array.from(subjectMap.values()).sort((a, b) => b.n - a.n);

  const stats = [
    { label: "Pending approvals", value: pending?.length ?? 0, dot: "bg-amber-300", href: "/admin/courses?status=pending" },
    { label: "Published courses", value: published.length, dot: "bg-emerald-300", href: "/admin/courses?status=published" },
    { label: "Instructors", value: instructors, dot: "bg-violet-300", href: "/admin/instructors" },
    { label: "Students", value: students, dot: "bg-sky-300", href: "/admin/students" },
    { label: "Enrollments", value: enrollments ?? 0, dot: "bg-pink-300", href: "/admin/students?enrolled=1" },
  ];

  return (
    <GlassShell active="home" variant="admin">
      <div className="space-y-6">
        <header>
          <p className="text-sm text-white/70">Knowlix · Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Admin panel</h1>
        </header>

        <section aria-label="Overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="glass lift block p-5 text-white">
              <p className="text-sm text-white/70"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${s.dot}`} />{s.label}</p>
              <p className="mt-1 text-3xl font-extrabold">{s.value}</p>
              <p className="mt-2 text-xs font-semibold text-amber-300">View →</p>
            </Link>
          ))}
        </section>

        <section aria-label="Courses by subject" className="glass p-6">
          <h2 className="text-xl font-bold">Courses by subject</h2>
          {subjects.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {subjects.map((s) => (
                <Link
                  key={s.name}
                  href={`/admin/courses?subject=${encodeURIComponent(s.name)}`}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
                >
                  {s.name}
                  <span className="rounded-full bg-gradient-to-br from-teal-400 to-violet px-2 py-0.5 text-xs font-bold">{s.n}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-white/70">No published courses yet.</p>
          )}
        </section>

        <section aria-label="Pending approvals">
          <h2 className="mb-3 text-xl font-bold">Pending approvals</h2>
          {pending?.length ? (
            <div className="space-y-3">
              {pending.map((c: any) => (
                <div key={c.id} className="glass flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{c.title}</h3>
                    <p className="text-sm text-white/70">
                      by {c.profiles?.full_name ?? "Instructor"} · {c.category ?? "General"} · <span className="capitalize">{c.level}</span>
                    </p>
                    <p className="text-xs text-white/50">Submitted {fmt(c.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={setCourseStatus.bind(null, c.id, "published")}>
                      <button className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-emerald-950 transition hover:-translate-y-0.5">Approve</button>
                    </form>
                    <form action={setCourseStatus.bind(null, c.id, "rejected")}>
                      <button className="rounded-full bg-rose-400/20 px-5 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-400/30">Reject</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="glass p-8 text-center text-white/70">Nothing pending. All caught up.</p>
          )}
        </section>
      </div>
    </GlassShell>
  );
}