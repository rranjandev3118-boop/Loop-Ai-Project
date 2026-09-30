"use client";

import { useEffect, useState } from "react";
import { landingCopy } from "./data";
import { calculateScrollProgress } from "@/lib/scroll-progress";

export default function ScrollControls() {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setProgress(
          calculateScrollProgress(
            window.scrollY,
            document.documentElement.scrollHeight,
            window.innerHeight,
          ),
        );
        setShowBackToTop(window.scrollY > 480);
        frame = 0;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full"
      >
        <div
          className="h-full w-full origin-left bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-400"
          style={{
            transform: `scaleX(${progress})`,
            opacity: progress > 0 ? 1 : 0,
          }}
        />
      </div>
      <button
        type="button"
        aria-label={landingCopy.controls.backToTop}
        onClick={() => {
          const behavior = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches
            ? "auto"
            : "smooth";
          window.scrollTo({ top: 0, behavior });
        }}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-5 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:bottom-7 sm:right-7 ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}
