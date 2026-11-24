import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles, Award } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";

export default async function InstructorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!supabaseConfigured()) notFound();
  const sb = await createClient();

  const { data: p } = await sb
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", id)
    .maybeSingle();

  // Support both instructor and admin roles
  if (!p || (p.role !== "instructor" && p.role !== "admin")) notFound();

  const { data: ip } = await sb
    .from("instructor_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { data } = await sb
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("instructor_id", id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch reviews for rating badges
  const { data: revData } = await sb
    .from("course_reviews")
    .select("course_id, rating");

  const revMap = new Map<string, number[]>();
  (revData ?? []).forEach((r: any) => {
    const list = revMap.get(r.course_id) || [];
    list.push(r.rating);
    revMap.set(r.course_id, list);
  });

  const courses = ((data as any[]) ?? []).map((c) => {
    const ratings = revMap.get(c.id) || [];
    const reviews_count = ratings.length;
    const avg_rating = reviews_count
      ? Number((ratings.reduce((a, b) => a + b, 0) / reviews_count).toFixed(1))
      : null;
    return { ...c, avg_rating, reviews_count };
  });

  const name = p.full_name ?? "Knowlix instructor";
  const subjects = Array.from(
    new Set(courses.map((c) => (c.category ?? "").trim()).filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#0b1329] dark:text-white pb-20 transition-colors">
      {/* 1. Header Profile Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft size={14} /> Back to courses
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90 flex flex-wrap items-center gap-6">
          <span className="grid h-24 w-24 place-items-center rounded-3xl bg-blue-600 text-4xl font-extrabold text-white shadow-lg shadow-blue-600/25">
            {name.charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {name}
              </h1>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300 capitalize">
                Verified {p.role}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {ip?.headline ?? "Instructor & Academic Specialist at Knowlix"}
            </p>

            {subjects.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Bio & Experience */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8 pb-16">
        {(ip?.bio || ip?.experience) && (
          <section className="grid gap-6 md:grid-cols-2">
            {ip?.bio && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600 dark:text-blue-400" /> About
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {ip.bio}
                </p>
              </div>
            )}
            {ip?.experience && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award size={16} className="text-amber-500" /> Experience & Background
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {ip.experience}
                </p>
              </div>
            )}
          </section>
        )}

        {/* 3. Courses by Instructor */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={22} className="text-blue-600 dark:text-blue-400" /> Courses by {name}
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {courses.length} course{courses.length === 1 ? "" : "s"} published
            </span>
          </div>

          {courses.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <p>No published courses by this instructor yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
