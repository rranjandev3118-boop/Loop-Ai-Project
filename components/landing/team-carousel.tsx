"use client";

import { useEffect, useRef, useState } from "react";
import { landingCopy, teamPerspectives } from "./data";

export default function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeItem = teamPerspectives[activeIndex];

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % teamPerspectives.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [isVisible, isPaused, prefersReducedMotion]);

  const changeSlide = (direction: number) => {
    setActiveIndex(
      (current) =>
        (current + direction + teamPerspectives.length) %
        teamPerspectives.length,
    );
  };

  return (
    <section
      ref={regionRef}
      aria-label={landingCopy.perspectives.label}
      aria-roledescription="carousel"
      className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 shadow-sm sm:p-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsPaused(false);
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (startX === null || endX === undefined) return;
        const distance = endX - startX;
        if (Math.abs(distance) > 48) changeSlide(distance < 0 ? 1 : -1);
      }}
    >
      <div
        className="mx-auto max-w-3xl"
        role="group"
        aria-roledescription="slide"
        aria-label={landingCopy.perspectives.slideLabel(
          activeIndex + 1,
          teamPerspectives.length,
        )}
        aria-live="polite"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
          {activeItem.audience}
        </p>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {activeItem.title}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {activeItem.description}
        </p>
        <p className="mt-5 inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-800">
          {activeItem.takeaway}
        </p>
      </div>
      <div className="mx-auto mt-7 flex max-w-3xl items-center justify-between gap-4">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label={landingCopy.perspectives.chooseLabel}
        >
          {teamPerspectives.map((item, index) => (
            <button
              key={item.audience}
              type="button"
              aria-label={landingCopy.perspectives.showLabel(item.audience)}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span
                aria-hidden="true"
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? "w-7 bg-indigo-600" : "w-2.5 bg-indigo-200"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={landingCopy.perspectives.previousLabel}
            onClick={() => changeSlide(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label={landingCopy.perspectives.nextLabel}
            onClick={() => changeSlide(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <p className="sr-only">
        {landingCopy.perspectives.disclosure}
      </p>
    </section>
  );
}
