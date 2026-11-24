import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Instructors() {
  let rows: any[] = [];
  if (supabaseConfigured()) {
    const sb = await createClient();
    const { data: people } = await sb.from("profiles").select("id, full_name").eq("role", "instructor");
    const { data: courses } = await sb
      .from("courses")
      .select("id, title, category, instructor_id")
      .eq("status", "published");
    rows = (people ?? [])
      .map((p: any) => {
        const mine = (courses ?? []).filter((c: any) => c.instructor_id === p.id);
        return {
          id: p.id,
          name: p.full_name ?? "Knowlix instructor",
          count: mine.length,
          titles: mine.slice(0, 3).map((c: any) => c.title),
          subjects: Array.from(new Set(mine.map((c: any) => (c.category ?? "").trim()).filter(Boolean))) as string[],
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  return (
    <>
      <section className="aurora text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight">Meet our instructors</h1>
          <p className="mt-2 max-w-xl text-white/70">Learn from teachers who create and publish courses on Knowlix.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {rows.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <article key={r.id} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-800/90">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-600/20">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white"><Link href={`/instructors/${r.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition">{r.name}</Link></h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{r.count} published course{r.count === 1 ? "" : "s"}</p>
                  </div>
                </div>

                {r.subjects.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.subjects.map((s: string) => (
                      <span key={s} className="rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">{s}</span>
                    ))}
                  </div>
                )}

                {r.titles.length > 0 ? (
                  <ul className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {r.titles.map((t: string) => <li key={t} className="truncate">• {t}</li>)}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">No published courses yet.</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">No instructors yet.</div>
        )}
      </div>
    </>
  );
}