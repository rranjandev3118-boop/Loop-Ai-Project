"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(value);
          return;
        }

        const duration = 900;
        const startedAt = performance.now();

        const update = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setCount(Math.round(value * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = window.requestAnimationFrame(update);
        };

        frame = window.requestAnimationFrame(update);
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {count}
      {suffix}
    </span>
  );
}
