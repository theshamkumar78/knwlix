"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastListener({
  showToast,
}: {
  showToast: (message: string, type?: ToastType) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = searchParams.get("saved");
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    let toastShown = false;

    if (saved) {
      showToast(
        saved === "1" ? "Changes saved successfully!" : decodeURIComponent(saved),
        "success"
      );
      toastShown = true;
    } else if (success) {
      showToast(decodeURIComponent(success), "success");
      toastShown = true;
    } else if (error) {
      showToast(decodeURIComponent(error), "error");
      toastShown = true;
    }

    if (toastShown) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("saved");
      params.delete("error");
      params.delete("success");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router, showToast]);

  return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Suspense fallback={null}>
        <ToastListener showToast={showToast} />
      </Suspense>

      {/* Floating toast notification container */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              t.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 ring-1 ring-emerald-500/30"
                : t.type === "error"
                ? "bg-rose-950/90 text-rose-100 ring-1 ring-rose-500/30"
                : "bg-slate-900/90 text-amber-100 ring-1 ring-amber-500/30"
            }`}
          >
            <div className="shrink-0 pt-0.5">
              {t.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
              {t.type === "error" && (
                <AlertCircle className="h-5 w-5 text-rose-400" />
              )}
              {t.type === "info" && (
                <Info className="h-5 w-5 text-amber-400" />
              )}
            </div>

            <p className="flex-1 text-sm font-medium leading-snug">
              {t.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastProvider;
