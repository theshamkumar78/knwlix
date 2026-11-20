import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`glass flex flex-col items-center justify-center rounded-3xl p-8 text-center text-white md:p-12 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-amber-300 ring-1 ring-white/15">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-white/70 leading-relaxed">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
