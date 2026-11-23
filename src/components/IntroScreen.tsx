
"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, SkipForward, Sparkles } from "lucide-react";

export default function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"logo" | "loading">("logo");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("knowlix-intro-seen") === "true") {
      setVisible(false);
      return;
    }

    const start = Date.now();

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;

      if (elapsed < 2000) {
        setPhase("logo");
      } else {
        setPhase("loading");
        setProgress(
          Math.min(100, Math.round(((elapsed - 2000) / 5000) * 100))
        );
      }

      if (elapsed >= 7000) {
        sessionStorage.setItem("knowlix-intro-seen", "true");
        setProgress(100);
        setVisible(false);
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, []);

  function skipIntro() {
    sessionStorage.setItem("knowlix-intro-seen", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#071329] text-white">

      {phase === "logo" ? (
        <div className="animate-pulse text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-2xl">
            <BookOpen size={48} className="text-blue-600" />
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-[0.2em]">
            KNOWLIX
          </h1>

          <p className="mt-3 text-sm tracking-widest text-blue-200">
            LEARN. EXPLORE. ACHIEVE.
          </p>

          <Sparkles className="mx-auto mt-5 animate-spin text-cyan-300" />
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/knowlix-intro.png')",
            }}
          />

          <div className="absolute inset-0 bg-[#06132d]/45" />

          <div className="relative z-10 w-full px-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-xl">
                  <GraduationCap size={34} className="text-blue-600" />
                </div>

                <span className="text-3xl font-black tracking-wider">
                  KNOWLIX
                </span>
              </div>

              <h2 className="text-3xl font-black sm:text-5xl">
                Welcome to Knowlix
              </h2>

              <p className="mt-3 text-sm text-blue-100 sm:text-lg">
                Your journey to knowledge starts here.
              </p>

              <div className="mt-10 w-full max-w-xl rounded-2xl border border-white/20 bg-[#071329]/90 p-5 shadow-2xl backdrop-blur-xl">

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-blue-200">
                    Preparing your experience...
                  </span>

                  <span className="font-bold tabular-nums">
                    {progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={skipIntro}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold transition hover:bg-white/20"
                  >
                    Skip Intro
                    <SkipForward size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
