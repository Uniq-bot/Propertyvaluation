"use client";

import React from "react";
import { createPortal } from "react-dom";
import type { PropertyInput, ValuationResult, BuildingResult } from "@/types";
import { formatNPR, formatNumber, formatPercent } from "@/lib/functions";
import {
  Printer,
  X,
  ShieldCheck,
  Building2,
  MapPin,
  Scale,
  TrendingUp,
  Calendar,
  FileText,
  LandPlot,
  Image as Img,
} from "lucide-react";
import Image from "next/image";

interface ValuationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyInput;
  result: ValuationResult;
}
interface ImageType {
  url: string;
  type: string;
  name: string;
}
export function ValuationReportModal({
  isOpen,
  onClose,
  property,
  result,
}: ValuationReportModalProps) {
  const buildingResult = result.building as BuildingResult | false;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toImageUrl = (value?: File | string | null) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  };

  const imageUrls: ImageType[] = [
    ...(property.images ?? []).map((img) => ({
      url: toImageUrl(img.file),
      type: img.type,
      name: img.name || img.type,
    })),
    ...(property.nearestRoadImage
      ? [
          {
            url: toImageUrl(property.nearestRoadImage),
            type: "nearestRoad",
            name: "Nearest Road Image",
          },
        ]
      : []),
  ].filter((img) => Boolean(img.url));

  const nearestRoadImages = imageUrls.filter(
    (img) => img.type === "nearestRoad",
  );
  const otherImages = imageUrls.filter((img) => img.type !== "nearestRoad");
  const coverImageUrl =
    otherImages[0]?.url || imageUrls[0]?.url || "/image.png";
  const landAreaSqft = result.landAreaAana * 342.25;

  const handlePrint = () => {
    window.print();
  };

  const modal = (
    <div
      id="valuation-report-root"
      className="report-modal-backdrop fixed inset-0 z-50 flex  items-start justify-center overflow-y-auto bg-black/60 p-2 sm:p-6"
    >
      {/* Modal Container */}
      <div className="report-modal-content relative my-4 sm:my-8 w-full max-w-4xl -white shadow-2xl overflow-hidden text-[#10151f]">
        {/* Top Action Bar (Screen Only) */}
        <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#e8dfc8] bg-white px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#8a5a00]" />
            <span className="font-[PoppinsRegular] text-sm sm:text-lg font-bold text-[#10151f]">
              Valuation Report Preview
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gold-gradient inline-flex items-center gap-1.5 sm:gap-2 -3 sm:px-5 py-1.5 sm:py-2 text-xs px-10 sm:text-sm font-bold text-[#10151f] transition hover:opacity-90 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="xs:hidden ">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className=" border-[#e8dfc8] bg-white p-1.5 sm:p-2 text-[#475569] hover:bg-[#f7f3ea] transition"
              aria-label="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
        {/* cover page */}
        <div className="w-full min-h-screen bg-white text-[#10151f] font-[PoppinsRegular]">
          {/* Header */}
          <nav className="w-full px-6 py-6 sm:px-10 sm:py-5 border-b border-[#e8dfc8]">
            <div className="flex items-center gap-4">
              <Image
                src="/image.png"
                alt="EkPratishat Logo"
                width={100}
                height={100}
                className="h-16 w-24 sm:h-20 sm:w-28 object-contain"
              />

              <div className="border-l border-[#d6c69a] pl-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  EkPratishat Real Estate
                </h1>

                <p className="mt-1 text-xs sm:text-sm md:text-base text-[#64748b] font-sans tracking-wide">
                  Property Valuation and Consultancy
                </p>
              </div>
            </div>
          </nav>

          {/* Cover Content */}
          <main className="flex flex-col items-center px-6 py-7 sm:px-10 sm:py-5">
            {/* Report Title */}
            <div className="text-center">
              <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#8a5a00]">
                Certified Valuation Report
              </p>

              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-medium">
                Report on
              </h1>

              <h2 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-bold">
                Property Valuation
              </h2>

              <div className="mx-auto mt-5 h-1 w-16  bg-[#f1c810]" />
            </div>

            {/* Property Image */}
            <div className="mt-10 w-full max-w-2xl">
              <div className="overflow-hidden  border border-[#e8dfc8] bg-[#f8f7f3]  shadow-sm">
                <img
                  src={coverImageUrl}
                  alt="Property"
                  className="h-70 sm:h-87.5 md:h-100 w-full object-cover"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="mt-10 w-full max-w-2xl">
              <div className=" border border-[#e8dfc8] bg-[#fcfbf8] p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
                  {/* Owner */}
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8a5a00]">
                      Owner Name
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#10151f]">
                      {property.ownerDetails.ownerName}
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8a5a00]">
                      Property Address
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#10151f]">
                      {property.location.municipality},{" "}
                      {property.location.district}
                    </p>
                  </div>

                  {/* Prepared By */}
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8a5a00]">
                      Prepared By
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#10151f]">
                      {result.valuatorDetail.valuatorName}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8a5a00]">
                      Date of Valuation
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#10151f]">
                      {currentDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* Executive Summary — document style, left-aligned */}
        <div className="min-h-screen bg-white p-6 sm:p-10">
          <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Executive Summary</h2>

            <div className="mt-4 text-sm text-[#10151f] leading-relaxed">
              <p>
                This certified valuation report provides the concluded market
                value for the subject property based on the valuation
                methodology and inputs documented in this report. The valuation
                has been prepared in good faith for the stated client and for
                the stated purpose.
              </p>

              <p className="mt-3">
                Subject property:{" "}
                <strong className="text-[#10151f]">
                  {property.plotNumber || "—"}
                </strong>{" "}
                — located at{" "}
                <strong>
                  {property.location.municipality}, {property.location.district}, {property.location.tole}
                </strong>
                .
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] uppercase text-[#64748b]">
                    Final Property Value
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {formatNPR(result.finalValue)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase text-[#64748b]">
                    Land Value
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {formatNPR(result.land.landValue)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase text-[#64748b]">
                    Area
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {formatNumber(result.landAreaAana)} Aana
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-[#64748b]">
                <div>
                  <strong>Valuation Method (Land):</strong>{" "}
                  {result.valuationMethod?.land || "—"}
                </div>
                <div className="mt-1">
                  <strong>Valuation Method (Building):</strong>{" "}
                  {result.valuationMethod?.building || "—"}
                </div>
                <div className="mt-1">
                  <strong>Audit Weights:</strong> Govt{" "}
                  {result.audit?.governmentWeight ??
                    result.land.weights.government}
                  % · Market{" "}
                  {result.audit?.marketWeight ?? result.land.weights.market}%
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table of contents */}
        <div className="min-h-screen bg-white p-6 sm:p-10">
          <div className="w-full max-w-3xl mx-auto">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#8a5a00]">
              Contents
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#10151f]">
              Table of Contents
            </h2>

            <div className="mt-3 h-1 w-16 bg-[#f1c810]" />

            <div className="mt-8 border border-[#e8dfc8] bg-[#fcfbf8]">
              {[
                "General",
                "Structural / Site Factors",
                "Rates of Land",
                "Calculation & Conclusion",
                "Possible Future Improvements",
                "Certification & Signatures",
                "Annex - Images",
              ].map((title, index, arr) => (
                <div
                  key={title}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    index !== arr.length - 1 ? "border-b border-[#e8dfc8]" : ""
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d6c69a] bg-white font-mono text-xs font-bold text-[#8a5a00]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm sm:text-base font-semibold text-[#10151f]">
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-10 space-y-8 text-[#10151f]">
          <div className="border-b-2 border-[#10151f] pb-5">
            <div className="flex justify-between items-start gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a5a00]">
                  Property Valuation Report
                </p>

                <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
                  LAND & BUILDING VALUATION
                </h1>

                <p className="mt-1 text-xs text-[#64748b]">
                  Bagmati Province · Nepal
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-[#64748b]">
                  Report Reference
                </p>

                <p className="font-mono text-xs font-bold">
                  {result.propertyId}
                </p>

                <p className="mt-1 text-xs text-[#64748b]">
                  Date: {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
      01 — GENERAL
  ========================================================= */}
          <section className="report-section w-full">
            <SectionHeading number="01" title="General" />

            <div className="mt-4 border border-[#e8dfc8]">
              {/* Client / Owner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#e8dfc8]">
                <Detail
                  label="Name of Bank / Client"
                  value={property.clientDetails?.clientName || "—"}
                />

                <Detail
                  label="Property / Plot Number"
                  value={property.plotNumber || "—"}
                />

                <Detail
                  label="Owner Name"
                  value={property.ownerDetails?.ownerName || "—"}
                />

                <Detail
                  label="Owner Contact"
                  value={property.ownerDetails?.ownerNumber || "—"}
                />
              </div>

              {/* Location */}
              <div className="p-4 bg-[#faf8f2] border-b border-[#e8dfc8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a5a00]">
                  Location of Land
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  <Detail label="District" value={property.location.district} />

                  <Detail
                    label="Municipality"
                    value={property.location.municipality}
                  />

                  <Detail
                    label="Ward No."
                    value={`Ward ${property.location.ward}`}
                  />
                  <Detail
                    label="Tole"
                    value={String(property.location.tole)}
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="p-4 border-b border-[#e8dfc8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a5a00]">
                  Coordinates
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <Detail
                    label="Latitude"
                    value={String(property.location.latitude)}
                  />

                  <Detail
                    label="Longitude"
                    value={String(property.location.longitude)}
                  />
                  
                </div>
              </div>

              {/* Four Boundaries */}
              <div className="p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a5a00]">
                  Four-Boundary Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <Boundary
                    direction="East"
                    value={property.boundaryDetails.east}
                  />

                  <Boundary
                    direction="West"
                    value={property.boundaryDetails.west}
                  />

                  <Boundary
                    direction="North"
                    value={property.boundaryDetails.north}
                  />

                  <Boundary
                    direction="South"
                    value={property.boundaryDetails.south}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Detail label="Nearest Road" value={property.nearestRoad} />

              <Detail
                label="Nearest Landmark"
                value={property.nearestLandMark}
              />
            </div>
          </section>

        
          <section className="report-section">
            <SectionHeading number="02" title="Structural / Site Factors" />

            <p className="mt-2 text-xs text-[#64748b]">
              Site characteristics and structural factors observed during the
              property assessment.
            </p>

            <div className="mt-4 overflow-hidden">
              {property.structuralAmenities?.length ? (
                <table className="w-full text-xs border-collapse border border-[#e8dfc8]">
                  <thead className="bg-[#f8f1e3]">
                    <tr>
                      <th className="p-3 text-left border border-[#e8dfc8]">S.N.</th>
                      <th className="p-3 text-left border border-[#e8dfc8]">Factor / Amenity</th>
                      <th className="p-3 text-left border border-[#e8dfc8]">Observed Value</th>
                    </tr>
                  </thead>

                  <tbody>
                    {property.structuralAmenities.map((amenity, index) => (
                      <tr key={`${amenity.factor}-${index}`}>
                        <td className="p-3 border border-[#e8dfc8]">{index + 1}</td>

                        <td className="p-3 font-semibold border border-[#e8dfc8]">{amenity.factor}</td>

                        <td className="p-3 text-[#475569] border border-[#e8dfc8]">
                          {amenity.observedValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-xs text-[#64748b] border border-[#e8dfc8]">
                  No structural or site factors were provided.
                </p>
              )}
            </div>
          </section>

  
          
          <section className="report-section">
            <SectionHeading number="03" title="Calculation of Land Area" />

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <AreaCard label="Ropani" value={property.landArea.ropani} />

              <AreaCard label="Aana" value={property.landArea.aana} />

              <AreaCard label="Paisa" value={property.landArea.paisa} />

              <AreaCard label="Dam" value={property.landArea.dam} />
            </div>

            {/* Conversion */}
            <div className="mt-4 border border-[#e8dfc8]">
              <div className="p-4 bg-[#faf8f2]">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Calculation of Aana and Square Feet
                </h3>

                <div className="mt-3 space-y-2 text-xs text-[#475569]">
                  <p>
                    <strong>1 Aana</strong> = 342.25 sq.ft.
                  </p>

                  <p>
                    Total Land Area ={" "}
                    <strong>{formatNumber(result.landAreaAana)} Aana</strong>
                  </p>

                  <p>
                    Equivalent Area ={" "}
                    <strong>{formatNumber(landAreaSqft)} sq.ft.</strong>
                  </p>
                </div>
              </div>
            </div>
          </section>

          
       <section className="report-section">
            <SectionHeading number="04" title="Valuation of Land" />

            <table className="mt-4 w-full text-xs border-collapse border border-[#e8dfc8]">
              <thead className="bg-[#f8f1e3]">
                <tr>
                  <th className="p-3 text-left border border-[#e8dfc8]">Particulars</th>
                  <th className="p-3 text-right border border-[#e8dfc8]">Rate / Aana</th>
                  <th className="p-3 text-center border border-[#e8dfc8]">Weight</th>
                  <th className="p-3 text-right border border-[#e8dfc8]">Contribution</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-3 font-semibold border border-[#e8dfc8]">Government Rate</td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(property.governmentRate)}
                  </td>

                  <td className="p-3 text-center border border-[#e8dfc8]">
                    {formatPercent(property.governmentWeight)}
                  </td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(
                      property.governmentRate * property.governmentWeight,
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold border border-[#e8dfc8]">Market Rate</td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(property.marketRate)}
                  </td>

                  <td className="p-3 text-center border border-[#e8dfc8]">
                    {formatPercent(property.marketWeight)}
                  </td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(property.marketRate * property.marketWeight)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border border-[#e8dfc8]">Fair market value (FVM)</td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(result.finalValue)}
                  </td>

                  <td className="p-3 text-center border border-[#e8dfc8]">
                    {`${formatPercent(property.marketWeight)} of market rate + ${formatPercent(property.governmentWeight)} of government rate`}
                  </td>

                  <td className="p-3 text-right border border-[#e8dfc8]">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border border-[#e8dfc8]">Distressed Rate (80%)</td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(result.finalValue*0.8)}
                  </td>

                  <td className="p-3 text-center border border-[#e8dfc8]">
                    {`80% of fair market value (FVM)`}
                  </td>

                  <td className="p-3 text-right border border-[#e8dfc8]">-</td>
                </tr>

                <tr className="bg-[#f7f3ea] font-bold">
                  <td className="p-3 border border-[#e8dfc8]">Adopted Land Rate</td>

                  <td colSpan={3} className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(result.land.adoptedRate)} / Aana
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          
          {buildingResult && (
            <section className="report-section">
              <SectionHeading number="05" title="Calculation of Building" />

              <p className="mt-2 text-xs text-[#64748b]">
                Building valuation is calculated using the cost approach with
                applicable additions and depreciation.
              </p>

              {/* Floor calculation */}

              <table className="mt-4 w-full text-xs border-collapse border border-[#e8dfc8]">
                <thead className="bg-[#f8f1e3]">
                  <tr>
                    <th className="p-3 text-left border border-[#e8dfc8]">S.N.</th>

                    <th className="p-3 text-left border border-[#e8dfc8]">Floor</th>

                    <th className="p-3 text-right border border-[#e8dfc8]">Area (sq.ft.)</th>

                    <th className="p-3 text-right border border-[#e8dfc8]">Rate / sq.ft.</th>

                    <th className="p-3 text-right border border-[#e8dfc8]">Civil Cost</th>
                  </tr>
                </thead>

                <tbody>
                  {buildingResult.floors.map((floor, index) => (
                    <tr key={index}>
                      <td className="p-3 border border-[#e8dfc8]">{index + 1}</td>

                      <td className="p-3 font-semibold border border-[#e8dfc8]">{floor.floor}</td>

                      <td className="p-3 text-right border border-[#e8dfc8]">
                        {formatNumber(floor.area)}
                      </td>

                      <td className="p-3 text-right border border-[#e8dfc8]">
                        {formatNPR(floor.ratePerSqft)}
                      </td>

                      <td className="p-3 text-right border border-[#e8dfc8]">
                        {formatNPR(floor.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-[#fffdf8] font-bold">
                  <tr>
                    <td colSpan={2} className="p-3 border border-[#e8dfc8]">
                      Total
                    </td>

                    <td className="p-3 text-right border border-[#e8dfc8]">
                      {formatNumber(buildingResult.totalFloorArea)}
                    </td>

                    <td className="border border-[#e8dfc8]" />

                    <td className="p-3 text-right border border-[#e8dfc8]">
                      {formatNPR(buildingResult.civilCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Building additions */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <ValueCard
                  label={`Sanitary Installation (${formatPercent(
                    buildingResult.sanitary.rate,
                  )})`}
                  value={formatNPR(buildingResult.sanitary.cost)}
                />

                <ValueCard
                  label={`Electrical Installation (${formatPercent(
                    buildingResult.electrical.rate,
                  )})`}
                  value={formatNPR(buildingResult.electrical.cost)}
                />

                <ValueCard
                  label="Gross Replacement Cost"
                  value={formatNPR(buildingResult.grossBuildingCost)}
                />
              </div>

              {/* Depreciation */}

              <div className="mt-4 border border-[#e8dfc8] p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Depreciation Calculation
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <Detail
                    label="Building Age"
                    value={`${buildingResult.depreciation.age} Years`}
                  />

                  <Detail
                    label="Useful Life"
                    value={`${buildingResult.depreciation.usefulLife} Years`}
                  />

                  <Detail
                    label="Annual Depreciation Rate"
                    value={formatPercent(
                      buildingResult.depreciation.annualRate,
                    )}
                  />

                  <Detail
                    label="Depreciation Amount"
                    value={`-${formatNPR(buildingResult.depreciation.amount)}`}
                  />
                </div>

                <div className="mt-4 flex justify-between items-center bg-[#f7f3ea] p-3">
                  <span className="font-semibold">Present Building Value</span>

                  <span className="text-lg font-bold">
                    {formatNPR(buildingResult.presentBuildingValue)}
                  </span>
                </div>
              </div>
            </section>
          )}

          
          <section className="report-section">
            <SectionHeading number="06" title="Summary of Calculation" />

            <table className="mt-4 w-full text-xs border-collapse border border-[#e8dfc8]">
              <thead className="bg-[#f8f1e3]">
                <tr>
                  <th className="p-3 text-left border border-[#e8dfc8]">Particulars</th>

                  <th className="p-3 text-right border border-[#e8dfc8]">Fair Market Value</th>

                  <th className="p-3 text-right border border-[#e8dfc8]">80% Distress Value</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-3 font-semibold border border-[#e8dfc8]">Land Value</td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(result.land.landValue)}
                  </td>

                  <td className="p-3 text-right border border-[#e8dfc8]">
                    {formatNPR(Math.round(result.land.landValue * 0.8))}
                  </td>
                </tr>

                {buildingResult && (
                  <tr>
                    <td className="p-3 font-semibold border border-[#e8dfc8]">Building Value</td>

                    <td className="p-3 text-right border border-[#e8dfc8]">
                      {formatNPR(buildingResult.presentBuildingValue)}
                    </td>

                    <td className="p-3 text-right border border-[#e8dfc8]">
                      {formatNPR(
                        Math.round(buildingResult.presentBuildingValue * 0.8),
                      )}
                    </td>
                  </tr>
                )}

                <tr className="bg-[#e1e1e1]  text-black">
                  <td className="p-4 font-bold text-sm border border-[#e8dfc8] bg-[#e1e1e1] text-black">
                    TOTAL PROPERTY VALUE
                  </td>

                  <td className="p-4 text-right font-bold text-sm border border-[#e8dfc8] bg-[#e1e1e1] text-black]">
                    {formatNPR(result.finalValue)}
                  </td>

                  <td className="p-4 text-right font-bold text-sm border border-[#e8dfc8] bg-[#e1e1e1] text-black]">
                    {formatNPR(Math.round(result.finalValue * 0.8))}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

        
          <section className="report-section">
            <SectionHeading number="07" title="Possible Future Improvements" />

            <div className="mt-4 border border-[#e8dfc8] bg-[#fffdf8] p-4">
              <p className="text-xs leading-relaxed text-[#475569]">
                {property.possibleFutureInhanceMents ||
                  "No future improvements specified."}
              </p>
            </div>
          </section>

          {/* =========================================================
      CERTIFICATION
  ========================================================= */}
          <section className="report-section border-t-2 border-[#10151f] pt-6">
            <p className="text-[11px] leading-relaxed text-[#64748b]">
              This valuation report presents the assessment of the subject
              property based on the information, rates, site factors and
              valuation methodology recorded in the assessment.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-10">
              <Signature
                title="Valuation Officer"
                name={result.valuatorDetail?.valuatorName}
                designation="Licensed Valuer"
              />

              <Signature
                title="Verifying Authority"
                name={"EkPratishat Real Estate"}
                designation="Verifying Authority"
              />

              <div className="flex justify-center">
                <div className="h-20 w-20 border-2 border-dashed border-[#d6a936] flex items-center justify-center text-[9px] text-center font-bold text-[#8a5a00]">
                  OFFICIAL
                  <br />
                  STAMP
                </div>
              </div>
            </div>
          </section>
        </div>
        <div
          className="annex-page min-h-screen bg-white p-4 sm:p-10"
          style={{ pageBreakBefore: "always", breakBefore: "page" }}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8a5a00]">
            Annex
          </h3>
          <h2 className="mt-1 text-2xl font-bold text-[#10151f]">Images</h2>

          {/* Nearest Road Image */}
          <div className="report-section mt-6 border-t border-[#e8dfc8] pt-6">
            <h3 className="text-sm font-bold">Nearest Road Image</h3>

            {nearestRoadImages.length ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {nearestRoadImages.map((img, idx) => (
                  <figure
                    key={idx}
                    className="border border-[#e8dfc8] bg-white p-3 sm:p-4 shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-48 object-cover"
                    />
                    <figcaption className="mt-3 text-xs text-[#64748b]">
                      <strong className="text-sm text-[#10151f]">
                        {img.name}
                      </strong>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#64748b]">
                No nearest road image provided.
              </p>
            )}
          </div>

          {/* Other Property Images */}
          <div className="report-section mt-8 border-t border-[#e8dfc8] pt-6">
            <h3 className="text-sm font-bold">Property Images</h3>

            {otherImages.length ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {otherImages.map((img, idx) => (
                  <figure
                    key={idx}
                    className="border border-[#e8dfc8] bg-white p-3 sm:p-4 shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-48 object-cover"
                    />
                    <figcaption className="mt-3 text-xs text-[#64748b]">
                      <strong className="text-sm text-[#10151f]">
                        {img.name}
                      </strong>
                      <div className="text-[11px] mt-1">Type: {img.type}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#64748b]">
                No additional images provided.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html,
          body {
            height: fit !important;
            overflow: visible !important;
          }

          /* Because the modal is portaled to document.body, this hides
             every other top-level app wrapper (layout shells, sidebars,
             scroll containers) in one shot — no nested overflow/height
             constraints from the app tree can clip the report anymore. */
          body > *:not(#valuation-report-root) {
            display: none !important;
          }

          #valuation-report-root {
            position: static !important;
            inset: auto !important;
            display: block !important;
            overflow: visible !important;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          .report-modal-content {
            position: static !important;
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }

          /* Force white backgrounds for printing to avoid odd colored PDF backgrounds */
          .report-modal-content,
          .report-modal-content * {
            background: transparent !important;
            background-color: #ffffff !important;
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .report-modal-content img {
            max-width: 100% !important;
            height: auto !important;
          }

          /* Keep each report section together where it reasonably fits.
             If a section doesn't fit in the remaining space on the current
             page, push the WHOLE section (heading + content) to a fresh
             page instead of leaving a lonely heading at the bottom. If a
             section is genuinely taller than one page, the browser will
             still break inside it as a last resort — that's expected. */
          .report-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Never split a table across a break, and never leave a heading
             stranded with no content following it. */
          table {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          h1,
          h2,
          h3 {
            break-after: avoid;
            page-break-after: avoid;
            orphans: 3;
            widows: 3;
          }

          .annex-page {
            page-break-before: always !important;
            break-before: page !important;
          }

          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
}

const SectionHeading = ({
  number,
  title,
}: {
  number: string;
  title: string;
}) => (
  <div className="flex items-center gap-3 border-b-2 border-[#10151f] pb-2">
    <span className="font-mono text-xs font-bold text-[#8a5a00]">{number}</span>

    <h2 className="text-sm sm:text-lg font-bold">{title}</h2>
  </div>
);

const Detail = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="p-4 border-b border-[#e8dfc8]">
    <span className="block text-[10px] uppercase tracking-wide font-semibold text-[#64748b]">
      {label}
    </span>

    <span className="block mt-1 text-xs font-bold text-[#10151f]">
      {value || "—"}
    </span>
  </div>
);

const Boundary = ({
  direction,
  value,
}: {
  direction: string;
  value?: string;
}) => (
  <div className="border border-[#e8dfc8] p-3">
    <span className="block text-[10px] uppercase font-bold text-[#64748b]">
      {direction}
    </span>

    <span className="block mt-1 text-xs font-semibold">{value || "—"}</span>
  </div>
);

const AreaCard = ({ label, value }: { label: string; value: number }) => (
  <div className="border border-[#e8dfc8] bg-[#fffdf8] p-4">
    <span className="block text-[10px] uppercase tracking-wide text-[#64748b]">
      {label}
    </span>

    <span className="block mt-1 text-xl font-bold">{formatNumber(value)}</span>
  </div>
);

const ValueCard = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-[#e8dfc8] bg-[#fffdf8] p-4">
    <span className="block text-[10px] uppercase tracking-wide text-[#64748b]">
      {label}
    </span>

    <span className="block mt-1 text-sm font-bold">{value}</span>
  </div>
);

const Signature = ({
  title,
  name,
  designation,
}: {
  title: string;
  name?: string;
  designation?: string;
}) => (
  <div>
    <div className="h-16 border-b border-dashed border-[#10151f]" />

    <p className="mt-2 text-center text-xs font-bold">{title}</p>

    <p className="mt-1 text-center text-sm font-semibold">{name || "—"}</p>

    <p className="text-center text-[10px] text-[#64748b]">
      {designation || "Signature & Seal"}
    </p>
  </div>
);