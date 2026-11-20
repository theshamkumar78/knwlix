export default function CoursesLoading() {
  return (
    <div>
      {/* Top Header Skeleton */}
      <section className="aurora text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse space-y-4">
          <div className="h-10 w-64 rounded-full bg-white/25" />
          <div className="h-4 w-80 rounded-full bg-white/15" />

          {/* Search bar placeholder */}
          <div className="glass mt-6 grid gap-3 p-3 md:grid-cols-[2fr_1.2fr_1fr_auto]">
            <div className="h-12 rounded-full bg-white/10" />
            <div className="h-12 rounded-full bg-white/10" />
            <div className="h-12 rounded-full bg-white/10" />
            <div className="h-12 w-28 rounded-full bg-amber-400/40" />
          </div>

          {/* Category chips placeholder */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-white/15" />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Cards Grid Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 h-4 w-32 rounded-full bg-slate-200 animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
            >
              <div className="aspect-video w-full bg-slate-200" />
              <div className="flex-1 space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="h-6 w-5/6 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
