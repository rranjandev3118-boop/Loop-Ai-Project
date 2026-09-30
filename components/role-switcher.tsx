"use client";

import { useState } from "react";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import { roleMeta, type RoleKey } from "@/lib/role-config";
import { DEMO_USERS } from "@/lib/demo-users";

function responseError(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }
  return fallback;
}

export function RoleSwitcher({
  currentRole,
  userEmail,
  passwordlessDemoSwitch,
}: {
  currentRole: RoleKey;
  userEmail: string;
  passwordlessDemoSwitch: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<RoleKey>(currentRole);
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openConfirmation(role: RoleKey) {
    setTargetRole(role);
    setEmail(passwordlessDemoSwitch ? DEMO_USERS[role].email : "");
    setPassword("");
    setError("");
    setLoading(false);
    setConfirmOpen(true);
  }

  function closeConfirmation() {
    setConfirmOpen(false);
    setEmail(userEmail);
    setPassword("");
    setError("");
    setLoading(false);
  }

  async function handleConfirm() {
    if (!email || (!passwordlessDemoSwitch && !password)) {
      setError(
        passwordlessDemoSwitch
          ? "Select a valid demo account."
          : "Enter the target account's email and password.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/session/role-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, targetRole }),
      });

      if (!response.ok) {
        const payload: unknown = await response.json();
        setError(responseError(payload, "Role access not authorized."));
        return;
      }

      setConfirmOpen(false);
      setOpen(false);
      window.location.replace(
        new URL("/dashboard", window.location.origin).href,
      );
    } catch {
      setError("Unable to verify role access right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
      >
        <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold tracking-[0.2em] ${roleMeta[currentRole].soft}`}>
          {currentRole}
        </span>
        <span>Current role</span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-20 w-[300px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Switch perspective</div>
          {Object.entries(roleMeta).map(([roleKey, meta]) => {
            const role = roleKey as RoleKey;
            const isActive = role === currentRole;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (role !== currentRole) {
                    openConfirmation(role);
                  }
                }}
                className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-slate-200 hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-800">{meta.label}</div>
                  <div className="text-xs text-slate-500">{meta.description}</div>
                </div>
                {isActive && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-switch-title"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">Secure role access</div>
                <h3 id="role-switch-title" className="mt-2 text-xl font-semibold text-slate-900">{roleMeta[targetRole].label} access</h3>
              </div>
              <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] ${roleMeta[targetRole].soft}`}>
                {targetRole}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              {passwordlessDemoSwitch
                ? "Switch to this seeded demo account in your current workspace."
                : "Enter the target account's credentials to switch to its workspace role."}
            </p>

            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="off"
                  readOnly={passwordlessDemoSwitch}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
                />
              </label>
              {!passwordlessDemoSwitch && (
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
                  />
                </label>
              )}
            </div>

            {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={closeConfirmation} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancel</button>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70">
                <ShieldCheck className="h-4 w-4" />
                {loading ? "Switching..." : "Switch role"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
