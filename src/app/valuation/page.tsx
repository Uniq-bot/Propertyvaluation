"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NumberField } from "@/components/NumberFields";
import { ResultSection } from "@/components/Result";
import { useProperty } from "../../../public/context/PropertyContext";
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
import {
  convertToAana,
  formatNPR,
  formatNumber,
  formatPercent,
} from "@/lib/functions";
import InflationChart from "@/components/Chart";
import { BAGMATI_PROVINCE_DATA } from "@/data/bagmatiData";
import { ValuationReportModal } from "@/components/ValuationReportModal";
import type {
  ValuationResult,
  ApiError,
  Building,
  Location,
  PropertyInput,
  BuildingResult,
  PropertyImage,
  PropertyImageType,
  OwnerDetail,
  ClientDetail,
} from "@/types";
import { LandPlot, X } from "lucide-react";
import { Stepper } from "@/components/Steppers";
import { StepCard } from "@/components/StepCard";
import { PROPERTY_FACTORS } from "@/data/factors";

// ── Design tokens ────────────────────────────
export const CHARCOAL = "#10151f";
export const NAVY = CHARCOAL;
export const BG = "#f7f3ea";
export const BORDER = "#e8dfc8";
export const TEXT = "#10151f";
export const MUTED = "#475569";
export const FAINT = "#64748b";

// ── Helpers ──────────────────────────────────
const generatePropertyId = () =>
  `VAL-2026-${Math.floor(100_000 + Math.random() * 900_000)}`;

const createDefaultBuilding = (): Building => ({
  depreciationRate: 0,
  sanitaryRate: 0.05,
  electricalRate: 0.05,
  usefulLife: 50,
  floors: [],
});

const emptyProperty: PropertyInput = {
  propertyId: generatePropertyId(),
  plotNumber: "",
  possibleFutureInhanceMents: "",
  ownerDetails: {
    ownerName: "",
    ownerNumber: 0,
    ownerLocation: "",
  },
  clientDetails: {
    clientName: "",
    clientAddress: "",
    ContactNumber: 0,
  },
  location: {
    district: "",
    municipality: "",
    ward: 1,
    latitude: 0,
    longitude: 0,
  },
  boundaryDetails: {
    east: "",
    west: "",
    north: "",
    south: "",
  },
  nearestRoad: "",
  nearestRoadImage: null as unknown as File,
  nearestLandMark: "",
  landArea: {
    ropani: 0,
    aana: 0,
    paisa: 0,
    dam: 0,
  },
  governmentRate: 0,
  marketRate: 0,
  governmentWeight: 30,
  marketWeight: 70,
  buildingAge: 0,
  hasBuilding: true,
  structuralAmenities: [],
  building: createDefaultBuilding(),
};
export const STEPS = [
  "Client Details",
  "Owner Details",
  "Location",
  "Land",
  "Building",
  "Image",
  "Review",
] as const;
export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ── Main component ───────────────────────────
export default function PropertyValuationPage() {
  const router = useRouter();
  const {
    property,
    setProperty,
    updateProperty,
    updateLocation,
    updateLandArea,
    images,
    addImage: addPropertyImage,
    deleteImage: deletePropertyImage,
  } = useProperty();

  const [clientDetail, setClientDetail] = useState<ClientDetail>({
    ...emptyProperty.clientDetails,
  });

  const [ownerDetail, setOwnerDetail] = useState<OwnerDetail>({
    ...emptyProperty.ownerDetails,
  });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [includeBuilding, setIncludeBuilding] = useState(true);
  const [step, setStep] = useState<StepIndex>(0);
  const [furthestUnlocked, setFurthestUnlocked] = useState<StepIndex>(0);
  const [formOpen, setFormOpen] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  // UI-local image state remains for upload previews; the shared property context stores the canonical image list.
  const [factorsField, setFactorsField] = useState<
    { factor: string; observedValue: string; adjustment: number }[]
  >([
    {
      factor: "",
      observedValue: "",
      adjustment: 0,
    },
  ]);

  const addFactorField = () => {
    setFactorsField((prev) => [
      ...prev,
      { factor: "", observedValue: "", adjustment: 0 },
    ]);
  };

  const deleteFactorField = (index: number) => {
    setFactorsField((prev) => prev.filter((_, i) => i !== index));
  };
  const updateFactorField = (
    index: number,
    field: "factor" | "observedValue" | "adjustment",
    value: string | number,
  ) => {
    setFactorsField((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    );
  };

  const updateFactordataInProperty = (factorFields: any) => {
    setProperty((prev) => ({
      ...prev,
      structuralAmenities: factorFields.map((f: any) => ({
        factor: f.factor,
        observedValue: f.observedValue,
        adjustment: f.adjustment,
      })),
    }));
  };

  const handleNext = (next: StepIndex) => {
    updateFactordataInProperty(factorsField);
    advance(next);
  };

  // Derived selects
  const selectedDistrictInfo = BAGMATI_PROVINCE_DATA.find(
    (d) => d.name === property.location.district,
  );
  const currentMunicipalities = selectedDistrictInfo?.municipalities ?? [];
  const selectedMuniInfo = currentMunicipalities.find(
    (m) => m.name === property.location.municipality,
  );
  const maxWards = selectedMuniInfo?.maxWards ?? 15;
  const building = property.building ?? createDefaultBuilding();
  const buildingFloors = building.floors ?? [];

  // Validation flags
  const locationDone =
    !!property.location.district &&
    !!property.location.municipality &&
    !!property.location.ward;

  const landDone =
    convertToAana(
      property.landArea.ropani,
      property.landArea.aana,
      property.landArea.paisa,
      property.landArea.dam,
      "aana",
    ) > 0 &&
    property.governmentRate > 0 &&
    property.marketRate > 0;

  const buildingDone =
    !includeBuilding ||
    (Array.isArray(buildingFloors) &&
      buildingFloors.length > 0 &&
      buildingFloors.every(
        (f) => f && Number(f.area) > 0 && String(f.name ?? "").trim().length > 0,
      ));

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
  const updatePropertyBuilding = (key: keyof Building, value: any) => {
    setProperty((prev) => ({
      ...prev,
      building: { ...(prev.building ?? createDefaultBuilding()), [key]: value },
    }));
  };
  const updateClientDetail = (detail: ClientDetail) => {
    setProperty((prev) => ({
      ...prev,
      clientDetails: detail,
    }));

    advance(0);
  };

  const updatePropertyOwnerDetails = (ownerDetails: OwnerDetail) => {
    setProperty((prev) => ({
      ...prev,
      ownerDetails: ownerDetails,
    }));

    advance(1);
  };

  const updateFloor = (index: number, area: number) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...(prev.building ?? createDefaultBuilding()),
        floors: (prev.building?.floors ?? []).map((f, i) =>
          i === index ? { ...f, area } : f,
        ),
      },
    }));
  const updateRate = (index: number, rate: number) => {
    setProperty((prev) => ({
      ...prev,
      building: {
        ...(prev.building ?? createDefaultBuilding()),
        floors: (prev.building?.floors ?? []).map((f, i) =>
          i === index ? { ...f, ratePerSqft: rate } : f,
        ),
      },
    }));
  };
  const updateFloorName = (index: number, name: string) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...(prev.building ?? createDefaultBuilding()),
        floors: (prev.building?.floors ?? []).map((f, i) =>
          i === index ? { ...f, name } : f,
        ),
      },
    }));

  const addFloor = () =>
    setProperty((prev) => {
      const currentBuilding = prev.building ?? createDefaultBuilding();
      const n = currentBuilding.floors.length;
      const defaultName =
        n === 0
          ? "Ground Floor"
          : n === 1
            ? "First Floor"
            : n === 2
              ? "Second Floor"
              : `Floor ${n + 1}`;
      return {
        ...prev,
        building: {
          ...currentBuilding,
          floors: [
            ...currentBuilding.floors,
            { name: defaultName, area: 0, ratePerSqft: 0 },
          ],
        },
      };
    });
  const upDateImageToProperty = (nextImages: PropertyImage[]) => {
    setProperty((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...nextImages],
    }));

    advance(5);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "satellite" | "trace" | "physical",
  ) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const nextImageList: PropertyImage[] = [];

    for (const file of files) {
      const image: PropertyImage = {
        name: file.name,
        file,
        type,
      };

      if (type === "physical") {
        const existingPhysical = images.filter(
          (img) => img.type === "physical",
        );
        if (existingPhysical.length >= 4) {
          continue;
        }
      }

      nextImageList.push(image);
    }

    if (type === "physical") {
      const filtered = images.filter((img) => img.type !== "physical");
      const merged = [...filtered, ...nextImageList];
      setProperty((prev) => ({
        ...prev,
        images: merged.slice(0, 4),
      }));
    } else {
      const filtered = images.filter((img) => img.type !== type);
      setProperty((prev) => ({
        ...prev,
        images: [...filtered, ...nextImageList],
      }));
    }

    e.target.value = "";
  };
  const deleteImage = (type: PropertyImageType, index?: number) => {
    const nextImages = [...(images ?? [])];
    if (type === "physical" && index !== undefined) {
      const physicalImages = nextImages.filter(
        (img) => img.type === "physical",
      );
      const imageToDelete = physicalImages[index];
      if (!imageToDelete) return;
      setProperty((prev) => ({
        ...prev,
        images: prev.images?.filter((img) => img !== imageToDelete) ?? [],
      }));
      return;
    }

    setProperty((prev) => ({
      ...prev,
      images: prev.images?.filter((img) => img.type !== type) ?? [],
    }));
  };
  const removeFloor = (index: number) =>
    setProperty((prev) => ({
      ...prev,
      building: {
        ...(prev.building ?? createDefaultBuilding()),
        floors: (prev.building?.floors ?? []).filter((_, i) => i !== index),
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
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete the valuation.",
      );
    } finally {
      setLoading(false);
      console.log(result);
    }
  };

  // Convenience typed cast for building result
  const buildingResult = result?.building as BuildingResult | false | undefined;

  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <div className="mx-auto max-w-4xl px-3 sm:px-5 py-5 sm:py-8">
        {/* ── Form wizard ──────────────────────────── */}
        {formOpen ? (
          <>
            <Stepper
              step={step}
              onJump={goTo}
              furthestUnlocked={furthestUnlocked}
            />
            {step === 0 && (
              <StepCard
                title="Client's Details"
                helper="Who is the Client? This is the person who is requesting the valuation."
              >
                <div className="flex flex-col gap-4 sm:gap-5">
                  <Field
                    label="Client Name"
                    value={clientDetail?.clientName ?? ""}
                    placeholder="e.g. John Doe"
                    onChange={(value) =>
                      setClientDetail((prev) => ({
                        clientName: value ?? "",
                        clientAddress: prev?.clientAddress ?? "",
                        ContactNumber: prev?.ContactNumber ?? 0,
                      }))
                    }
                  />
                  <NumberField
                    label="Phone Number"
                    suffix="phone"
                    placeholder="9876543210"
                    value={clientDetail?.ContactNumber}
                    onChange={(value) =>
                      setClientDetail((prev) => ({
                        clientName: prev?.clientName ?? "",
                        clientAddress: prev?.clientAddress ?? "",
                        ContactNumber: value,
                      }))
                    }
                  />
                  <Field
                    label="Client Address"
                    value={clientDetail?.clientAddress ?? ""}
                    placeholder="e.g. Bhaktapur, Nepal"
                    onChange={(value) =>
                      setClientDetail((prev) => ({
                        clientAddress: value,
                        ContactNumber: prev?.ContactNumber ?? 0,
                        clientName: prev?.clientName ?? "",
                      }))
                    }
                  />
                </div>
                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {!locationDone ? (
                    <p
                      className="text-[11px] sm:text-xs"
                      style={{ color: "#94a3b8" }}
                    >
                      Fill owner details to continue
                    </p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={
                      !clientDetail?.ContactNumber ||
                      !clientDetail?.clientAddress ||
                      !clientDetail?.clientName
                    }
                    onClick={() => updateClientDetail(clientDetail)}
                    className="bg-gold-gradient rounded-md py-2.5 px-4 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: NAVY }}
                  >
                    Continue
                  </button>
                </div>
              </StepCard>
            )}
            {step === 1 && (
              <StepCard
                title="Owner's Details"
                helper="Who is the owner of the Property? Determine"
              >
                <div className="flex flex-col gap-4 sm:gap-5">
                  <Field
                    label="Owner Name"
                    value={ownerDetail?.ownerName ?? ""}
                    placeholder="e.g. John Doe"
                    onChange={(value) =>
                      setOwnerDetail((prev) => ({
                        ownerNumber: prev?.ownerNumber ?? 0,
                        ownerLocation: prev?.ownerLocation ?? "",
                        ownerName: value,
                      }))
                    }
                  />
                  <NumberField
                    label="Phone Number"
                    suffix="phone"
                    placeholder="9876543210"
                    value={ownerDetail?.ownerNumber}
                    onChange={(value) =>
                      setOwnerDetail((prev) => ({
                        ownerName: prev?.ownerName ?? "",
                        ownerLocation: prev?.ownerLocation ?? "",
                        ownerNumber: value,
                      }))
                    }
                  />
                  <Field
                    label="Owner Address"
                    value={ownerDetail?.ownerLocation ?? ""}
                    placeholder="e.g. Bhaktapur, Nepal"
                    onChange={(value) =>
                      setOwnerDetail((prev) => ({
                        ownerNumber: prev?.ownerNumber ?? 0,
                        ownerLocation: value,
                        ownerName: prev?.ownerName ?? "",
                      }))
                    }
                  />
                </div>
                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {!locationDone ? (
                    <p
                      className="text-[11px] sm:text-xs"
                      style={{ color: "#94a3b8" }}
                    >
                      Fill owner details to continue
                    </p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={
                      !ownerDetail?.ownerName ||
                      !ownerDetail?.ownerNumber ||
                      !ownerDetail?.ownerLocation
                    }
                    onClick={() => updatePropertyOwnerDetails(ownerDetail)}
                    className="bg-gold-gradient rounded-md py-2.5 px-4 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: NAVY }}
                  >
                    Continue
                  </button>
                </div>
              </StepCard>
            )}

            {step === 2 && (
              <StepCard
                title="Property Details"
                helper="Property location, plot number, four boundaries details and nearest road/landmark."
              >
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <div className="flex items-center justify-between col-span-2">
                    <div className="flex flex-col items-stretch gap-2 sm:col-span-2 sm:flex-row sm:items-end">
                      <div className="flex items-center justify-between">
                        <Field
                          label="Property reference"
                          value={property.propertyId}
                          placeholder="e.g. VAL-2026-839201"
                          onChange={(value) =>
                            updateProperty("propertyId", value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateProperty("propertyId", generatePropertyId())
                        }
                        className="w-full rounded border h-full px-3 py-2.5 text-xs font-semibold transition hover:bg-[#f7f3ea] sm:w-auto"
                        style={{ borderColor: BORDER, color: NAVY }}
                      >
                        Generate new ID
                      </button>
                    </div>
                    <div className="w-1/2">
                      <Field
                        label="Plot Number"
                        value={property.plotNumber}
                        placeholder="e.g. 100"
                        onChange={(value) =>
                          updateProperty("plotNumber", value)
                        }
                      />
                    </div>
                  </div>

                  <div className="">
                    <label
                      className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Province
                    </label>
                    <div
                      className="mt-1.5 flex h-9 sm:h-10 items-center rounded border bg-[#f7f3ea] px-3 text-xs sm:text-sm font-medium"
                      style={{ borderColor: BORDER }}
                    >
                      Bagmati Province
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
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
                      className="mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2"
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
                      className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Municipality
                    </label>
                    <select
                      value={property.location.municipality}
                      onChange={(e) =>
                        setProperty((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            municipality: e.target.value,
                            ward: 1,
                          },
                        }))
                      }
                      disabled={!property.location.district}
                      className="mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 disabled:bg-[#f7f3ea] disabled:text-[#94a3b8]"
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
                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: "#94a3b8" }}
                      >
                        Pick a district first
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                      style={{ color: MUTED }}
                    >
                      Ward no.
                    </label>
                    <select
                      value={property.location.ward || 1}
                      onChange={(e) =>
                        updateLocation("ward", Number(e.target.value))
                      }
                      disabled={!property.location.municipality}
                      className="mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 disabled:bg-[#f7f3ea] disabled:text-[#94a3b8]"
                      style={{ borderColor: BORDER }}
                    >
                      {Array.from({ length: maxWards }, (_, i) => i + 1).map(
                        (w) => (
                          <option key={w} value={w}>
                            Ward {w}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <NumberField
                    label="Latitude"
                    placeholder="e.g. 27.7172"
                    value={property.location.latitude}
                    onChange={(value) => updateLocation("latitude", value)}
                  />
                  <NumberField
                    label="Longitude"
                    placeholder="e.g. 85.3240"
                    value={property.location.longitude}
                    onChange={(value) => updateLocation("longitude", value)}
                  />

                  <Field
                    label="Nearest Road"
                    value={property.nearestRoad}
                    placeholder="e.g. Ring Road"
                    onChange={(value) => updateProperty("nearestRoad", value)}
                  />
                  <Field
                    label="Nearest Landmark"
                    value={property.nearestLandMark}
                    placeholder="e.g. Boudhanath Stupa"
                    onChange={(value) =>
                      updateProperty("nearestLandMark", value)
                    }
                  />
                </div>
                <div
                  className="mt-5 sm:mt-6 overflow-hidden rounded-xl border"
                  style={{ borderColor: BORDER }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-130 border-collapse text-left">
                      <thead>
                        <tr style={{ backgroundColor: "#faf8f1" }}>
                          <th
                            className="w-16 border-b px-3 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                            style={{ borderColor: BORDER, color: MUTED }}
                          >
                            S.N
                          </th>
                          <th
                            className="border-b px-3 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                            style={{ borderColor: BORDER, color: MUTED }}
                          >
                            Boundary
                          </th>
                          <th
                            className="border-b px-3 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                            style={{ borderColor: BORDER, color: MUTED }}
                          >
                            Boundary Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: "east", label: "East" },
                          { key: "west", label: "West" },
                          { key: "north", label: "North" },
                          { key: "south", label: "South" },
                        ].map(({ key, label }, index) => (
                          <tr key={key} className="bg-white">
                            <td
                              className="border-b px-3 py-3 align-top text-xs sm:text-sm font-semibold text-gray-900"
                              style={{ borderColor: BORDER }}
                            >
                              {index + 1}
                            </td>
                            <td
                              className="border-b px-3 py-3 align-top text-xs sm:text-sm font-semibold text-gray-900"
                              style={{ borderColor: BORDER }}
                            >
                              {label}
                            </td>
                            <td
                              className="border-b px-3 py-3 align-top"
                              style={{ borderColor: BORDER }}
                            >
                              <input
                                type="text"
                                className="w-full rounded border bg-white px-3 py-2.5 text-xs sm:text-sm outline-none transition focus:ring-2"
                                style={{ borderColor: BORDER }}
                                placeholder="e.g. Plot of the property or Road"
                                value={
                                  property.boundaryDetails[
                                    key as keyof typeof property.boundaryDetails
                                  ]
                                }
                                onChange={(e) =>
                                  updateProperty("boundaryDetails", {
                                    ...property.boundaryDetails,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {!locationDone ? (
                    <p
                      className="text-[11px] sm:text-xs"
                      style={{ color: "#94a3b8" }}
                    >
                      Choose a district, municipality and ward to continue
                    </p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={!locationDone}
                    onClick={() => advance(2)}
                    className="bg-gold-gradient rounded-md py-2.5 px-4 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: NAVY }}
                  >
                    Continue
                  </button>
                </div>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard
                title="Land details"
                helper="We blend the government-listed rate with the going market rate — the market rate counts for more since it reflects real conditions."
              >
                <div className="mb-5 sm:mb-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <NumberField
                    label="Ropani"
                    suffix="ropani"
                    placeholder="e.g. 8.5"
                    value={property.landArea.ropani}
                    onChange={(value) => updateLandArea("ropani", value)}
                  />
                  <NumberField
                    label="Aana"
                    suffix="aana"
                    placeholder="e.g. 8.5"
                    value={property.landArea.aana}
                    onChange={(value) => updateLandArea("aana", value)}
                  />
                  <NumberField
                    label="Paisa"
                    suffix="paisa"
                    placeholder="e.g. 8.5"
                    value={property.landArea.paisa}
                    onChange={(value) => updateLandArea("paisa", value)}
                  />
                  <NumberField
                    label="Dam"
                    suffix="dam"
                    placeholder="e.g. 8.5"
                    value={property.landArea.dam}
                    onChange={(value) => updateLandArea("dam", value)}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Government Rate */}
                  <div
                    className="rounded border p-3 sm:p-4"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-5">
                      <div className="flex-1 w-full">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            Government Rate
                          </h3>

                          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-600">
                            Official Value
                          </span>
                        </div>

                        <p
                          className="mb-3 text-xs sm:text-sm leading-relaxed"
                          style={{ color: MUTED }}
                        >
                          Government-assessed land value used as a reference.
                        </p>

                        <MoneyFieldInline
                          value={property.governmentRate}
                          placeholder="e.g. 800000"
                          onChange={(value) =>
                            updateProperty("governmentRate", value)
                          }
                        />

                        <p
                          className="mt-1.5 text-xs sm:text-sm"
                          style={{ color: MUTED }}
                        >
                          Per aana
                        </p>
                      </div>

                      <div className="w-full sm:w-36">
                        <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                          Valuation Weight
                        </label>

                        <select
                          value={property.governmentWeight}
                          onChange={(e) =>
                            updateProperty(
                              "governmentWeight",
                              Number(e.target.value),
                            )
                          }
                          className="h-10 sm:h-11 w-full rounded border bg-white px-3 text-sm sm:text-base font-medium outline-none transition focus:ring-2"
                          style={{ borderColor: BORDER }}
                        >
                          <option value={0.0}>0%</option>
                          <option value={0.1}>10%</option>
                          <option value={0.2}>20%</option>
                          <option value={0.3}>30%</option>
                          <option value={0.4}>40%</option>
                          <option value={0.5}>50%</option>
                          <option value={0.6}>60%</option>
                          <option value={0.7}>70%</option>
                          <option value={0.8}>80%</option>
                        </select>

                        <p
                          className="mt-2 text-[11px] sm:text-xs leading-relaxed"
                          style={{ color: MUTED }}
                        >
                          How much this rate influences the final valuation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Market Rate */}
                  <div
                    className="rounded border p-3 sm:p-4"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-5">
                      <div className="flex-1 w-full">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            Market Rate
                          </h3>

                          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-600">
                            Current Market
                          </span>
                        </div>

                        <p
                          className="mb-3 text-xs sm:text-sm leading-relaxed"
                          style={{ color: MUTED }}
                        >
                          Estimated selling price based on current local market
                          conditions.
                        </p>

                        <MoneyFieldInline
                          value={property.marketRate}
                          placeholder="e.g. 2020000"
                          onChange={(value) =>
                            updateProperty("marketRate", value)
                          }
                        />

                        <p
                          className="mt-1.5 text-xs sm:text-sm"
                          style={{ color: MUTED }}
                        >
                          Per aana
                        </p>
                      </div>

                      <div className="w-full sm:w-36">
                        <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                          Valuation Weight
                        </label>

                        <select
                          value={property.marketWeight}
                          onChange={(e) =>
                            updateProperty(
                              "marketWeight",
                              Number(e.target.value),
                            )
                          }
                          className="h-10 sm:h-11 w-full rounded border bg-white px-3 text-sm sm:text-base font-medium outline-none transition focus:ring-2"
                          style={{ borderColor: BORDER }}
                        >
                          <option value={0.0}>0%</option>
                          <option value={0.1}>10%</option>
                          <option value={0.2}>20%</option>
                          <option value={0.3}>30%</option>
                          <option value={0.4}>40%</option>
                          <option value={0.5}>50%</option>
                          <option value={0.6}>60%</option>
                          <option value={0.7}>70%</option>
                          <option value={0.8}>80%</option>
                        </select>

                        <p
                          className="mt-2 text-[11px] sm:text-xs leading-relaxed"
                          style={{ color: MUTED }}
                        >
                          How much this rate influences the final valuation.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Property Factors */}
                  <div
                    className="mt-4 sm:mt-6 rounded-xl border p-3 sm:p-5"
                    style={{ borderColor: BORDER }}
                  >
                    <div>
                      {/* Header */}
                      <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            Property factors
                          </h3>

                          <p
                            className="mt-1 text-xs sm:text-sm leading-relaxed"
                            style={{ color: MUTED }}
                          >
                            Add local factors that can affect the property's
                            market value.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="w-fit rounded-md bg-gold-gradient px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={addFactorField}
                        >
                          + Add Field
                        </button>
                      </div>

                      {/* Table wrapper for mobile scrolling */}
                      <div
                        className="overflow-x-auto rounded-lg border"
                        style={{ borderColor: BORDER }}
                      >
                        <table className="w-full min-w-175 border-collapse text-left">
                          <thead>
                            <tr
                              className="border-b"
                              style={{
                                borderColor: BORDER,
                                backgroundColor: "#faf8f1",
                              }}
                            >
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-700">
                                Factor / Amenity
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-700">
                                Observed Value
                              </th>

                              {/* <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-700">
                              Adjustment
                            </th> */}

                              <th className="w-24 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-700">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {factorsField.map((factor, index) => {
                              const selectedFactor = PROPERTY_FACTORS.find(
                                (item) => item.value === factor.factor,
                              );

                              return (
                                <tr
                                  key={index}
                                  className="border-b last:border-b-0 transition-colors hover:bg-gray-50"
                                  style={{ borderColor: BORDER }}
                                >
                                  {/* Factor */}
                                  <td className="px-3 py-3">
                                    <select
                                      value={factor.factor}
                                      onChange={(e) =>
                                        updateFactorField(
                                          index,
                                          "factor",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                                      style={{ borderColor: BORDER }}
                                    >
                                      <option value="null">
                                        - Select the Factor -
                                      </option>

                                      {PROPERTY_FACTORS.map((item) => (
                                        <option
                                          key={item.value}
                                          value={item.value}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>

                                  {/* Observed Value */}
                                  <td className="px-3 py-3">
                                    <input
                                      disabled={factor.factor === "null"}
                                      type="text"
                                      value={factor.observedValue}
                                      onChange={(e) =>
                                        updateFactorField(
                                          index,
                                          "observedValue",
                                          e.target.value,
                                        )
                                      }
                                      placeholder={
                                        selectedFactor?.placeholder ||
                                        "Enter observed value"
                                      }
                                      className="w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                                      style={{ borderColor: BORDER }}
                                    />
                                  </td>

                                  {/* Action */}
                                  <td className="px-3 py-3">
                                    <button
                                      type="button"
                                      disabled={factorsField.length === 1}
                                      onClick={() => deleteFactorField(index)}
                                      className="rounded-md border px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                                      style={{ borderColor: BORDER }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Possible future enhancements */}
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                        Possible Future Enhancements
                      </h3>
                      <div>
                        <textarea
                          placeholder="Describe potential future enhancements..."
                          className="w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                          style={{ borderColor: BORDER }}
                          value={property.possibleFutureInhanceMents}
                          onChange={(e) => {
                            setProperty({
                              ...property,
                              possibleFutureInhanceMents: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs sm:text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4 text-left"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {!landDone && (
                      <p
                        className="text-[11px] sm:text-xs"
                        style={{ color: "#94a3b8" }}
                      >
                        Fill in the land area and both rates
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!landDone}
                      onClick={() => handleNext(3)}
                      className="bg-gold-gradient rounded-md py-2.5 px-3 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ color: NAVY }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </StepCard>
            )}

            {step === 4 && (
              <StepCard title="Is there a building on this land?">
                <div className="flex flex-col sm:flex-row gap-3">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setIncludeBuilding(val)}
                      className={`flex-1 rounded border px-4 py-3 text-xs sm:text-sm font-semibold transition ${
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
                  <div className="mt-5 sm:mt-6">
                    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                      <NumberField
                        label="Building age"
                        suffix="Years"
                        placeholder="e.g. 5"
                        value={property.buildingAge ?? 0}
                        onChange={(value) =>
                          updateProperty("buildingAge", value)
                        }
                      />
                      <NumberField
                        label="Depriciation Rate"
                        suffix="%"
                        placeholder="e.g. 5%"
                        value={property.building?.depreciationRate ?? 0}
                        onChange={(value) =>
                          updatePropertyBuilding("depreciationRate", value)
                        }
                      />
                    </div>

                    <div className="mt-5 sm:mt-7">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold">
                          Floors
                        </h3>
                        <button
                          type="button"
                          onClick={addFloor}
                          className="bg-gold-gradient rounded px-3 py-1.5 text-[11px] sm:text-xs font-bold transition"
                          style={{ color: NAVY }}
                        >
                          + Add a floor
                        </button>
                      </div>

                      {buildingFloors.length === 0 ? (
                        <div
                          className="rounded border border-dashed p-5 sm:p-6 text-center text-xs sm:text-sm"
                          style={{ borderColor: BORDER, color: MUTED }}
                        >
                          No floors added yet. Add each floor&apos;s built-up
                          area.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {buildingFloors.map((floor, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-3 rounded border p-3 sm:p-4 sm:flex-row sm:items-center"
                              style={{ borderColor: BORDER }}
                            >
                              <input
                                type="text"
                                value={floor.name}
                                onChange={(e) =>
                                  updateFloorName(index, e.target.value)
                                }
                                placeholder="Floor name"
                                className="flex-1 rounded border bg-white px-3 py-2 text-xs sm:text-sm font-medium outline-none"
                                style={{ borderColor: BORDER }}
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={floor.area || ""}
                                  onChange={(e) =>
                                    updateFloor(index, Number(e.target.value))
                                  }
                                  placeholder="Area"
                                  className="w-24 sm:w-28 rounded border bg-white px-3 py-2 text-right text-xs sm:text-sm outline-none"
                                  style={{ borderColor: BORDER }}
                                />
                                <span
                                  className="text-[11px] sm:text-xs"
                                  style={{ color: MUTED }}
                                >
                                  sqft
                                </span>
                                <input
                                  type="number"
                                  value={floor.ratePerSqft || ""}
                                  onChange={(e) =>
                                    updateRate(index, Number(e.target.value))
                                  }
                                  placeholder="Rate per sqft"
                                  className="w-24 sm:w-28 rounded border bg-white px-3 py-2 text-right text-xs sm:text-sm outline-none"
                                  style={{ borderColor: BORDER }}
                                />
                                <span
                                  className="text-[11px] sm:text-xs"
                                  style={{ color: MUTED }}
                                >
                                  NRS/sqft
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFloor(index)}
                                  className="ml-1 text-[11px] sm:text-xs font-semibold"
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
                  <p
                    className="mt-5 text-xs sm:text-sm"
                    style={{ color: MUTED }}
                  >
                    The total valuation will equal the land value alone.
                  </p>
                )}

                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs sm:text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4 text-left"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {!buildingDone && (
                      <p
                        className="text-[11px] sm:text-xs"
                        style={{ color: "#94a3b8" }}
                      >
                        Add a construction rate and at least one floor&apos;s
                        area
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!buildingDone}
                      onClick={() => advance(4)}
                      className="bg-gold-gradient rounded-md py-2.5 px-4 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ color: NAVY }}
                    >
                      Add Images
                    </button>
                  </div>
                </div>
              </StepCard>
            )}
            {step === 5 && (
              <StepCard
                title="Add Images"
                helper="Upload images of the property to enhance the valuation."
              >
                <div className="flex flex-col gap-5 sm:gap-6 py-6 sm:py-10">
                  {/* Image Upload Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                    {(
                      [
                        {
                          type: "satellite",
                          title: "Satellite View",
                          description:
                            "Upload a satellite image of the property.",
                          maxImages: 1,
                        },
                        {
                          type: "trace",
                          title: "Trace View",
                          description:
                            "Upload the land trace / cadastral image.",
                          maxImages: 1,
                        },
                        {
                          type: "physical",
                          title: "Physical View",
                          description:
                            "Upload up to 4 physical photographs of the property.",
                          maxImages: 4,
                        },
                      ] as const
                    ).map((imageType) => {
                      const typeImages = images.filter(
                        (img) => img.type === imageType.type,
                      );

                      const isPhysical = imageType.type === "physical";
                      const canUploadMore =
                        typeImages.length < imageType.maxImages;

                      return (
                        <div
                          key={imageType.type}
                          className="rounded border border-[#e8dfc8] bg-[#fffdf8] p-3 sm:p-4"
                        >
                          {/* Title */}
                          <div className="mb-3">
                            <p className="text-xs sm:text-sm font-bold text-[#10151f]">
                              {imageType.title}
                            </p>

                            <p className="mt-1 text-[11px] sm:text-xs text-[#64748b]">
                              {imageType.description}
                            </p>
                          </div>

                          {/* Physical images */}
                          {isPhysical ? (
                            <>
                              {typeImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {typeImages.map((image, index) => (
                                    <div
                                      key={`${image.name}-${index}`}
                                      className="relative"
                                    >
                                      <img
                                        src={URL.createObjectURL(image.file)}
                                        alt={image.name}
                                        className="h-32 w-full rounded object-cover"
                                      />

                                      {/* Delete */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          deleteImage(image.type, index)
                                        }
                                        className="absolute right-1.5 top-1.5 rounded-full bg-white p-1.5 text-red-600 shadow-md transition hover:bg-red-50"
                                        aria-label={`Remove ${image.name}`}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add more physical images */}
                              {canUploadMore && (
                                <label className="mt-3 flex h-32 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-[#e8dfc8] bg-white transition hover:border-[#d6a936] hover:bg-[#fdfbf5]">
                                  <div className="mb-2 rounded-full bg-[#f7f3ea] p-3">
                                    <LandPlot className="h-5 w-5 text-[#8a5a00]" />
                                  </div>

                                  <p className="text-xs sm:text-sm font-semibold text-[#10151f]">
                                    {typeImages.length === 0
                                      ? "Upload Images"
                                      : "Add More Images"}
                                  </p>

                                  <p className="mt-1 text-[10px] sm:text-[11px] text-[#64748b]">
                                    {typeImages.length}/4 images
                                  </p>

                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, imageType.type)
                                    }
                                  />
                                </label>
                              )}

                              {!canUploadMore && (
                                <p className="mt-2 text-center text-[10px] text-[#64748b]">
                                  Maximum 4 physical images reached.
                                </p>
                              )}
                            </>
                          ) : /* Satellite / Trace */
                          typeImages.length > 0 ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(typeImages[0].file)}
                                alt={typeImages[0].name}
                                className="h-40 sm:h-48 w-full rounded object-cover"
                              />

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => deleteImage(imageType.type)}
                                className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600 shadow-md transition hover:bg-red-50"
                                aria-label={`Remove ${typeImages[0].name}`}
                              >
                                <X className="h-4 w-4" />
                              </button>

                              {/* Replace */}
                              <label className="mt-3 flex cursor-pointer items-center justify-center rounded border border-[#e8dfc8] bg-white px-3 py-2 text-[11px] sm:text-xs font-semibold text-[#475569] transition hover:bg-[#f7f3ea]">
                                Replace Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, imageType.type)
                                  }
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="flex h-40 sm:h-48 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-[#e8dfc8] bg-white transition hover:border-[#d6a936] hover:bg-[#fdfbf5]">
                              <div className="mb-2 rounded-full bg-[#f7f3ea] p-3">
                                <LandPlot className="h-5 w-5 text-[#8a5a00]" />
                              </div>

                              <p className="text-xs sm:text-sm font-semibold text-[#10151f]">
                                Upload Image
                              </p>

                              <p className="mt-1 text-[10px] sm:text-[11px] text-[#64748b]">
                                PNG, JPG or WEBP
                              </p>

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(e, imageType.type)
                                }
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                    {/* Nearest Road Image */}
                    <div className="rounded border border-[#e8dfc8] bg-[#fffdf8] p-3 sm:p-4">
                      <div className="mb-3">
                        <p className="text-xs sm:text-sm font-bold text-[#10151f]">
                          Nearest Road Image
                        </p>
                        <p className="mt-1 text-[11px] sm:text-xs text-[#64748b]">
                          Upload a photo of the nearest access road.
                        </p>
                      </div>

                      {property.nearestRoadImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(property.nearestRoadImage)}
                            alt="Nearest road"
                            className="h-40 sm:h-48 w-full rounded object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateProperty(
                                "nearestRoadImage",
                                undefined as unknown as File,
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600 shadow-md transition hover:bg-red-50"
                            aria-label="Remove nearest road image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <label className="mt-3 flex cursor-pointer items-center justify-center rounded border border-[#e8dfc8] bg-white px-3 py-2 text-[11px] sm:text-xs font-semibold text-[#475569] transition hover:bg-[#f7f3ea]">
                            Replace Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                  updateProperty("nearestRoadImage", file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="flex h-40 sm:h-48 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-[#e8dfc8] bg-white transition hover:border-[#d6a936] hover:bg-[#fdfbf5]">
                          <div className="mb-2 rounded-full bg-[#f7f3ea] p-3">
                            <LandPlot className="h-5 w-5 text-[#8a5a00]" />
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[#10151f]">
                            Upload Image
                          </p>
                          <p className="mt-1 text-[10px] sm:text-[11px] text-[#64748b]">
                            PNG, JPG or WEBP
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                updateProperty("nearestRoadImage", file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-2 sm:mt-4 flex flex-col-reverse sm:flex-row w-full items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-xs sm:text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4 text-left"
                      style={{ color: MUTED }}
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => upDateImageToProperty(images)}
                      disabled={images.length === 0}
                      className="bg-gold-gradient inline-flex justify-center px-3 items-center gap-2 rounded-md py-3 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ color: NAVY }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </StepCard>
            )}

            {step === 6 && (
              <StepCard
                title="Check everything before calculating"
                helper="Nothing has been sent yet — take a moment to make sure this looks right."
              >
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  {[
                    {
                      label: "Client",
                      text: `${property.clientDetails.clientName} · ${property.clientDetails.clientAddress}`,
                      editStep: 0,
                    },
                    {
                      label: "Owner",
                      text: `${property.ownerDetails.ownerName} · ${property.ownerDetails.ownerLocation}`,
                      editStep: 1,
                    },
                    {
                      label: "Location",
                      text: `${property.location.municipality}, Ward ${property.location.ward}, ${property.location.district}`,
                      editStep: 2,
                    },
                    {
                      label: "Land",
                      text: `${formatNumber(convertToAana(property.landArea.ropani, property.landArea.aana, property.landArea.paisa, property.landArea.dam, "aana"))} aana · government ${formatNPR(property.governmentRate)} · market ${formatNPR(property.marketRate)}`,
                      editStep: 3,
                    },
                    {
                      label: "Building",
                      text: includeBuilding
                        ? `${buildingFloors.length} floor${
                            buildingFloors.length === 1 ? "" : "s"
                          }, ${formatNumber(
                            buildingFloors.reduce(
                              (s, f) => s + (f.area || 0),
                              0,
                            ) ?? 0,
                          )} sqft total`
                        : "Not included — land only",
                      editStep: 4,
                    },
                  ].map(({ label, text, editStep }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-3 sm:gap-4 rounded border p-3 sm:p-4"
                      style={{ borderColor: BORDER }}
                    >
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p style={{ color: MUTED }}>{text}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(editStep as StepIndex)}
                        className="shrink-0 text-[11px] sm:text-xs font-semibold"
                        style={{ color: NAVY }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                {error && (
                  <div
                    className="mt-4 sm:mt-5 rounded border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-xs sm:text-sm"
                    style={{ color: "#b91c1c" }}
                  >
                    <p className="font-semibold">Something went wrong</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                <div className="mt-5 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="text-xs sm:text-sm font-medium underline decoration-[#e8dfc8] underline-offset-4 text-left"
                    style={{ color: MUTED }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={calculateValuation}
                    disabled={loading}
                    className="bg-gold-gradient inline-flex justify-center items-center gap-2 rounded-md py-3 text-xs sm:text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
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
            className="mb-5 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 rounded border p-3 sm:p-4"
            style={{ borderColor: BORDER }}
          >
            <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
              Showing the valuation for{" "}
              <span className="font-mono">{property.propertyId}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setFormOpen(true);
                setStep(0);
              }}
              className="text-xs sm:text-sm font-semibold"
              style={{ color: NAVY }}
            >
              Edit details
            </button>
          </div>
        )}

        {/* ── Results ──────────────────────────────── */}
        {result && (
          <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
            {/* Headline total */}
            <div
              className="rounded-lg p-4 text-center sm:p-8"
              style={{
                borderColor: NAVY,
                borderWidth: 2,
                backgroundColor: "white",
              }}
            >
              <p
                className="text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                style={{ color: MUTED }}
              >
                Total property value
              </p>
              <p
                className="mt-2 font-[PoppinsRegular] text-2xl sm:text-4xl md:text-5xl font-bold wrap-break-word"
                style={{ color: NAVY }}
              >
                {formatNPR(result.finalValue)}
              </p>
              <div
                className="mx-auto mt-4 sm:mt-5 grid max-w-md grid-cols-2 gap-3 sm:gap-4 border-t pt-4 sm:pt-5"
                style={{ borderColor: BORDER }}
              >
                <SummaryAmount
                  label="Land"
                  value={formatNPR(result.land.landValue)}
                />
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
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="bg-gold-gradient rounded px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold shadow transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ color: NAVY }}
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Generate & Print Full Report
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/auction-analysis?amount=${result.finalValue}&id=${encodeURIComponent(result.propertyId)}`,
                    )
                  }
                  className="rounded border px-5 py-2.5 text-xs sm:text-sm font-bold transition hover:bg-[#f7f3ea]"
                  style={{ borderColor: BORDER, color: NAVY }}
                >
                  See auction estimate →
                </button>
              </div>
            </div>

            {/* Full calculation sheet */}
            <details
              className="rounded border bg-white"
              style={{ borderColor: BORDER }}
            >
              <summary
                className="cursor-pointer select-none px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold"
                style={{ color: TEXT }}
              >
                Show the full calculation sheet
              </summary>

              <div className="space-y-5 sm:space-y-6 px-1 pb-5 sm:pb-6 sm:px-2">
                {/* Land section */}
                <ResultSection
                  number=""
                  title="Land valuation"
                  description="How the adopted land rate and total land value were worked out."
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-140 text-xs sm:text-sm">
                      <thead>
                        <tr
                          className="text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: "#f8f1e3", color: NAVY }}
                        >
                          {[
                            "S.N.",
                            "Rate category",
                            "Rate / Aana",
                            "Weight",
                            "Contribution",
                          ].map((h) => (
                            <th
                              key={h}
                              className="border px-2.5 sm:px-4 py-2 sm:py-3"
                              style={{ borderColor: BORDER }}
                            >
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
                    className="mt-4 sm:mt-5 grid border sm:grid-cols-3"
                    style={{ borderColor: BORDER }}
                  >
                    <ValueSummary
                      label="Total land area(R-A-P-D)"
                      value={`${result.land.inputs.landArea.ropani} - ${result.land.inputs.landArea.aana} - ${result.land.inputs.landArea.paisa} - ${result.land.inputs.landArea.dam}`}
                      strong
                      right
                    />
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
                {/* Property & Amenity Assessment */}
                <ResultSection
                  number=""
                  title="Property & amenity assessment"
                  description="Property-specific factors used to adjust the prevailing market land rate."
                >
                  {property.structuralAmenities ? (
                    <>
                      {/* Score summary
                      <div
                        className="grid gap-px overflow-hidden rounded border sm:grid-cols-3"
                        style={{ borderColor: BORDER }}
                      >
                        <Metric
                          label="Amenity score"
                          value={`${Math.round(result.land.amenityScore ?? 0)} / 100`}
                          strong
                        />

                        <Metric
                          label="Market rate adjustment"
                          value={`${((result.land.amenityAdjustment ?? 0) * 100).toFixed(1)}%`}
                        />

                        <Metric
                          label="Adjusted market rate"
                          value={formatNPR(result.land.inputs.marketRate)}
                          strong
                        />
                      </div> */}

                      {/* Amenities */}
                      <div
                        className="mt-5 sm:mt-6 overflow-hidden rounded border"
                        style={{ borderColor: BORDER }}
                      >
                        <div
                          className="border-b px-3 sm:px-4 py-2.5 sm:py-3"
                          style={{
                            borderColor: BORDER,
                            backgroundColor: "#f8f1e3",
                          }}
                        >
                          <p
                            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                            style={{ color: NAVY }}
                          >
                            Property factors
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                          {property.structuralAmenities?.map(
                            (amenity, index) => (
                              <AmenityResult
                                key={index}
                                label={amenity.factor}
                                value={amenity.observedValue}
                              />
                            ),
                          )}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div
                        className="mt-4 sm:mt-5 rounded border-l-4 px-3 sm:px-4 py-2.5 sm:py-3"
                        style={{
                          borderColor: NAVY,
                          backgroundColor: "#faf8f3",
                        }}
                      >
                        <p
                          className="text-[11px] sm:text-xs leading-relaxed"
                          style={{ color: MUTED }}
                        >
                          The amenity assessment is applied to the market rate
                          only. The government rate remains unchanged. The
                          resulting adjusted market rate is then combined with
                          the government rate using the selected valuation
                          weights.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
                      No property amenity information was provided.
                    </p>
                  )}
                </ResultSection>
                {/* Building section */}
                {buildingResult !== false &&
                  buildingResult &&
                  buildingResult.floors.length > 0 && (
                    <>
                      <ResultSection
                        number=""
                        title="Building valuation"
                        description="Construction cost, additional components and depreciation."
                      >
                        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                          <Metric
                            label="Total floor area"
                            value={`${formatNumber(buildingResult.totalFloorArea)} sqft`}
                          />
                          <Metric
                            label="Civil construction"
                            value={formatNPR(buildingResult.civilCost)}
                          />
                          <Metric
                            label="Gross building cost"
                            value={formatNPR(buildingResult.grossBuildingCost)}
                          />
                          <Metric
                            label="Depreciation"
                            value={formatNPR(
                              buildingResult.depreciation.amount,
                            )}
                          />
                        </div>

                        <div className="mt-5 sm:mt-6 overflow-x-auto">
                          <table className="w-full min-w-125 text-xs sm:text-sm">
                            <thead>
                              <tr
                                className="text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
                                style={{
                                  backgroundColor: "#f8f1e3",
                                  color: NAVY,
                                }}
                              >
                                {[
                                  "S.N.",
                                  "Floor",
                                  "Area (sq.ft.)",
                                  "Rate / sqft",
                                  "Construction cost",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3"
                                    style={{ borderColor: BORDER }}
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {buildingResult.floors.map((floor, index) => (
                                <tr
                                  key={floor.floor}
                                  className="border-t"
                                  style={{ borderColor: BORDER }}
                                >
                                  <td
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3"
                                    style={{
                                      borderColor: BORDER,
                                      color: MUTED,
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3 font-medium"
                                    style={{ borderColor: BORDER }}
                                  >
                                    {floor.floor}
                                  </td>
                                  <td
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3 text-right"
                                    style={{ borderColor: BORDER }}
                                  >
                                    {formatNumber(floor.area)}
                                  </td>
                                  <td
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3 text-right"
                                    style={{ borderColor: BORDER }}
                                  >
                                    {formatNPR(floor.ratePerSqft)}
                                  </td>
                                  <td
                                    className="border px-2.5 sm:px-4 py-2 sm:py-3 text-right font-semibold"
                                    style={{ borderColor: BORDER }}
                                  >
                                    {formatNPR(floor.cost)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-5 sm:mt-6 grid gap-px sm:grid-cols-3">
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
                            value={formatNPR(
                              buildingResult.presentBuildingValue,
                            )}
                            strong
                          />
                        </div>
                      </ResultSection>

                      <ResultSection
                        number=""
                        title="Depreciation statement"
                        description="How building depreciation was applied."
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-125 text-xs sm:text-sm">
                            <tbody>
                              <DetailRow
                                label="Building age"
                                value={`${buildingResult.depreciation.age} years`}
                              />
                              <DetailRow
                                label="Useful life"
                                value={`${buildingResult.depreciation.usefulLife} years`}
                              />

                              <DetailRow
                                label="Annual depreciation rate"
                                value={formatPercent(
                                  buildingResult.depreciation.annualRate,
                                )}
                              />
                              <DetailRow
                                label="Depreciation amount"
                                value={formatNPR(
                                  buildingResult.depreciation.amount,
                                )}
                              />
                            </tbody>
                          </table>
                        </div>
                      </ResultSection>
                    </>
                  )}

                {/* Inflation chart */}
                <ResultSection
                  number=""
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
                  className="grid gap-3 border-t px-3 sm:px-4 pt-4 sm:pt-5 text-[11px] sm:text-xs sm:grid-cols-3"
                  style={{ borderColor: BORDER, color: MUTED }}
                >
                  <div>
                    <p>Property reference</p>
                    <p
                      className="mt-1 font-mono font-semibold"
                      style={{ color: TEXT }}
                    >
                      {result.propertyId}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p>Record status</p>
                    <p className="mt-1 font-semibold text-green-700">
                      Valuation completed
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>

      {result && isReportOpen && (
        <ValuationReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          property={property}
          result={result}
        />
      )}
    </main>
  );
}

function AmenityResult({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div
      className="border-b p-3 sm:p-4 sm:border-r"
      style={{ borderColor: BORDER }}
    >
      <p
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: MUTED }}
      >
        {label}
      </p>

      <p
        className="mt-1.5 text-xs sm:text-sm font-semibold"
        style={{
          color:
            positive === true
              ? "#166534"
              : positive === false
                ? "#991b1b"
                : TEXT,
        }}
      >
        {value}
      </p>
    </div>
  );
}
