import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { enrollWithDetails } from "../actions";

const field =
  "mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default async function EnrollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!supabaseConfigured()) notFound();
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/courses/${slug}/enroll`);

  const { data: course } = await sb
    .from("courses")
    .select("id, title, thumbnail_url, level, duration, profiles(full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!course) notFound();

  const { data: me } = await sb.from("profiles").select("full_name, role").eq("id", user.id).single();
  if (me?.role !== "student") redirect("/dashboard");

  const { data: already } = await sb.from("enrollments").select("id").eq("course_id", course.id).eq("student_id", user.id).maybeSingle();
  if (already) redirect(`/dashboard/courses#c-${course.id}`);

  const { data: sp } = await sb.from("student_profiles").select("*").eq("id", user.id).maybeSingle();

  return (
    <section className="aurora min-h-[calc(100vh-4rem)] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.3fr]">
        <aside className="glass h-fit p-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/10">
            <Image src={course.thumbnail_url ?? "/images/category-banners.jpeg"} alt={course.title} fill sizes="400px" className="object-cover" />
          </div>
          <div className="p-3">
            <p className="text-xs text-white/60">You are enrolling in</p>
            <h1 className="mt-1 text-xl font-extrabold">{course.title}</h1>
            <p className="mt-1 text-sm capitalize text-white/70">
              {(course.profiles as any)?.full_name ?? "Knowlix instructor"} · {course.level}{course.duration ? ` · ${course.duration}` : ""}
            </p>
          </div>
        </aside>

        <form action={enrollWithDetails.bind(null, course.id, slug)} className="glass space-y-5 p-6">
          <div>
            <h2 className="text-2xl font-extrabold">Tell us about yourself</h2>
            <p className="mt-1 text-sm text-white/70">These details become your student profile.</p>
          </div>

          <label className="block text-sm">Full name *
            <input name="full_name" defaultValue={me?.full_name ?? ""} required minLength={2} className={field} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Phone
              <input name="phone" type="tel" defaultValue={sp?.phone ?? ""} placeholder="03xx xxxxxxx" className={field} />
            </label>
            <label className="block text-sm">City
              <input name="city" defaultValue={sp?.city ?? ""} className={field} />
            </label>
          </div>
          <label className="block text-sm">Education level
            <select name="education" defaultValue={sp?.education ?? ""} className={`${field} [&>option]:text-slate-900`}>
              <option value="">Select</option>
              <option>School student</option>
              <option>College student</option>
              <option>University student</option>
              <option>Working professional</option>
              <option>Other</option>
            </select>
          </label>
          <label className="block text-sm">Why do you want to take this course?
            <textarea name="goal" rows={3} defaultValue={sp?.goal ?? ""} className={field} />
          </label>

          <p className="flex items-start gap-2 text-xs text-white/60">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" />
            Your name and these details are visible to the course instructor and admins only.
          </p>

          <button className="w-full rounded-full bg-amber-400 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
            Confirm enrollment
          </button>
        </form>
      </div>
    </section>
  );
}