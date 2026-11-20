import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  PlayCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { requireRole } from "@/lib/auth";

export default async function CourseStudentPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  // Fetch course
  const { data: course } = await sb
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (!course) notFound();

  // Ensure owner or admin
  if (course.instructor_id !== user.id && user.role !== "admin") {
    notFound();
  }

  // Fetch lessons
  const { data: lessons } = await sb
    .from("lessons")
    .select("id, title, content, video_url, module_title, order_index")
    .eq("course_id", id)
    .order("order_index");

  const count = lessons?.length ?? 0;
  const teacher = course.profiles?.full_name ?? "Instructor";

  // Group by modules
  const modulesMap = new Map<string, typeof lessons>();
  (lessons ?? []).forEach((l) => {
    const mod = l.module_title?.trim() || "Course Lessons";
    const existing = modulesMap.get(mod) || [];
    existing.push(l);
    modulesMap.set(mod, existing);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Preview Mode Top Bar */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 bg-amber-400 px-4 py-3 text-amber-950 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Eye size={18} />
          <span>Student View Preview Mode: &quot;{course.title}&quot;</span>
          <span className="rounded-full bg-amber-950/15 px-2.5 py-0.5 text-xs font-semibold capitalize">
            Status: {course.status}
          </span>
        </div>

        <Link
          href={`/instructor/courses/${course.id}`}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-amber-950 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-black"
        >
          <ArrowLeft size={14} /> Exit preview & edit course
        </Link>
      </div>

      {/* Hero Header */}
      <section className="aurora text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {course.category ?? "General"}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">
                {course.level}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
              {course.title}
            </h1>

            <div className="mt-5 flex w-fit items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet font-bold">
                {teacher.charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="block text-xs text-white/60">Instructor</span>
                <span className="block font-semibold">{teacher}</span>
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <PlayCircle size={18} />
                {count} lesson{count === 1 ? "" : "s"}
              </span>
              {course.duration && (
                <span className="flex items-center gap-2">
                  <Clock size={18} />
                  {course.duration}
                </span>
              )}
              <span className="flex items-center gap-2 capitalize">
                <BarChart3 size={18} />
                {course.level}
              </span>
            </div>
          </div>

          <aside className="glass p-3">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/10">
              <Image
                src={course.thumbnail_url ?? "/images/category-banners.jpeg"}
                alt={course.title}
                fill
                sizes="380px"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4">
              <button
                disabled
                className="w-full rounded-full bg-amber-400 px-6 py-3 text-center text-sm font-bold text-amber-950 opacity-90 cursor-not-allowed"
              >
                Enroll now (Preview)
              </button>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>✓ Learn at your own pace</li>
                <li>✓ Track your progress lesson by lesson</li>
                <li>✓ Official verifiable certificate on completion</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Main Body */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 lg:max-w-3xl">
        {/* What You Will Learn Card */}
        {course.what_you_will_learn && course.what_you_will_learn.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              What you will learn
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.what_you_will_learn.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Course */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">About this course</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
            {course.description || "No description provided yet."}
          </p>
        </section>

        {/* Curriculum Outline */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
          {count > 0 ? (
            <div className="space-y-4">
              {Array.from(modulesMap.entries()).map(([moduleName, moduleLessons]) => (
                <div key={moduleName} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {moduleName} ({moduleLessons?.length ?? 0} lessons)
                  </h3>
                  <ol className="space-y-2">
                    {(moduleLessons ?? []).map((l, i) => (
                      <li
                        key={l.id}
                        className="flex items-center gap-3 rounded-lg bg-white p-3 border border-slate-100"
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {l.title}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No lessons created yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
