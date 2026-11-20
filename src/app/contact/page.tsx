"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Contact Information Cards (PDF Page 9) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Get In Touch
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                We'd love to hear from you! Reach out for support or feedback.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Email Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </h3>
                  <a
                    href="mailto:info@knowlix.com"
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    info@knowlix.com
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phone
                  </h3>
                  <a
                    href="tel:+923001234567"
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    +92 300 123 4567
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Address
                  </h3>
                  <p className="text-sm font-bold text-slate-900">
                    123 Learning St, Education City
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (PDF Page 9) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-blue-500/5">
              {/* Paper airplane accent in top right */}
              <div className="absolute right-8 top-8 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Send size={18} />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2" />
                  <h3 className="text-base font-bold text-emerald-900">Message Delivered!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you, {name || "learner"}! Our team will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-4 inline-block text-xs font-bold text-emerald-800 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sham Kumar"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you with your learning goals?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
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
