"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, PlayCircle, Award, BadgeCheck } from "lucide-react";

type Role = "student" | "instructor" | "admin" | null;

function buildSlides(role: Role) {
  const dash = role === "instructor" ? "/instructor" : role === "admin" ? "/admin" : "/dashboard/courses";
  const dashLabel = role === "instructor" || role === "admin" ? "Open My Dashboard" : "Continue Learning";
  return [
    {
      key: "welcome",
      chip: "Welcome to Knowlix",
      title: "Learn Without Limits. Grow Without Boundaries.",
      text: "Welcome to Knowlix, your modern online learning destination. Discover new skills, explore expert-led courses, and build the knowledge you need to achieve your goals.",
      cta: { label: "Explore Courses", href: "/courses" },
      bg: "bg-gradient-to-br from-[#ebe7ff] to-[#f8f6ff]",
      art: "player",
    },
    {
      key: "skills",
      chip: "Learn new skills",
      title: "Your Future Starts With What You Learn Today.",
      text: "From technology and programming to business and professional development, discover learning opportunities designed to help you grow and succeed.",
      cta: role ? { label: dashLabel, href: dash } : { label: "Start Learning", href: "/signup" },
      bg: "bg-gradient-to-br from-[#d9f6ee] to-[#f1fcf9]",
      art: "progress",
    },
    {
      key: "succeed",
      chip: "Learn, practice and succeed",
      title: "Turn Your Knowledge Into Real-World Skills.",
      text: "Learn at your own pace, track your progress, complete lessons, and take the next step toward your academic and professional success with Knowlix.",
      cta: role ? { label: dashLabel, href: dash } : { label: "Join Knowlix", href: "/signup" },
      bg: "bg-gradient-to-br from-[#ffeccc] to-[#fff8ec]",
      art: "certificate",
    },
  ] as const;
}

const card = "rounded-[22px] border border-[#e3defa] bg-white shadow-[0_10px_28px_rgba(91,63,224,0.10)]";

function Float({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`${card} absolute ${className}`}
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function PlayerArt() {
  return (
    <div className="relative px-2 pb-6 pt-4 sm:px-6">
      <div className={`${card} rounded-[26px] p-3.5`}>
        <div className="mb-3 flex gap-1.5 px-2">
          <i className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <i className="h-2.5 w-2.5 rounded-full bg-green-300" />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr]">
          <div className="relative grid h-44 place-items-center rounded-2xl bg-gradient-to-br from-[#8b6cf6] to-[#5b3fe0] sm:h-56">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white"><PlayCircle size={32} className="text-[#5b3fe0]" /></span>
            <span className="absolute bottom-3 left-4 text-sm font-bold text-white">Video lesson</span>
          </div>
          <div className="hidden flex-col gap-2.5 sm:flex">
            <div className="rounded-xl bg-[#ebe7ff] p-3 text-sm font-bold">1. Introduction</div>
            <div className="rounded-xl bg-[#f5f3ff] p-3 text-sm">2. Core ideas</div>
            <div className="rounded-xl bg-[#f5f3ff] p-3 text-sm">3. Practice</div>
            <div className="mt-auto h-2 rounded-full bg-[#ebe7ff]"><div className="h-2 w-2/5 rounded-full bg-gradient-to-r from-[#1fb89a] to-[#5b3fe0]" /></div>
          </div>
        </div>
      </div>
      <Float className="right-0 top-0 flex items-center gap-2.5 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d9f6ee]"><BadgeCheck size={20} className="text-[#0e8f78]" /></span>
        <b className="text-sm">Progress tracking</b>
      </Float>
      <Float className="bottom-0 left-0 flex items-center gap-2.5 px-4 py-3" delay={1.2}>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fef3c7]"><Award size={20} className="text-[#a16207]" /></span>
        <b className="text-sm">Certificates</b>
      </Float>
    </div>
  );
}

function ProgressArt() {
  const rows = [["Lesson 1", 100], ["Lesson 2", 75], ["Lesson 3", 40], ["Lesson 4", 10]] as const;
  return (
    <div className="relative px-2 pb-6 pt-4 sm:px-6">
      <div className={`${card} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <b className="text-lg">My courses</b>
          <span className="rounded-full bg-[#d9f6ee] px-3 py-1 text-xs font-bold text-[#0b6b57]">This week</span>
        </div>
        <div className="space-y-3">
          {rows.map(([t, p]) => (
            <div key={t} className="rounded-2xl bg-[#f5faf8] p-3">
              <div className="mb-2 flex justify-between text-sm font-semibold"><span>{t}</span><span>{p}%</span></div>
              <div className="h-2 rounded-full bg-[#d9f6ee]"><div className="h-2 rounded-full bg-gradient-to-r from-[#1fb89a] to-[#5b3fe0]" style={{ width: `${p}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-14 items-end gap-2">
          {[30, 55, 40, 80, 65, 100, 45].map((h, i) => (
            <i key={i} className="flex-1 rounded-md bg-gradient-to-b from-[#5eead4] to-[#5b3fe0]" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <Float className="left-0 top-6 flex items-center gap-2.5 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9f6ee]"><BadgeCheck size={20} className="text-[#0e8f78]" /></span>
        <b className="text-sm">Lesson completed</b>
      </Float>
    </div>
  );
}

function CertificateArt() {
  return (
    <div className="relative px-2 pb-8 pt-6 sm:px-6">
      <div className={`${card} -rotate-3 rounded-[20px] p-3.5`}>
        <div className="rounded-2xl border-[5px] border-double border-[#5b3fe0] bg-white p-6 text-center">
          <p className="text-xs font-extrabold tracking-[0.3em] text-[#5b3fe0]">KNOWLIX</p>
          <h3 className="mb-3 mt-2 text-2xl font-extrabold">Certificate of Completion</h3>
          <p className="text-xs text-[#4b4876]">This is to certify that</p>
          <p className="my-1.5 border-b border-[#e3defa] pb-1.5 text-2xl font-extrabold">Your Name Here</p>
          <p className="text-xs text-[#4b4876]">has completed the course</p>
          <p className="mt-1 text-lg font-extrabold text-[#5b3fe0]">Your Course Title</p>
        </div>
      </div>
      <Float className="bottom-0 right-0 flex items-center gap-3 px-4 py-3" delay={0.8}>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ea580c] font-extrabold text-white">K</span>
        <div><b className="block text-sm">Expert-led courses</b><span className="text-xs text-[#4b4876]">Published by instructors</span></div>
      </Float>
    </div>
  );
}

const variants = {
  enter: (d: number) => ({ x: d * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: -d * 48, opacity: 0 }),
};

export default function HeroSlider({ role }: { role: Role }) {
  const slides = buildSlides(role);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const go = useCallback((n: number, d: number) => {
    setDir(d);
    setI((n + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const f = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);

  const running = !reduce && !hold && !hidden && !userPaused;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => go(i + 1, 1), 6000);
    return () => clearInterval(t);
  }, [i, running, go]);

  const s = slides[i];
  const Art = s.art === "player" ? PlayerArt : s.art === "progress" ? ProgressArt : CertificateArt;
  const ctrl = "grid h-11 w-11 place-items-center rounded-full border border-[#cfc6f7] bg-white text-[#3b27a8] transition hover:bg-[#ebe7ff]";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Knowlix highlights"
      className="mx-auto max-w-7xl px-4 py-6 text-[#1b1740]"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div className="relative overflow-hidden rounded-[36px] border border-[#e3defa]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={s.key}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1, 1);
              else if (info.offset.x > 60) go(i - 1, -1);
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            aria-live={running ? "off" : "polite"}
            className={`${s.bg} grid min-h-[620px] items-center gap-8 px-6 pb-24 pt-10 sm:px-14 lg:min-h-[600px] lg:grid-cols-[1fr_1.05fr]`}
          >
            <div>
              <span className="inline-block rounded-full border border-[#e3defa] bg-white px-4 py-1.5 text-sm font-bold text-[#3b27a8]">{s.chip}</span>
              <h1 className="my-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{s.title}</h1>
              <p className="mb-7 max-w-lg text-lg text-[#4b4876]">{s.text}</p>
              <Link
                href={s.cta.href}
                className="inline-flex items-center rounded-full bg-[#5b3fe0] px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#4a31c8]"
              >
                {s.cta.label}
              </Link>
            </div>
            <div aria-hidden="true"><Art /></div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-5 bottom-4 flex items-center justify-between sm:inset-x-12">
          <div className="flex gap-2.5">
            <button type="button" onClick={() => go(i - 1, -1)} aria-label="Previous slide" className={ctrl}><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => go(i + 1, 1)} aria-label="Next slide" className={ctrl}><ChevronRight size={20} /></button>
          </div>
          <div role="tablist" aria-label="Choose slide" className="flex items-center">
            {slides.map((sl, n) => (
              <button
                key={sl.key}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={`Go to slide ${n + 1}`}
                onClick={() => go(n, n > i ? 1 : -1)}
                className="p-2.5"
              >
                <span className={`block h-2.5 rounded-full transition-all ${n === i ? "w-8 bg-[#5b3fe0]" : "w-2.5 bg-[#c9c0f3]"}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {!reduce && (
              <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"} className={ctrl}>
                {userPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            )}
            <span className="hidden text-sm font-semibold text-[#4b4876] sm:block">0{i + 1} / 0{slides.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}