import Link from "next/link";
import Hero from "@/components/Hero";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";
export default async function Home() {
  let courses: Course[] = [];
  if (supabaseConfigured()) {
    const sb = await createClient();
    const { data } = await sb.from("courses").select("*, profiles(full_name)").eq("status", "published").order("created_at", { ascending: false }).limit(6);
    courses = (data as Course[]) ?? [];
  }
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Featured courses</h2>
        {courses.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((c) => <CourseCard key={c.id} c={c} />)}</div>
          : <p className="rounded-xl border border-dashed p-8 text-center text-slate-500">No published courses yet. {supabaseConfigured() ? "Instructors can create one and an admin can approve it." : "Connect Supabase (see README) to load courses."}</p>}
        <div className="mt-8 text-center"><Link href="/courses" className="text-brand underline">View all courses</Link></div>
      </section>
    </>
  );
}
