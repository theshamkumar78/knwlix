import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, ExternalLink, User, CheckCircle2 } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { updateProfile, updateStudentProfile } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800";

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { sb, user, profile } = await requireRole([
    "student",
    "instructor",
    "admin",
  ]);
  if (profile.role === "instructor") redirect("/instructor/profile");
  const isStudent = profile.role === "student";

  const { data: sp } = await sb
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id")
    .eq("student_id", user.id);
  const ids = (enr ?? []).map((e: any) => e.course_id);
  const { data: les } = ids.length
    ? await sb
        .from("lessons")
        .select("id, course_id")
        .in("course_id", ids)
        : { data: [] as any[] };
  const { data: prog } = await sb
    .from("lesson_progress")
    .select("lesson_id, course_id")
    .eq("student_id", user.id)
    .eq("completed", true);

  // Fetch issued certificates for student profile
  const { data: certs } = await sb
    .from("certificates")
    .select("id, code, issued_at, course_id, courses(title)")
    .eq("student_id", user.id)
    .order("issued_at", { ascending: false });

  const lessonsDone = (prog ?? []).length;
  const finished = ids.filter((cid: string) => {
    const total = (les ?? []).filter((l: any) => l.course_id === cid).length;
    const done = (prog ?? []).filter((p: any) => p.course_id === cid).length;
    return total > 0 && done >= total;
  }).length;

  const badges = [
    { title: "First Step", text: "Enrolled in a course", ok: ids.length >= 1 },
    { title: "Explorer", text: "Enrolled in 3 courses", ok: ids.length >= 3 },
    {
      title: "Getting Started",
      text: "Completed a lesson",
      ok: lessonsDone >= 1,
    },
    {
      title: "On a Roll",
      text: "Completed 10 lessons",
      ok: lessonsDone >= 10,
    },
    { title: "Course Finisher", text: "Finished a course", ok: finished >= 1 },
  ];

  const name = profile.full_name ?? "";
  const shown = name || user.email?.split("@")[0] || "Student";

  return (
    <GlassShell active="profile" variant={profile.role}>
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md shadow-blue-600/20">
            {shown.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{shown}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {profile.role} · {user.email}
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <form
            action={isStudent ? updateStudentProfile : updateProfile}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-800/90"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
            {saved && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              >
                Profile saved successfully.
              </p>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                name="full_name"
                defaultValue={name}
                required
                minLength={2}
                className={field}
              />
            </div>

            {isStudent && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={sp?.phone ?? ""}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      City
                    </label>
                    <input
                      name="city"
                      defaultValue={sp?.city ?? ""}
                      className={field}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Education Level
                  </label>
                  <select
                    name="education"
                    defaultValue={sp?.education ?? ""}
                    className={field}
                  >
                    <option value="">Select Level</option>
                    <option>School Student</option>
                    <option>College Student</option>
                    <option>University Student</option>
                    <option>Working Professional</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Learning Goal
                  </label>
                  <textarea
                    name="goal"
                    rows={2}
                    defaultValue={sp?.goal ?? ""}
                    className={field}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    About Me
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={sp?.bio ?? ""}
                    className={field}
                  />
                </div>
              </>
            )}

            <button className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              Save Changes
            </button>
          </form>

          {isStudent && (
            <div className="space-y-6">
              <section className="grid grid-cols-3 gap-3">
                {[
                  ["Enrolled", ids.length],
                  ["Lessons done", lessonsDone],
                  ["Finished", finished],
                ].map(([l, v]) => (
                  <div key={l as string} className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-black text-blue-600">{v}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{l}</p>
                  </div>
                ))}
              </section>

              {/* Your Certificates Section */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">Your Certificates</h2>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {certs?.length ?? 0} Earned
                  </span>
                </div>
                {certs && certs.length > 0 ? (
                  <ul className="space-y-3">
                    {certs.map((c: any) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
                            <Award size={18} />
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {(c.courses as any)?.title ?? "Course"}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400">
                              {c.code}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Link
                            href={`/dashboard/certificate/${c.course_id}`}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                          >
                            View
                          </Link>
                          <Link
                            href={`/verify/${c.code}`}
                            target="_blank"
                            title="Verify certificate"
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    Complete all lessons of a course to earn your verified certificate.
                  </p>
                )}
              </section>

              {/* Achievements Section */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Achievements</h2>
                <ul className="space-y-2.5">
                  {badges.map((b) => (
                    <li
                      key={b.title}
                      className={`flex items-center gap-3 rounded-xl p-3 border ${
                        b.ok ? "border-emerald-200 bg-emerald-50/60" : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          b.ok ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {b.ok ? "✓" : "•"}
                      </span>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">{b.title}</span>
                        <span className="block text-[11px] text-slate-500">
                          {b.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </GlassShell>
  );
}
