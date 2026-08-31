import Link from "next/link";

const CHARCOAL  = "#10151f";
const CHARCOAL2 = "#1d1a16";
const GOLD      = "#d6a936";
const BORDER    = "#e8dfc8";
const BG        = "#f7f3ea";
const MUTED     = "#475569";
const SURFACE   = "#fffdf8";
const TEXT      = "#10151f";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>

      {/* Hero */}
      <section style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            <div>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                style={{ background: "#fdf6dc", border: `1px solid #e5c87a`, color: "#8a5a00" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Assessment System Active
              </div>

              <h2
                className="font-serif text-4xl font-bold leading-tight sm:text-5xl"
                style={{ color: CHARCOAL }}
              >
                Calculate property<br />value accurately.
              </h2>

              <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: MUTED }}>
                Land and building valuation using government and market rates,
                straight-line depreciation, and a 10-year inflation forecast.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/valuation"
                  className="bg-gold-gradient rounded px-7 py-3 text-base font-bold transition hover:opacity-90"
                  style={{ color: CHARCOAL }}
                >
                  Begin Valuation →
                </Link>
                <a
                  href="#how"
                  className="rounded border px-7 py-3 text-base font-semibold transition hover:bg-[#f7f3ea]"
                  style={{ borderColor: BORDER, color: MUTED }}
                >
                  How it works
                </a>
              </div>

              {/* Key figures */}
              <div
                className="mt-10 inline-grid grid-cols-3 divide-x rounded border"
                style={{ borderColor: BORDER }}
              >
                {(
                  [
                    ["30:70", "Govt. / Market weight"],
                    ["50 yrs", "Building useful life"],
                    ["10 yrs", "Inflation forecast"],
                  ] as [string, string][]
                ).map(([val, label]) => (
                  <div key={label} className="px-5 py-4">
                    <p className="font-serif text-2xl font-bold" style={{ color: CHARCOAL }}>
                      {val}
                    </p>
                    <p className="mt-0.5 text-sm" style={{ color: MUTED }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div
              className="overflow-hidden rounded border"
              style={{ borderColor: BORDER }}
            >
              <div className="bg-gold-gradient px-6 py-5">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "rgba(16,21,31,0.55)" }}
                >
                  Valuation Preview
                </p>
                <p className="mt-1.5 font-serif text-xl font-bold" style={{ color: CHARCOAL }}>
                  Property Assessment
                </p>
                <p className="text-sm" style={{ color: "#5a4010" }}>
                  Land + Building · Bagmati Province
                </p>
              </div>

              <div style={{ borderTop: `3px solid ${CHARCOAL}` }}>
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Government Rate
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ color: CHARCOAL }}>
                      30% weight
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Market Rate
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ color: CHARCOAL }}>
                      70% weight
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Building
                    </p>
                    <p className="mt-1 text-base font-semibold" style={{ color: TEXT }}>
                      Cost Approach
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Depreciation
                    </p>
                    <p className="mt-1 text-base font-semibold" style={{ color: TEXT }}>
                      Straight-Line
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5" style={{ background: BG }}>
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: MUTED }}
                  >
                    Formula
                  </p>
                  <p
                    className="mt-2 font-mono text-sm font-semibold"
                    style={{ color: CHARCOAL }}
                  >
                    (0.30 × Govt.) + (0.70 × Market)
                  </p>
                </div>
              </div>

              <div className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <Link
                  href="/valuation"
                  className="bg-gold-gradient flex w-full items-center justify-center gap-2 rounded py-3 text-sm font-bold transition hover:opacity-90"
                  style={{ color: CHARCOAL }}
                >
                  Calculate Property Value →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-serif text-2xl font-bold" style={{ color: CHARCOAL }}>
            How it works
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {(
              [
                ["01", "Enter details", "Location, land area, government rate, market rate, and optional building info."],
                ["02", "Calculate", "System blends rates (40:60), applies depreciation, and computes total value."],
                ["03", "Review results", "Land value, building value, depreciation breakdown, and 10-year inflation chart."],
              ] as [string, string, string][]
            ).map(([num, title, body]) => (
              <div
                key={num}
                className="rounded border bg-white p-6"
                style={{ borderColor: BORDER, borderTop: `3px solid ${GOLD}` }}
              >
                <span className="font-mono text-2xl font-bold" style={{ color: GOLD }}>
                  {num}
                </span>
                <h3 className="mt-4 text-lg font-bold" style={{ color: CHARCOAL }}>
                  {title}
                </h3>
                <p className="mt-2 text-base" style={{ color: MUTED }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation method */}
      <section style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-serif text-2xl font-bold" style={{ color: CHARCOAL }}>
            Valuation method
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-lg font-bold" style={{ color: CHARCOAL }}>Land</h3>
              <p className="mt-1 text-base" style={{ color: MUTED }}>
                Weighted average of government and market rate.
              </p>
              <div className="mt-4 divide-y rounded border" style={{ borderColor: BORDER }}>
                {(
                  [["Government rate", "30%"], ["Market rate", "70%"]] as [string, string][]
                ).map(([l, v]) => (
                  <div key={l} className="flex justify-between px-4 py-3">
                    <span className="text-base" style={{ color: MUTED }}>{l}</span>
                    <span className="text-base font-bold" style={{ color: CHARCOAL }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-lg font-bold" style={{ color: CHARCOAL }}>Building</h3>
              <p className="mt-1 text-base" style={{ color: MUTED }}>
                Cost approach with straight-line depreciation.
              </p>
              <div className="mt-4 divide-y rounded border" style={{ borderColor: BORDER }}>
                {(
                  [
                    ["Useful life", "50 years"],
                    ["Scrap value", "10%"],
                    ["Sanitary", "10% of civil cost"],
                    ["Electrical", "8% of civil cost"],
                  ] as [string, string][]
                ).map(([l, v]) => (
                  <div key={l} className="flex justify-between px-4 py-3">
                    <span className="text-base" style={{ color: MUTED }}>{l}</span>
                    <span className="text-base font-semibold" style={{ color: TEXT }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: CHARCOAL }}>
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Ready to begin?</h2>
            <p className="mt-1 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              Enter property details and get the valuation in minutes.
            </p>
          </div>
          <Link
            href="/valuation"
            className="bg-gold-gradient shrink-0 rounded px-8 py-3 text-base font-bold transition hover:opacity-90"
            style={{ color: CHARCOAL }}
          >
            Launch Calculator →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: CHARCOAL2 }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Nepal Property Valuation System · Bagmati Province
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.22)" }}>
            FY 2082/83
          </p>
        </div>
      </footer>

    </main>
  );
}
