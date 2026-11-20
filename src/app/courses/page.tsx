import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import EmptyState from "@/components/ui/EmptyState";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";
 
const categoryFilters = [
  "All",
  "Computer Science",
  "Medical / MBBS",
  "English",
  "Mathematics",
  "Business",
  "Web Development",
  "Python",
];
 
export default async function Courses({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
    sort?: string;
  }>;
}) {
  const { q, category, level, sort } = await searchParams;
  let courses: Course[] = [];
  let error = "";
 
  if (supabaseConfigured()) {
    const sb = await createClient();
 
    // FIX: lessons(count) add kiya taake asli lessons ki ginti mile
    let query = sb
      .from("courses")
      .select("*, profiles(full_name)")
      .eq("status", "published");
 
    if (q) query = query.ilike("title", `%${q.replace(/[%,]/g, "")}%`);
    if (category && category !== "All")
      query = query.ilike("category", `%${category.replace(/[%,]/g, "")}%`);
    if (level) query = query.eq("level", level);
    query =
      sort === "title"
        ? query.order("title")
        : query.order("created_at", { ascending: false });
 
    const { data, error: e } = await query;
    error = e?.message ?? "";
 
    // FIX: sirf in courses ke reviews fetch karna
    const courseIds = ((data as any[]) ?? []).map((c) => c.id);
 
    const { data: revData } = courseIds.length
      ? await sb
          .from("course_reviews")
          .select("course_id, rating")
          .in("course_id", courseIds)
      : { data: [] as any[] };
 
    const revMap = new Map<string, number[]>();
    (revData ?? []).forEach((r: any) => {
      const list = revMap.get(r.course_id) || [];
      list.push(r.rating);
      revMap.set(r.course_id, list);
    });
 
    // FIX: lessons ki ginti safe view se (RLS ke bawajood kaam karta hai)
    const { data: lessonData } = courseIds.length
      ? await sb
          .from("course_lesson_counts")
          .select("course_id, lessons_count")
          .in("course_id", courseIds)
      : { data: [] as any[] };
 
    const lessonMap = new Map<string, number>();
    (lessonData ?? []).forEach((l: any) => {
      lessonMap.set(l.course_id, l.lessons_count);
    });
 
    courses = ((data as any[]) ?? []).map((c) => {
      const ratings = revMap.get(c.id) || [];
      const reviews_count = ratings.length;
      const avg_rating = reviews_count
        ? Number((ratings.reduce((a, b) => a + b, 0) / reviews_count).toFixed(1))
        : null;
      return {
        ...c,
        avg_rating,
        reviews_count,
        lessons_count: lessonMap.get(c.id) ?? 0, // FIX: asli lessons
      };
    });
  }
 
  // Fallback demo courses matching PDF titles when database is fresh
  const demoFallbackCourses: Course[] = [
    {
      id: "demo-python",
      instructor_id: "inst-1",
      title: "Python Programming (Beginner to Advanced)",
      slug: "basic-python",
      description: "Learn Python from scratch and become a professional developer.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "Computer Science",
      level: "Beginner",
      duration: "12 hours",
      status: "published",
      avg_rating: 4.8,
      reviews_count: 14,
      profiles: { full_name: "Prof. Shahzeb" },
    },
    {
      id: "demo-anatomy",
      instructor_id: "inst-2",
      title: "Human Anatomy (MBBS)",
      slug: "human-anatomy",
      description: "Comprehensive medical human anatomy course for health sciences.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "Medical / MBBS",
      level: "Intermediate",
      duration: "18 hours",
      status: "published",
      avg_rating: 4.7,
      reviews_count: 9,
      profiles: { full_name: "Dr. Ayesha Khan" },
    },
    {
      id: "demo-math",
      instructor_id: "inst-3",
      title: "Advanced Mathematics",
      slug: "advanced-mathematics",
      description: "Calculus, Linear Algebra, and discrete mathematical foundations.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "Mathematics",
      level: "Advanced",
      duration: "15 hours",
      status: "published",
      avg_rating: 4.9,
      reviews_count: 22,
      profiles: { full_name: "Dr. Salman Tariq" },
    },
    {
      id: "demo-business",
      instructor_id: "inst-4",
      title: "Business Management",
      slug: "business-management",
      description: "Strategic leadership, financial planning, and operational mastery.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "Business",
      level: "Beginner",
      duration: "10 hours",
      status: "published",
      avg_rating: 4.7,
      reviews_count: 18,
      profiles: { full_name: "Prof. Hamza Ali" },
    },
    {
      id: "demo-english",
      instructor_id: "inst-5",
      title: "English Grammar",
      slug: "english-grammar",
      description: "Master modern English grammar, communication, and professional writing.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "English",
      level: "Beginner",
      duration: "12 hours",
      status: "published",
      avg_rating: 4.7,
      reviews_count: 15,
      profiles: { full_name: "Sarah Jenkins" },
    },
    {
      id: "demo-networks",
      instructor_id: "inst-6",
      title: "Computer Networks",
      slug: "computer-networks",
      description: "TCP/IP, routing protocols, subnetting, and network security architecture.",
      thumbnail_url: "/images/category-banners.jpeg",
      category: "Computer Science",
      level: "Intermediate",
      duration: "14 hours",
      status: "published",
      avg_rating: 4.7,
      reviews_count: 20,
      profiles: { full_name: "Prof. David Clark" },
    },
  ];
 
  const displayCourses = courses.length > 0 ? courses : (q || category ? [] : demoFallbackCourses);
 
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* 1. Header & Search Bar matching PDF Page 2 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            All Courses
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Explore our wide range of courses and start learning today.
          </p>
        </div>
 
        {/* Search & Filter Bar */}
        <form className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search courses..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
 
          <button
            type="submit"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <SlidersHorizontal size={16} />
            <span>Filter</span>
          </button>
        </form>
 
        {/* Category Pills Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {categoryFilters.map((cat) => {
            const isAll = cat === "All";
            const isActive = isAll ? !category || category === "All" : category?.toLowerCase() === cat.toLowerCase();
            const href = isAll ? "/courses" : `/courses?category=${encodeURIComponent(cat)}`;
 
            return (
              <Link
                key={cat}
                href={href}
                className={`inline-flex min-h-[38px] items-center rounded-xl px-4 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat}
              </Link>
            );
          })}
 
          {(q || (category && category !== "All") || level) && (
            <Link
              href="/courses"
              className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              <X size={14} /> Clear filters
            </Link>
          )}
        </div>
      </section>
 
      {/* 2. Courses Grid matching PDF Page 2 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            Could not load courses: {error}
          </div>
        ) : displayCourses.length ? (
          <>
            <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Showing {displayCourses.length} course{displayCourses.length === 1 ? "" : "s"}</span>
            </div>
 
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayCourses.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No courses match your search"
            description="We couldn't find any courses matching your criteria. Try adjusting keywords or clearing filters."
            actionHref="/courses"
            actionLabel="View all courses"
            className="border border-slate-200 bg-white !text-slate-800 shadow-sm"
          />
        )}
      </section>
    </main>
  );
}
 
