"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="aurora grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12 text-white">
      <div className="glass w-full max-w-lg space-y-6 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-white/70">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
          {error?.message && (
            <p className="mt-4 rounded-xl bg-white/5 p-3 font-mono text-xs text-rose-200/90 break-words">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <RefreshCw size={16} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <Home size={16} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
