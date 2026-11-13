import { requireRole } from "@/lib/auth";
import { setUserRole } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const badge: Record<string, string> = {
  draft: "bg-white/15 text-white/80",
  pending: "bg-amber-400/20 text-amber-200",
  published: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });

export default async function Instructors() {
  const { sb } = await requireRole(["admin"]);

  const { data: instr } = await sb
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "instructor")
    .order("created_at", { ascending: false });
  const { data: courses } = await sb.from("courses").select("id, title, status, category, instructor_id");
  const { data: enr } = await sb.from("enrollments").select("course_id, student_id");

  const rows = (instr ?? []).map((t: any) => {
    const mine = (courses ?? []).filter((c: any) => c.instructor_id === t.id);
    const mineIds = new Set(mine.map((c: any) => c.id));
    const myEnr = (enr ?? []).filter((e: any) => mineIds.has(e.course_id));
    return {
      ...t,
      subjects: Array.from(new Set(mine.map((c: any) => (c.category ?? "").trim()).filter(Boolean))) as string[],
      students: new Set(myEnr.map((e: any) => e.student_id)).size,
      published: mine.filter((c: any) => c.status === "published").length,
      list: mine.map((c: any) => ({ ...c, students: myEnr.filter((e: any) => e.course_id === c.id).length })),
    };
  });

  return (
    <GlassShell active="instructors" variant="admin">
      <div className="space-y-6">
        <header>
          <p className="text-sm text-white/70">Knowlix · Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold">Instructors</h1>
          <p className="mt-1 text-white/70">{rows.length} instructor{rows.length === 1 ? "" : "s"}</p>
        </header>

        {rows.length ? (
          rows.map((t: any) => {
            const name = t.full_name ?? `Instructor ${String(t.id).slice(0, 6)}`;
            return (
              <article key={t.id} className="glass p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-lg font-bold">
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold">{name}</h2>
                      <p className="text-xs text-white/50">Joined {fmt(t.created_at)}</p>
                    </div>
                  </div>
                  <form action={setUserRole.bind(null, t.id, "student")}>
                    <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25">Make student</button>
                  </form>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/60">Courses created</p><p className="text-2xl font-extrabold">{t.list.length}</p></div>
                  <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/60">Published</p><p className="text-2xl font-extrabold">{t.published}</p></div>
                  <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/60">Students enrolled</p><p className="text-2xl font-extrabold">{t.students}</p></div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-white/60">Subjects</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.subjects.length ? (
                      t.subjects.map((s: string) => (
                        <span key={s} className="rounded-full bg-violet/30 px-3 py-1 text-xs font-semibold">{s}</span>
                      ))
                    ) : (
                      <span className="text-sm text-white/50">No subject yet</span>
                    )}
                  </div>
                </div>

                {t.list.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {t.list.map((c: any) => (
                      <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
                        <span className="min-w-0 truncate font-medium">{c.title}</span>
                        <span className="flex shrink-0 items-center gap-3 text-sm text-white/70">
                          {c.students} student{c.students === 1 ? "" : "s"}
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[c.status] ?? badge.draft}`}>{c.status}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })
        ) : (
          <p className="glass p-10 text-center text-white/70">No instructors yet.</p>
        )}
      </div>
    </GlassShell>
  );
}