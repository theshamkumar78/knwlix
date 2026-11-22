import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8fafc] text-slate-900 dark:bg-[#0b1329] dark:text-slate-100 flex items-center justify-center px-4 py-16 transition-colors">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-14 text-center shadow-xl shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-800/90">
        {/* Big 404 with Graduation Cap */}
        <div className="relative inline-block">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <GraduationCap size={28} />
          </div>
          <span className="text-8xl sm:text-9xl font-black tracking-tight text-blue-600 select-none">
            404
          </span>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The page you are looking for doesn't exist or has moved. Let's get you back on track!
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span>Go Back Home</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/courses"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
