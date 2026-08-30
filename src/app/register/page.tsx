"use client";

import Link from "next/link";

const CHARCOAL = "#10151f";
const BORDER   = "#e8dfc8";
const BG       = "#f7f3ea";
const TEXT     = "#10151f";
const MUTED    = "#475569";
const SURFACE  = "#fffdf8";
const GOLD     = "#d6a936";

export default function Register() {
  /*
   * User Registration logic is commented out per project requirements.
   * Authentication is restricted to pre-seeded administrator accounts.
   */

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
                Registration Closed
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#5a4010" }}>
                Public user registration is disabled for this system
              </p>
            </div>

            <div style={{ borderTop: `3px solid ${CHARCOAL}` }} />

            <div className="px-8 py-8 space-y-6 text-center">
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                Access is restricted to pre-seeded administrator accounts. Please log in using your authorized credentials.
              </p>

              <div
                className="rounded border p-4 text-xs text-left space-y-1.5"
                style={{ background: "#fdfbf7", borderColor: BORDER }}
              >
                <p className="font-bold uppercase tracking-wide" style={{ color: CHARCOAL }}>
                  🔑 Seeded Admin Credentials
                </p>
                <div className="font-mono text-[11px] space-y-0.5" style={{ color: MUTED }}>
                  <p><strong>Email:</strong> admin@valuation.gov.np</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-block w-full rounded py-3 text-sm font-bold shadow transition hover:opacity-95"
                style={{ background: CHARCOAL, color: GOLD }}
              >
                Go to Sign In
              </Link>
            </div>
          </div>

          <p className="mt-5 text-center text-xs" style={{ color: MUTED }}>
            Nepal Property Valuation System · Bagmati Province
          </p>
        </div>
      </div>
    </main>
  );
}
