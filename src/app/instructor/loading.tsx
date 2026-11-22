export default function InstructorLoading() {
  return (
    <div className="aurora min-h-[calc(100vh-4rem)] px-4 py-6 text-white" role="status" aria-label="Loading">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-8 w-48 rounded-xl bg-white/20" />
        <div className="glass h-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="glass h-28" />)}
        </div>
      </div>
    </div>
  );
}