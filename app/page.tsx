import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Check, Layers, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import LandingSections from "@/components/landing/landing-sections";
import ScrollControls from "@/components/landing/scroll-controls";

export default function Home() {
  return (
    <>
      <ScrollControls />
      <main className="landing-page relative min-h-screen w-full overflow-x-hidden px-4 py-5 sm:px-6 sm:py-8 md:py-10">
      {/* Subtle, GPU-friendly background noise/orbits */}
      <div className="landing-noise" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="landing-orbit landing-orbit-one hidden md:block" aria-hidden="true" />
        <div className="landing-orbit landing-orbit-two hidden md:block" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Navigation Header */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="landing-mark flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md">
              L
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-[0.22em] text-slate-900">LOOP</div>
              <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.28em] text-indigo-600">
                Signal intelligence
              </div>
            </div>
          </div>
          <Link 
            href="/login" 
            className="btn btn-secondary text-xs sm:text-sm font-semibold py-2 px-3.5 sm:px-4 shadow-sm hover:shadow"
          >
            Sign in <span aria-hidden="true" className="ml-1">↗</span>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="mt-8 grid items-center gap-10 sm:mt-12 lg:mt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="landing-eyebrow inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-indigo-700 shadow-sm">
              <span>AI Customer Intelligence</span>
              <span className="landing-live-dot h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500">Live signals</span>
            </div>

            <h1 className="landing-title mt-4 sm:mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
              Make every voice <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">move the product.</span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
              Turn scattered feedback into themes, trends, grounded answers and actionable customer intelligence for every team in your workspace.
            </p>

            <div className="mt-6 sm:mt-8 flex w-full flex-col sm:flex-row sm:w-auto gap-3 sm:gap-4">
              <Link 
                href="/login" 
                className="btn btn-primary w-full sm:w-auto px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Open workspace <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Link>
              <Link 
                href="/signup" 
                className="btn btn-secondary w-full sm:w-auto px-6 py-3 text-sm font-semibold shadow-sm hover:shadow transition-all"
              >
                Create workspace
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[10px]">✓</span>
                <span>Real workspace analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-[10px]">✓</span>
                <span>Grounded AI answers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-[10px]">✓</span>
                <span>Role-based access</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive Preview Stage */}
          <div className="landing-stage relative w-full overflow-visible py-4 sm:py-6" aria-label="Animated preview of workspace intelligence">
            <div className="landing-grid hidden md:block" aria-hidden="true" />
            <div className="landing-ring landing-ring-large hidden md:block" aria-hidden="true" />
            <div className="landing-ring landing-ring-small hidden md:block" aria-hidden="true" />

            {/* Glowing signal points on tablet/desktop */}
            <div className="landing-node landing-node-a hidden md:block" aria-hidden="true"><span>billing</span></div>
            <div className="landing-node landing-node-b hidden md:block" aria-hidden="true"><span>onboarding</span></div>
            <div className="landing-node landing-node-c hidden md:block" aria-hidden="true"><span>retention</span></div>
            <div className="landing-signal-line landing-signal-line-one hidden md:block" aria-hidden="true" />
            <div className="landing-signal-line landing-signal-line-two hidden md:block" aria-hidden="true" />

            {/* Center Intelligence Console */}
            <div className="landing-console relative mx-auto w-full max-w-[380px] rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 text-white shadow-2xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-300">Workspace pulse</div>
                  <div className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">+24.8%</div>
                  <div className="mt-0.5 text-xs text-slate-400">signal momentum · this week</div>
                </div>
                <div className="landing-status flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Uptrend
                </div>
              </div>

              {/* Animated wave bars */}
              <div className="landing-wave mt-5 flex h-14 items-end gap-1.5 border-b border-slate-800 pb-2" aria-hidden="true">
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
                <span className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400" />
              </div>

              {/* 4 Key Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["Total feedback", "128"],
                  ["Negative", "20%"],
                  ["New this week", "15"],
                  ["Top theme", "Billing"],
                ].map(([label, value]) => (
                  <div key={label} className="landing-metric rounded-xl border border-slate-800 bg-slate-800/40 p-2.5">
                    <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                    <strong className="block text-base font-bold text-slate-100">{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsive floating cards */}
            <div className="landing-float-card landing-float-card-top mt-3 sm:mt-0 flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-lg">
              <span className="landing-mini-icon flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold text-sm shadow">✦</span>
              <div>
                <b className="text-xs font-bold text-slate-900">AI found a pattern</b>
                <small className="block text-[10px] text-slate-500">Checkout friction is rising</small>
              </div>
            </div>

            <div className="landing-float-card landing-float-card-bottom mt-2 sm:mt-0 flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-lg">
              <span className="landing-avatar flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs shadow">L</span>
              <div>
                <b className="text-xs font-bold text-slate-900">Grounded answer</b>
                <small className="block text-[10px] text-slate-500">12 sources connected</small>
              </div>
            </div>

          </div>
        </section>
        <LandingSections />
      </div>
      </main>
    </>
  );
}
