import Link from "next/link";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";

const chips = ["Web Development", "Python", "Data Science", "UI/UX Design", "English", "Mathematics"];
const field =
  "w-full rounded-full bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default async function Courses({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string; sort?: string }>;
}) {
  const { q, category, level, sort } = await searchParams;
  let courses: Course[] = [];
  let error = "";

  if (supabaseConfigured()) {
    const sb = await createClient();
    let query = sb.from("courses").select("*, profiles(full_name)").eq("status", "published");
    if (q) query = query.ilike("title", `%${q.replace(/[%,]/g, "")}%`);
    if (category) query = query.ilike("category", `%${category.replace(/[%,]/g, "")}%`);
    if (level) query = query.eq("level", level);
    query = sort === "title" ? query.order("title") : query.order("created_at", { ascending: false });
    const { data, error: e } = await query;
    error = e?.message ?? "";
    courses = (data as Course[]) ?? [];
  }

  return (
    <>
      <section className="aurora text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Explore courses</h1>
          <p className="mt-2 text-white/70">Find the right course and start learning today.</p>

          <form className="glass mt-6 grid gap-3 p-3 md:grid-cols-[2fr_1.2fr_1fr_auto]">
            <label><span className="sr-only">Search</span>
              <input name="q" defaultValue={q} placeholder="Search courses" className={field} />
            </label>
            <label><span className="sr-only">Category</span>
              <input name="category" defaultValue={category} placeholder="Category" className={field} />
            </label>
            <label><span className="sr-only">Level</span>
              <select name="level" defaultValue={level ?? ""} className={`${field} [&>option]:text-slate-900`}>
                <option value="">All levels</option>
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </label>
            <button className="rounded-full bg-amber-400 px-8 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Link
                key={c}
                href={`/courses?category=${encodeURIComponent(c)}`}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  category?.toLowerCase() === c.toLowerCase()
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {c}
              </Link>
            ))}
            {(q || category || level) && (
              <Link href="/courses" className="rounded-full px-4 py-1.5 text-sm text-amber-300 underline">Clear filters</Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {error ? (
          <p role="alert" className="text-red-600">Could not load courses: {error}</p>
        ) : courses.length ? (
          <>
            <p className="mb-5 text-sm text-slate-500">{courses.length} course{courses.length === 1 ? "" : "s"} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => <CourseCard key={c.id} c={c} />)}
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            {supabaseConfigured() ? "No courses match your search." : "Supabase is not configured yet."}
          </p>
        )}
      </div>
    </>
  );
}