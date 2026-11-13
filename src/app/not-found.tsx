import Link from "next/link";

export default function NotFound() {
  return (
    <section className="aurora grid min-h-[calc(100vh-4rem)] place-items-center px-4 text-center text-white">
      <div>
        <p className="text-7xl font-extrabold">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-white/70">The page you are looking for does not exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">Go home</Link>
          <Link href="/courses" className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/25">Browse courses</Link>
        </div>
      </div>
    </section>
  );
}