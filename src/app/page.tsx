import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import type { Course } from "@/types";
import {
  Code, Brain, Palette, Megaphone, Briefcase, Terminal, Database, PenTool, Smartphone,
  Languages, Calculator, FlaskConical, ArrowRight, UserPlus, BookOpenCheck, Trophy,
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

const steps = [
  { icon: UserPlus, title: "Create your account", text: "Sign up for free in less than a minute." },
  { icon: BookOpenCheck, title: "Pick a course & enroll", text: "Browse subjects and join the course you like." },
  { icon: Trophy, title: "Learn & track progress", text: "Finish lessons and watch your progress grow." },
];

export default async function Home() {
  let courses: Course[] = [];
  let role: "student" | "instructor" | "admin" | null = null;

  if (supabaseConfigured()) {
    // dono kaam saath saath (parallel), ek ke baad ek nahi
    const [{ profile }, featured] = await Promise.all([
      getCurrentUser(),
      (async () => {
        const sb = await createClient();
        return sb
          .from("courses")
          .select("*, profiles(full_name)")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(6);
      })(),
    ]);
    role = profile?.role ?? null;
    courses = (featured.data as Course[]) ?? [];
  }

  return (
    <>
      <HeroSlider role={role} />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Explore subjects</h2>
        <p className="mt-2 text-slate-600">Pick a topic and start learning today.</p>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="aurora rounded-3xl p-3 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/category-banners.jpeg" alt="Knowlix subject areas" loading="lazy" className="w-full rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map(({ name, icon: Icon, tone }) => (
              <Link
                key={name}
                href={`/courses?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span>
                <span className="text-sm font-semibold leading-tight group-hover:text-brand">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Featured courses</h2>
              <p className="mt-2 text-slate-600">Fresh courses from our instructors.</p>
            </div>
            <Link href="/courses" className="hidden items-center gap-1 font-semibold text-brand md:flex">
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

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title text-center">How Knowlix works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <span className="absolute -top-4 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
              <span className="mx-auto mt-2 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand"><Icon size={28} /></span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}