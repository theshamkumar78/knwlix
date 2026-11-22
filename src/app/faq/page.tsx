import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { FAQS } from "@/lib/faqs";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-10 text-slate-900 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <HelpCircle size={24} />
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Frequently asked questions</h1>
          <p className="mt-2 text-slate-500">Quick answers about learning on Knowlix.</p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <ChevronDown size={18} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-blue-600 p-6 text-center text-white">
          <p className="font-bold">Still have a question?</p>
          <Link href="/contact" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700">
            Contact us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}