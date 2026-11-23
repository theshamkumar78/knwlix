
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  PlayCircle,
  Award,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Star,
  Flame,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type Role = "student" | "instructor" | "admin" | null;

function buildSlides(role: Role) {
  const dash =
    role === "instructor"
      ? "/instructor"
      : role === "admin"
      ? "/admin"
      : "/dashboard";

  const dashLabel =
    role === "instructor" || role === "admin"
      ? "Open My Dashboard"
      : "Continue Learning";

  return [
    {
      key: "welcome",
      chip: "Welcome to Knowlix",
      title: "Learn Without Limits. Grow Without Boundaries.",
      text: "Welcome to Knowlix, your modern online learning destination. Discover new skills, explore expert-led courses, and build the knowledge you need to achieve your goals.",
      cta: { label: "Explore Courses", href: "/courses" },
      secondaryCta: { label: "How It Works", href: "/#categories" },
      lightBg:
        "bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/70 border-blue-100",
      darkBg:
        "dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 dark:border-slate-800",
      accent: "from-blue-600 to-indigo-600",
      art: "player",
    },
    {
      key: "skills",
      chip: "Industry-Ready Curriculum",
      title: "Your Future Starts With What You Learn Today.",
      text: "From technology and programming to business and professional development, discover learning opportunities designed to help you grow and succeed.",
      cta: role
        ? { label: dashLabel, href: dash }
        : { label: "Start Learning", href: "/signup" },
      secondaryCta: { label: "Browse Catalog", href: "/courses" },
      lightBg:
        "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 border-emerald-100",
      darkBg:
        "dark:bg-gradient-to-br dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 dark:border-slate-800",
      accent: "from-emerald-600 to-teal-600",
      art: "progress",
    },
    {
      key: "succeed",
      chip: "Accredited & Verifiable",
      title: "Turn Your Knowledge Into Real-World Skills.",
      text: "Learn at your own pace, track your progress, complete assessments, and take the next step toward your academic and professional success with Knowlix.",
      cta: role
        ? { label: dashLabel, href: dash }
        : { label: "Join Knowlix", href: "/signup" },
      secondaryCta: { label: "View Certificates", href: "/courses" },
      lightBg:
        "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 border-amber-100",
      darkBg:
        "dark:bg-gradient-to-br dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900 dark:border-slate-800",
      accent: "from-amber-500 to-orange-600",
      art: "certificate",
    },
    {
      key: "building",
      chip: "Welcome to Our Learning Campus",
      title: "A New World of Learning Begins Here.",
      text: "Explore Knowlix, discover new opportunities, and build the skills that shape your future. Start your learning journey with us today.",
      cta: { label: "Explore Knowlix", href: "/courses" },
      secondaryCta: { label: "Join Our Community", href: "/signup" },
      lightBg:
        "bg-gradient-to-br from-sky-50 via-white to-blue-100 border-blue-100",
      darkBg:
        "dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 dark:border-slate-800",
      accent: "from-blue-600 to-cyan-600",
      art: "building",
    },
  ] as const;
}

/* =========================================================
   INTERACTIVE ART 1: VIDEO CLASSROOM PLAYER
   ========================================================= */

function PlayerArt() {
  return (
    <div className="relative mx-auto w-full max-w-lg py-2">
      <div className="relative rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-blue-900/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-800/95 sm:p-5">
        <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-700">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <ShieldCheck size={13} className="text-blue-500" />
            Knowlix Video Engine
          </span>
        </div>

        <div className="relative grid h-44 w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 sm:h-52">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-15 [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="grid h-16 w-16 cursor-pointer place-items-center rounded-full bg-white/90 text-blue-600 shadow-lg shadow-blue-900/30 backdrop-blur-sm"
            >
              <PlayCircle size={38} className="fill-blue-50 text-blue-600" />
            </motion.div>

            <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              Python Masterclass · Lesson 04
            </span>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-slate-200">
            <span>12:45 / 24:10</span>
            <span className="rounded bg-blue-500/80 px-1.5 py-0.5 text-[10px] text-white">
              HD 1080p
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 p-2 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <CheckCircle2 size={14} className="shrink-0 text-blue-600" />
            <span className="truncate">1. Syntax</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-2 text-xs font-semibold text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-blue-600 text-[10px] text-white">
              2
            </span>
            <span className="truncate">2. Loops</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 p-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-300 text-[10px] text-slate-700">
              3
            </span>
            <span className="truncate">3. Project</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            4.9 / 5.0 Rating
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <BadgeCheck size={16} className="text-emerald-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Verified Platform
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INTERACTIVE ART 2: LEARNING HABIT & PROGRESS
   ========================================================= */

function ProgressArt() {
  const skills = [
    {
      name: "Full-Stack Web Engineering",
      pct: 92,
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Python Data & Algorithms",
      pct: 84,
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "UI/UX Design Systems",
      pct: 68,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg py-2">
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-xl shadow-emerald-900/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-800/95">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Active Learning Path
            </h4>
            <p className="text-xs text-slate-500">
              Live Weekly Momentum
            </p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Flame size={14} className="fill-orange-500 text-orange-500" />
            7-Day Streak
          </span>
        </div>

        <div className="space-y-3.5">
          {skills.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/60"
            >
              <div className="mb-1.5 flex justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">
                  {s.name}
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {s.pct}%
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Weekly Study Hours</span>
            <span className="font-bold text-emerald-600">
              +14% vs last week
            </span>
          </div>

          <div className="flex h-12 items-end gap-2 px-1">
            {[40, 65, 50, 85, 70, 100, 60].map((h, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <TrendingUp size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Top 5% Learner
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <Award size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            3 Badges Earned
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INTERACTIVE ART 3: VERIFIABLE ACCREDITED CERTIFICATE
   ========================================================= */

function CertificateArt() {
  return (
    <div className="relative mx-auto w-full max-w-lg py-2">
      <div className="relative rounded-3xl border border-amber-200/90 bg-gradient-to-b from-amber-50/50 to-white p-5 shadow-xl shadow-amber-900/10 backdrop-blur-md dark:border-amber-900/50 dark:from-slate-800 dark:to-slate-900">
        <div className="rounded-2xl border-2 border-dashed border-amber-300/80 bg-white p-5 text-center dark:border-amber-700/60 dark:bg-slate-900/90">
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
            <Award size={22} />
            <span className="text-xs font-black uppercase tracking-widest">
              KNOWLIX OFFICIAL
            </span>
          </div>

          <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
            Certificate of Completion
          </h3>

          <p className="mt-1 text-[11px] text-slate-500">
            Awarded for academic excellence and project mastery to
          </p>

          <p className="my-2 border-b border-amber-200 pb-1.5 text-base font-extrabold text-blue-600 dark:border-amber-800 dark:text-blue-400">
            Sham Kumar
          </p>

          <p className="text-[11px] text-slate-500">
            for successfully completing the curriculum
          </p>

          <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            Modern Full-Stack Web Development & Cloud Systems
          </p>

          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400 dark:border-slate-800">
            <span className="font-mono">ID: KNX-9482-VERIFIED</span>

            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={12} />
              Cryptographically Signed
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-100 text-xs font-black text-amber-700">
            QR
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Live Online Verification
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <BadgeCheck size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Share to LinkedIn
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INTERACTIVE ART 4: KNOWLIX BUILDING IMAGE
   ========================================================= */

function BuildingArt() {
  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-blue-200/60 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
      <div className="relative aspect-video overflow-hidden rounded-2xl">
        <Image
          src="/images/knowlix-building.png"
          alt="Knowlix learning campus"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between px-3 py-3">
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            Welcome to Knowlix
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Learn. Explore. Achieve.
          </p>
        </div>

        <Sparkles className="text-blue-500" size={22} />
      </div>
    </div>
  );
}

/* =========================================================
   SLIDER ANIMATION
   ========================================================= */

const slideVariants = {
  enter: (d: number) => ({
    x: d > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (d: number) => ({
    x: d > 0 ? -40 : 40,
    opacity: 0,
  }),
};

/* =========================================================
   MAIN HERO SLIDER
   ========================================================= */

export default function HeroSlider({ role }: { role: Role }) {
  const slides = buildSlides(role);
  const reduce = useReducedMotion();

  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const go = useCallback(
    (n: number, d: number) => {
      setDir(d);
      setI((n + slides.length) % slides.length);
    },
    [slides.length]
  );

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

  const Art =
    s.art === "player"
      ? PlayerArt
      : s.art === "progress"
      ? ProgressArt
      : s.art === "building"
      ? BuildingArt
      : CertificateArt;

  const ctrlBtn =
    "grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-slate-700";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Knowlix Highlights Slider"
      className="mx-auto max-w-7xl px-4 py-4 sm:py-6"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div
        className={`relative overflow-hidden rounded-[32px] border ${s.lightBg} ${s.darkBg} shadow-xl shadow-blue-900/5 transition-colors duration-300`}
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={s.key}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: reduce ? 0 : 0.35,
              ease: "easeOut",
            }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) go(i + 1, 1);
              else if (info.offset.x > 50) go(i - 1, -1);
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            className="grid min-h-[580px] items-center gap-8 px-6 pb-24 pt-8 sm:px-12 lg:min-h-[520px] lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-12"
          >
            {/* LEFT CONTENT */}

            <div className="z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles
                  size={13}
                  className="text-blue-600 dark:text-blue-400"
                />
                {s.chip}
              </span>

              <h1 className="mt-4 text-3xl font-black leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                {s.title}
              </h1>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {s.text}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={s.cta.href}
                  prefetch={true}
                  className="btn btn-primary font-bold shadow-lg shadow-blue-600/30"
                >
                  <span>{s.cta.label}</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href={s.secondaryCta.href}
                  prefetch={true}
                  className="btn btn-outline"
                >
                  {s.secondaryCta.label}
                </Link>
              </div>
            </div>

            {/* RIGHT VISUAL */}

            <div aria-hidden="true" className="w-full">
              <Art />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM CAROUSEL CONTROLS */}

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between sm:inset-x-10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(i - 1, -1)}
              aria-label="Previous slide"
              className={ctrlBtn}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => go(i + 1, 1)}
              aria-label="Next slide"
              className={ctrlBtn}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* SLIDE INDICATORS */}

          <div
            role="tablist"
            aria-label="Select slide"
            className="flex items-center gap-1.5"
          >
            {slides.map((sl, n) => (
              <button
                key={sl.key}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={`Go to slide ${n + 1}`}
                onClick={() => go(n, n > i ? 1 : -1)}
                className="px-1 py-2 focus:outline-none"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    n === i
                      ? "w-8 bg-blue-600 shadow-sm shadow-blue-600/40"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* PAUSE / RESUME */}

          <div className="flex items-center gap-2 sm:gap-3">
            {!reduce && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={
                  userPaused ? "Resume auto sliding" : "Pause auto sliding"
                }
                title={
                  userPaused ? "Resume auto sliding" : "Pause auto sliding"
                }
                className={ctrlBtn}
              >
                {userPaused ? (
                  <Play size={16} />
                ) : (
                  <Pause size={16} />
                )}
              </button>
            )}

            <span className="hidden text-xs font-bold text-slate-500 dark:text-slate-400 sm:block">
              0{i + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
