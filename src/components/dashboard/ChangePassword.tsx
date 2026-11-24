"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch = confirm.length > 0 && password === confirm;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setFieldErrors({});

    if (!isPasswordValid) {
      setFieldErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters and include both letters and numbers.",
      }));
      return;
    }

    if (password !== confirm) {
      setFieldErrors((prev) => ({
        ...prev,
        confirm: "The two passwords do not match.",
      }));
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }

    setMsg({ ok: true, text: "Password updated successfully." });
    setPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change password</h2>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <PasswordInput
            label="New password"
            name="password"
            id="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters with letters & numbers"
            error={fieldErrors.password}
          />

          {password.length > 0 && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/60 p-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Password requirements:
              </p>
              <ul className="space-y-1">
                <li
                  className={`flex items-center gap-1.5 ${
                    hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {hasMinLength ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span>At least 8 characters</span>
                </li>
                <li
                  className={`flex items-center gap-1.5 ${
                    hasLetter ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {hasLetter ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span>Contains at least one letter</span>
                </li>
                <li
                  className={`flex items-center gap-1.5 ${
                    hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {hasNumber ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span>Contains at least one number</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm new password"
          name="confirm"
          id="confirm-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            if (fieldErrors.confirm) {
              setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
            }
          }}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={
            confirm.length > 0 && !passwordsMatch
              ? "The two passwords do not match."
              : fieldErrors.confirm
          }
        />
      </div>

      {msg && (
        <p
          role="alert"
          className={`rounded-2xl px-4 py-3 text-sm ${
            msg.ok
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-60"
      >
        {busy ? "Please wait…" : "Update password"}
      </button>
    </form>
  );
}
