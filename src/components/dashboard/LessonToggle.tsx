"use client";
import { useOptimistic, useTransition } from "react";
import { toggleLesson } from "@/app/dashboard/actions";

export default function LessonToggle({ lessonId, courseId, done }: { lessonId: string; courseId: string; done: boolean }) {
  const [isDone, setOptimistic] = useOptimistic(done);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={isDone}
      title={isDone ? "Click to undo" : "Mark this lesson as complete"}
      onClick={() =>
        start(async () => {
          setOptimistic(!isDone);
          await toggleLesson(lessonId, courseId, !isDone);
        })
      }
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
        isDone ? "bg-emerald-400/20 text-emerald-200" : "bg-white/15 hover:bg-white/25"
      } ${pending ? "cursor-wait opacity-70" : ""}`}
    >
      {isDone ? "Completed" : "Mark complete"}
    </button>
  );
}