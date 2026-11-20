export default function AdminLoading() {
  return (
    <div className="aurora min-h-[calc(100vh-4rem)] px-4 py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-start">
        {/* Nav Skeleton */}
        <div className="glass hidden h-72 w-16 shrink-0 animate-pulse rounded-full p-3 md:block" />

        {/* Content Skeleton */}
        <div className="min-w-0 flex-1 space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-full bg-white/20" />
            <div className="h-8 w-56 rounded-full bg-white/25" />
          </div>

          {/* 5 Stats Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass p-5 space-y-2">
                <div className="h-4 w-24 rounded-full bg-white/20" />
                <div className="h-8 w-14 rounded-full bg-white/30" />
                <div className="h-3 w-12 rounded-full bg-amber-400/30" />
              </div>
            ))}
          </div>

          {/* Pending Section Skeleton */}
          <div className="glass p-6 space-y-4">
            <div className="h-6 w-48 rounded-full bg-white/25" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                  <div className="space-y-2">
                    <div className="h-5 w-52 rounded bg-white/20" />
                    <div className="h-3 w-36 rounded bg-white/10" />
                  </div>
                  <div className="h-9 w-24 rounded-full bg-amber-400/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
