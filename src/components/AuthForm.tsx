"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, BookOpen, Check, X, Shield, Chrome, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/ui/PasswordInput";

export default function AuthForm({
  mode: initialMode,
}: {
  mode: "login" | "signup" | "forgot";
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [busy, setBusy] = useState(false);

  // Live password strength
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setFieldErrors({});

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return setMsg({
        ok: false,
        text: "Supabase is not configured. See README.",
      });
    }

    if (mode === "signup") {
      if (!isPasswordValid) {
        setFieldErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters and include letters & numbers.",
        }));
        return;
      }
      if (password !== confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
        return;
      }
    } else if (mode === "login") {
      if (password.length < 6) {
        setFieldErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters.",
        }));
        return;
      }
    }

    setBusy(true);
    const sb = createClient();

    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg({ ok: false, text: error.message });
      } else {
        const next = params.get("next");
        const target = next && next.startsWith("/") ? next : "/dashboard";
        window.location.href = target;
      }
    } else if (mode === "signup") {
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${location.origin}/login`,
        },
      });
      setMsg(
        error
          ? { ok: false, text: error.message }
          : { ok: true, text: "Account created successfully! You can now log in." }
      );
      if (!error) {
        setMode("login");
      }
    } else {
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/login`,
      });
      setMsg(
        error
          ? { ok: false, text: error.message }
          : {
              ok: true,
              text: "If that email exists, a password reset link has been sent.",
            }
      );
    }
    setBusy(false);
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f8fafc] text-slate-900 dark:bg-[#0b1329] dark:text-slate-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl grid items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Brand & 3D Illustration Graphic (PDF Page 7) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4">
          <div className="relative mx-auto aspect-square w-72 max-w-full rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-8 text-white shadow-2xl shadow-blue-500/20 flex flex-col items-center justify-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
              <GraduationCap size={56} className="text-white drop-shadow" />
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
              <BookOpen size={14} /> University Grade LMS
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Join Knowlix <br />
              <span className="text-blue-600 dark:text-blue-400">Start Your Learning</span> <br />
              Journey Today
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Connect with university-grade courses, track your lessons, and earn certified credentials.
            </p>
          </div>
        </div>

        {/* Right Column: Clean Auth Card (PDF Page 7) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-800/90">
            {/* Segmented [ Login ] [ Sign Up ] Tabs (PDF Page 7) */}
            {mode !== "forgot" && (
              <div className="mb-8 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 dark:bg-slate-700/60 p-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMsg(null);
                  }}
                  className={`py-2.5 rounded-xl transition ${
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setMsg(null);
                  }}
                  className={`py-2.5 rounded-xl transition ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Reset Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your email address to receive a secure password reset link.
                </p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sham Kumar"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-700/60 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-700/60 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-800"
                />
              </div>

              {mode !== "forgot" && (
                <PasswordInput
                  label="Password"
                  id="auth-password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  required
                  placeholder="••••••••"
                  error={fieldErrors.password}
                />
              )}

              {mode === "signup" && (
                <PasswordInput
                  label="Confirm Password"
                  id="auth-confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  required
                  placeholder="••••••••"
                  error={fieldErrors.confirmPassword}
                />
              )}

              {/* Remember Me & Forgot Password (PDF Page 7) */}
              {mode === "login" && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold">Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setMsg(null);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Status or error message banner */}
              {msg && (
                <div
                  role="alert"
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    msg.ok
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Submit Button (PDF Page 7) */}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {busy
                  ? "Please wait…"
                  : mode === "login"
                  ? "Login"
                  : mode === "signup"
                  ? "Sign Up"
                  : "Send Reset Link"}
              </button>

              {/* Back to login option if in forgot mode */}
              {mode === "forgot" && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {/* Social Login Section (PDF Page 7) */}
              {mode !== "forgot" && (
                <div className="pt-4">
                  <div className="relative text-center text-xs text-slate-400 mb-4">
                    <span className="bg-white dark:bg-slate-800 px-2 relative z-10 font-medium">
                      or continue with
                    </span>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-200 dark:border-slate-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => alert("Social Google login is configured via Supabase Auth.")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Chrome size={16} className="text-rose-500" />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Social GitHub login is configured via Supabase Auth.")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Github size={16} className="text-slate-900 dark:text-white" />
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
