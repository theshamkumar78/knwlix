import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Course } from "@/types";

export default async function InstructorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabaseConfigured()) notFound();
  const sb = await createClient();

  const { data: p } = await sb.from("profiles").select("id, full_name, role").eq("id", id).maybeSingle();
  if (!p || p.role !== "instructor") notFound();
  const { data: ip } = await sb.from("instructor_profiles").select("*").eq("id", id).maybeSingle();
  const { data } = await sb
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("instructor_id", id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const courses = (data as Course[]) ?? [];
  const name = p.full_name ?? "Knowlix instructor";
  const subjects = Array.from(new Set(courses.map((c) => (c.category ?? "").trim()).filter(Boolean)));

  return (
    <>
      <section className="aurora text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Link href="/instructors" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft size={16} /> All instructors
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-violet text-4xl font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold md:text-4xl">{name}</h1>
              <p className="mt-1 text-white/70">{ip?.headline ?? "Instructor at Knowlix"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <span key={s} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
        {(ip?.bio || ip?.experience) && (
          <section className="grid gap-6 md:grid-cols-2">
            {ip?.bio && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">About</h2>
                <p className="mt-2 whitespace-pre-line text-slate-600">{ip.bio}</p>
              </div>
            )}
            {ip?.experience && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">Experience</h2>
                <p className="mt-2 whitespace-pre-line text-slate-600">{ip.experience}</p>
              </div>
            )}
          </section>
        )}

        <section>
          <h2 className="text-2xl font-extrabold">Courses by {name}</h2>
          {courses.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => <CourseCard key={c.id} c={c} />)}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">No published courses yet.</p>
          )}
        </section>
      </div>
    </>
  );
}