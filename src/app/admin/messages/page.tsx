import Link from "next/link";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import { setMessageRead, deleteMessage } from "./actions";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi",
  });

export default async function Messages({ searchParams }: { searchParams: Promise<{ unread?: string }> }) {
  const { unread } = await searchParams;
  const { sb } = await requireRole(["admin"]);

  let query = sb.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (unread === "1") query = query.eq("is_read", false);
  const { data } = await query;
  const rows: any[] = data ?? [];
  const { count: unreadCount } = await sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false);

  const tab = (on: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition ${on ? "bg-blue-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"}`;

  return (
    <GlassShell active="messages" variant="admin">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{unreadCount ?? 0} unread</p>
        </header>

        <div className="flex gap-2">
          <Link href="/admin/messages" className={tab(unread !== "1")}>All</Link>
          <Link href="/admin/messages?unread=1" className={tab(unread === "1")}>Unread</Link>
        </div>

        {rows.length ? (
          <div className="space-y-3">
            {rows.map((m) => (
              <article key={m.id} className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-800/90 ${m.is_read ? "border-slate-200/80 dark:border-slate-800" : "border-blue-300 ring-2 ring-blue-100 dark:border-blue-700 dark:ring-blue-900/40"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      {!m.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" aria-label="Unread" />}
                      {m.subject || "(no subject)"}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {m.full_name} · <a href={`mailto:${m.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{m.email}</a>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{fmt(m.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                      <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition">
                        {m.is_read ? "Mark unread" : "Mark read"}
                      </button>
                    </form>
                    <form action={deleteMessage.bind(null, m.id)}>
                      <button className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 transition">Delete</button>
                    </form>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">{m.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">No messages here.</p>
        )}
      </div>
    </GlassShell>
  );
}