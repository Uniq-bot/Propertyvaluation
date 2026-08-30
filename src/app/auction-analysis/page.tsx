"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatNPR } from "@/lib/functions";
import { Suspense } from "react";

const MIN_RATE  = 50;
const MAX_RATE  = 90;
const DEFAULT_RATE = 70;

const CHARCOAL = "#10151f";
const GOLD     = "#d6a936";
const BRICK    = "#b91c1c";
const BORDER   = "#e8dfc8";
const MUTED    = "#475569";
const FAINT    = "#94a3b8";
const BG       = "#f7f3ea";

interface RateInfo {
  word: string;
  sentence: string;
  color: string;
}

function describeRate(rate: number): RateInfo {
  if (rate <= 60)
    return { word: "Cautious", sentence: "assumes the property sells well under the bank valuation.", color: BRICK };
  if (rate <= 78)
    return { word: "Typical", sentence: "is the middle-of-the-road assumption most auctions land near.", color: GOLD };
  return { word: "Strong", sentence: "assumes the sale comes in close to the full bank valuation.", color: CHARCOAL };
}

const POSITIVE_SIGNALS = [
  { title: "Good road access", detail: "Properties on black-topped or ring-road-adjacent lanes draw more bidders." },
  { title: "South or east facing", detail: "Vastu-compliant orientation is a consistent premium factor in Bagmati auctions." },
  { title: "Clean title & no encumbrance", detail: "A clear lalpurja with no pending disputes removes a major bidder hesitation." },
  { title: "Multiple bidders present", detail: "Competitive auctions regularly exceed the 70–75% baseline." },
  { title: "Commercial zone or mixed-use", detail: "Commercial-zoned land attracts investors and typically recovers more of its book value." },
];

const NEGATIVE_SIGNALS = [
  { title: "Interior or galli plot", detail: "Difficult vehicle access shrinks the buyer pool significantly." },
  { title: "Legal dispute or court stay", detail: "Any pending case on the property scares away most buyers." },
  { title: "Falling or flat local market", detail: "In a slow market even prime locations may clear at 55–60% of valuation." },
  { title: "Forced or short-notice sale", detail: "Less marketing time means fewer bidders and a lower clearing price." },
  { title: "Old or structurally weak building", detail: "Buyers factor in demolition cost, reducing the effective bid." },
];

const OUTCOME_BANDS = [
  { label: "Distressed / litigation", range: "50–60", display: "50–60%", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", note: "Forced sale, disputed title, or very thin bidder turnout." },
  { label: "Below typical",           range: "61–69", display: "61–69%", color: "#c2590a", bg: "#fff7ed", border: "#fed7aa", note: "Weak market conditions or property-specific drawbacks." },
  { label: "Typical outcome",         range: "70–78", display: "70–78%", color: "#8a5a00", bg: "#fdf6dc", border: "#e5c87a", note: "Most bank-initiated auctions in Bagmati clear here." },
  { label: "Strong outcome",          range: "79–90", display: "79–90%", color: "#166534", bg: "#f0fdf4", border: "#bbf7d0", note: "Prime location, clean title, and competitive bidding." },
];

// ── Inner component (reads searchParams) ─────
function AuctionContent() {
  const router        = useRouter();
  const searchParams  = useSearchParams();

  const valuationAmount = Number(searchParams.get("amount") ?? 0);
  const propertyId      = searchParams.get("id") ?? "—";

  const [rate, setRate] = useState(DEFAULT_RATE);

  const estimate = Math.round((valuationAmount * rate) / 100);
  const low      = Math.round((valuationAmount * MIN_RATE) / 100);
  const high     = Math.round((valuationAmount * MAX_RATE) / 100);
  const info     = describeRate(rate);

  if (!valuationAmount) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" style={{ background: BG }}>
        <div className="w-full max-w-sm text-center">
          <p className="font-serif text-lg" style={{ color: CHARCOAL }}>
            There&apos;s no valuation to work from yet.
          </p>
          <p className="mt-2 text-sm" style={{ color: MUTED }}>
            Complete a property valuation first, then come back here.
          </p>
          <button
            type="button"
            onClick={() => router.push("/valuation")}
            className="mt-6 rounded px-5 py-2.5 text-sm font-medium transition"
            style={{ background: CHARCOAL, color: BG }}
          >
            Go to valuation
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: BG, color: CHARCOAL }}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl" style={{ color: CHARCOAL }}>
              Auction estimate
            </h1>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              Based on the completed bank valuation · Bagmati Province
            </p>
          </div>
          <p className="mt-1 shrink-0 font-mono text-xs" style={{ color: FAINT }}>
            {propertyId}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">

          {/* LEFT — estimate + bands */}
          <div className="space-y-5">

            {/* Estimate card */}
            <div className="rounded border bg-white p-6" style={{ borderColor: BORDER }}>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: MUTED }}>Bank valuation</span>
                <span className="font-semibold" style={{ color: CHARCOAL }}>
                  {formatNPR(valuationAmount)}
                </span>
              </div>

              <div className="my-5 h-px" style={{ background: BORDER }} />

              <label htmlFor="rate" className="block text-sm" style={{ color: MUTED }}>
                If it sells at{" "}
                <span className="font-semibold" style={{ color: CHARCOAL }}>{rate}%</span>{" "}
                of that valuation
              </label>

              <input
                id="rate"
                type="range"
                min={MIN_RATE}
                max={MAX_RATE}
                step={5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ accentColor: GOLD }}
                className="mt-3 w-full cursor-pointer"
                aria-valuetext={`${rate} percent`}
              />
              <div className="mt-1 flex justify-between text-xs" style={{ color: FAINT }}>
                <span>{MIN_RATE}% · distressed</span>
                <span>{MAX_RATE}% · strong</span>
              </div>

              <div className="mt-7 text-center">
                <p className="font-serif text-5xl leading-none" style={{ color: info.color }}>
                  {formatNPR(estimate)}
                </p>
                <p className="mt-3 text-sm" style={{ color: MUTED }}>
                  <span className="font-semibold" style={{ color: info.color }}>
                    {info.word} estimate
                  </span>{" "}
                  — {info.sentence}
                </p>
              </div>

              <div
                className="mt-6 grid grid-cols-2 divide-x border-t pt-5 text-center text-xs"
                style={{ borderColor: BORDER }}
              >
                <div className="pr-4">
                  <p style={{ color: FAINT }}>Lowest likely</p>
                  <p className="mt-1 font-mono text-sm font-semibold" style={{ color: BRICK }}>
                    {formatNPR(low)}
                  </p>
                </div>
                <div className="pl-4">
                  <p style={{ color: FAINT }}>Highest likely</p>
                  <p className="mt-1 font-mono text-sm font-semibold" style={{ color: "#166534" }}>
                    {formatNPR(high)}
                  </p>
                </div>
              </div>
            </div>

            {/* Outcome bands */}
            <div>
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: FAINT }}
              >
                Typical outcome ranges
              </p>
              <div className="space-y-2">
                {OUTCOME_BANDS.map((band) => {
                  const [lo, hi] = band.range.split("–").map(Number);
                  const inBand   = rate >= lo && rate <= hi;
                  return (
                    <div
                      key={band.label}
                      className="flex items-center gap-3 rounded border p-3.5 transition-all"
                      style={{
                        borderColor: inBand ? band.border : BORDER,
                        background:  inBand ? band.bg     : "white",
                      }}
                    >
                      <span
                        className="shrink-0 rounded px-2 py-0.5 font-mono text-xs font-bold"
                        style={{ background: band.bg, color: band.color, border: `1px solid ${band.border}` }}
                      >
                        {band.display}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: inBand ? band.color : CHARCOAL }}
                        >
                          {band.label}
                        </p>
                        <p className="text-xs leading-4 mt-0.5" style={{ color: MUTED }}>
                          {band.note}
                        </p>
                      </div>
                      {inBand && (
                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold"
                          style={{ background: band.bg, color: band.color, border: `1px solid ${band.border}` }}
                        >
                          ← now
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How it works */}
            <details
              className="rounded border bg-white open:pb-4"
              style={{ borderColor: BORDER }}
            >
              <summary
                className="cursor-pointer select-none px-5 py-4 text-sm font-medium"
                style={{ color: CHARCOAL }}
              >
                How auction pricing works in Nepal
              </summary>
              <div className="space-y-3 px-5 text-sm leading-6" style={{ color: MUTED }}>
                <p>
                  In Nepal, bank-initiated auctions (lelam) are governed by the Bank and
                  Financial Institution Act. The bank sets a minimum bid price — typically
                  80–90% of the valuation — but the actual clearing price depends entirely
                  on how many buyers show up and how competitive the bidding is.
                </p>
                <p>
                  If the first auction gets no bids, the bank reduces the reserve price and
                  re-auctions. Properties can go through two or three rounds before clearing,
                  each time at a lower price. This is why distressed properties sometimes
                  sell at 50–55% of valuation.
                </p>
                <p>
                  The 70–75% band is the most common result for a standard residential
                  property with a clean title in Bagmati Province.
                </p>
              </div>
            </details>
          </div>

          {/* RIGHT — signals */}
          <div className="space-y-5">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  What pushes the price up
                </p>
              </div>
              <div className="space-y-2">
                {POSITIVE_SIGNALS.map((s) => (
                  <div
                    key={s.title}
                    className="rounded border bg-white p-4"
                    style={{ borderColor: BORDER, borderLeft: "3px solid #22c55e" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>
                      {s.title}
                    </p>
                    <p className="mt-1 text-xs leading-5" style={{ color: MUTED }}>
                      {s.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  What pulls the price down
                </p>
              </div>
              <div className="space-y-2">
                {NEGATIVE_SIGNALS.map((s) => (
                  <div
                    key={s.title}
                    className="rounded border bg-white p-4"
                    style={{ borderColor: BORDER, borderLeft: "3px solid #ef4444" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>
                      {s.title}
                    </p>
                    <p className="mt-1 text-xs leading-5" style={{ color: MUTED }}>
                      {s.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer row */}
        <div className="mt-8 flex items-start justify-between gap-6">
          <p className="text-xs italic leading-5" style={{ color: FAINT }}>
            Planning assumptions only — not a guarantee or professional valuation opinion.
            Actual results depend on market conditions, legal status, and buyer turnout.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="shrink-0 text-sm font-medium underline underline-offset-4 transition"
            style={{ color: MUTED, textDecorationColor: BORDER }}
          >
            ← Back
          </button>
        </div>

      </div>
    </main>
  );
}

// ── Page export (wraps in Suspense for useSearchParams) ──
export default function AuctionAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: BG }}>
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e8dfc8] border-t-[#d6a936]" />
        </div>
      }
    >
      <AuctionContent />
    </Suspense>
  );
}
