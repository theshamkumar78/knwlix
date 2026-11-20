import Link from "next/link";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import CourseApprovalActions from "@/components/admin/CourseApprovalActions";

const badgeTone: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
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
    .select("id, title, slug, status, category, level, instructor_id, created_at, rejection_reason")
    .order("created_at", { ascending: false });
  if (status && ["draft", "pending", "published", "rejected"].includes(status))
    query = query.eq("status", status);
  if (subject)
    query = query.ilike("category", `%${subject.replace(/[%,]/g, "")}%`);
  let { data: courses, error: courseErr } = await query;

  // Fallback if column not in cache
  if (courseErr) {
    let fallback = sb
      .from("courses")
      .select("id, title, slug, status, category, level, instructor_id, created_at")
      .order("created_at", { ascending: false });
    if (status && ["draft", "pending", "published", "rejected"].includes(status))
      fallback = fallback.eq("status", status);
    if (subject)
      fallback = fallback.ilike("category", `%${subject.replace(/[%,]/g, "")}%`);
    const { data: fbData } = await fallback;
    courses = (fbData ?? []) as any;
  }

  const ids = (courses ?? []).map((c: any) => c.id);
  const teacherIds = Array.from(
    new Set((courses ?? []).map((c: any) => c.instructor_id))
  );
  const { data: teachers } = teacherIds.length
    ? await sb.from("profiles").select("id, full_name").in("id", teacherIds)
    : { data: [] as any[] };
  const { data: les } = ids.length
    ? await sb.from("lessons").select("id, course_id").in("course_id", ids)
    : { data: [] as any[] };
  const { data: enr } = ids.length
    ? await sb.from("enrollments").select("course_id").in("course_id", ids)
    : { data: [] as any[] };

  const rows = (courses ?? []).map((c: any) => ({
    ...c,
    teacher:
      (teachers ?? []).find((t: any) => t.id === c.instructor_id)?.full_name ??
      "Instructor",
    lessons: (les ?? []).filter((l: any) => l.course_id === c.id).length,
    students: (enr ?? []).filter((e: any) => e.course_id === c.id).length,
  }));

  return (
    <GlassShell active="courses" variant="admin">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">All Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} course{rows.length === 1 ? "" : "s"}
            {subject ? ` in “${subject}”` : ""}
          </p>
        </header>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={
                f.value ? `/admin/courses?status=${f.value}` : "/admin/courses"
              }
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                (status ?? "") === f.value && !subject
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </Link>
          ))}
          {subject && (
            <Link
              href="/admin/courses"
              className="rounded-xl bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700"
            >
              {subject} ✕
            </Link>
          )}
        </div>

        {rows.length ? (
          <div className="space-y-4">
            {rows.map((c: any) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate font-bold text-base text-slate-900">{c.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-bold capitalize ${
                        badgeTone[c.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    by {c.teacher} · {c.category ?? "General"} ·{" "}
                    <span className="capitalize">{c.level}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {c.lessons} lessons · {c.students} students enrolled
                  </p>

                  {c.status === "rejected" && c.rejection_reason && (
                    <p className="mt-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <span className="font-bold">Rejection reason:</span>{" "}
                      {c.rejection_reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {c.status === "pending" ? (
                    <CourseApprovalActions
                      courseId={c.id}
                      courseTitle={c.title}
                    />
                  ) : (
                    <Link
                      href={`/courses/${c.slug || c.id}`}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No courses found matching this criteria.
          </div>
        )}
      </div>
    </GlassShell>
  );
}
