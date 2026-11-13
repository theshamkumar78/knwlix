import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";

const badge: Record<string, string> = {
  draft: "bg-white/15 text-white/80",
  pending: "bg-amber-400/20 text-amber-200",
  published: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};
const filters = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Pending", value: "pending" },
  { label: "Draft", value: "draft" },
  { label: "Rejected", value: "rejected" },
];

export default async function InstructorCourses({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { sb, user } = await requireRole(["instructor", "admin"]);

  let query = sb
    .from("courses")
    .select("id, title, status, category, level, thumbnail_url")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });
  if (status && ["draft", "pending", "published", "rejected"].includes(status)) query = query.eq("status", status);
  const { data } = await query;

  return (
    <GlassShell active="courses" variant="instructor">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold">My courses</h1>
          <Link
            href="/instructor/courses/create"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5"
          >
            <Plus size={16} /> Create course
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.value ? `/instructor/courses?status=${f.value}` : "/instructor/courses"}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                (status ?? "") === f.value ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c: any) => (
              <Link key={c.id} href={`/instructor/courses/${c.id}`} className="glass lift overflow-hidden text-white">
                <div className="relative aspect-video bg-white/10">
                  <Image
                    src={c.thumbnail_url ?? "/images/category-banners.jpeg"}
                    alt={c.title}
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 font-bold">{c.title}</h3>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[c.status] ?? badge.draft}`}>{c.status}</span>
                  </div>
                  <p className="mt-2 text-sm capitalize text-white/70">{c.category ?? "General"} · {c.level}</p>
                  <p className="mt-3 text-sm font-semibold text-amber-300">Manage →</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="glass p-10 text-center text-white/70">No courses found here.</p>
        )}
      </div>
    </GlassShell>
  );
}