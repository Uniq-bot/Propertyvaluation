"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatNPR } from "@/lib/functions";
import type { YearProjection, InflationResponse } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface InflationChartProps {
  initialAmount?: number;
  buildingValue?: number;
}

const CHARCOAL = "#10151f";
const GOLD     = "#d6a936";
const BORDER   = "#e8dfc8";
const MUTED    = "#475569";

const PRESET_RATES = [
  { label: "Conservative", value: 3 },
  { label: "Standard", value: 5 },
  { label: "Moderate", value: 8 },
  { label: "High growth", value: 12 },
] as const;

export default function InflationChart({
  initialAmount = 10_000_000,
  buildingValue = 0,
}: InflationChartProps) {
  const [inflationRate, setInflationRate] = useState<number>(5);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [projectionData, setProjectionData] = useState<YearProjection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(false);

  const [prevInitialAmount, setPrevInitialAmount] = useState<number>(initialAmount);
  if (initialAmount !== prevInitialAmount) {
    setPrevInitialAmount(initialAmount);
    if (!isCustomAmount) {
      setAmount(initialAmount);
    }
  }

  // Fetch land value inflation projection from the Next.js API route
  useEffect(() => {
    let mounted = true;

    const fetchInflation = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/inflation/${inflationRate}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentAmount: amount }),
        });

        if (!res.ok) throw new Error("Failed to fetch inflation projection.");

        const data: InflationResponse = await res.json();
        if (mounted) setProjectionData(data.years ?? []);
      } catch (err: unknown) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Error loading projection.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchInflation();
    return () => { mounted = false; };
  }, [inflationRate, amount]);

  const firstYearVal = projectionData[0]?.amount ?? amount;
  const lastYearVal  = projectionData.at(-1)?.amount ?? amount;
  const totalGrowth  = lastYearVal - firstYearVal;
  const totalGrowthPct =
    firstYearVal > 0 ? ((totalGrowth / firstYearVal) * 100).toFixed(1) : "0";
  const finalYearLabel = projectionData.at(-1)?.year ?? new Date().getFullYear() + 10;

  const chartData = {
    labels: projectionData.map((d) => `Year ${d.year}`),
    datasets: [
      {
        label: "Projected land value (NPR)",
        data: projectionData.map((d) => d.amount),
        borderColor: GOLD,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(214,169,54,0.18)");
          gradient.addColorStop(1, "rgba(214,169,54,0.00)");
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: GOLD,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: CHARCOAL,
        titleColor: "rgba(255,255,255,0.5)",
        bodyColor: "#f7f3ea",
        borderColor: GOLD,
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "PoppinsBlack", size: 11, weight: "bold" as const },
        bodyFont:  { family: "Source Sans 3, sans-serif", size: 13, weight: "bold" as const },
        callbacks: {
          title:  (items: TooltipItem<"line">[]) => items[0]?.label ?? "",
          label:  (item: TooltipItem<"line">) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency", currency: "NPR", maximumFractionDigits: 0,
            }).format(item.parsed.y ?? 0),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: MUTED, font: { family: "Source Sans 3, sans-serif", size: 11 }, maxRotation: 0 },
      },
      y: {
        grid: { color: BORDER },
        border: { display: false, dash: [4, 4] as number[] },
        ticks: {
          color: MUTED,
          font: { family: "Source Sans 3, sans-serif", size: 11 },
          callback: (value: number | string) => {
            const n = Number(value);
            if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
            if (n >= 100_000)    return `${(n / 100_000).toFixed(1)}L`;
            return `${(n / 1000).toFixed(0)}K`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: MUTED }}>
        Land tends to gain value over time; the building doesn&apos;t. Pick a growth rate
        that fits this area and we&apos;ll project the land&apos;s value forward, year by year.
      </p>

      {/* Controls */}
      <div
        className="grid gap-6 rounded border bg-white p-5 sm:p-6 lg:grid-cols-2"
        style={{ borderColor: BORDER }}
      >
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide"
            style={{ color: MUTED }}
          >
            Yearly growth rate
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_RATES.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setInflationRate(preset.value)}
                className="rounded border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  borderColor: inflationRate === preset.value ? GOLD : BORDER,
                  backgroundColor: inflationRate === preset.value ? GOLD : "white",
                  color: inflationRate === preset.value ? CHARCOAL : MUTED,
                }}
              >
                {preset.label} · {preset.value}%
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer"
              style={{ accentColor: GOLD }}
              aria-label="Fine-tune growth rate"
            />
            <span
              className="w-14 shrink-0 text-right font-mono text-sm font-semibold"
              style={{ color: CHARCOAL }}
            >
              {inflationRate}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              className="block text-xs font-semibold uppercase tracking-wide"
              style={{ color: MUTED }}
            >
              Starting land value
            </label>
            {isCustomAmount && (
              <button
                type="button"
                onClick={() => { setIsCustomAmount(false); setAmount(initialAmount); }}
                className="text-xs font-medium underline decoration-[#e8dfc8] underline-offset-4"
                style={{ color: CHARCOAL }}
              >
                Reset to calculated value
              </button>
            )}
          </div>

          <div
            className="mt-3 flex items-center gap-2 rounded border px-3"
            style={{ borderColor: BORDER }}
          >
            <span className="text-xs font-semibold" style={{ color: MUTED }}>NPR</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setIsCustomAmount(true); setAmount(Number(e.target.value)); }}
              className="w-full bg-transparent py-2.5 font-mono text-sm font-semibold outline-none"
              style={{ color: CHARCOAL }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: "#94a3b8" }}>
            {isCustomAmount
              ? "Using a custom starting value instead of the calculated land value."
              : "This is the land value from the valuation — the building's value isn't included."}
          </p>
        </div>
      </div>

      {/* Headline projection */}
      <div
        className="rounded border-2 p-6 text-center sm:p-7"
        style={{ borderColor: CHARCOAL, backgroundColor: "#fff" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: MUTED }}
        >
          Projected land value in {finalYearLabel}
        </p>
        <p className="mt-2 font-[PoppinsBlack] text-4xl sm:text-5xl" style={{ color: CHARCOAL }}>
          {formatNPR(lastYearVal)}
        </p>
        <p className="mt-2 text-sm" style={{ color: "#10151f" }}>
          up {formatNPR(totalGrowth)} ({totalGrowthPct}%) from {formatNPR(firstYearVal)} today
        </p>

        {buildingValue > 0 && (
          <p
            className="mt-4 border-t pt-4 text-sm"
            style={{ borderColor: BORDER, color: MUTED }}
          >
            Add the building&apos;s fixed value of{" "}
            <span className="font-semibold" style={{ color: CHARCOAL }}>
              {formatNPR(buildingValue)}
            </span>{" "}
            and the whole property would be worth about{" "}
            <span className="font-semibold" style={{ color: CHARCOAL }}>
              {formatNPR(lastYearVal + buildingValue)}
            </span>{" "}
            in {finalYearLabel}.
          </p>
        )}
      </div>

      {/* Chart */}
      <div
        className="relative rounded border bg-white p-4 sm:p-6"
        style={{ borderColor: BORDER }}
      >
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-serif text-base" style={{ color: CHARCOAL }}>
              Growth curve
            </h3>
            <p className="text-xs" style={{ color: MUTED }}>
              Compounding at {inflationRate}% a year through {finalYearLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="self-start rounded border px-3 py-1.5 text-xs font-semibold transition hover:bg-[#f7f3ea] sm:self-auto"
            style={{ borderColor: BORDER, color: CHARCOAL }}
          >
            {showTable ? "Hide year-by-year table" : "See year-by-year table"}
          </button>
        </div>

        {error && (
          <div
            className="mb-4 rounded border border-[#E9C9C0] bg-[#FBF1EE] p-3 text-xs"
            style={{ color: "#9B5142" }}
          >
            {error}
          </div>
        )}

        <div className="relative h-[320px] w-full">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-xs">
              <div
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: CHARCOAL }}
              >
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2"
                  style={{ borderColor: `${GOLD}55`, borderTopColor: GOLD }}
                />
                Working it out…
              </div>
            </div>
          )}
          {projectionData.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div
              className="flex h-full items-center justify-center text-sm"
              style={{ color: "#94a3b8" }}
            >
              No projection available yet.
            </div>
          )}
        </div>
      </div>

      {/* Year-by-year table */}
      {showTable && projectionData.length > 0 && (
        <div
          className="overflow-x-auto rounded border bg-white"
          style={{ borderColor: BORDER }}
        >
          <table className="w-full text-left text-xs">
            <thead
              className="border-b font-semibold uppercase tracking-wider"
              style={{ borderColor: BORDER, color: MUTED }}
            >
              <tr>
                <th className="px-4 py-2.5">Year</th>
                <th className="px-4 py-2.5 text-right">Projected land value</th>
                {buildingValue > 0 && (
                  <th className="px-4 py-2.5 text-right">Est. total property value</th>
                )}
                <th className="px-4 py-2.5 text-right">Growth from base</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: BORDER }}>
              {projectionData.map((item, idx) => {
                const growthFromBase = item.amount - firstYearVal;
                const pctFromBase =
                  firstYearVal > 0
                    ? ((growthFromBase / firstYearVal) * 100).toFixed(1)
                    : "0";

                return (
                  <tr key={item.year}>
                    <td
                      className="px-4 py-2.5 font-semibold"
                      style={{ color: CHARCOAL }}
                    >
                      {item.year} {idx === 0 ? "(base)" : `(+${idx} yr)`}
                    </td>
                    <td
                      className="px-4 py-2.5 text-right font-mono font-semibold"
                      style={{ color: CHARCOAL }}
                    >
                      {formatNPR(item.amount)}
                    </td>
                    {buildingValue > 0 && (
                      <td
                        className="px-4 py-2.5 text-right font-mono font-semibold"
                        style={{ color: CHARCOAL }}
                      >
                        {formatNPR(item.amount + buildingValue)}
                      </td>
                    )}
                    <td
                      className="px-4 py-2.5 text-right font-semibold"
                      style={{ color: idx === 0 ? MUTED : CHARCOAL }}
                    >
                      {idx === 0
                        ? "Base"
                        : `+${formatNPR(growthFromBase)} (${pctFromBase}%)`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
