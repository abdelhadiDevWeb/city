"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError, login } from "@/lib/api";

function errorMessage(err: unknown): string {
  if (!(err instanceof ApiError)) return "Could not reach the server. Please try again.";
  if (err.status === 400) return "Please enter a valid email and password.";
  if (err.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return err.message;
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-ink" />
        <path d="M9 23V13h4v10zM14.5 23V8h4v15zM20 23v-7h4v7z" className="fill-brand" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">City</span>
    </div>
  );
}

function Skyline() {
  return (
    <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <g className="fill-ink">
        <rect x="0" y="110" width="46" height="70" />
        <rect x="50" y="70" width="38" height="110" />
        <rect x="92" y="95" width="30" height="85" />
        <rect x="126" y="40" width="44" height="140" />
        <rect x="140" y="22" width="16" height="18" />
        <rect x="174" y="85" width="36" height="95" />
        <rect x="214" y="120" width="28" height="60" />
        <rect x="246" y="55" width="50" height="125" />
        <rect x="300" y="100" width="34" height="80" />
        <rect x="338" y="30" width="40" height="150" />
        <rect x="352" y="10" width="12" height="20" />
        <rect x="382" y="90" width="44" height="90" />
        <rect x="430" y="60" width="32" height="120" />
        <rect x="466" y="115" width="40" height="65" />
        <rect x="510" y="75" width="42" height="105" />
        <rect x="556" y="105" width="44" height="75" />
      </g>
      <g className="fill-brand" opacity="0.9">
        {[
          [60, 85], [72, 85], [60, 105], [72, 120],
          [136, 60], [150, 60], [136, 85], [150, 110], [136, 135],
          [258, 70], [276, 70], [258, 100], [276, 125],
          [348, 50], [362, 50], [348, 80], [362, 110], [348, 140],
          [440, 75], [440, 105], [520, 90], [536, 120],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="7" height="9" />
        ))}
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  const inputClass =
    "block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-400 shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";

  return (
    <main className="grid min-h-screen flex-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand text-ink lg:flex lg:flex-col">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative z-10 flex flex-1 flex-col p-12">
          <Logo />
          <div className="mt-auto mb-10 max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Build a better city, together.
            </h2>
            <p className="mt-4 text-base font-medium text-ink/75">
              One secure place to manage everything that keeps the city moving.
            </p>
          </div>
        </div>
        <div className="relative h-48 xl:h-56">
          <Skyline />
        </div>
      </aside>

      <section className="flex flex-col px-6 py-10 sm:px-12">
        <Logo className="text-ink lg:hidden" />

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight text-ink">Sign in</h1>
            <p className="mt-2 text-sm text-stone-500">Enter your details to access your account.</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    maxLength={128}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-400 transition hover:text-brand focus-visible:text-brand focus-visible:outline-none"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                      {showPassword && <path d="M4 4l16 16" strokeLinecap="round" />}
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span aria-hidden className="text-brand transition group-hover:translate-x-0.5">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 lg:text-left">© {new Date().getFullYear()} City. All rights reserved.</p>
      </section>
    </main>
  );
}
