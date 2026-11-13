import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import type { Course } from "@/types";

const levelTone: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
};

export default function CourseCard({ c }: { c: Course }) {
  const name = c.profiles?.full_name ?? "Knowlix instructor";
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={c.thumbnail_url ?? "/images/category-banners.jpeg"}
          alt={c.title}
          fill
          sizes="(min-width:1024px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand shadow">
          {c.category ?? "General"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug group-hover:text-brand">{c.title}</h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm text-slate-600">{name}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span className={`rounded-full px-2.5 py-1 font-semibold capitalize ${levelTone[c.level] ?? "bg-slate-100 text-slate-600"}`}>
              {c.level}
            </span>
            {c.duration && (
              <span className="flex items-center gap-1"><Clock size={14} />{c.duration}</span>
            )}
          </div>
          <span className="flex items-center gap-1 font-semibold text-brand">
            View <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}