"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return setMsg({ ok: false, text: "Supabase is not configured. See README." });
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password") ?? "");
    if (mode !== "forgot" && password.length < 8) return setMsg({ ok: false, text: "Password must be at least 8 characters." });
    setBusy(true);
    const sb = createClient();
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setMsg({ ok: false, text: error.message });
      else {
        const next = params.get("next");
        router.push(next && next.startsWith("/") ? next : "/dashboard");
        router.refresh();
      }
    } else if (mode === "signup") {
      const { error } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: String(f.get("name")) }, emailRedirectTo: `${location.origin}/login` },
      });
      setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Account created. You can log in now." });
    } else {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login` });
      setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "If that email exists, a reset link was sent." });
    }
    setBusy(false);
  }

  const field =
    "mt-1 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";
  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password";
  const sub =
    mode === "login" ? "Log in to continue learning." : mode === "signup" ? "Join Knowlix and start learning today." : "We will email you a reset link.";

  return (
    <section className="aurora grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12 text-white">
      <form onSubmit={submit} className="glass w-full max-w-md space-y-5 p-8">
        <div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-white/70">{sub}</p>
        </div>

        {mode === "signup" && (
          <label className="block text-sm">Full name<input name="name" required className={field} /></label>
        )}
        <label className="block text-sm">Email<input name="email" type="email" required className={field} /></label>
        {mode !== "forgot" && (
          <label className="block text-sm">Password<input name="password" type="password" required minLength={8} className={field} /></label>
        )}

        {msg && (
          <p role="alert" className={`rounded-2xl px-4 py-3 text-sm ${msg.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>
            {msg.text}
          </p>
        )}

        <button disabled={busy} className="w-full rounded-full bg-amber-400 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Sign up" : "Send reset link"}
        </button>

        <div className="space-y-1 text-center text-sm text-white/70">
          {mode === "login" && (
            <>
              <p><Link href="/forgot-password" className="underline hover:text-white">Forgot password?</Link></p>
              <p>New here? <Link href="/signup" className="font-semibold text-amber-300">Create an account</Link></p>
            </>
          )}
          {mode === "signup" && (
            <p>Already have an account? <Link href="/login" className="font-semibold text-amber-300">Log in</Link></p>
          )}
          {mode === "forgot" && (
            <p><Link href="/login" className="font-semibold text-amber-300">Back to login</Link></p>
          )}
        </div>
      </form>
    </section>
  );
}