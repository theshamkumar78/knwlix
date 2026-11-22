import Link from "next/link";
import { Award, BookOpen } from "lucide-react";
import GlassShell from "@/components/dashboard/GlassShell";
import LessonToggle from "@/components/dashboard/LessonToggle";
import ProgressRing from "@/components/dashboard/ProgressRing";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { embedUrl } from "@/lib/video";

export default async function StudentCourses() {
  const { sb, user } = await requireRole(["student", "instructor", "admin"]);

  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, enrolled_at, courses(id, title, category, thumbnail_url)")
    .eq("user_id", user.id);

  const ids = (enr ?? []).map((e: any) => e.course_id);

  const { data: prog } = ids.length
    ? await sb.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true)
    : { data: [] as any[] };
  const done = new Set((prog ?? []).map((p: any) => p.lesson_id));

  const { data: allLessons } = ids.length
    ? await sb.from("lessons").select("id, course_id, title, content, video_url, module_title, order_index").in("course_id", ids).order("order_index")
    : { data: [] as any[] };

  const blocks = (enr ?? []).map((e: any) => ({
    ...e,
    lessons: (allLessons ?? []).filter((l: any) => l.course_id === e.course_id),
  }));

  return (
    <GlassShell active="courses">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your course progress and complete lessons.
          </p>
        </div>

        {blocks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-800/60">
            <BookOpen size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">You have not enrolled in any course yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Explore our wide variety of courses and start your learning journey.
            </p>
            <Link
              href="/courses"
              prefetch={true}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}

        {blocks.map((b: any) => {
          const n = b.lessons.filter((l: any) => done.has(l.id)).length;
          const total = b.lessons.length;
          const pct = total ? Math.round((n * 100) / total) : 0;
          return (
            <section
              key={b.course_id}
              id={`c-${b.course_id}`}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-800/90 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ProgressRing pct={pct} size={64} stroke={6} />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {b.courses.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {n}/{total} lessons complete
                    </p>
                  </div>
                </div>
                {total > 0 && n === total && (
                  <Link
                    href={`/dashboard/certificate/${b.course_id}`}
                    prefetch={true}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600"
                  >
                    <Award size={16} /> Get certificate
                  </Link>
                )}
              </div>

              <ul className="mt-5 space-y-3">
                {b.lessons.map((l: any, idx: number) => {
                  const showModule = l.module_title && l.module_title !== b.lessons[idx - 1]?.module_title;
                  const embed = embedUrl(l.video_url);
                  return (
                    <li key={l.id}>
                      {showModule && (
                        <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {l.module_title}
                        </p>
                      )}
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">
                            {l.title}
                          </span>
                          <LessonToggle lessonId={l.id} courseId={b.course_id} done={done.has(l.id)} />
                        </div>
                        {l.video_url &&
                          (embed ? (
                            <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-black">
                              <iframe
                                src={embed}
                                title={l.title}
                                loading="lazy"
                                className="h-full w-full"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <a
                              href={l.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 block text-sm font-semibold text-blue-600 dark:text-blue-400 underline"
                            >
                              Watch video
                            </a>
                          ))}
                        {l.content && (
                          <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
                            {l.content}
                          </p>
                        )}
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
