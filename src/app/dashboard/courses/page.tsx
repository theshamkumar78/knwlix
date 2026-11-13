import Link from "next/link";
import { Award } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { toggleLesson } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";
import ProgressRing from "@/components/dashboard/ProgressRing";

function toEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default async function MyCourses() {
  const { sb, user } = await requireRole(["student", "instructor", "admin"]);
  const { data: enr } = await sb.from("enrollments").select("course_id, courses(title)").eq("student_id", user.id);
  const { data: prog } = await sb.from("lesson_progress").select("lesson_id, completed").eq("student_id", user.id);
  const done = new Set(prog?.filter((p) => p.completed).map((p) => p.lesson_id));

  const blocks = await Promise.all(
    (enr ?? []).map(async (e: any) => {
      const { data: lessons } = await sb
        .from("lessons")
        .select("id, title, content, video_url, module_title")
        .eq("course_id", e.course_id)
        .order("order_index");
      return { ...e, lessons: lessons ?? [] };
    })
  );

  return (
    <GlassShell active="courses">
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold">My courses</h1>
        {blocks.length === 0 && (
          <p className="glass p-8 text-center text-white/70">You have not enrolled in any course yet.</p>
        )}

        {blocks.map((b: any) => {
          const n = b.lessons.filter((l: any) => done.has(l.id)).length;
          const total = b.lessons.length;
          const pct = total ? Math.round((n * 100) / total) : 0;
          return (
            <section key={b.course_id} id={`c-${b.course_id}`} className="glass scroll-mt-24 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ProgressRing pct={pct} size={64} stroke={6} />
                  <div>
                    <h2 className="text-xl font-bold">{b.courses.title}</h2>
                    <p className="text-sm text-white/70">{n}/{total} lessons complete</p>
                  </div>
                </div>
                {total > 0 && n === total && (
                  <Link
                    href={`/dashboard/certificate/${b.course_id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5"
                  >
                    <Award size={16} /> Get certificate
                  </Link>
                )}
              </div>

              <ul className="mt-5 space-y-3">
                {b.lessons.map((l: any, idx: number) => {
                  const isDone = done.has(l.id);
                  const showModule = l.module_title && l.module_title !== b.lessons[idx - 1]?.module_title;
                  return (
                    <li key={l.id}>
                      {showModule && <p className="mb-2 mt-4 text-sm font-bold text-teal-300">{l.module_title}</p>}
                      <div className="rounded-2xl bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{l.title}</span>
                          <form action={toggleLesson.bind(null, l.id, b.course_id, !isDone)}>
                            <button
                              title={isDone ? "Click to undo" : "Mark this lesson as complete"}
                              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                                isDone ? "bg-emerald-400/20 text-emerald-200" : "bg-white/15 hover:bg-white/25"
                              }`}
                            >
                              {isDone ? "Completed" : "Mark complete"}
                            </button>
                          </form>
                        </div>
                        {l.video_url &&
                          (toEmbed(l.video_url) ? (
                            <div className="mt-3 aspect-video overflow-hidden rounded-xl">
                              <iframe src={toEmbed(l.video_url)!} title={l.title} className="h-full w-full" allowFullScreen />
                            </div>
                          ) : (
                            <a href={l.video_url} target="_blank" className="mt-2 block text-sm text-amber-300 underline">Watch video</a>
                          ))}
                        {l.content && <p className="mt-2 whitespace-pre-line text-sm text-white/70">{l.content}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </GlassShell>
  );
}