"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Award,
  Video,
  FileText,
} from "lucide-react";
import { toggleLesson } from "@/app/dashboard/actions";
import { useToast } from "@/components/ui/Toast";

function getVideoEmbed(url: string | null) {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. YouTube (standard, shorts, embed, youtu.be)
  // rel=0: Strictly disable recommendations from other channels
  // modestbranding=1: Hide YouTube branding
  // iv_load_policy=3: Disable annotations and end-screen popups
  // playsinline=1: Inline playback
  const yt = trimmed.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (yt) {
    return {
      type: "youtube" as const,
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`,
    };
  }

  // 2. Vimeo (dnt=1: Do Not Track, clean player)
  const vimeo = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
  );
  if (vimeo) {
    return {
      type: "vimeo" as const,
      src: `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0&portrait=0&dnt=1`,
    };
  }

  // 3. Direct HTML5 Video (.mp4, .webm, .ogg, .m4v)
  if (/\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(trimmed)) {
    return {
      type: "html5" as const,
      src: trimmed,
    };
  }

  // 4. External fallback
  return {
    type: "external" as const,
    src: trimmed,
  };
}

export interface LessonItem {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  module_title: string | null;
  order_index: number;
}

export default function CourseLessonViewer({
  courseId,
  courseTitle,
  lessons,
  initialDoneIds,
}: {
  courseId: string;
  courseTitle: string;
  lessons: LessonItem[];
  initialDoneIds: string[];
}) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set(initialDoneIds));

  // Default active lesson: first incomplete lesson or first lesson
  const firstIncompleteIdx = lessons.findIndex((l) => !doneSet.has(l.id));
  const [activeIdx, setActiveIdx] = useState<number>(
    firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0
  );

  const activeLesson = lessons[activeIdx] ?? lessons[0];
  const total = lessons.length;
  const completedCount = lessons.filter((l) => doneSet.has(l.id)).length;
  const pct = total ? Math.round((completedCount * 100) / total) : 0;
  const isCurrentDone = activeLesson ? doneSet.has(activeLesson.id) : false;

  const handleToggle = (lessonId: string, markComplete: boolean, advanceNext: boolean = false) => {
    startTransition(async () => {
      try {
        await toggleLesson(lessonId, courseId, markComplete);
        setDoneSet((prev) => {
          const next = new Set(prev);
          if (markComplete) next.add(lessonId);
          else next.delete(lessonId);
          return next;
        });

        if (markComplete) {
          showToast("Lesson marked as complete!", "success");
          if (advanceNext && activeIdx < lessons.length - 1) {
            setActiveIdx((prev) => prev + 1);
          }
        } else {
          showToast("Lesson marked as incomplete.", "info");
        }
      } catch (err: any) {
        showToast(err?.message || "Failed to update lesson progress", "error");
      }
    });
  };

  if (!lessons.length) {
    return (
      <div className="glass p-8 text-center text-white/70">
        No lessons available for this course yet.
      </div>
    );
  }

  return (
    <div id={`c-${courseId}`} className="glass scroll-mt-24 overflow-hidden rounded-3xl">
      {/* 1. Sticky Course Header & Progress Bar */}
      <div className="sticky top-16 z-30 border-b border-white/10 bg-slate-900/90 p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-teal-300 uppercase">
              Course Progress
            </span>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              {courseTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-lg font-bold text-amber-300">{pct}%</span>
              <p className="text-xs text-white/60">
                {completedCount} of {total} lessons complete
              </p>
            </div>

            {total > 0 && completedCount === total && (
              <Link
                href={`/dashboard/certificate/${courseId}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <Award size={16} /> Get certificate
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-amber-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        {/* 2. Main Lesson Viewer Stage */}
        <div className="space-y-6 p-6 sm:p-8 border-b border-white/10 lg:border-b-0 lg:border-r">
          {/* Module & Lesson Title */}
          <div>
            {activeLesson?.module_title && (
              <span className="inline-block rounded-full bg-teal-400/20 px-3 py-1 text-xs font-semibold text-teal-300">
                {activeLesson.module_title}
              </span>
            )}
            <h3 className="mt-2 text-2xl font-bold text-white">
              {activeLesson ? `Lesson ${activeIdx + 1}: ${activeLesson.title}` : "Select a lesson"}
            </h3>
          </div>

          {/* Video Player */}
          {activeLesson?.video_url && (() => {
            const video = getVideoEmbed(activeLesson.video_url);
            if (!video) return null;

            if (video.type === "youtube" || video.type === "vimeo") {
              return (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/60 shadow-xl ring-1 ring-white/10">
                  <iframe
                    src={video.src}
                    title={activeLesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              );
            }

            if (video.type === "html5") {
              return (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/60 shadow-xl ring-1 ring-white/10">
                  <video
                    src={video.src}
                    controls
                    controlsList="nodownload"
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            }

            return (
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-white">
                <span className="flex items-center gap-2 text-sm">
                  <Video size={18} /> External video resource
                </span>
                <a
                  href={video.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-amber-950 hover:bg-amber-300"
                >
                  Watch video ↗
                </a>
              </div>
            );
          })()}

          {/* Text Content / Notes */}
          {activeLesson?.content && (
            <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                <FileText size={15} /> Lesson Notes & Instructions
              </div>
              <p className="whitespace-pre-line leading-relaxed text-white/90">
                {activeLesson.content}
              </p>
            </div>
          )}

          {/* Interactive Navigation Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeIdx === 0}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} /> Previous lesson
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(activeLesson.id, !isCurrentDone, !isCurrentDone)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold transition ${
                  isCurrentDone
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
                    : "bg-amber-400 text-amber-950 hover:-translate-y-0.5 hover:bg-amber-300"
                } disabled:opacity-50`}
              >
                <CheckCircle2 size={16} />
                {isPending
                  ? "Updating…"
                  : isCurrentDone
                  ? "Completed (Click to undo)"
                  : "Mark complete and continue"}
              </button>

              <button
                type="button"
                onClick={() => setActiveIdx((prev) => Math.min(lessons.length - 1, prev + 1))}
                disabled={activeIdx === lessons.length - 1}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next lesson <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Curriculum Lesson Playlist Sidebar */}
        <div className="p-5 space-y-3 bg-white/[0.02]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Curriculum Lessons ({completedCount}/{total})
          </h4>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {lessons.map((l, idx) => {
              const isDone = doneSet.has(l.id);
              const isActive = idx === activeIdx;

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`flex w-full min-h-[44px] items-center justify-between gap-3 rounded-xl p-3 text-left transition focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                    isActive
                      ? "bg-white/15 text-white ring-1 ring-amber-400/50"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-white/50">
                      {idx + 1}.
                    </span>
                    <span className="truncate text-xs font-medium">
                      {l.title}
                    </span>
                  </div>

                  <span className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/30" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
