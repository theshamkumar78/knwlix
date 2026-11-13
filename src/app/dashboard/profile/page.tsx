import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { updateProfile, updateStudentProfile } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default async function Profile({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const { sb, user, profile } = await requireRole(["student", "instructor", "admin"]);
  if (profile.role === "instructor") redirect("/instructor/profile");
  const isStudent = profile.role === "student";

  const { data: sp } = await sb.from("student_profiles").select("*").eq("id", user.id).maybeSingle();
  const { data: enr } = await sb.from("enrollments").select("course_id").eq("student_id", user.id);
  const ids = (enr ?? []).map((e: any) => e.course_id);
  const { data: les } = ids.length ? await sb.from("lessons").select("id, course_id").in("course_id", ids) : { data: [] as any[] };
  const { data: prog } = await sb.from("lesson_progress").select("lesson_id, course_id").eq("student_id", user.id).eq("completed", true);

  const lessonsDone = (prog ?? []).length;
  const finished = ids.filter((cid: string) => {
    const total = (les ?? []).filter((l: any) => l.course_id === cid).length;
    const done = (prog ?? []).filter((p: any) => p.course_id === cid).length;
    return total > 0 && done >= total;
  }).length;

  const badges = [
    { title: "First step", text: "Enrolled in a course", ok: ids.length >= 1 },
    { title: "Explorer", text: "Enrolled in 3 courses", ok: ids.length >= 3 },
    { title: "Getting started", text: "Completed a lesson", ok: lessonsDone >= 1 },
    { title: "On a roll", text: "Completed 10 lessons", ok: lessonsDone >= 10 },
    { title: "Course finisher", text: "Finished a course", ok: finished >= 1 },
  ];

  const name = profile.full_name ?? "";
  const shown = name || user.email?.split("@")[0] || "User";

  return (
    <GlassShell active="profile" variant={profile.role}>
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-2xl font-bold">
            {shown.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold">{shown}</h1>
            <div><p className="text-sm capitalize text-white/70">{profile.role} · {user.email}</p><a href="/dashboard/security" className="text-xs font-semibold text-amber-300 underline">Change password</a></div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <form action={isStudent ? updateStudentProfile : updateProfile} className="glass space-y-5 p-6">
            <h2 className="text-xl font-bold">Profile details</h2>
            {saved && <p role="status" className="rounded-2xl bg-emerald-400/15 px-4 py-3 text-sm text-emerald-200">Profile saved.</p>}
            <label className="block text-sm">Full name
              <input name="full_name" defaultValue={name} required minLength={2} className={field} />
            </label>

            {isStudent && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">Phone
                    <input name="phone" type="tel" defaultValue={sp?.phone ?? ""} className={field} />
                  </label>
                  <label className="block text-sm">City
                    <input name="city" defaultValue={sp?.city ?? ""} className={field} />
                  </label>
                </div>
                <label className="block text-sm">Education level
                  <select name="education" defaultValue={sp?.education ?? ""} className={`${field} [&>option]:text-slate-900`}>
                    <option value="">Select</option>
                    <option>School student</option>
                    <option>College student</option>
                    <option>University student</option>
                    <option>Working professional</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-sm">My learning goal
                  <textarea name="goal" rows={2} defaultValue={sp?.goal ?? ""} className={field} />
                </label>
                <label className="block text-sm">About me
                  <textarea name="bio" rows={3} defaultValue={sp?.bio ?? ""} className={field} />
                </label>
                <p className="text-xs text-white/60">Visible to your course instructors and admins only.</p>
              </>
            )}

            <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
              Save changes
            </button>
          </form>

          {isStudent && (
            <div className="space-y-6">
              <section className="grid grid-cols-3 gap-3">
                {[["Enrolled", ids.length], ["Lessons done", lessonsDone], ["Finished", finished]].map(([l, v]) => (
                  <div key={l as string} className="glass p-4 text-center">
                    <p className="text-2xl font-extrabold">{v}</p>
                    <p className="text-xs text-white/70">{l}</p>
                  </div>
                ))}
              </section>

              <section className="glass p-6">
                <h2 className="text-xl font-bold">Achievements</h2>
                <ul className="mt-4 space-y-3">
                  {badges.map((b) => (
                    <li key={b.title} className={`flex items-center gap-3 rounded-2xl p-3 ${b.ok ? "bg-emerald-400/15" : "bg-white/5 opacity-60"}`}>
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${b.ok ? "bg-gradient-to-br from-teal-400 to-violet" : "bg-white/10"}`}>
                        {b.ok ? "✓" : "•"}
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{b.title}</span>
                        <span className="block text-xs text-white/70">{b.text}</span>
                      </span>
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