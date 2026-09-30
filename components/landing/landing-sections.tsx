import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CountUp } from "./count-up";
import FaqAccordion from "./faq-accordion";
import {
  feedbackSources,
  illustrativeWorkflows,
  landingCopy,
  landingFeatures,
  landingStats,
  technologyStack,
  whyLoopItems,
  workflowSteps,
} from "./data";
import { Reveal } from "./reveal";
import TeamCarousel from "./team-carousel";

function SectionHeading({
  headingId,
  eyebrow,
  title,
  description,
}: {
  headingId: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">
        {eyebrow}
      </p>
      <h2 id={headingId} className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default function LandingSections() {
  return (
    <div className="mt-24 space-y-24 pb-10 sm:mt-32 sm:space-y-32">
      <section aria-labelledby="landing-sources-title">
        <Reveal>
          <SectionHeading
            headingId="landing-sources-title"
            {...landingCopy.sources}
          />
        </Reveal>
        <div className="group relative mt-10 overflow-hidden rounded-2xl border border-indigo-100 bg-white/80 py-5 shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20"
            aria-hidden="true"
          />
          <div className="landing-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-3 px-2 sm:gap-4 sm:px-3"
              >
                {feedbackSources.map((source) => (
                  <li
                    key={source}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm sm:px-5"
                  >
                    {source}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            {landingCopy.sources.footer}
          </p>
        </div>
      </section>

      <section aria-labelledby="landing-features-title">
        <Reveal>
          <SectionHeading
            headingId="landing-features-title"
            {...landingCopy.features}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingFeatures.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="group h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 sm:p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">
                  {landingCopy.features.cardLinkLabel}
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="landing-stats-title"
        className="overflow-hidden rounded-3xl bg-slate-950 px-5 py-10 text-white shadow-xl shadow-indigo-950/10 sm:px-10 sm:py-12"
      >
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                {landingCopy.stats.eyebrow}
              </p>
              <h2
                id="landing-stats-title"
                className="mt-3 max-w-sm text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {landingCopy.stats.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                {landingCopy.stats.description}
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-3">
              {landingStats.map(({ value, suffix, label, detail }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5"
                >
                  <dt className="text-sm font-semibold text-slate-200">{label}</dt>
                  <dd className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                    <CountUp value={value} suffix={suffix} />
                  </dd>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="landing-process-title">
        <Reveal>
          <SectionHeading
            headingId="landing-process-title"
            {...landingCopy.process}
          />
        </Reveal>
        <div className="relative mt-10">
          <div
            className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-indigo-200 via-cyan-300 to-indigo-200 md:block"
            aria-hidden="true"
          />
          <ol className="relative grid gap-4 md:grid-cols-4">
            {workflowSteps.map(({ number, icon: Icon, title, description }, index) => (
              <Reveal key={number} delay={index * 0.08}>
                <li className="relative h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-white shadow-lg shadow-indigo-950/15">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-xs font-bold tracking-[0.18em] text-indigo-600">
                    {landingCopy.process.stepLabel} {number}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="landing-workflows-title">
        <Reveal>
          <SectionHeading
            headingId="landing-workflows-title"
            {...landingCopy.workflows}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {illustrativeWorkflows.map((workflow, index) => (
            <Reveal key={workflow.title} delay={index * 0.07}>
              <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/10">
                <div
                  role="img"
                  aria-label={landingCopy.workflows.previewAlt(workflow.signal)}
                  className={`relative h-48 overflow-hidden bg-gradient-to-br ${workflow.tone} p-5`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.9),transparent_34%)]" />
                  <div className="relative h-full rounded-xl border border-white/80 bg-white/90 p-4 shadow-lg transition-transform duration-500 group-hover:scale-[1.04]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-bold text-slate-800">
                        {workflow.signal}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        {landingCopy.workflows.workspaceLabel}
                      </span>
                    </div>
                    <div className="mt-4 flex h-16 items-end gap-2" aria-hidden="true">
                      {workflow.bars.map((height, barIndex) => (
                        <span
                          key={`${workflow.signal}-${barIndex}`}
                          className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-[10px] text-slate-500">
                        {landingCopy.workflows.themeLabel}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700">
                        {workflow.theme}
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 z-10 bg-indigo-950/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[10px] font-bold text-indigo-800 backdrop-blur">
                    {workflow.label}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {workflow.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {workflow.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">
                    {landingCopy.workflows.previewLabel}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="landing-technology-title">
        <Reveal>
          <SectionHeading
            headingId="landing-technology-title"
            {...landingCopy.technology}
          />
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {technologyStack.map((technology, index) => (
            <Reveal key={technology.name} delay={index * 0.04}>
              <li className="flex h-full min-h-24 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-extrabold text-white">
                  {technology.shortName}
                </span>
                <span>
                  <strong className="block text-sm text-slate-900">
                    {technology.name}
                  </strong>
                  <span className="mt-1 block text-xs leading-4 text-slate-500">
                    {technology.role}
                  </span>
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="landing-perspectives-title">
        <Reveal>
          <SectionHeading
            headingId="landing-perspectives-title"
            {...landingCopy.perspectives}
          />
        </Reveal>
        <div className="mt-10">
          <TeamCarousel />
        </div>
      </section>

      <section aria-labelledby="landing-why-title">
        <Reveal>
          <SectionHeading
            headingId="landing-why-title"
            {...landingCopy.why}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {whyLoopItems.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.07}>
              <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <Icon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="landing-faq-title">
        <Reveal>
          <SectionHeading
            headingId="landing-faq-title"
            {...landingCopy.faq}
          />
        </Reveal>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </section>

      <Reveal>
        <section
          aria-labelledby="landing-cta-title"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-950 px-6 py-10 text-white shadow-2xl shadow-indigo-950/20 sm:px-10 sm:py-14"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-36 right-20 h-72 w-72 rounded-full border border-cyan-200/15"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                {landingCopy.cta.eyebrow}
              </p>
              <h2
                id="landing-cta-title"
                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {landingCopy.cta.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100">
                {landingCopy.cta.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {landingCopy.cta.signup}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {landingCopy.cta.login}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <footer className="border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold tracking-[0.2em] text-slate-900">
              {landingCopy.footer.brandName}
            </p>
            <p className="mt-1 text-xs text-slate-500">{landingCopy.footer.tagline}</p>
          </div>
          <nav aria-label={landingCopy.footer.navLabel}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link className="transition hover:text-indigo-700" href="#landing-features-title">
                  {landingCopy.footer.links[0]}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-indigo-700" href="#landing-process-title">
                  {landingCopy.footer.links[1]}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-indigo-700" href="#landing-faq-title">
                  {landingCopy.footer.links[2]}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-indigo-700" href="/login">
                  {landingCopy.footer.links[3]}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-6 border-t border-slate-200 pt-5 text-xs text-slate-500">
          {landingCopy.footer.copyright}
        </p>
      </footer>

    </div>
  );
}
