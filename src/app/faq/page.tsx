
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { FAQS } from "@/lib/faqs";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-10 text-slate-900 transition-colors duration-200 dark:bg-[#0b1329] dark:text-slate-100 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
            <HelpCircle size={27} />
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Quick answers about learning on Knowlix.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50 sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-900 marker:hidden dark:text-white sm:text-base">
                <span>{f.q}</span>

                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 group-open:rotate-180 group-open:bg-blue-50 group-open:text-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:group-open:bg-blue-500/15 dark:group-open:text-blue-400">
                  <ChevronDown size={18} />
                </span>
              </summary>

              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-7 text-center text-white shadow-xl shadow-blue-600/15 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-300/20 blur-2xl" />

          <div className="relative">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10">
              <HelpCircle size={24} />
            </span>

            <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
              Still have a question?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-blue-100">
              Our team is here to help you. Get in touch with us for further assistance.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Back Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
