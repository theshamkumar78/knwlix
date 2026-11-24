
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import { enrollWithDetails } from "../actions";

const field =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900";

export default async function EnrollPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!supabaseConfigured()) notFound();

  const sb = await createClient();

  // Get current logged-in user
  const { user } = await getCurrentUser();

  if (!user) redirect(`/login?next=/courses/${slug}/enroll`);

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    );

  let cq = sb
    .from("courses")
    .select("id, slug, title, thumbnail_url, level, duration, profiles(full_name)")
    .eq("status", "published");

  if (isUuid) {
    cq = cq.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    cq = cq.eq("slug", slug);
  }

  const { data: course } = await cq.maybeSingle();

  if (!course) notFound();

  const { data: me } = await sb
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (me?.role !== "student") redirect("/dashboard");

  const { data: already } = await sb
    .from("enrollments")
    .select("id")
    .eq("course_id", course.id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (already) redirect(`/dashboard/courses#c-${course.id}`);

  const { data: sp } = await sb
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section className="ed-canvas min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.3fr]">
        <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
            <Image
              src={course.thumbnail_url ?? "/images/category-banners.jpeg"}
              alt={course.title}
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>

          <div className="pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              You are enrolling in
            </p>

            <h1 className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
              {course.title}
            </h1>

            <p className="mt-1 text-sm capitalize text-slate-600 dark:text-slate-300">
              {(course.profiles as any)?.full_name ?? "Knowlix instructor"}
              {" · "}
              {course.level}
              {course.duration ? ` · ${course.duration}` : ""}
            </p>
          </div>
        </aside>

        <form
          action={enrollWithDetails.bind(null, course.id, slug)}
          className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90"
        >
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Tell us about yourself
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              These details become your student profile.
            </p>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Full name *
            <input
              name="full_name"
              defaultValue={me?.full_name ?? ""}
              required
              minLength={2}
              className={field}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Phone
              <input
                name="phone"
                type="tel"
                defaultValue={sp?.phone ?? ""}
                placeholder="03xx xxxxxxx"
                className={field}
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              City
              <input
                name="city"
                defaultValue={sp?.city ?? ""}
                className={field}
              />
            </label>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Education level
            <select
              name="education"
              defaultValue={sp?.education ?? ""}
              className={`${field} [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white`}
            >
              <option value="">Select</option>
              <option>School student</option>
              <option>College student</option>
              <option>University student</option>
              <option>Working professional</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Why do you want to take this course?
            <textarea
              name="goal"
              rows={3}
              defaultValue={sp?.goal ?? ""}
              className={field}
            />
          </label>

          <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Your name and these details are visible to the course instructor and admins only.
          </p>

          <button className="btn btn-primary w-full py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20">
            Confirm enrollment
          </button>
        </form>
      </div>
    </section>
  );
}
