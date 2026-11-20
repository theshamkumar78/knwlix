"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BookOpen, Star, Bookmark, ArrowRight, User } from "lucide-react";
import type { Course } from "@/types";

interface CourseCardProps {
  c: Course & { lessons_count?: number };
}

export default function CourseCard({ c }: CourseCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const instructorName = c.profiles?.full_name ?? "Expert Instructor";

  // FIX: fake 4.8 rating hata diya. Reviews na hon to rating nahi dikhegi
  const hasRating = !!c.avg_rating && c.avg_rating > 0;
  const rating = hasRating ? c.avg_rating!.toFixed(1) : null;

  // FIX: 12 ki jagah asli ginti (na mile to 0)
  const lessonsCount = c.lessons_count ?? 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={c.thumbnail_url || "/images/category-banners.jpeg"}
          alt={c.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges: Category & Bookmark */}
        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between">
          <span className="rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-xs">
            {c.category || "General"}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            aria-label="Bookmark course"
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition ${
              bookmarked
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600"
            }`}
          >
            <Bookmark size={15} className={bookmarked ? "fill-white" : ""} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <Link href={`/courses/${c.slug || c.id}`}>
          <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-blue-600">
            {c.title}
          </h3>
        </Link>

        {/* Instructor */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-50 text-blue-600">
            <User size={12} />
          </span>
          <span className="truncate">{instructorName}</span>
        </div>

        {/* Meta Stats Row */}
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <BookOpen size={15} className="text-blue-600" />
            <span>
              {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
            </span>
          </div>

          {hasRating ? (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              {c.reviews_count ? (
                <span className="text-slate-400 font-normal">({c.reviews_count})</span>
              ) : null}
            </div>
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              New
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3">
          <Link
            href={`/courses/${c.slug || c.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span>View Course</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
