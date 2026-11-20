export default function CourseDetailLoading() {
  return (
    <div>
      {/* Top Section Skeleton */}
      <section className="aurora text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_380px] animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-28 rounded-full bg-white/20" />
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-white/15" />
              <div className="h-6 w-24 rounded-full bg-white/15" />
            </div>
            <div className="h-10 w-4/5 rounded-lg bg-white/25 md:h-12" />
            <div className="h-12 w-64 rounded-full bg-white/10" />
            <div className="flex gap-6 pt-2">
              <div className="h-5 w-24 rounded bg-white/20" />
              <div className="h-5 w-24 rounded bg-white/20" />
            </div>
          </div>

          {/* Right Card Skeleton */}
          <div className="glass p-3 space-y-4">
            <div className="aspect-video w-full rounded-2xl bg-white/10" />
            <div className="p-2 space-y-3">
              <div className="h-11 w-full rounded-full bg-amber-400/40" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & About Section Skeleton */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 lg:max-w-3xl animate-pulse">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="h-6 w-44 rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/6 rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 w-full rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
