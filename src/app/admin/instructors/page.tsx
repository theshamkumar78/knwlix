import { ShieldCheck, ShieldX } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { setUserRole, toggleUserActive } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const badgeTone: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function Instructors() {
  const { sb } = await requireRole(["admin"]);

  let { data: instr, error: instrErr } = await sb
    .from("profiles")
    .select("id, full_name, created_at, is_active")
    .eq("role", "instructor")
    .order("created_at", { ascending: false });

  // Fallback if migration 0005 has not been run yet
  if (instrErr) {
    const { data: fbInstr } = await sb
      .from("profiles")
      .select("id, full_name, created_at")
      .eq("role", "instructor")
      .order("created_at", { ascending: false });
    instr = (fbInstr ?? []) as any;
  }
  const { data: courses } = await sb
    .from("courses")
    .select("id, title, status, category, instructor_id");
  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, student_id");

  const rows = (instr ?? []).map((t: any) => {
    const mine = (courses ?? []).filter((c: any) => c.instructor_id === t.id);
    const mineIds = new Set(mine.map((c: any) => c.id));
    const myEnr = (enr ?? []).filter((e: any) => mineIds.has(e.course_id));
    return {
      ...t,
      subjects: Array.from(
        new Set(
          mine
            .map((c: any) => (c.category ?? "").trim())
            .filter(Boolean)
        )
      ) as string[],
      students: new Set(myEnr.map((e: any) => e.student_id)).size,
      published: mine.filter((c: any) => c.status === "published").length,
      list: mine.map((c: any) => ({
        ...c,
        students: myEnr.filter((e: any) => e.course_id === c.id).length,
      })),
    };
  });

  return (
    <GlassShell active="instructors" variant="admin">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Instructors</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {rows.length} instructor{rows.length === 1 ? "" : "s"} on the platform
          </p>
        </header>

        {rows.length ? (
          rows.map((t: any) => {
            const name =
              t.full_name ?? `Instructor ${String(t.id).slice(0, 6)}`;
            const isActive = t.is_active !== false;

            return (
              <article key={t.id} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-600/20">
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{name}</h2>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <ShieldCheck size={11} /> Active
                            </>
                          ) : (
                            <>
                              <ShieldX size={11} /> Deactivated
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Joined {fmt(t.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form
                      action={toggleUserActive.bind(null, t.id, !isActive)}
                    >
                      <button
                        type="submit"
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                          isActive
                            ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                        }`}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>

                    <form action={setUserRole.bind(null, t.id, "student")}>
                      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700 transition">
                        Make Student
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Courses created</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{t.list.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{t.published}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Students enrolled</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{t.students}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subjects</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.subjects.length ? (
                      t.subjects.map((s: string) => (
                        <span
                          key={s}
                          className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">None yet</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            No instructors found.
          </div>
        )}
      </div>
    </GlassShell>
  );
}
