"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { sendContactMessage } from "./actions";

const input =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-800";
const label = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300";

type Info = { icon: any; title: string; value: string; href?: string };

export default function ContactPage() {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const info: Info[] = [
    ...(SITE.email ? [{ icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}` }] : []),
    ...(SITE.phone ? [{ icon: Phone, title: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` }] : []),
    ...(SITE.location ? [{ icon: MapPin, title: "Location", value: SITE.location }] : []),
    { icon: Clock, title: "Response time", value: "We reply within 1–2 working days." },
  ];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    start(async () => {
      const res = await sendContactMessage(fd);
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-8 text-slate-900 sm:pt-12 dark:bg-[#0b1329] dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Get in touch</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Have questions about our courses or learning platform? Send us a message and our team will help you.
              </p>
            </div>
            <div className="space-y-4 pt-2">
              {info.map(({ icon: Icon, title, value, href }) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">{title}</h2>
                    {href ? (
                      <a href={href} className="break-all text-sm font-bold text-slate-900 dark:text-white transition hover:text-blue-600 dark:hover:text-blue-400">{value}</a>
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-blue-500/5 sm:p-10 dark:border-slate-800 dark:bg-slate-800/90">
              <div className="absolute right-8 top-8 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Send size={18} />
              </div>
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Send us a message</h2>

              {sent ? (
                <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-600" />
                  <h3 className="text-base font-bold text-emerald-900">Message sent</h3>
                  <p className="mt-1 text-xs text-emerald-700">Thank you! Our team will get back to you soon.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-4 inline-block text-xs font-bold text-emerald-800 underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className={label}>Your name</label>
                    <input id="full_name" name="full_name" required minLength={2} maxLength={100} className={input} />
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>Your email</label>
                    <input id="email" name="email" type="email" required maxLength={200} placeholder="you@example.com" className={input} />
                  </div>
                  <div>
                    <label htmlFor="subject" className={label}>Subject (optional)</label>
                    <input id="subject" name="subject" maxLength={150} className={input} />
                  </div>
                  <div>
                    <label htmlFor="message" className={label}>Your message</label>
                    <textarea id="message" name="message" rows={5} required minLength={5} maxLength={2000} className={input} />
                  </div>

                  {/* spam bots ke liye jaal, insaan ko nazar nahi aata */}
                  <div className="hidden" aria-hidden="true">
                    <input name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

                  <button
                    type="submit"
                    disabled={pending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                  >
                    <span>{pending ? "Sending…" : "Send message"}</span>
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}