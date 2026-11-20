"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, CheckCircle, Clock } from "lucide-react";
import CourseLessonViewer, { LessonItem } from "@/components/courses/CourseLessonViewer";
import EmptyState from "@/components/ui/EmptyState";

export interface EnrolledCourseBlock {
  courseId: string;
  courseTitle: string;
  lessons: LessonItem[];
  doneIds: string[];
}

export default function MyCoursesClient({
  blocks,
}: {
  blocks: EnrolledCourseBlock[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">(
    "all"
  );

  const stats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;

    blocks.forEach((b) => {
      const isComplete =
        b.lessons.length > 0 && b.doneIds.length >= b.lessons.length;
      if (isComplete) completed++;
      else inProgress++;
    });

    return { all: blocks.length, completed, inProgress };
  }, [blocks]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      // 1. Text Search Filter
      const matchesSearch =
        query.trim() === "" ||
        b.courseTitle.toLowerCase().includes(query.toLowerCase());

      // 2. Status Filter
      const isComplete =
        b.lessons.length > 0 && b.doneIds.length >= b.lessons.length;

      let matchesStatus = true;
      if (filter === "in_progress") matchesStatus = !isComplete;
      if (filter === "completed") matchesStatus = isComplete;

      return matchesSearch && matchesStatus;
    });
  }, [blocks, query, filter]);

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      {blocks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <BookOpen size={14} /> All courses ({stats.all})
            </button>

            <button
              type="button"
              onClick={() => setFilter("in_progress")}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filter === "in_progress"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Clock size={14} /> In progress ({stats.inProgress})
            </button>

            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filter === "completed"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <CheckCircle size={14} /> Completed ({stats.completed})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in my courses…"
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      )}

      {/* Courses List */}
      {filteredBlocks.length > 0 ? (
        <div className="space-y-8">
          {filteredBlocks.map((b) => (
            <CourseLessonViewer
              key={b.courseId}
              courseId={b.courseId}
              courseTitle={b.courseTitle}
              lessons={b.lessons}
              initialDoneIds={b.doneIds}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={blocks.length === 0 ? "No courses enrolled yet" : "No matching courses"}
          description={
            blocks.length === 0
              ? "You haven't enrolled in any course yet. Browse our catalog to get started."
              : "No enrolled courses match your current search and filter criteria."
          }
          actionHref="/courses"
          actionLabel="Browse courses catalog"
          className="border border-slate-200 bg-white !text-slate-800 shadow-sm"
        />
      )}
    </div>
  );
}
