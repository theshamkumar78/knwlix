export default function DashboardLoading() {
  return (
    <div className="aurora min-h-[calc(100vh-4rem)] px-4 py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-start">
        {/* Left Nav skeleton */}
        <div className="glass hidden h-64 w-16 shrink-0 animate-pulse rounded-full p-3 md:block" />

        {/* Main Content skeleton */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Header */}
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-28 rounded-full bg-white/20" />
            <div className="h-8 w-64 rounded-full bg-white/25" />
          </div>

          {/* Hero continue card skeleton */}
          <div className="glass relative overflow-hidden p-7 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded-full bg-white/20" />
              <div className="h-8 w-72 rounded-full bg-white/25" />
              <div className="h-4 w-96 max-w-full rounded-full bg-white/15" />
              <div className="mt-4 h-11 w-44 rounded-full bg-amber-400/40" />
            </div>
          </div>

          {/* 3 Stats cards skeleton */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-5 animate-pulse space-y-3">
                <div className="h-4 w-28 rounded-full bg-white/20" />
                <div className="h-8 w-16 rounded-full bg-white/30" />
              </div>
            ))}
          </div>

          {/* Courses grid skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-36 rounded-full bg-white/20 animate-pulse" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass flex items-center gap-4 p-5 animate-pulse">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-white/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded-full bg-white/25" />
                    <div className="h-3 w-1/2 rounded-full bg-white/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
