import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Laptop,
  Stethoscope,
  Book,
  Calculator,
  Briefcase,
  Users,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";
 
type Role = "student" | "instructor" | "admin" | null;
 
// 5 categories directly matching Page 1 of the PDF design
const popularCategories = [
  {
    name: "Computer Science",
    slug: "Computer Science",
    icon: Laptop,
    cardBg: "bg-blue-50/90 hover:bg-blue-100/80 border-blue-100/80",
    iconColor: "text-blue-600 bg-blue-100",
  },
  {
    name: "Medical / MBBS",
    slug: "Medical",
    icon: Stethoscope,
    cardBg: "bg-emerald-50/90 hover:bg-emerald-100/80 border-emerald-100/80",
    iconColor: "text-emerald-600 bg-emerald-100",
  },
  {
    name: "English",
    slug: "English",
    icon: Book,
    cardBg: "bg-amber-50/90 hover:bg-amber-100/80 border-amber-100/80",
    iconColor: "text-amber-600 bg-amber-100",
  },
  {
    name: "Mathematics",
    slug: "Mathematics",
    icon: Calculator,
    cardBg: "bg-teal-50/90 hover:bg-teal-100/80 border-teal-100/80",
    iconColor: "text-teal-600 bg-teal-100",
  },
  {
    name: "Business / BBA",
    slug: "Business",
    icon: Briefcase,
    cardBg: "bg-rose-50/90 hover:bg-rose-100/80 border-rose-100/80",
    iconColor: "text-rose-600 bg-rose-100",
  },
];
 
export default async function Home() {
  let courses: Course[] = [];
  let role: Role = null; // FIX: role ab declare ho gaya hai
 
  if (supabaseConfigured()) {
    const sb = await createClient();
 
    // FIX: logged-in user ka role Supabase se nikalna
    try {
      const {
        data: { user },
      } = await sb.auth.getUser();
 
      if (user) {
        const { data: profile } = await sb
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
 
        role = ((profile as any)?.role as Role) ?? null;
      }
    } catch {
      role = null;
    }
 
    const { data } = await sb
      .from("courses")
      .select("*, profiles(full_name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);
 
    // FIX: sirf in 8 courses ke reviews fetch karna
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
        lessons_count: lessonMap.get(c.id) ?? 0,
      };
    });
  }
 
  // Fallback demo courses matching PDF titles if database has few courses
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
      title: "Business Management (BBA)",
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
  ];
 
  const displayCourses = courses.length > 0 ? courses : demoFallbackCourses;
 
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* 1. Hero Section (PDF Page 1) */}
      <HeroSlider role={role} />
 
      {/* 2. Popular Categories (PDF Page 1) */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Popular Categories
          </h2>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>
 
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.slug)}`}
                className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md ${cat.cardBg}`}
              >
                <div className={`grid h-14 w-14 place-items-center rounded-2xl shadow-xs ${cat.iconColor}`}>
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>
 
      {/* 3. Featured Courses (PDF Page 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1.5 rounded-full bg-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Featured Courses
            </h2>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>
 
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayCourses.slice(0, 4).map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </section>
 
      {/* 4. Value Pillars / Why Knowlix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-700">
              University Grade Platform
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              Why Learn With Knowlix?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built for students and educators with zero clutter, high reliability, and industry-standard certificates.
            </p>
          </div>
 
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Expert Instructors</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Learn directly from verified university professors and seasoned industry specialists.
              </p>
            </div>
 
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                <Award size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Verifiable Certificates</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Earn cryptographic certificates with unique verification codes and instant online authenticity check.
              </p>
            </div>
 
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                <BookOpen size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Self-Paced Learning</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Track your weekly progress, revisit completed video lessons anytime, and learn at your own rhythm.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
 
