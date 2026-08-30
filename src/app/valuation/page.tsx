"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NumberField } from "@/components/NumberFields";
import { ResultSection } from "@/components/Result";
import {
  DetailRow,
  Field,
  LandRow,
  Metric,
  MoneyField,
  MoneyFieldInline,
  SummaryAmount,
  ValueSummary,
  WeightValue,
} from "@/components/Additionals";
import { formatNPR, formatNumber, formatPercent } from "@/lib/functions";
import InflationChart from "@/components/Chart";
import { BAGMATI_PROVINCE_DATA } from "@/data/bagmatiData";
import type {
  ValuationResult,
  ApiError,
  Building,
  Location,
  PropertyInput,
  BuildingResult,
} from "@/types";

// ── Design tokens ────────────────────────────
const CHARCOAL = "#10151f";
const NAVY     = CHARCOAL;
const BG       = "#f7f3ea";
const BORDER   = "#e8dfc8";
const TEXT     = "#10151f";
const MUTED    = "#475569";
const FAINT    = "#64748b";

// ── Helpers ──────────────────────────────────
const generatePropertyId = () =>
  `VAL-2026-${Math.floor(100_000 + Math.random() * 900_000)}`;

const emptyProperty: PropertyInput = {
  propertyId: generatePropertyId(),
  location: { district: "", municipality: "", ward: 1 },
  landAreaAana: 0,
  governmentRate: 0,
  marketRate: 0,
  buildingAge: 0,
  building: {
    defaultRatePerSqft: 0,
    sanitaryRate: 0.1,
    electricalRate: 0.08,
    usefulLife: 50,
    scrapValue: 0.1,
    floors: [],
  },
};

const STEPS = ["Location", "Land", "Building", "Review"] as const;
type StepIndex = 0 | 1 | 2 | 3;

// ── StepCard ─────────────────────────────────
function StepCard({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded border bg-white p-5 sm:p-7"
      style={{ borderColor: BORDER }}
    >
      <h2 className="font-serif text-2xl font-bold" style={{ color: NAVY }}>
        {title}
      </h2>
      {helper && (
        <p className="mt-1.5 text-base" style={{ color: MUTED }}>
          {helper}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

// ── Stepper ──────────────────────────────────
function Stepper({
  step,
  onJump,
  furthestUnlocked,
}: {
  step: StepIndex;
  onJump: (s: StepIndex) => void;
  furthestUnlocked: StepIndex;
}) {
  return (
    <ol className="mb-6 flex items-center">
      {STEPS.map((label, i) => {
        const idx      = i as StepIndex;
        const done     = idx < step;
        const active   = idx === step;
        const locked   = idx > furthestUnlocked;
        const isLast   = i === STEPS.length - 1;
        return (
          <li key={label} className="flex flex-1 items-center">
            <button
              type="button"
              disabled={locked}
              onClick={() => onJump(idx)}
              className={`flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm font-semibold transition sm:px-3 ${
                locked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"
              }`}
              style={{
                backgroundColor: active ? NAVY : done ? "#24211c" : "#e8dfc8",
                color: active || done ? "white" : MUTED,
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                style={{
                  background: active ? "rgba(255,255,255,0.2)" : done ? "rgba(255,255,255,0.15)" : "#fff",
                  color: active || done ? "white" : FAINT,
                }}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {!isLast && (
              <div
                className="mx-1 h-px w-4 shrink-0"
                style={{ backgroundColor: BORDER }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ── Main component ───────────────────────────
export default function PropertyValuationPage() {
  const router = useRouter();

  const [property, setProperty]             = useState<PropertyInput>(emptyProperty);
  const [result, setResult]                 = useState<ValuationResult | null>(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [includeBuilding, setIncludeBuilding] = useState(true);
  const [step, setStep]                     = useState<StepIndex>(0);
  const [furthestUnlocked, setFurthestUnlocked] = useState<StepIndex>(0);
  const [formOpen, setFormOpen]             = useState(true);

  // Derived selects
  const selectedDistrictInfo = BAGMATI_PROVINCE_DATA.find(
    (d) => d.name === property.location.district,
  );
  const currentMunicipalities = selectedDistrictInfo?.municipalities ?? [];
  const selectedMuniInfo = currentMunicipalities.find(
    (m) => m.name === property.location.municipality,
  );
  const maxWards = selectedMuniInfo?.maxWards ?? 15;

  // Validation flags
  const locationDone =
    !!property.location.district &&
    !!property.location.municipality &&
    !!property.location.ward;

  const landDone =
    property.landAreaAana > 0 &&
    property.governmentRate > 0 &&
    property.marketRate > 0;

  const buildingDone =
    !includeBuilding ||
    (property.building !== undefined &&
      property.building.defaultRatePerSqft > 0 &&
      property.building.floors.length > 0 &&
      property.building.floors.every((f) => f.area > 0 && f.name.trim()));

  // Navigation
  const goTo = (target: StepIndex) => {
    if (target > furthestUnlocked) return;
    setStep(target);
  };

  const advance = (from: StepIndex) => {
    const next = (from + 1) as StepIndex;
    setFurthestUnlocked((prev) => (next > prev ? next : prev));
    setStep(next);
  };

  // Updaters
  const updateProperty = <K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K],
  ) => setProperty((prev) => ({ ...prev, [key]: value }));

  const updateLocation = <K extends keyof Location>(
    key: K,
    value: Location[K],
  ) =>
    setProperty((prev) => ({
      ...prev,
      location: { ...prev.location, [key]: value },
    }));

  const updateBuilding = <K extends keyof Building>(
    key: K,
    value: Building[K],
  ) =>
    setProperty((prev) => ({
      ...prev,
      building: { ...prev.building!, [key]: value },
    }));

  const updateFloor = (index: number, area: number) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...prev.building!,
        floors: prev.building!.floors.map((f, i) =>
          i === index ? { ...f, area } : f,
        ),
      },
    }));

  const updateFloorName = (index: number, name: string) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...prev.building!,
        floors: prev.building!.floors.map((f, i) =>
          i === index ? { ...f, name } : f,
        ),
      },
    }));

  const addFloor = () =>
    setProperty((prev) => {
      const n = prev.building!.floors.length;
      const defaultName =
        n === 0 ? "Ground Floor"
        : n === 1 ? "First Floor"
        : n === 2 ? "Second Floor"
        : `Floor ${n + 1}`;
      return {
        ...prev,
        building: {
          ...prev.building!,
          floors: [...prev.building!.floors, { name: defaultName, area: 0 }],
        },
      };
    });

  const removeFloor = (index: number) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...prev.building!,
        floors: prev.building!.floors.filter((_, i) => i !== index),
      },
    }));

  // API call
  const calculateValuation = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload: Partial<PropertyInput> = { ...property };
      if (!includeBuilding) {
        delete payload.building;
        delete payload.buildingAge;
      }

      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ValuationResult | ApiError = await res.json();

      if (!res.ok) {
        const e = data as ApiError;
        throw new Error(e.error ?? e.message ?? "Valuation failed");
      }

      setResult(data as ValuationResult);
      setFormOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to complete the valuation.");
    } finally {
      setLoading(false);
    }
  };

  // Convenience typed cast for building result
  const buildingResult = result?.building as BuildingResult | false | undefined;

  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <div className="mx-auto max-w-3xl px-5 py-8">

        {/* ── Form wizard ──────────────────────────── */}
        {formOpen ? (
          <>
            <Stepper
              step={step}
              onJump={goTo}
              furthestUnlocked={furthestUnlocked}
            />

            {/* STEP 0 — Location */}
            {step === 0 && (
              <StepCard
                title="Where is the property?"
                helper="This determines the government rate band and local context used later."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col items-stretch gap-2 sm:col-span-2 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Field
                        label="Property reference"
                        value={property.propertyId}
                        placeholder="e.g. VAL-2026-839201"
                        onChange={(value) => updateProperty("propertyId", value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateProperty("propertyId", generatePropertyId())}
                      className="w-full rounded-lg border px-3 py-2.5 text-xs font-semibold transition hover:bg-[#f7f3ea] sm:w-auto"
                      style={{ borderColor: BORDER, color: NAVY }}
                    >
                      Generate new ID
                    </button>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      className="block text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Province
                    </label>
                    <div
                      className="mt-1.5 flex h-10 items-center rounded-lg border bg-[#f7f3ea] px-3 text-sm font-medium"
                      style={{ borderColor: BORDER }}
                    >
                      Bagmati Province
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      District
                    </label>
                    <select
                      value={property.location.district}
                      onChange={(e) => {
                        const dist = BAGMATI_PROVINCE_DATA.find(
                          (d) => d.name === e.target.value,
                        );
                        const firstMuni = dist?.municipalities[0]?.name ?? "";
                        setProperty((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            district: e.target.value,
                            municipality: firstMuni,
                            ward: 1,
                          },
                        }));
                      }}
                      className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2"
                      style={{ borderColor: BORDER }}
                    >
                      <option value="">Choose a district</option>
                      {BAGMATI_PROVINCE_DATA.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Municipality
                    </label>
                    <select
                      value={property.location.municipality}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          location: { ...prev.location, municipality: e.target.value, ward: 1 },
                        }))
                      }
                      disabled={!property.location.district}
                      className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 disabled:bg-[#f7f3ea] disabled:text-[#94a3b8]"
                      style={{ borderColor: BORDER }}
                    >
                      <option value="">Choose a municipality</option>
                      {currentMunicipalities.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    {!property.location.district && (
                      <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>
                        Pick a district first
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Ward no.
                    </label>
                    <select
                      value={property.location.ward || 1}
                      onChange={(e) => updateLocation("ward", Number(e.target.value))}
                      disabled={!property.location.municipality}
                      className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 disabled:bg-[#f7f3ea] disabled:text-[#94a3b8]"
                      style={{ borderColor: BORDER }}
                    >
                      {Array.from({ length: maxWards }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>
                          Ward {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between">
                  {!locationDone ? (
                    <p className="text-xs" style={{ color: "#94a3b8" }}>
                      Choose a district, municipality and ward to continue
                    </p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={!locationDone}
                    onClick={() => advance(0)}
                    className="bg-gold-gradient rounded px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: NAVY }}
                  >
                    Continue
                  </button>
                </div>
              </StepCard>
            )}

            {/* STEP 1 — Land */}
            {step === 1 && (
              <StepCard
                title="Land details"
                helper="We blend the government-listed rate with the going market rate — the market rate counts for more since it reflects real conditions."
              >
                <div className="mb-6">
                  <NumberField
                    label="Land area"
                    suffix="Aana"
                    placeholder="e.g. 8.5"
                    value={property.landAreaAana}
                    onChange={(value) => updateProperty("landAreaAana", value)}
                  />
                </div>

                <div className="space-y-4">
                  <div
                    className="flex items-end gap-3 rounded-xl border p-4"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex-1">
                      <MoneyFieldInline
                        value={property.governmentRate}
                        placeholder="e.g. 800000"
                        onChange={(value) => updateProperty("governmentRate", value)}
                      />
                      <p className="mt-1 text-xs" style={{ color: MUTED }}>
                        Government rate, per aana
                      </p>
                    </div>
                    <WeightValue value={0.4} />
                  </div>

                  <div
                    className="flex items-end gap-3 rounded-xl border p-4"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex-1">
                      <MoneyFieldInline
                        value={property.marketRate}
                        placeholder="e.g. 2020000"
                        onChange={(value) => updateProperty("marketRate", value)}
                      />
                      <p className="mt-1 text-xs" style={{ color: MUTED }}>
                        Market rate, per aana
                      </p>
                    </div>
                    <WeightValue value={0.6} />
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <div className="flex items-center gap-3">
                    {!landDone && (
                      <p className="text-xs" style={{ color: "#94a3b8" }}>
                        Fill in the land area and both rates
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!landDone}
                      onClick={() => advance(1)}
                      className="bg-gold-gradient rounded px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ color: NAVY }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </StepCard>
            )}

            {/* STEP 2 — Building */}
            {step === 2 && (
              <StepCard title="Is there a building on this land?">
                <div className="flex gap-3">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setIncludeBuilding(val)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        includeBuilding === val
                          ? "border-[#10151f] bg-[#10151f] text-white"
                          : "border-[#e8dfc8] bg-white text-[#10151f]"
                      }`}
                    >
                      {val ? "Yes, value the building too" : "No, land only"}
                    </button>
                  ))}
                </div>

                {includeBuilding ? (
                  <div className="mt-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <MoneyField
                        label="Construction rate"
                        suffix="/ sqft"
                        placeholder="e.g. 2500"
                        value={property.building?.defaultRatePerSqft ?? 0}
                        onChange={(value) => updateBuilding("defaultRatePerSqft", value)}
                      />
                      <NumberField
                        label="Building age"
                        suffix="Years"
                        placeholder="e.g. 5"
                        value={property.buildingAge ?? 0}
                        onChange={(value) => updateProperty("buildingAge", value)}
                      />
                    </div>

                    <p className="mt-3 text-xs italic" style={{ color: "#94a3b8" }}>
                      Depreciation assumes a 50-year useful life and a 10% scrap value — fixed.
                    </p>

                    <div className="mt-7">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Floors</h3>
                        <button
                          type="button"
                          onClick={addFloor}
                          className="bg-gold-gradient rounded px-3 py-1.5 text-xs font-bold transition"
                          style={{ color: NAVY }}
                        >
                          + Add a floor
                        </button>
                      </div>

                      {property.building?.floors.length === 0 ? (
                        <div
                          className="rounded-xl border border-dashed p-6 text-center text-sm"
                          style={{ borderColor: BORDER, color: MUTED }}
                        >
                          No floors added yet. Add each floor&apos;s built-up area.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {property.building?.floors.map((floor, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                              style={{ borderColor: BORDER }}
                            >
                              <input
                                type="text"
                                value={floor.name}
                                onChange={(e) => updateFloorName(index, e.target.value)}
                                placeholder="Floor name"
                                className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm font-medium outline-none"
                                style={{ borderColor: BORDER }}
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={floor.area || ""}
                                  onChange={(e) => updateFloor(index, Number(e.target.value))}
                                  placeholder="Area"
                                  className="w-28 rounded-lg border bg-white px-3 py-2 text-right text-sm outline-none"
                                  style={{ borderColor: BORDER }}
                                />
                                <span className="text-xs" style={{ color: MUTED }}>sqft</span>
                                <button
                                  type="button"
                                  onClick={() => removeFloor(index)}
                                  className="ml-1 text-xs font-semibold"
                                  style={{ color: "#b91c1c" }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm" style={{ color: MUTED }}>
                    The total valuation will equal the land value alone.
                  </p>
                )}

                <div className="mt-7 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <div className="flex items-center gap-3">
                    {!buildingDone && (
                      <p className="text-xs" style={{ color: "#94a3b8" }}>
                        Add a construction rate and at least one floor&apos;s area
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!buildingDone}
                      onClick={() => advance(2)}
                      className="bg-gold-gradient rounded px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ color: NAVY }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </StepCard>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <StepCard
                title="Check everything before calculating"
                helper="Nothing has been sent yet — take a moment to make sure this looks right."
              >
                <div className="space-y-4 text-sm">
                  {[
                    {
                      label: "Location",
                      text: `${property.location.municipality}, Ward ${property.location.ward}, ${property.location.district}`,
                      editStep: 0,
                    },
                    {
                      label: "Land",
                      text: `${formatNumber(property.landAreaAana)} aana · government ${formatNPR(property.governmentRate)} · market ${formatNPR(property.marketRate)}`,
                      editStep: 1,
                    },
                    {
                      label: "Building",
                      text: includeBuilding
                        ? `${property.building?.floors.length ?? 0} floor${
                            property.building?.floors.length === 1 ? "" : "s"
                          }, ${formatNumber(
                            property.building?.floors.reduce((s, f) => s + (f.area || 0), 0) ?? 0,
                          )} sqft total`
                        : "Not included — land only",
                      editStep: 2,
                    },
                  ].map(({ label, text, editStep }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 rounded-xl border p-4"
                      style={{ borderColor: BORDER }}
                    >
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p style={{ color: MUTED }}>{text}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(editStep as StepIndex)}
                        className="text-xs font-semibold"
                        style={{ color: NAVY }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm" style={{ color: "#b91c1c" }}>
                    <p className="font-semibold">Something went wrong</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                <div className="mt-7 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={calculateValuation}
                    disabled={loading}
                    className="bg-gold-gradient inline-flex items-center gap-2 rounded px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ color: NAVY }}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#10151f]/30 border-t-[#10151f]" />
                        Calculating…
                      </>
                    ) : (
                      "Calculate valuation"
                    )}
                  </button>
                </div>
              </StepCard>
            )}
          </>
        ) : (
          <div
            className="mb-6 flex items-center justify-between rounded-2xl border p-4"
            style={{ borderColor: BORDER }}
          >
            <p className="text-sm" style={{ color: MUTED }}>
              Showing the valuation for{" "}
              <span className="font-mono">{property.propertyId}</span>
            </p>
            <button
              type="button"
              onClick={() => { setFormOpen(true); setStep(0); }}
              className="text-sm font-semibold"
              style={{ color: NAVY }}
            >
              Edit details
            </button>
          </div>
        )}

        {/* ── Results ──────────────────────────────── */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Headline total */}
            <div
              className="rounded border p-6 text-center sm:p-8"
              style={{ borderColor: NAVY, borderWidth: 2, backgroundColor: "white" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: MUTED }}
              >
                Total property value
              </p>
              <p
                className="mt-2 font-serif text-4xl font-bold sm:text-5xl"
                style={{ color: NAVY }}
              >
                {formatNPR(result.finalValue)}
              </p>
              <div
                className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-4 border-t pt-5"
                style={{ borderColor: BORDER }}
              >
                <SummaryAmount label="Land" value={formatNPR(result.land.landValue)} />
                <SummaryAmount
                  label="Building"
                  value={formatNPR(
                    buildingResult !== false && buildingResult
                      ? buildingResult.presentBuildingValue
                      : 0,
                  )}
                  border
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/auction-analysis?amount=${result.finalValue}&id=${encodeURIComponent(result.propertyId)}`,
                  )
                }
                className="bg-gold-gradient mt-6 rounded px-5 py-2.5 text-sm font-bold transition hover:opacity-90"
                style={{ color: NAVY }}
              >
                See what it might fetch at auction →
              </button>
            </div>

            {/* Full calculation sheet */}
            <details className="rounded-2xl border bg-white" style={{ borderColor: BORDER }}>
              <summary
                className="cursor-pointer select-none px-6 py-4 text-sm font-semibold"
                style={{ color: TEXT }}
              >
                Show the full calculation sheet
              </summary>

              <div className="space-y-6 px-1 pb-6 sm:px-2">
                {/* Land section */}
                <ResultSection
                  number="1"
                  title="Land valuation"
                  description="How the adopted land rate and total land value were worked out."
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead>
                        <tr
                          className="text-left text-xs font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: "#f8f1e3", color: NAVY }}
                        >
                          {["S.N.", "Rate category", "Rate / Aana", "Weight", "Contribution"].map((h) => (
                            <th key={h} className="border px-4 py-3" style={{ borderColor: BORDER }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <LandRow
                          index={1}
                          label="Government"
                          rate={result.land.inputs.governmentRate}
                          weight={result.land.weights.government}
                        />
                        <LandRow
                          index={2}
                          label="Market"
                          rate={result.land.inputs.marketRate}
                          weight={result.land.weights.market}
                        />
                      </tbody>
                    </table>
                  </div>

                  <div
                    className="mt-5 grid border sm:grid-cols-2"
                    style={{ borderColor: BORDER }}
                  >
                    <ValueSummary
                      label="Adopted land rate"
                      value={`${formatNPR(result.land.adoptedRate)} / Aana`}
                    />
                    <ValueSummary
                      label="Total land value"
                      value={formatNPR(result.land.landValue)}
                      strong
                      right
                    />
                  </div>
                </ResultSection>

                {/* Building section */}
                {buildingResult !== false &&
                  buildingResult &&
                  buildingResult.floors.length > 0 && (
                    <>
                      <ResultSection
                        number="2"
                        title="Building valuation"
                        description="Construction cost, additional components and depreciation."
                      >
                        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                          <Metric
                            label="Total floor area"
                            value={`${formatNumber(buildingResult.totalFloorArea)} sqft`}
                          />
                          <Metric label="Civil construction" value={formatNPR(buildingResult.civilCost)} />
                          <Metric label="Gross building cost" value={formatNPR(buildingResult.grossBuildingCost)} />
                          <Metric label="Depreciation" value={formatNPR(buildingResult.depreciation.amount)} />
                        </div>

                        <div className="mt-6 overflow-x-auto">
                          <table className="w-full min-w-[500px] text-sm">
                            <thead>
                              <tr
                                className="text-left text-xs font-semibold uppercase tracking-wide"
                                style={{ backgroundColor: "#f8f1e3", color: NAVY }}
                              >
                                {["S.N.", "Floor", "Area (sq.ft.)", "Rate / sqft", "Construction cost"].map(
                                  (h) => (
                                    <th
                                      key={h}
                                      className="border px-4 py-3"
                                      style={{ borderColor: BORDER }}
                                    >
                                      {h}
                                    </th>
                                  ),
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {buildingResult.floors.map((floor, index) => (
                                <tr key={floor.floor} className="border-t" style={{ borderColor: BORDER }}>
                                  <td className="border px-4 py-3" style={{ borderColor: BORDER, color: MUTED }}>
                                    {index + 1}
                                  </td>
                                  <td className="border px-4 py-3 font-medium" style={{ borderColor: BORDER }}>
                                    {floor.floor}
                                  </td>
                                  <td className="border px-4 py-3 text-right" style={{ borderColor: BORDER }}>
                                    {formatNumber(floor.area)}
                                  </td>
                                  <td className="border px-4 py-3 text-right" style={{ borderColor: BORDER }}>
                                    {formatNPR(floor.ratePerSqft)}
                                  </td>
                                  <td className="border px-4 py-3 text-right font-semibold" style={{ borderColor: BORDER }}>
                                    {formatNPR(floor.cost)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-6 grid gap-px sm:grid-cols-3">
                          <Metric
                            label={`Sanitary (${formatPercent(buildingResult.sanitary.rate)})`}
                            value={formatNPR(buildingResult.sanitary.cost)}
                          />
                          <Metric
                            label={`Electrical (${formatPercent(buildingResult.electrical.rate)})`}
                            value={formatNPR(buildingResult.electrical.cost)}
                          />
                          <Metric
                            label="Present building value"
                            value={formatNPR(buildingResult.presentBuildingValue)}
                            strong
                          />
                        </div>
                      </ResultSection>

                      <ResultSection
                        number="3"
                        title="Depreciation statement"
                        description="How building depreciation was applied."
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[500px] text-sm">
                            <tbody>
                              <DetailRow label="Building age" value={`${buildingResult.depreciation.age} years`} />
                              <DetailRow label="Useful life" value={`${buildingResult.depreciation.usefulLife} years`} />
                              <DetailRow label="Scrap value" value={formatPercent(buildingResult.depreciation.scrapValue)} />
                              <DetailRow label="Annual depreciation rate" value={formatPercent(buildingResult.depreciation.annualRate)} />
                              <DetailRow label="Depreciation amount" value={formatNPR(buildingResult.depreciation.amount)} />
                            </tbody>
                          </table>
                        </div>
                      </ResultSection>
                    </>
                  )}

                {/* Inflation chart */}
                <ResultSection
                  number="4"
                  title="Land value inflation & future appreciation forecast"
                  description="10-year land value forecast. Building structure value does not inflate."
                >
                  <InflationChart
                    initialAmount={result.land.landValue}
                    buildingValue={
                      buildingResult !== false && buildingResult
                        ? buildingResult.presentBuildingValue
                        : 0
                    }
                  />
                </ResultSection>

                {/* Footer meta */}
                <div
                  className="grid gap-3 border-t px-4 pt-5 text-xs sm:grid-cols-3"
                  style={{ borderColor: BORDER, color: MUTED }}
                >
                  <div>
                    <p>Property reference</p>
                    <p className="mt-1 font-mono font-semibold" style={{ color: TEXT }}>
                      {result.propertyId}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p>Record status</p>
                    <p className="mt-1 font-semibold text-green-700">Valuation completed</p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
