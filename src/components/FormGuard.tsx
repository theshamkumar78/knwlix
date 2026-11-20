"use client";
import { useEffect } from "react";

// Server-action forms: pehle click ke baad dobara submit ko 4 second tak rokta hai
export default function FormGuard() {
  useEffect(() => {
    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null;
      if (!form || !form.getAttribute("action")?.startsWith("javascript:")) return; // sirf server-action forms
      if (form.dataset.busy === "1") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      form.dataset.busy = "1";
      form.setAttribute("aria-busy", "true");
      const btn = (e as SubmitEvent).submitter as HTMLButtonElement | null;
      setTimeout(() => {
        if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; btn.style.cursor = "wait"; }
      }, 0);
      setTimeout(() => {
        form.dataset.busy = "0";
        form.removeAttribute("aria-busy");
        if (btn) { btn.disabled = false; btn.style.opacity = ""; btn.style.cursor = ""; }
      }, 4000);
    };
    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);
  return null;
}