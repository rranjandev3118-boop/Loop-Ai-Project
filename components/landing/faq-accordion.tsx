"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { landingFaqs } from "./data";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 shadow-sm sm:px-7">
      {landingFaqs.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        const panelId = `landing-faq-panel-${index}`;

        return (
          <div key={question} className="relative py-1">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-base"
              >
                {question}
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg leading-none text-indigo-700 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <motion.div
              id={panelId}
              aria-hidden={!isOpen}
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : -5,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
              className={`pb-5 text-sm leading-6 text-slate-600 ${
                isOpen
                  ? "relative"
                  : "pointer-events-none absolute inset-x-0 top-full -z-10"
              }`}
            >
              {answer}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
