"use client";

const NAVY   = "#1a2f4e";
const BORDER = "#e8dfc8";
const TEXT   = "#111827";
const MUTED  = "#4b5563";
const FAINT  = "#9ca3af";
const BG     = "#f9f6ef";

interface NumberFieldProps {
  label: string;
  value: number;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export function NumberField({
  label,
  value,
  suffix,
  placeholder,
  disabled = false,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: MUTED }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value === undefined ? "":value=== 0 ? "0" : value}
          placeholder={placeholder ?? "0"}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full rounded border bg-white px-3 py-2.5 pr-16 text-base outline-none transition disabled:cursor-not-allowed"
          style={{
            borderColor: BORDER,
            color: disabled ? FAINT : TEXT,
            backgroundColor: disabled ? BG : "white",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
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
