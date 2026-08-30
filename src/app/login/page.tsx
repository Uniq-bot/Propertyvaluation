"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const CHARCOAL = "#10151f";
const BORDER   = "#e8dfc8";
const BG       = "#f7f3ea";
const TEXT     = "#10151f";
const MUTED    = "#475569";
const SURFACE  = "#fffdf8";
const GOLD     = "#d6a936";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/valuation";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5" noValidate>
      {/* Error Alert */}
      {error && (
        <div
          className="rounded border px-4 py-3 text-sm font-medium"
          style={{ background: "#fff5f5", borderColor: "#fca5a5", color: "#b91c1c" }}
        >
          {error}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-wide mb-1.5"
          style={{ color: MUTED }}
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
          placeholder="admin@valuation.gov.np"
          className="w-full rounded border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#d6a936]"
          style={{ borderColor: BORDER, background: "#ffffff", color: CHARCOAL }}
        />
      </div>

      {/* Password Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wide"
            style={{ color: MUTED }}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs font-semibold hover:underline"
            style={{ color: MUTED }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          placeholder="••••••••"
          className="w-full rounded border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#d6a936]"
          style={{ borderColor: BORDER, background: "#ffffff", color: CHARCOAL }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded py-3 text-sm font-bold shadow transition hover:opacity-95 disabled:opacity-60 cursor-pointer"
        style={{ background: CHARCOAL, color: GOLD }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: BG, color: TEXT }}>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className="overflow-hidden rounded border shadow-sm"
            style={{ borderColor: BORDER, background: SURFACE }}
          >
            {/* Card header */}
            <div className="bg-gold-gradient px-8 py-6">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(16,21,31,0.6)" }}
              >
                Bagmati Province
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold" style={{ color: CHARCOAL }}>
                Sign in
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#5a4010" }}>
                Enter your credentials to access the valuation system
              </p>
            </div>

            <div style={{ borderTop: `3px solid ${CHARCOAL}` }} />

            <Suspense fallback={<div className="p-8 text-center text-sm">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-5 text-center text-xs" style={{ color: MUTED }}>
            Nepal Property Valuation System · Bagmati Province
          </p>
        </div>
      </div>
    </main>
  );
}
