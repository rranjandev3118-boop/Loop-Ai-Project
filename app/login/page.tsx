"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { DEMO_USERS, getDemoEmail } from "@/lib/demo-users";

const roles = [
  { 
    key: "ADMIN", 
    label: "Admin Access", 
    shortLabel: "Admin",
    note: "Full workspace control", 
    accent: "bg-violet-500/10 text-violet-700 border-violet-200",
    activeClass: "border-violet-500 bg-violet-50/90 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
  },
  { 
    key: "ANALYST", 
    label: "Analyst Access", 
    shortLabel: "Analyst",
    note: "Feedback & analysis", 
    accent: "bg-sky-500/10 text-sky-700 border-sky-200",
    activeClass: "border-sky-500 bg-sky-50/90 text-sky-900 ring-2 ring-sky-500/20 shadow-sm"
  },
  { 
    key: "VIEWER", 
    label: "Viewer Access", 
    shortLabel: "Viewer",
    note: "Read-only insights", 
    accent: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    activeClass: "border-emerald-500 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm"
  }
] as const;

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]["key"]>("ADMIN");
  const [email, setEmail] = useState(DEMO_USERS.ADMIN.email);
  const [password, setPassword] = useState("LoopDemo123!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!resendSeconds) return;
    const timer = window.setInterval(() => setResendSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  function fillDemoRole(role: (typeof roles)[number]["key"]) {
    setSelectedRole(role);
    setEmail(getDemoEmail(role));
    setPassword("LoopDemo123!");
  }

  async function resendOtp() {
    if (resendSeconds || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to resend the code");
      setResendSeconds(60);
      setError(data.delivery === "development-console"
        ? "Development mode: no email was sent. Use the code printed in the server terminal."
        : "A new verification code was sent.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Unable to resend the code");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent) {
    if (loading) return;
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (otpRequired) {
        const verifyResponse = await fetch("/api/auth/login/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, targetRole: selectedRole })
        });
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) throw new Error(verifyData.error || "Unable to verify the code");
      } else {
        const requestResponse = await fetch("/api/auth/login/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, targetRole: selectedRole })
        });
        const requestData = await requestResponse.json();
        if (!requestResponse.ok) throw new Error(requestData.error || "Invalid credentials or role mismatch.");
        if (requestData.requiresOtp) {
          setOtpRequired(true);
          setResendSeconds(60);
          setError(requestData.delivery === "development-console"
            ? "Development mode: no email was sent. Use the code printed in the server terminal."
            : "Verification code sent successfully. Check your email.");
          return;
        }
      }
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        targetRole: selectedRole,
        redirect: false
      });

      if (result?.ok) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setError("Invalid credentials or role mismatch.");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 md:py-12">
      {/* Lightweight background ambient glow */}
      <div className="login-particles" aria-hidden="true" />
      <div className="login-orbit login-orbit-one hidden md:block" aria-hidden="true" />
      <div className="login-orbit login-orbit-two hidden md:block" aria-hidden="true" />

      {/* Main Responsive Container: w-full max-w-4xl grid-cols-1 md:grid-cols-2 */}
      <div className="login-shell relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl transition-all duration-300 md:grid-cols-2 md:rounded-[32px] md:shadow-2xl">
        
        {/* Left Side: Visual Brand Panel */}
        <div className="login-visual relative flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-8 md:min-h-[580px] md:p-10">
          <div className="login-visual-grid hidden md:block" aria-hidden="true" />
          
          <div>
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-[0.2em] text-white">
                <span className="login-mark flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 font-bold text-white shadow-md">L</span>
                <span>LOOP</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </span>
            </div>

            <div className="login-visual-copy mt-6 md:mt-14">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-indigo-300">Secure Access</div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl md:leading-tight">
                Your customer signal, in focus.
              </h1>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                Every role is strictly verified before it can affect customer data, analytics, or administrative workspace controls.
              </p>
            </div>
          </div>

          {/* Role Cards preview - visible on desktop and tablet */}
          <div className="mt-6 hidden space-y-2.5 md:block">
            {roles.map((role) => (
              <div 
                key={role.key} 
                onClick={() => fillDemoRole(role.key)}
                className={`login-role-card cursor-pointer rounded-xl border p-3 transition-all ${
                  selectedRole === role.key 
                    ? "border-indigo-400 bg-white/15 shadow-md" 
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">{role.label}</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">{role.key}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-slate-300">{role.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>End-to-end encrypted tenant isolation</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="login-form-panel flex flex-col justify-center bg-white p-6 sm:p-8 md:p-10">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-indigo-600">Workspace Login</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${roles.find((r) => r.key === selectedRole)?.accent}`}>
                {selectedRole}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Enter workspace</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Select your access role to proceed</p>
          </div>

          {/* Interactive Role Switcher Pills */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {roles.map((role) => {
              const active = selectedRole === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => fillDemoRole(role.key)}
                  className={`login-role-select flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all sm:p-3 ${
                    active ? role.activeClass : "border-slate-200 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xs font-bold sm:text-sm">{role.shortLabel}</span>
                  <span className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">{role.note.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 sm:text-xs">
                Email address
              </label>
              <input
                className="input mt-1 w-full text-base sm:text-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={otpRequired}
                required
                type="email"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 sm:text-xs">
                  Password
                </label>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full pr-11 text-base sm:text-sm"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {otpRequired && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Verification Code (OTP)
                </label>
                <input
                  className="input mt-1 tracking-[0.35em] text-center font-mono text-base font-bold sm:text-sm"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  required
                />
              </div>
            )}

            {error && (
              <div className={`rounded-xl border p-3 text-xs sm:text-sm ${
                error.includes("sent successfully") ||
                error.includes("Development mode")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800" 
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : otpRequired ? (
                "Verify and Sign In"
              ) : (
                <span className="inline-flex items-center gap-2">
                  Continue as {selectedRole} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>

            {otpRequired && (
              <button
                type="button"
                onClick={() => void resendOtp()}
                disabled={loading || resendSeconds > 0}
                className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-500 disabled:text-slate-400"
              >
                {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : "Resend OTP"}
              </button>
            )}
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-600">Demo:</span>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">{email}</code>
              </div>
              <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                Create workspace →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
