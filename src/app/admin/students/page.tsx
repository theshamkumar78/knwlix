import Link from "next/link";
import { Download, ShieldCheck, ShieldX } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { setUserRole, toggleUserActive } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function Students({
  searchParams,
}: {
  searchParams: Promise<{ enrolled?: string }>;
}) {
  const { enrolled } = await searchParams;
  const { sb } = await requireRole(["admin"]);

  // 1. Fetch all enrollments
  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, student_id, enrolled_at")
    .order("enrolled_at", { ascending: false });

  const enrolledUserIds = Array.from(
    new Set((enr ?? []).map((e: any) => e.student_id))
  );

  // 2. Fetch profiles: all students AND any account that has an enrollment
  let { data: allProfiles, error: profErr } = await sb
    .from("profiles")
    .select("id, full_name, role, created_at, is_active")
    .order("created_at", { ascending: false });

  // Fallback if migration 0005 has not been run yet
  if (profErr) {
    const { data: fbProfiles } = await sb
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false });
    allProfiles = (fbProfiles ?? []) as any;
  }

  const studs = (allProfiles ?? []).filter(
    (p: any) => p.role === "student" || enrolledUserIds.includes(p.id)
  );

  // 3. Fetch courses, lessons and progress to compute live progress %
  const { data: courses } = await sb.from("courses").select("id, title");
  const { data: les } = await sb.from("lessons").select("id, course_id");
  const { data: prog } = await sb
    .from("lesson_progress")
    .select("student_id, course_id")
    .eq("completed", true);

  const allRows = (studs ?? []).map((s: any) => {
    const mine = (enr ?? [])
      .filter((e: any) => e.student_id === s.id)
      .map((e: any) => {
        const total = (les ?? []).filter(
          (l: any) => l.course_id === e.course_id
        ).length;
        const done = (prog ?? []).filter(
          (p: any) => p.student_id === s.id && p.course_id === e.course_id
        ).length;
        return {
          course:
            (courses ?? []).find((c: any) => c.id === e.course_id)?.title ??
            "Course",
          when: e.enrolled_at as string,
          pct: total ? Math.round((done * 100) / total) : 0,
          done,
          total,
        };
      });
    return { ...s, mine };
  });

  const enrolledCount = allRows.filter((r) => r.mine.length > 0).length;
  const notEnrolledCount = allRows.filter((r) => r.mine.length === 0).length;

  let displayRows = allRows;
  if (enrolled === "1") displayRows = allRows.filter((r) => r.mine.length > 0);
  if (enrolled === "0") displayRows = allRows.filter((r) => r.mine.length === 0);

  const filters = [
    { label: `All (${allRows.length})`, value: "" },
    { label: `Enrolled (${enrolledCount})`, value: "1" },
    { label: `Not enrolled (${notEnrolledCount})`, value: "0" },
  ];

  return (
    <GlassShell active="students" variant="admin">
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Students & Enrollments</h1>
            <p className="mt-1 text-sm text-slate-500">
              {displayRows.length} user{displayRows.length === 1 ? "" : "s"} shown ·{" "}
              {enr?.length ?? 0} total active enrollment{enr?.length === 1 ? "" : "s"}
            </p>
          </div>

          <a
            href="/api/admin/export-enrollments"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            <Download size={15} /> Export CSV
          </a>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={
                f.value ? `/admin/students?enrolled=${f.value}` : "/admin/students"
              }
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                (enrolled ?? "") === f.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {displayRows.length ? (
          <div className="space-y-4">
            {displayRows.map((s: any) => {
              const name = s.full_name ?? `User ${String(s.id).slice(0, 6)}`;
              const isActive = s.is_active !== false;

              return (
                <article key={s.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20">
                        {name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-slate-900 text-base">
                            <Link
                              href={`/admin/students/${s.id}`}
                              className="hover:text-blue-600 transition"
                            >
                              {name}
                            </Link>
                          </h2>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 capitalize">
                            {s.role}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
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
                        <p className="text-xs text-slate-400 mt-0.5">
                          {s.mine.length} course{s.mine.length === 1 ? "" : "s"}{" "}
                          enrolled
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <form action={toggleUserActive.bind(null, s.id, !isActive)}>
                        <button
                          type="submit"
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                            isActive
                              ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>

                      {s.role === "student" && (
                        <form action={setUserRole.bind(null, s.id, "instructor")}>
                          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                            Make Instructor
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {s.mine.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      {s.mine.map((m: any, i: number) => (
                        <li
                          key={i}
                          className="grid items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 md:grid-cols-[1.5fr_1.2fr_1.2fr]"
                        >
                          <span className="truncate font-semibold text-xs text-slate-900">
                            {m.course}
                          </span>
                          <div>
                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${m.pct}%` }}
                              />
                            </div>
                            <p className="mt-1 text-[11px] font-medium text-slate-500">
                              {m.done}/{m.total} lessons · {m.pct}%
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-400 md:text-right">
                            Enrolled {fmt(m.when)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No students in this group.
          </div>
        )}
      </div>
    </GlassShell>
  );
}
