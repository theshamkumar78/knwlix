"use client";

import React, { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitCourseReview } from "@/app/dashboard/actions";
import { useToast } from "@/components/ui/Toast";

export default function CourseReviewForm({
  courseId,
  existingReview,
}: {
  courseId: string;
  existingReview?: { rating: number; review_text: string | null } | null;
}) {
  const { showToast } = useToast();
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState<string>(existingReview?.review_text || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await submitCourseReview(courseId, rating, text);
        showToast("Review submitted successfully! Thank you.", "success");
      } catch (err: any) {
        showToast(err?.message || "Failed to submit review", "error");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <h3 className="text-lg font-bold text-slate-900">
        {existingReview ? "Update your review" : "Leave a course review"}
      </h3>

      {/* 5-Star Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={24}
                className={`transition ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-bold text-slate-700">
            {hoverRating || rating} / 5
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Your feedback (optional)
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what you learned and how the instructor helped you…"
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : existingReview ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}
