import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";

const badgeTone: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
};

const filters = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Pending", value: "pending" },
  { label: "Draft", value: "draft" },
  { label: "Rejected", value: "rejected" },
];

export default async function InstructorCourses({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  let query = sb
    .from("courses")
    .select("id, title, status, category, level, thumbnail_url")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });
  if (status && ["draft", "pending", "published", "rejected"].includes(status))
    query = query.eq("status", status);
  const { data } = await query;

  return (
    <GlassShell active="courses" variant="instructor">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">My Courses</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your curriculum, edit lessons, and track student enrollments.
            </p>
          </div>

          <Link
            href="/instructor/courses/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Create Course
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={
                f.value
                  ? `/instructor/courses?status=${f.value}`
                  : "/instructor/courses"
              }
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                (status ?? "") === f.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c: any) => (
              <Link
                key={c.id}
                href={`/instructor/courses/${c.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-800/90"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <Image
                    src={c.thumbnail_url ?? "/images/category-banners.jpeg"}
                    alt={c.title}
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-bold capitalize shadow-xs ${
                        badgeTone[c.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {c.category ?? "General"}
                    </span>
                    <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-white text-base mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                      Level: {c.level}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Manage Course</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            No courses found under this filter.
          </div>
        )}
      </div>
    </GlassShell>
  );
}
