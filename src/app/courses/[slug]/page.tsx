import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, BarChart3, PlayCircle, ArrowLeft } from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!supabaseConfigured()) notFound();
  const sb = await createClient();
  const { data: course } = await sb.from("courses").select("*, profiles(full_name)").eq("slug", slug).maybeSingle();
  if (!course) notFound();
  const { data: outline } = await sb.from("lesson_outline").select("*").eq("course_id", course.id).order("order_index");
  const { data: { user } } = await sb.auth.getUser();
  const { data: enrolled } = user
    ? await sb.from("enrollments").select("id").eq("course_id", course.id).eq("student_id", user.id).maybeSingle()
    : { data: null };
  const { data: ip } = await sb.from("instructor_profiles").select("headline").eq("id", course.instructor_id).maybeSingle();

  const teacher = course.profiles?.full_name ?? "Knowlix instructor";
  const count = outline?.length ?? 0;

  return (
    <>
      <section className="aurora text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> All courses
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{course.category ?? "General"}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">{course.level}</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{course.title}</h1>

            <Link href={`/instructors/${course.instructor_id}`} className="mt-5 flex w-fit items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-5 transition hover:bg-white/20">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet font-bold">
                {teacher.charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="block text-xs text-white/60">Instructor</span>
                <span className="block font-semibold">{teacher}</span>
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/80">
              <span className="flex items-center gap-2"><PlayCircle size={18} />{count} lesson{count === 1 ? "" : "s"}</span>
              {course.duration && <span className="flex items-center gap-2"><Clock size={18} />{course.duration}</span>}
              <span className="flex items-center gap-2 capitalize"><BarChart3 size={18} />{course.level}</span>
            </div>
          </div>

          <aside className="glass p-3">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/10">
              <Image src={course.thumbnail_url ?? "/images/category-banners.jpeg"} alt={course.title} fill sizes="380px" className="object-cover" priority />
            </div>
            <div className="p-4">
              {enrolled ? (
                <Link href={`/dashboard/courses#c-${course.id}`} className="block rounded-full bg-amber-400 px-6 py-3 text-center text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
                  Continue learning
                </Link>
              ) : (
                <Link href={`/courses/${slug}/enroll`} className="block rounded-full bg-amber-400 px-6 py-3 text-center text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
                  Enroll now
                </Link>
              )}
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>Learn at your own pace</li>
                <li>Track your progress lesson by lesson</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 lg:max-w-3xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">About this course</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">{course.description || "No description yet."}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Curriculum</h2>
          <ol className="mt-4 space-y-3">
            {count ? (
              outline!.map((l, i) => (
                <li key={l.id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
                  <span className="font-medium">{l.title}{l.module_title ? <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">{l.module_title}</span> : null}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No lessons yet.</li>
            )}
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Your instructor</h2>
          <Link href={`/instructors/${course.instructor_id}`} className="mt-4 flex items-center gap-4 rounded-xl p-2 transition hover:bg-slate-50">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-xl font-bold text-white">
              {teacher.charAt(0).toUpperCase()}
            </span>
            <span>
              <span className="block font-bold">{teacher}</span>
              <span className="block text-sm text-slate-500">{ip?.headline ?? "View profile and other courses"}</span>
            </span>
          </Link>
        </section>
      </div>
    </>
  );
}