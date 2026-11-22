import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import { FAQS } from "@/lib/faqs";
import type { Course } from "@/types";
import {
  Code, Brain, Palette, Megaphone, Briefcase, Terminal, Database, PenTool, Smartphone,
  Languages, Calculator, FlaskConical, ArrowRight, UserPlus, BookOpenCheck, Trophy,
  Target, Eye, Sparkles, BookOpen, TrendingUp, Clock, PlayCircle, Award, Star, ChevronDown,
  Layers, LayoutDashboard, GraduationCap,
} from "lucide-react";

const subjects = [
  { name: "Web Development", icon: Code, tone: "bg-blue-100 text-blue-600" },
  { name: "Artificial Intelligence", icon: Brain, tone: "bg-violet-100 text-violet-600" },
  { name: "Graphic Design", icon: Palette, tone: "bg-pink-100 text-pink-600" },
  { name: "Digital Marketing", icon: Megaphone, tone: "bg-orange-100 text-orange-600" },
  { name: "Business Management", icon: Briefcase, tone: "bg-amber-100 text-amber-600" },
  { name: "Python", icon: Terminal, tone: "bg-emerald-100 text-emerald-600" },
  { name: "Data Science", icon: Database, tone: "bg-cyan-100 text-cyan-600" },
  { name: "UI/UX Design", icon: PenTool, tone: "bg-fuchsia-100 text-fuchsia-600" },
  { name: "Mobile App Development", icon: Smartphone, tone: "bg-indigo-100 text-indigo-600" },
  { name: "English Language", icon: Languages, tone: "bg-rose-100 text-rose-600" },
  { name: "Mathematics", icon: Calculator, tone: "bg-teal-100 text-teal-600" },
  { name: "Science & Technology", icon: FlaskConical, tone: "bg-lime-100 text-lime-700" },
];

const why = [
  { icon: Sparkles, title: "Quality courses", text: "Learn useful topics through well-organized course content." },
  { icon: BookOpen, title: "Easy learning", text: "Simple explanations and structured lessons make learning easier." },
  { icon: TrendingUp, title: "Skill development", text: "Build practical knowledge for education and future career opportunities." },
  { icon: Clock, title: "Flexible learning", text: "Access learning materials online at your convenience." },
];

const steps = [
  { icon: UserPlus, title: "Create your account", text: "Sign up for free in less than a minute." },
  { icon: BookOpenCheck, title: "Pick a course & enroll", text: "Browse subjects and join the course you like." },
  { icon: PlayCircle, title: "Watch lessons", text: "Learn step by step with video lessons and notes." },
  { icon: Trophy, title: "Track and finish", text: "Watch your progress grow and earn a certificate." },
];

const experience = [
  { icon: PlayCircle, title: "Video lessons", text: "Watch lessons inside the platform, at your own pace." },
  { icon: Layers, title: "Modules and lessons", text: "Courses are split into clear chapters and lessons." },
  { icon: LayoutDashboard, title: "My Courses dashboard", text: "See all your courses, progress and next lesson in one place." },
  { icon: TrendingUp, title: "Progress tracking", text: "Mark lessons complete and see your progress ring grow." },
  { icon: Award, title: "Certificates", text: "Finish every lesson to earn a certificate with a unique code." },
  { icon: Star, title: "Course reviews", text: "Enrolled students can rate courses and share feedback." },
];

export default async function Home() {
  let courses: Course[] = [];
  let reviews: any[] = [];
  let role: "student" | "instructor" | "admin" | null = null;

  if (supabaseConfigured()) {
    const sb = await createClient();
    // sab kaam saath saath (parallel)
    const [{ profile }, featured, rev] = await Promise.all([
      getCurrentUser(),
      sb.from("courses").select("*, profiles(full_name)").eq("status", "published").order("created_at", { ascending: false }).limit(6),
      sb
        .from("course_reviews")
        .select("rating, review_text, profiles(full_name), courses(title)")
        .not("review_text", "is", null)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
    role = profile?.role ?? null;
    courses = (featured.data as Course[]) ?? [];
    reviews = ((rev.data as any[]) ?? []).filter((r) => String(r.review_text ?? "").trim().length > 0);
  }

  const ctaHref = role === "instructor" ? "/instructor" : role === "admin" ? "/admin" : role === "student" ? "/dashboard/courses" : "/signup";
  const ctaLabel = role ? "Go to my dashboard" : "Create free account";
  const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

  return (
    <>
      <HeroSlider role={role} />

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">About Knowlix</p>
            <h2 className="section-title mt-2">Simple, accessible and skill-based learning</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Knowlix is an online learning platform designed to make education simple, accessible and effective. Our goal is to help students and learners develop knowledge and practical skills through quality online courses.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600">
              Read more about us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={card}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><Target size={22} /></span>
              <h3 className="mt-4 font-bold">Our mission</h3>
              <p className="mt-1 text-sm text-slate-600">To provide simple, accessible and skill-based online education.</p>
            </div>
            <div className={card}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600"><Eye size={22} /></span>
              <h3 className="mt-4 font-bold">Our vision</h3>
              <p className="mt-1 text-sm text-slate-600">To become a trusted platform for digital learning and professional development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 id="categories" className="section-title scroll-mt-28">Popular categories</h2>
        <p className="mt-2 text-slate-600">Pick a topic and start learning today.</p>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="aurora rounded-3xl p-3 shadow-xl">
            <Image src="/images/category-banners.jpeg" alt="Knowlix subject areas" width={1600} height={900} sizes="(min-width: 1024px) 55vw, 100vw" className="h-auto w-full rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map(({ name, icon: Icon, tone }) => (
              <Link
                key={name}
                href={`/courses?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span>
                <span className="text-sm font-semibold leading-tight group-hover:text-blue-600">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Featured courses</h2>
              <p className="mt-2 text-slate-600">Fresh courses from our instructors.</p>
            </div>
            <Link href="/courses" className="hidden items-center gap-1 font-semibold text-blue-600 md:flex">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {courses.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => <CourseCard key={c.id} c={c} />)}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No published courses yet.</p>
          )}
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Why choose Knowlix?</p>
        <h2 className="section-title mt-2 text-center">Why learn with us</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ icon: Icon, title, text }) => (
            <div key={title} className={`${card} transition hover:-translate-y-1 hover:shadow-md`}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={24} /></span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title text-center">How Knowlix works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <span className="absolute -top-4 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
                <span className="mx-auto mt-2 grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-600"><Icon size={28} /></span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student learning experience */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title text-center">Your learning experience</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">Everything you need to learn, track and finish a course.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experience.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={22} /></span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="bg-[#072346] py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">For instructors</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Share what you know</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              Instructors create courses with lessons and videos, submit them for review, and see who enrolled and how they are progressing. Instructor accounts are set up by our admin team, so contact us if you would like to teach.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/instructors" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700">Meet our instructors</Link>
              <Link href="/contact" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold">Contact us to teach</Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["Create courses and lessons", "Add videos and notes", "Submit for admin review", "See enrolled students"].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                <GraduationCap size={20} className="shrink-0 text-blue-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials: sirf asli reviews ho to dikhta hai */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="section-title text-center">What students say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure key={i} className={card}>
                <div className="flex gap-0.5 text-amber-400" aria-label={`${r.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star key={n} size={16} fill={n < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">“{r.review_text}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold">
                  {r.profiles?.full_name ?? "Knowlix student"}
                  <span className="block text-xs font-normal text-slate-500">{r.courses?.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="section-title text-center">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {FAQS.slice(0, 4).map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <ChevronDown size={18} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/faq" className="inline-flex items-center gap-1 font-semibold text-blue-600">See all questions <ArrowRight size={16} /></Link>
        </p>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-14 text-center text-white shadow-xl">
          <h2 className="text-3xl font-extrabold md:text-4xl">Ready to start learning?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">Join Knowlix and take the next step towards your goals.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={ctaHref} className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:-translate-y-0.5">{ctaLabel}</Link>
            <Link href="/courses" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold transition hover:bg-white/10">Browse courses</Link>
          </div>
        </div>
      </section>
    </>
  );
}