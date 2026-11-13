import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { setCourseStatus } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const badge: Record<string, string> = {
  draft: "bg-white/15 text-white/80",
  pending: "bg-amber-400/20 text-amber-200",
  published: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};
const filters = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Pending", value: "pending" },
  { label: "Draft", value: "draft" },
  { label: "Rejected", value: "rejected" },
];

export default async function AdminCourses({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; subject?: string }>;
}) {
  const { status, subject } = await searchParams;
  const { sb } = await requireRole(["admin"]);

  let query = sb
    .from("courses")
    .select("id, title, status, category, level, instructor_id, created_at")
    .order("created_at", { ascending: false });
  if (status && ["draft", "pending", "published", "rejected"].includes(status)) query = query.eq("status", status);
  if (subject) query = query.ilike("category", `%${subject.replace(/[%,]/g, "")}%`);
  const { data: courses } = await query;

  const ids = (courses ?? []).map((c: any) => c.id);
  const teacherIds = Array.from(new Set((courses ?? []).map((c: any) => c.instructor_id)));
  const { data: teachers } = teacherIds.length
    ? await sb.from("profiles").select("id, full_name").in("id", teacherIds)
    : { data: [] as any[] };
  const { data: les } = ids.length ? await sb.from("lessons").select("id, course_id").in("course_id", ids) : { data: [] as any[] };
  const { data: enr } = ids.length ? await sb.from("enrollments").select("course_id").in("course_id", ids) : { data: [] as any[] };

  const rows = (courses ?? []).map((c: any) => ({
    ...c,
    teacher: (teachers ?? []).find((t: any) => t.id === c.instructor_id)?.full_name ?? "Instructor",
    lessons: (les ?? []).filter((l: any) => l.course_id === c.id).length,
    students: (enr ?? []).filter((e: any) => e.course_id === c.id).length,
  }));

  return (
    <GlassShell active="courses" variant="admin">
      <div className="space-y-6">
        <header>
          <p className="text-sm text-white/70">Knowlix · Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold">All courses</h1>
          <p className="mt-1 text-white/70">{rows.length} course{rows.length === 1 ? "" : "s"}{subject ? ` in “${subject}”` : ""}</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.value ? `/admin/courses?status=${f.value}` : "/admin/courses"}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                (status ?? "") === f.value && !subject ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {f.label}
            </Link>
          ))}
          {subject && (
            <Link href="/admin/courses" className="rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-950">
              {subject} ✕
            </Link>
          )}
        </div>

        {rows.length ? (
          <div className="space-y-3">
            {rows.map((c: any) => (
              <div key={c.id} className="glass flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{c.title}</h3>
                  <p className="text-sm text-white/70">
                    by {c.teacher} · {c.category ?? "General"} · <span className="capitalize">{c.level}</span>
                  </p>
                  <p className="text-xs text-white/50">{c.lessons} lessons · {c.students} students</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[c.status] ?? badge.draft}`}>{c.status}</span>
                  {c.status === "pending" && (
                    <>
                      <form action={setCourseStatus.bind(null, c.id, "published")}>
                        <button className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950">Approve</button>
                      </form>
                      <form action={setCourseStatus.bind(null, c.id, "rejected")}>
                        <button className="rounded-full bg-rose-400/20 px-4 py-2 text-sm font-bold text-rose-200">Reject</button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="glass p-10 text-center text-white/70">No courses found here.</p>
        )}
      </div>
    </GlassShell>
  );
}