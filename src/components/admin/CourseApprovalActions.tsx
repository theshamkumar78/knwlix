"use client";

import React, { useState, useTransition } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { setCourseStatus } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

export default function CourseApprovalActions({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle: string;
}) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await setCourseStatus(courseId, "published");
        showToast(`Course "${courseTitle}" approved and published!`, "success");
      } catch (err: any) {
        showToast(err?.message || "Failed to approve course", "error");
      }
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast("Please enter a rejection reason for the instructor", "error");
      return;
    }
    startTransition(async () => {
      try {
        await setCourseStatus(courseId, "rejected", reason.trim());
        showToast(`Course rejected with feedback sent to instructor.`, "info");
        setRejecting(false);
      } catch (err: any) {
        showToast(err?.message || "Failed to reject course", "error");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleApprove}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <Check size={14} /> Approve
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => setRejecting(!rejecting)}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 transition disabled:opacity-50"
        >
          <X size={14} /> {rejecting ? "Cancel" : "Reject"}
        </button>
      </div>

      {rejecting && (
        <form
          onSubmit={handleReject}
          className="mt-2 w-72 rounded-2xl bg-slate-900/95 p-3 text-left ring-1 ring-white/15 space-y-2.5 backdrop-blur-md animate-in fade-in"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
            <AlertTriangle size={13} />
            <span>Rejection feedback for instructor:</span>
          </div>

          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="e.g. Please add detailed lesson notes and fix audio in video 2…"
            className="w-full rounded-xl bg-white/10 p-2 text-xs text-white placeholder-white/40 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-amber-400"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-rose-500 py-1.5 text-xs font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {isPending ? "Rejecting…" : "Confirm rejection"}
          </button>
        </form>
      )}
    </div>
  );
}
