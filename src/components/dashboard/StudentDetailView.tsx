import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, MapPin, GraduationCap } from "lucide-react";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi",
  });

export default async function StudentDetailView({
  sb, studentId, instructorId,
}: { sb: any; studentId: string; instructorId?: string }) {
  const { data: p } = await sb.from("profiles").select("id, full_name, role, created_at").eq("id", studentId).maybeSingle();
  if (!p) notFound();
  const { data: sp } = await sb.from("student_profiles").select("*").eq("id", studentId).maybeSingle();

  let cq = sb.from("courses").select("id, title");
  if (instructorId) cq = cq.eq("instructor_id", instructorId);
  const { data: courses } = await cq;
  const ids = (courses ?? []).map((c: any) => c.id);

  const { data: enr } = ids.length
    ? await sb.from("enrollments").select("course_id, enrolled_at").eq("student_id", studentId).in("course_id", ids).order("enrolled_at", { ascending: false })
    : { data: [] as any[] };
  if (instructorId && !(enr ?? []).length) notFound();

  const { data: les } = ids.length ? await sb.from("lessons").select("id, course_id").in("course_id", ids) : { data: [] as any[] };
  const { data: prog } = ids.length
    ? await sb.from("lesson_progress").select("course_id").eq("student_id", studentId).eq("completed", true).in("course_id", ids)
    : { data: [] as any[] };

  const rows = (enr ?? []).map((e: any) => {
    const total = (les ?? []).filter((l: any) => l.course_id === e.course_id).length;
    const done = (prog ?? []).filter((x: any) => x.course_id === e.course_id).length;
    return {
      key: e.course_id,
      title: (courses ?? []).find((c: any) => c.id === e.course_id)?.title ?? "Course",
      when: e.enrolled_at as string,
      total, done,
      pct: total ? Math.round((done * 100) / total) : 0,
    };
  });

  const name = p.full_name ?? `Student ${String(p.id).slice(0, 6)}`;
  const back = instructorId ? "/instructor/students" : "/admin/students";
  const facts = [
    { icon: Phone, label: "Phone", value: sp?.phone },
    { icon: MapPin, label: "City", value: sp?.city },
    { icon: GraduationCap, label: "Education", value: sp?.education },
  ];

  return (
    <div className="space-y-6">
      <Link href={back} className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
        <ArrowLeft size={16} /> Students
      </Link>

      <header className="glass flex items-center gap-4 p-6">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-2xl font-bold">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">{name}</h1>
          <p className="text-sm text-white/70">Joined {fmt(p.created_at)}</p>
        </div>
      </header>

      <section className="glass p-6">
        <h2 className="text-xl font-bold">Student details</h2>
        {sp ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4">
                  <p className="flex items-center gap-2 text-xs text-white/60"><Icon size={14} />{label}</p>
                  <p className="mt-1 font-semibold">{value || "Not provided"}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-white/60">Learning goal</p>
                <p className="mt-1 whitespace-pre-line text-sm">{sp.goal || "Not provided"}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-white/60">About</p>
                <p className="mt-1 whitespace-pre-line text-sm">{sp.bio || "Not provided"}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-white/70">This student has not filled in their details yet.</p>
        )}
      </section>

      <section className="glass p-6">
        <h2 className="text-xl font-bold">{instructorId ? "Enrolled in your courses" : "Enrolled courses"}</h2>
        {rows.length ? (
          <ul className="mt-4 space-y-3">
            {rows.map((r) => (
              <li key={r.key} className="grid items-center gap-3 rounded-2xl bg-white/5 p-4 md:grid-cols-[1.5fr_1.2fr_1.2fr]">
                <span className="truncate font-medium">{r.title}</span>
                <div>
                  <div className="h-2 rounded-full bg-white/15">
                    <div className="h-2 rounded-full bg-gradient-to-r from-teal-300 to-violet" style={{ width: `${r.pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-white/70">{r.done}/{r.total} lessons · {r.pct}%</p>
                </div>
                <p className="text-xs text-white/60 md:text-right">Enrolled {fmt(r.when)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-white/70">Not enrolled in any course yet.</p>
        )}
      </section>
    </div>
  );
}