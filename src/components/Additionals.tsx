"use client";

import { formatNPR, formatPercent } from "@/lib/functions";

const CHARCOAL = "#10151f";
const GOLD     = "#d6a936";
const BORDER   = "#e8dfc8";
const TEXT     = "#10151f";
const MUTED    = "#475569";
const FAINT    = "#64748b";
const BG       = "#f7f3ea";

// ── Field (text input) ──────────────────────

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function Field({
  label,
  value,
  placeholder = "Enter value",
  disabled = false,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: MUTED }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded border bg-white px-3 py-2.5 text-base outline-none transition disabled:cursor-not-allowed"
        style={{
          borderColor: BORDER,
          color: disabled ? FAINT : TEXT,
          backgroundColor: disabled ? BG : "white",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
      />
    </div>
  );
}

// ── MoneyField ──────────────────────────────

interface MoneyFieldProps {
  label: string;
  value: number;
  suffix?: string;
  placeholder?: string;
  onChange: (value: number) => void;
}

export function MoneyField({
  label,
  value,
  suffix,
  placeholder,
  onChange,
}: MoneyFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: MUTED }}>
        {label}
      </label>
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
          style={{ color: MUTED }}
        >
          Rs.
        </span>
        <input
          type="number"
          value={value === 0 ? "" : value}
          placeholder={placeholder ?? "0"}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded border bg-white py-2.5 pl-10 pr-16 text-base outline-none transition"
          style={{ borderColor: BORDER, color: TEXT }}
          onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
          onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
        />
        {suffix && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: FAINT }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ── MoneyFieldInline ────────────────────────

interface MoneyFieldInlineProps {
  value: number;
  placeholder?: string;
  onChange: (value: number) => void;
}

export function MoneyFieldInline({ value, placeholder, onChange }: MoneyFieldInlineProps) {
  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
        style={{ color: MUTED }}
      >
        Rs.
      </span>
      <input
        type="number"
        value={value === 0 ? "" : value}
        placeholder={placeholder ?? "0"}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full min-w-[160px] rounded border bg-white py-2.5 pl-10 pr-3 text-right text-base outline-none transition"
        style={{ borderColor: BORDER, color: TEXT }}
        onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
      />
    </div>
  );
}

// ── WeightValue ─────────────────────────────

export function WeightValue({ value }: { value: number }) {
  return (
    <span
      className="whitespace-nowrap rounded px-2.5 py-1 text-sm font-bold"
      style={{ background: "#fdf6dc", color: "#8a5a00", border: "1px solid #e5c87a" }}
    >
      {formatPercent(value)} weight
    </span>
  );
}

// ── InfoBox ─────────────────────────────────

export function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border px-4 py-3" style={{ borderColor: BORDER, background: BG }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="mt-1 text-base font-semibold" style={{ color: TEXT }}>
        {value}
      </p>
    </div>
  );
}

// ── SummaryAmount ───────────────────────────

export function SummaryAmount({
  label,
  value,
  border = false,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div className={`p-4 ${border ? "border-l" : ""}`} style={{ borderColor: BORDER }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="mt-1 break-words text-base font-bold" style={{ color: TEXT }}>
        {value}
      </p>
    </div>
  );
}

// ── LandRow ─────────────────────────────────

export function LandRow({
  index,
  label,
  rate,
  weight,
}: {
  index: number;
  label: string;
  rate: number;
  weight: number;
}) {
  return (
    <tr>
      <td className="border px-4 py-3 text-base" style={{ borderColor: BORDER, color: FAINT }}>
        {index}
      </td>
      <td className="border px-4 py-3 text-base font-medium" style={{ borderColor: BORDER }}>
        {label}
      </td>
      <td className="border px-4 py-3 text-right text-base" style={{ borderColor: BORDER }}>
        {formatNPR(rate)}
      </td>
      <td className="border px-4 py-3 text-right text-base" style={{ borderColor: BORDER }}>
        {formatPercent(weight)}
      </td>
      <td
        className="border px-4 py-3 text-right text-base font-bold"
        style={{ borderColor: BORDER, color: CHARCOAL }}
      >
        {formatNPR(rate * weight)}
      </td>
    </tr>
  );
}

// ── ValueSummary ────────────────────────────

export function ValueSummary({
  label,
  value,
  strong = false,
  right = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  right?: boolean;
}) {
  return (
    <div
      className={`p-4 ${right ? "border-t sm:border-l sm:border-t-0" : ""}`}
      style={{ borderColor: BORDER }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </p>
      <p
        className={`mt-1 ${strong ? "text-xl font-bold" : "text-lg font-semibold"}`}
        style={{ color: strong ? CHARCOAL : TEXT }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Metric ──────────────────────────────────

export function Metric({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded border px-4 py-4" style={{ borderColor: BORDER, background: BG }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </p>
      <p
        className={`mt-1 ${strong ? "text-lg font-bold" : "text-base font-semibold"}`}
        style={{ color: strong ? CHARCOAL : TEXT }}
      >
        {value}
      </p>
    </div>
  );
}

// ── DetailRow ───────────────────────────────

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b last:border-0" style={{ borderColor: BORDER }}>
      <td className="px-4 py-3 text-base" style={{ color: MUTED }}>
        {label}
      </td>
      <td className="px-4 py-3 text-right text-base font-semibold" style={{ color: TEXT }}>
        {value}
      </td>
    </tr>
  );
}

// ── FinalValue ──────────────────────────────

export function FinalValue({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div
      className="rounded border p-4"
      style={{
        borderColor: primary ? GOLD : BORDER,
        background: primary ? "#fdf6dc" : "white",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: primary ? "#8a5a00" : MUTED }}
      >
        {label}
      </p>
      <p
        className={`mt-2 break-words ${primary ? "text-xl font-bold" : "text-base font-bold"}`}
        style={{ color: primary ? CHARCOAL : TEXT }}
      >
        {value}
      </p>
    </div>
  );
}
