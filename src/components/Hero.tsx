"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" });
      gsap.to(".float", { y: -14, repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut", stagger: 0.4 });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="relative overflow-hidden bg-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <h1 className="reveal text-4xl font-bold leading-tight md:text-6xl">Learn Smarter.<br />Build Your Future.</h1>
          <p className="reveal mt-5 max-w-lg text-slate-300">Discover new skills, learn from expert instructors, and track your progress with Knowlix.</p>
          <div className="reveal mt-8 flex gap-3">
            <Link href="/courses" className="rounded-full bg-brand px-6 py-3 font-medium hover:bg-blue-500">Browse Courses</Link>
            <Link href="/signup" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10">Get Started</Link>
          </div>
        </div>
        <div className="reveal float rounded-3xl border border-white/10 bg-white/5 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/category-banners.jpeg" alt="Knowlix course categories" className="rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
