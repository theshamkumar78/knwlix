"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field =
  "mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default function ChangePassword() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setMsg(null);
    const f = new FormData(form);
    const p1 = String(f.get("password") ?? "");
    const p2 = String(f.get("confirm") ?? "");
    if (p1.length < 8) return setMsg({ ok: false, text: "Password must be at least 8 characters." });
    if (p1 !== p2) return setMsg({ ok: false, text: "The two passwords do not match." });

    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: p1 });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Password updated." });
    form.reset();
  }

  return (
    <form onSubmit={submit} className="glass space-y-5 p-6">
      <h2 className="text-xl font-bold">Change password</h2>
      <label className="block text-sm">New password
        <input name="password" type="password" required minLength={8} className={field} />
      </label>
      <label className="block text-sm">Confirm new password
        <input name="confirm" type="password" required minLength={8} className={field} />
      </label>
      {msg && (
        <p role="alert" className={`rounded-2xl px-4 py-3 text-sm ${msg.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>
          {msg.text}
        </p>
      )}
      <button disabled={busy} className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 disabled:opacity-60">
        {busy ? "Please wait…" : "Update password"}
      </button>
    </form>
  );
}