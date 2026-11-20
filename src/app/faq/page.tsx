"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle, GraduationCap, ArrowRight } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "How do I enroll in a course?",
    a: "Browse the course catalog, click on any course that interests you, and press 'Enroll Now'. Since Knowlix is open access for our university community, courses are immediately unlocked in your student dashboard.",
  },
  {
    q: "Can I get a certificate?",
    a: "Yes! Once you complete all video lessons in a course curriculum, Knowlix automatically generates a cryptographic verifiable certificate with a unique QR code and ID.",
  },
  {
    q: "Do you offer refunds?",
    a: "All introductory and university curriculum courses on Knowlix are 100% free. For premium certificate tracks, we provide a full 30-day money-back guarantee.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach out through our Contact page or email our academic support desk directly at info@knowlix.com. We respond within 24 hours.",
  },
  {
    q: "Are the courses self-paced?",
    a: "Yes, all courses are 100% self-paced. You can watch lessons, track your weekly progress, and pick up right where you left off at any time.",
  },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 pt-10 sm:pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Accordion List (PDF Page 10) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-700">
                Help & Support
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Frequently Asked Questions
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Find clear answers to common questions about learning with Knowlix.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                      <span className="ml-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Illustration Graphic Card (PDF Page 10) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-blue-500/5">
              <div className="aspect-square w-full rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-8 text-white flex flex-col items-center justify-center text-center shadow-inner">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
                  <HelpCircle size={44} className="text-white drop-shadow" />
                </div>
                <h3 className="mt-5 text-xl font-black text-white">Have Questions?</h3>
                <p className="mt-2 text-xs text-blue-100 max-w-xs">
                  Our academic support team and instructors are always here to assist your learning journey.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
                >
                  <span>Ask a Question</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
