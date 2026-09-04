import Link from "next/link";

const CHARCOAL = "#10151f";
const CHARCOAL2 = "#1d1a16";
const GOLD = "#d6a936";
const BORDER = "#e8dfc8";
const BG = "#f7f3ea";
const MUTED = "#475569";
const SURFACE = "#fffdf8";
const TEXT = "#10151f";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: SURFACE,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96  opacity-30 blur-3xl"
          style={{ background: "#e8c96b" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT */}
            <div>
              {/* Eyebrow */}
              <div
                className="mb-6 inline-flex items-center gap-2  px-4 py-2 text-sm font-semibold"
                style={{
                  background: "#fdf6dc",
                  border: `1px solid #e5c87a`,
                  color: "#8a5a00",
                }}
              >
                <span
                  className="h-2 w-2 "
                  style={{ background: "#c99a20" }}
                />
                Property Valuation System
              </div>

              {/* Heading */}
              <h1
                className="max-w-2xl font-serif text-2xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
                style={{ color: CHARCOAL }}
              >
                Know the real value
                <span className="block" style={{ color: GOLD }}>
                  of your property.
                </span>
              </h1>

              {/* Description */}
              <p
                className="mt-7 max-w-xl text-lg leading-8 sm:text-xl"
                style={{ color: MUTED }}
              >
                Estimate your land and building value using government rates,
                current market rates, depreciation, and future value
                projections.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/valuation"
                  className="bg-gold-gradient inline-flex items-center justify-center  px-7 py-3.5 text-base font-bold shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
                  style={{ color: CHARCOAL }}
                >
                  Start Valuation
                  <span className="ml-2 text-lg">→</span>
                </Link>

                <a
                  href="#how"
                  className="inline-flex items-center justify-center  border px-7 py-3.5 text-base font-semibold transition hover:bg-[#f7f3ea]"
                  style={{
                    borderColor: BORDER,
                    color: CHARCOAL,
                  }}
                >
                  See how it works
                </a>
              </div>

              {/* Trust / highlights */}
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center  text-xs font-bold"
                    style={{
                      background: "#eee4c5",
                      color: "#8a5a00",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: MUTED }}
                  >
                    Land + Building
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center  text-xs font-bold"
                    style={{
                      background: "#eee4c5",
                      color: "#8a5a00",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: MUTED }}
                  >
                    Depreciation included
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center  text-xs font-bold"
                    style={{
                      background: "#eee4c5",
                      color: "#8a5a00",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: MUTED }}
                  >
                    Future value forecast
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — VALUATION PREVIEW */}
            <div className="relative">
              {/* Main card */}
              <div
                className="overflow-hidden  border bg-white shadow-[0_20px_60px_rgba(16,21,31,0.08)]"
                style={{ borderColor: BORDER }}
              >
                {/* Card header */}
                <div
                  className="px-6 py-5 sm:px-7"
                  style={{
                    background:
                      "linear-gradient(135deg, #f5df8c 0%, #d6a936 100%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-[0.18em]"
                        style={{ color: "rgba(16,21,31,0.55)" }}
                      >
                        Valuation Preview
                      </p>

                      <p
                        className="mt-1.5 font-serif text-xl font-bold"
                        style={{ color: CHARCOAL }}
                      >
                        Property Assessment
                      </p>
                    </div>

                    <div
                      className="flex h-10 w-10 items-center justify-center "
                      style={{
                        background: "rgba(255,255,255,0.35)",
                      }}
                    >
                      <span className="text-lg">₹</span>
                    </div>
                  </div>

                  <p className="mt-1 text-sm" style={{ color: "#5a4010" }}>
                    Land + Building · Nepal
                  </p>
                </div>

                {/* Result */}
                <div className="px-6 py-6 sm:px-7">
                  <p className="text-sm font-semibold" style={{ color: MUTED }}>
                    Estimated Property Value
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <span
                      className="font-serif text-4xl font-bold sm:text-5xl"
                      style={{ color: CHARCOAL }}
                    >
                      Rs. 2.45 Cr
                    </span>
                  </div>

                  <p className="mt-1 text-sm" style={{ color: MUTED }}>
                    Based on current rates and property details
                  </p>
                </div>

                {/* Rate breakdown */}
                <div
                  className="mx-6  border sm:mx-7"
                  style={{ borderColor: BORDER }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-4"
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: CHARCOAL }}
                      >
                        Government Rate
                      </p>

                      <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
                        Official reference value
                      </p>
                    </div>

                    <span
                      className=" px-3 py-1 text-sm font-bold"
                      style={{
                        background: "#f7f3ea",
                        color: CHARCOAL,
                      }}
                    >
                      30%
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: CHARCOAL }}
                      >
                        Market Rate
                      </p>

                      <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
                        Current market estimate
                      </p>
                    </div>

                    <span
                      className=" px-3 py-1 text-sm font-bold"
                      style={{
                        background: "#f7f3ea",
                        color: CHARCOAL,
                      }}
                    >
                      70%
                    </span>
                  </div>
                </div>

                {/* Calculation */}
                <div
                  className="mx-6 mt-5  p-4 sm:mx-7"
                  style={{ background: BG }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wide"
                        style={{ color: MUTED }}
                      >
                        Calculation
                      </p>

                      <p
                        className="mt-1.5 font-mono text-sm font-semibold"
                        style={{ color: CHARCOAL }}
                      >
                        30% Govt. + 70% Market
                      </p>
                    </div>

                    <span className="text-xl" style={{ color: GOLD }}>
                      =
                    </span>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-6 sm:p-7">
                  <Link
                    href="/valuation"
                    className="bg-gold-gradient flex w-full items-center justify-center  py-3.5 text-base font-bold transition hover:opacity-90"
                    style={{ color: CHARCOAL }}
                  >
                    Calculate Your Property Value
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              {/* Floating info */}
              <div
                className="absolute -bottom-5 -left-5 hidden  border bg-white px-4 py-3 shadow-lg sm:block"
                style={{ borderColor: BORDER }}
              >
                <p className="text-xs font-semibold" style={{ color: MUTED }}>
                  Forecast period
                </p>

                <p
                  className="mt-0.5 text-lg font-bold"
                  style={{ color: CHARCOAL }}
                >
                  10 years
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section
        id="how"
        style={{
          background: BG,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p
              className="text-sm font-bold uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Simple process
            </p>

            <h2
              className="mt-2 font-serif text-3xl font-bold sm:text-4xl"
              style={{ color: CHARCOAL }}
            >
              From property details to valuation in three steps.
            </h2>

            <p
              className="mt-4 text-base leading-7 sm:text-lg"
              style={{ color: MUTED }}
            >
              Enter the property information, choose how the rates should
              influence the valuation, and review the calculated result.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Enter property details",
                "Add location, land area, government rate, market rate, and building information.",
              ],
              [
                "02",
                "Set the valuation weights",
                "Choose how strongly government and market rates should influence the land valuation.",
              ],
              [
                "03",
                "Review the result",
                "See land value, building value, depreciation, total value, and future projections.",
              ],
            ].map(([num, title, body]) => (
              <div
                key={num}
                className="group relative  border bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-3xl font-bold"
                    style={{ color: GOLD }}
                  >
                    {num}
                  </span>

                  <span
                    className="flex h-9 w-9 items-center justify-center  text-lg transition group-hover:translate-x-1"
                    style={{
                      background: "#f7f3ea",
                      color: CHARCOAL,
                    }}
                  >
                    →
                  </span>
                </div>

                <h3
                  className="mt-8 text-xl font-bold"
                  style={{ color: CHARCOAL }}
                >
                  {title}
                </h3>

                <p
                  className="mt-3 text-base leading-7"
                  style={{ color: MUTED }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Valuation method */}
      <section
        style={{
          background: SURFACE,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p
                className="text-sm font-bold uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                The methodology
              </p>

              <h2
                className="mt-2 font-serif text-3xl font-bold sm:text-4xl"
                style={{ color: CHARCOAL }}
              >
                A transparent approach to property valuation.
              </h2>

              <p
                className="mt-4 text-base leading-7 sm:text-lg"
                style={{ color: MUTED }}
              >
                Every valuation is broken down into understandable components,
                so you can see where the final number comes from.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Land */}
            <div
              className=" border bg-white p-7"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    01
                  </span>

                  <h3
                    className="mt-2 text-2xl font-bold"
                    style={{ color: CHARCOAL }}
                  >
                    Land valuation
                  </h3>
                </div>

                <div
                  className=" px-3 py-2 text-sm font-bold"
                  style={{
                    background: "#f7f3ea",
                    color: CHARCOAL,
                  }}
                >
                  Rate weighted
                </div>
              </div>

              <p className="mt-4 text-base leading-7" style={{ color: MUTED }}>
                Land value is calculated by combining the government-assessed
                rate with the current market rate according to the selected
                valuation weights.
              </p>

              <div
                className="mt-6 overflow-hidden  border"
                style={{ borderColor: BORDER }}
              >
                {[
                  ["Government rate", "30%"],
                  ["Market rate", "70%"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                      borderBottom:
                        index === 0 ? `1px solid ${BORDER}` : undefined,
                    }}
                  >
                    <span className="text-base" style={{ color: MUTED }}>
                      {label}
                    </span>

                    <span
                      className="text-base font-bold"
                      style={{ color: CHARCOAL }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5  p-4" style={{ background: BG }}>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: MUTED }}
                >
                  Example
                </p>

                <p
                  className="mt-2 font-mono text-sm font-semibold"
                  style={{ color: CHARCOAL }}
                >
                  Land Value = Rate × Area
                </p>
              </div>
            </div>

            {/* Building */}
            <div
              className=" border bg-white p-7"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    02
                  </span>

                  <h3
                    className="mt-2 text-2xl font-bold"
                    style={{ color: CHARCOAL }}
                  >
                    Building valuation
                  </h3>
                </div>

                <div
                  className=" px-3 py-2 text-sm font-bold"
                  style={{
                    background: "#f7f3ea",
                    color: CHARCOAL,
                  }}
                >
                  Depreciation
                </div>
              </div>

              <p className="mt-4 text-base leading-7" style={{ color: MUTED }}>
                Building value follows a cost approach and accounts for
                depreciation based on the building's age and useful life.
              </p>

              <div
                className="mt-6 overflow-hidden  border"
                style={{ borderColor: BORDER }}
              >
                {[
                  ["Useful life", "50 years"],
                  ["Scrap value", "10%"],
                  ["Sanitary", "10% of civil cost"],
                  ["Electrical", "8% of civil cost"],
                ].map(([label, value], index, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                      borderBottom:
                        index !== arr.length - 1
                          ? `1px solid ${BORDER}`
                          : undefined,
                    }}
                  >
                    <span className="text-base" style={{ color: MUTED }}>
                      {label}
                    </span>

                    <span
                      className="text-base font-semibold"
                      style={{ color: TEXT }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5  p-4" style={{ background: BG }}>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: MUTED }}
                >
                  Method
                </p>

                <p
                  className="mt-2 text-sm font-semibold"
                  style={{ color: CHARCOAL }}
                >
                  Cost approach + straight-line depreciation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden"
        style={{ background: CHARCOAL }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72  opacity-20 blur-3xl"
          style={{ background: GOLD }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p
                className="text-sm font-bold uppercase tracking-[0.18em]"
                style={{ color: "#e8c96b" }}
              >
                Ready when you are
              </p>

              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
                Find out what your property is worth.
              </h2>

              <p
                className="mt-4 max-w-xl text-base leading-7 sm:text-lg"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Enter your property details and get a clear breakdown of land
                value, building value, depreciation, and future projections.
              </p>
            </div>

            <Link
              href="/valuation"
              className="bg-gold-gradient inline-flex shrink-0 items-center justify-center  px-8 py-4 text-base font-bold transition hover:-translate-y-0.5 hover:opacity-90"
              style={{ color: CHARCOAL }}
            >
              Start Valuation
              <span className="ml-2 text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: CHARCOAL2 }}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Nepal Property Valuation System
              </p>

              <p
                className="mt-1 text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Transparent property valuation · Bagmati Province
              </p>
            </div>

            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              FY 2082/83
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
