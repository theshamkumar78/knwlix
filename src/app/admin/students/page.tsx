import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { setUserRole } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi",
  });
const filters = [
  { label: "All", value: "" },
  { label: "Enrolled", value: "1" },
  { label: "Not enrolled", value: "0" },
];

export default async function Students({ searchParams }: { searchParams: Promise<{ enrolled?: string }> }) {
  const { enrolled } = await searchParams;
  const { sb } = await requireRole(["admin"]);

  const { data: studs } = await sb
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });
  const { data: enr } = await sb.from("enrollments").select("course_id, student_id, enrolled_at").order("enrolled_at", { ascending: false });
  const { data: courses } = await sb.from("courses").select("id, title");
  const { data: les } = await sb.from("lessons").select("id, course_id");
  const { data: prog } = await sb.from("lesson_progress").select("student_id, course_id").eq("completed", true);

  let rows = (studs ?? []).map((s: any) => {
    const mine = (enr ?? []).filter((e: any) => e.student_id === s.id).map((e: any) => {
      const total = (les ?? []).filter((l: any) => l.course_id === e.course_id).length;
      const done = (prog ?? []).filter((p: any) => p.student_id === s.id && p.course_id === e.course_id).length;
      return {
        course: (courses ?? []).find((c: any) => c.id === e.course_id)?.title ?? "Course",
        when: e.enrolled_at as string,
        pct: total ? Math.round((done * 100) / total) : 0,
        done, total,
      };
    });
    return { ...s, mine };
  });
  if (enrolled === "1") rows = rows.filter((r) => r.mine.length > 0);
  if (enrolled === "0") rows = rows.filter((r) => r.mine.length === 0);

  return (
    <GlassShell active="students" variant="admin">
      <div className="space-y-6">
        <header>
          <p className="text-sm text-white/70">Knowlix · Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold">Students</h1>
          <p className="mt-1 text-white/70">{rows.length} student{rows.length === 1 ? "" : "s"} · {enr?.length ?? 0} total enrollments</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.value ? `/admin/students?enrolled=${f.value}` : "/admin/students"}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                (enrolled ?? "") === f.value ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {rows.length ? (
          rows.map((s: any) => {
            const name = s.full_name ?? `Student ${String(s.id).slice(0, 6)}`;
            return (
              <article key={s.id} className="glass p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet font-bold">
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="font-bold"><Link href={`/admin/students/${s.id}`} className="hover:underline">{name}</Link></h2>
                      <p className="text-xs text-white/50">{s.mine.length} course{s.mine.length === 1 ? "" : "s"} enrolled</p>
                    </div>
                  </div>
                  <form action={setUserRole.bind(null, s.id, "instructor")}>
                    <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25">Make instructor</button>
                  </form>
                </div>

                {s.mine.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {s.mine.map((m: any, i: number) => (
                      <li key={i} className="grid items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 md:grid-cols-[1.5fr_1.2fr_1.2fr]">
                        <span className="truncate font-medium">{m.course}</span>
                        <div>
                          <div className="h-2 rounded-full bg-white/15">
                            <div className="h-2 rounded-full bg-gradient-to-r from-teal-300 to-violet" style={{ width: `${m.pct}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-white/70">{m.done}/{m.total} lessons · {m.pct}%</p>
                        </div>
                        <p className="text-xs text-white/60 md:text-right">Enrolled {fmt(m.when)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })
        ) : (
          <p className="glass p-10 text-center text-white/70">No students in this group.</p>
        )}
      </div>
    </GlassShell>
  );
}