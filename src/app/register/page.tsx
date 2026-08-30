"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const CHARCOAL = "#10151f";
const GOLD     = "#d6a936";
const BORDER   = "#e8dfc8";
const BG       = "#f7f3ea";
const TEXT     = "#10151f";
const MUTED    = "#475569";
const SURFACE  = "#fffdf8";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Placeholder — swap in your real registration endpoint here
    await new Promise<void>((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/login");
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/valuation" });
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: BG, color: TEXT }}>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div
            className="overflow-hidden rounded border"
            style={{ borderColor: BORDER, background: SURFACE }}
          >
            {/* Card header */}
            <div className="bg-gold-gradient px-8 py-6">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(16,21,31,0.5)" }}
              >
                Bagmati Province
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold" style={{ color: CHARCOAL }}>
                Create account
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#5a4010" }}>
                Register to use the property valuation system
              </p>
            </div>

            <div style={{ borderTop: `3px solid ${CHARCOAL}` }} />

            <form
              onSubmit={handleSubmit}
              className="px-8 py-8 space-y-5"
              noValidate
            >
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: MUTED }}
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Hari Prasad Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded border px-4 py-3 text-sm outline-none transition"
                  style={{ borderColor: BORDER, background: BG, color: TEXT }}
                />
              </div>

              {/* Email */}
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded border px-4 py-3 text-sm outline-none transition"
                  style={{ borderColor: BORDER, background: BG, color: TEXT }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wide"
                    style={{ color: MUTED }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: GOLD }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded border px-4 py-3 text-sm outline-none transition"
                  style={{ borderColor: BORDER, background: BG, color: TEXT }}
                />
              </div>

              {/* Confirm password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold uppercase tracking-wide"
                    style={{ color: MUTED }}
                  >
                    Confirm password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: GOLD }}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded border px-4 py-3 text-sm outline-none transition"
                  style={{ borderColor: BORDER, background: BG, color: TEXT }}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  className="rounded border px-4 py-3 text-sm font-medium"
                  style={{ background: "#fff5f5", borderColor: "#fca5a5", color: "#b91c1c" }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-gold-gradient w-full rounded py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-60"
                style={{ color: CHARCOAL }}
              >
                {loading ? "Creating account…" : "Create account →"}
              </button>

              {/* Divider */}
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: MUTED }}
              >
                <div className="flex-1 border-t" style={{ borderColor: BORDER }} />
                or register with
                <div className="flex-1 border-t" style={{ borderColor: BORDER }} />
              </div>

              {/* Google Register */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded border py-3 text-sm font-semibold transition hover:bg-[#f7f3ea]"
                style={{ borderColor: BORDER, color: CHARCOAL }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {/* Already have account */}
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: MUTED }}
              >
                <div className="flex-1 border-t" style={{ borderColor: BORDER }} />
                already registered?
                <div className="flex-1 border-t" style={{ borderColor: BORDER }} />
              </div>

              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded border py-3 text-sm font-bold transition hover:bg-[#f7f3ea]"
                style={{ borderColor: BORDER, color: CHARCOAL }}
              >
                Sign in instead
              </Link>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
