"use client";

import React, { useEffect, useState } from "react";
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
  Route,
  LandPlot,
  Droplets,
  Zap,
  Car,
  Image,
} from "lucide-react";

interface ValuationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyInput;
  result: ValuationResult;
}

export function ValuationReportModal({
  isOpen,
  onClose,
  property,
  result,
}: ValuationReportModalProps) {
  // Portal target must wait for the client — document isn't available during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;
  const buildingResult = result.building as BuildingResult | false;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const landAreaSqft = property.landAreaAana * 342.25;

  const handlePrint = () => {
    window.print();
  };

  const modal = (
    <div
      id="valuation-report-root"
      className="report-modal-backdrop fixed inset-0 z-50 flex  items-start justify-center overflow-y-auto bg-black/60 p-2 sm:p-6"
    >
      {/* Modal Container */}
      <div className="report-modal-content relative my-4 sm:my-8 w-full max-w-4xl rounded bg-white shadow-2xl overflow-hidden text-[#10151f]">
          
        {/* Top Action Bar (Screen Only) */}
        <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#e8dfc8] bg-white px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#8a5a00]" />
            <span className="font-serif text-sm sm:text-lg font-bold text-[#10151f]">
              Valuation Report Preview
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gold-gradient inline-flex items-center gap-1.5 sm:gap-2 rounded px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#10151f] transition hover:opacity-90 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Print / Save PDF</span>
              <span className="xs:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[#e8dfc8] bg-white p-1.5 sm:p-2 text-[#475569] hover:bg-[#f7f3ea] transition"
              aria-label="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
        {/* cover page */}
        <div className="w-full h-screen">
          <nav className="w-full  px-6 sm:py-6 sm:px-10  bg-[#f7f3ea]">
            <h1>
              EkPratishat Real Estate
            </h1>
            <p>
              Property Valuation and Consultancy
            </p>
          </nav>
        </div>
        {/* Printable Report Document Body */}
        <div className="p-4 sm:p-10 space-y-6 sm:space-y-8 bg-white">
          {/* Header & Emblem */}
          <div className="border-b-2 border-[#10151f] pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-600" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#475569]">
                    Bagmati Province · Nepal Real Estate Appraisal
                  </span>
                </div>
                <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-[#10151f] mt-1">
                  PROPERTY VALUATION REPORT
                </h1>
                <p className="text-[11px] sm:text-xs text-[#64748b] mt-0.5">
                  Official Land & Infrastructure Valuation Assessment
                </p>
              </div>

              <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-[#d6a936] pl-3 sm:pl-0 sm:pr-3">
                <div className="inline-flex items-center gap-1.5 rounded bg-[#fdf6dc] border border-[#e5c87a] px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-[#8a5a00]">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  VERIFIED & COMPLETED
                </div>
                <p className="font-mono text-[11px] sm:text-xs font-semibold text-[#10151f] mt-1.5">
                  Ref: {result.propertyId}
                </p>
                <p className="text-[11px] sm:text-xs text-[#64748b] flex items-center sm:justify-end gap-1 mt-0.5">
                  <Calendar className="h-3 w-3 inline" /> {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div className="rounded border-2 border-[#10151f] bg-[#fffdf8] p-4 sm:p-6 shadow-sm">
            <div className="text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#475569]">
                  Total Appraised Property Value
                </p>
                <p className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-[#10151f] mt-1 break-words">
                  {formatNPR(result.finalValue)}
                </p>
                <p className="text-[11px] sm:text-xs text-[#64748b] mt-1">
                  Valuation currency: Nepalese Rupee ({result.currency})
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t sm:border-t-0 sm:border-l border-[#e8dfc8] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto text-center sm:text-left">
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#475569]">
                    Land Component
                  </p>
                  <p className="font-serif text-sm sm:text-lg font-bold text-[#10151f] break-words">
                    {formatNPR(result.land.landValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#475569]">
                    Building Component
                  </p>
                  <p className="font-serif text-sm sm:text-lg font-bold text-[#10151f] break-words">
                    {buildingResult
                      ? formatNPR(buildingResult.presentBuildingValue)
                      : "N/A (Land Only)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Location & Specification */}
          <div>
            <h2 className="font-serif text-sm sm:text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8a5a00]" />
              Property Location & General Details
            </h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded bg-[#f7f3ea] p-3 sm:p-4 text-[11px] sm:text-xs">
              <div>
                <span className="block font-semibold text-[#475569]">
                  District
                </span>
                <span className="font-bold text-[#10151f]">
                  {property.location.district || "—"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">
                  Municipality
                </span>
                <span className="font-bold text-[#10151f]">
                  {property.location.municipality || "—"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">
                  Ward No.
                </span>
                <span className="font-bold text-[#10151f]">
                  Ward {property.location.ward}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">
                  Land Area
                </span>
                <span className="font-bold text-[#10151f]">
                  {formatNumber(property.landAreaAana)} Aana (
                  {formatNumber(landAreaSqft)} sq.ft.)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Land Valuation Schedule */}
          <div>
            <h2 className="font-serif text-sm sm:text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8a5a00]" />
              Land Valuation Breakdown (Weighted Average Method)
            </h2>
            <p className="text-[11px] sm:text-xs text-[#475569] mt-1.5 mb-3">
              Standard weighting applied: 30% Government Rate + 70% Market Rate
              per Aana.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-[11px] sm:text-xs text-left border border-[#e8dfc8]">
                <thead className="bg-[#f8f1e3] text-[#10151f] font-semibold border-b border-[#e8dfc8]">
                  <tr>
                    <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                      S.N.
                    </th>
                    <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                      Category
                    </th>
                    <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                      Rate / Aana
                    </th>
                    <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-center">
                      Weight
                    </th>
                    <th className="p-2 sm:p-2.5 text-right">
                      Weighted Contribution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8dfc8]">
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                      1
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] font-medium">
                      Government Valuation Rate
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                      {formatNPR(result.land.inputs.governmentRate)}
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-center">
                      {formatPercent(result.land.weights.government)}
                    </td>
                    <td className="p-2 sm:p-2.5 text-right font-medium">
                      {formatNPR(
                        result.land.inputs.governmentRate *
                          result.land.weights.government,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                      2
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] font-medium">
                      Market Valuation Rate
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                      {formatNPR(result.land.inputs.marketRate)}
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-center">
                      {formatPercent(result.land.weights.market)}
                    </td>
                    <td className="p-2 sm:p-2.5 text-right font-medium">
                      {formatNPR(
                        result.land.inputs.marketRate *
                          result.land.weights.market,
                      )}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#fffdf8] font-bold border-t-2 border-[#10151f]">
                  <tr>
                    <td
                      colSpan={2}
                      className="p-2 sm:p-2.5 border-r border-[#e8dfc8]"
                    >
                      Adopted Land Rate
                    </td>
                    <td
                      colSpan={3}
                      className="p-2 sm:p-2.5 text-right text-xs sm:text-sm text-[#10151f]"
                    >
                      {formatNPR(result.land.adoptedRate)} / Aana
                    </td>
                  </tr>
                  <tr className="bg-[#f7f3ea]">
                    <td
                      colSpan={2}
                      className="p-2 sm:p-2.5 border-r border-[#e8dfc8]"
                    >
                      TOTAL LAND VALUE ({formatNumber(property.landAreaAana)}{" "}
                      Aana)
                    </td>
                    <td
                      colSpan={3}
                      className="p-2 sm:p-2.5 text-right text-sm sm:text-base text-[#10151f]"
                    >
                      {formatNPR(result.land.landValue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          {/* Section 3: Property Factors & Amenities */}
          <div>
            <h2 className="font-serif text-sm sm:text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <LandPlot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8a5a00]" />
              Property Factors & Amenities
            </h2>

            <p className="text-[11px] sm:text-xs text-[#475569] mt-1.5 mb-3">
              Site characteristics and basic infrastructure considered in the
              market-rate assessment.
            </p>

            {/* Amenity score */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded border border-[#e8dfc8] bg-[#fffdf8] p-3 sm:p-4">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                  Amenity Score
                </span>

                <div className="mt-1 flex items-end gap-1">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#10151f]">
                    {Math.round(result.land.amenityScore ?? 0)}
                  </span>
                  <span className="mb-1 text-[11px] sm:text-xs text-[#64748b]">
                    / 100
                  </span>
                </div>
              </div>

              <div className="rounded border border-[#e8dfc8] bg-[#fffdf8] p-3 sm:p-4">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                  Market Adjustment
                </span>

                <span
                  className={`mt-1 block font-serif text-xl sm:text-2xl font-bold ${
                    (result.land.amenityAdjustment ?? 0) >= 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {(result.land.amenityAdjustment ?? 0) >= 0 ? "+" : ""}
                  {((result.land.amenityAdjustment ?? 0) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="rounded border border-[#e8dfc8] bg-[#fffdf8] p-3 sm:p-4">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#64748b]">
                  Adjusted Market Rate
                </span>

                <span className="mt-1 block font-serif text-base sm:text-xl font-bold text-[#10151f] break-words">
                  {formatNPR(result.land.inputs.marketRate)}
                  <span className="ml-1 text-[11px] sm:text-xs font-normal text-[#64748b]">
                    / Aana
                  </span>
                </span>
              </div>
            </div>

            {/* Amenity details */}
            <div className="overflow-hidden rounded border border-[#e8dfc8]">
              <div className="grid grid-cols-2 sm:grid-cols-3">
                <AmenityReportItem
                  icon={<Route className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Road Width"
                  value={`${property.structuralAmenities?.roadWidth ?? 0} ft`}
                />
                <AmenityReportItem
                  icon={<Route className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Road Type"
                  value={
                    property.structuralAmenities?.roadType || "Not specified"
                  }
                />
                <AmenityReportItem
                  icon={<Route className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Road Condition"
                  value={
                    property.structuralAmenities?.roadCondition ||
                    "Not specified"
                  }
                />
                <AmenityReportItem
                  icon={<LandPlot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Land Shape"
                  value={
                    property.structuralAmenities?.landShape || "Not specified"
                  }
                />
                <AmenityReportItem
                  icon={<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Land Facing"
                  value={
                    property.structuralAmenities?.landFacing || "Not specified"
                  }
                />
                <AmenityReportItem
                  icon={<Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Water Supply"
                  value={
                    property.structuralAmenities?.waterSupply
                      ? "Available"
                      : "Not available"
                  }
                  positive={property.structuralAmenities?.waterSupply}
                />
                <AmenityReportItem
                  icon={<Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Drainage"
                  value={
                    property.structuralAmenities?.drainage
                      ? "Available"
                      : "Not available"
                  }
                  positive={property.structuralAmenities?.drainage}
                />
                <AmenityReportItem
                  icon={<Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Electricity"
                  value={
                    property.structuralAmenities?.electricity
                      ? "Available"
                      : "Not available"
                  }
                  positive={property.structuralAmenities?.electricity}
                />
                <AmenityReportItem
                  icon={<Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  label="Parking"
                  value={
                    property.structuralAmenities?.parkingAvailable
                      ? "Available"
                      : "Not available"
                  }
                  positive={property.structuralAmenities?.parkingAvailable}
                />
              </div>
            </div>

            <div className="mt-3 rounded bg-[#f7f3ea] px-3 py-2.5 text-[10px] sm:text-[11px] leading-relaxed text-[#475569]">
              <strong className="text-[#10151f]">Assessment note:</strong>{" "}
              Property amenities are used to adjust the prevailing market land
              rate. The government valuation rate remains unchanged.
            </div>
          </div>
          {/* Images */}
          {property.images && property.images.length > 0 && (
            <div className="mt-6 sm:mt-8 print:mt-6">
              {/* Section Header */}
              <div className="mb-4 flex items-end justify-between border-b-2 border-[#10151f] pb-2">
                <div>
                  <h2 className="flex items-center gap-2 font-serif text-base sm:text-xl font-bold text-[#10151f]">
                    <Image className="h-4 w-4 sm:h-5 sm:w-5 text-[#8a5a00]" />
                    Property Images
                  </h2>

                  <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                    Visual documentation of the property and site
                  </p>
                </div>

                <span className="text-[11px] sm:text-xs font-medium text-gray-500">
                  {property.images.length}{" "}
                  {property.images.length === 1 ? "Image" : "Images"}
                </span>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 print:grid-cols-2">
                {property.images.map((img, idx) => (
                  <div
                    key={`${img.type}-${idx}`}
                    className="overflow-hidden rounded border border-[#d9d0bc] bg-white print:break-inside-avoid"
                  >
                    {/* Image Header */}
                    <div className="flex items-center justify-between border-b border-[#e8dfc8] bg-[#faf8f2] px-3 py-2">
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a5a00]">
                          {img.name}
                        </p>

                        <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                          Property documentation
                        </p>
                      </div>

                      <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#10151f] text-[9px] sm:text-[10px] font-semibold text-white">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative h-48 sm:h-70 w-full bg-gray-100 print:h-52">
                      <img
                        src={URL.createObjectURL(img.file)}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Caption */}
                    <div className="border-t border-[#e8dfc8] px-3 py-2">
                      <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-500">
                        {img.type === "satellite" &&
                          "Satellite view indicating the property's surrounding area and location."}

                        {img.type === "trace" &&
                          "Trace view showing the property's boundary and site layout."}

                        {img.type === "physical" &&
                          "Physical view providing visual reference of the property."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Section 4: Building & Depreciation Schedule (if applicable) */}
          {buildingResult ? (
            <div>
              <h2 className="font-serif text-sm sm:text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8a5a00]" />
                Building Structure & Straight-Line Depreciation Schedule
              </h2>
              <p className="text-[11px] sm:text-xs text-[#475569] mt-1.5 mb-3">
                Calculated using cost approach with 10% sanitary and 8%
                electrical overhead additions.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-[11px] sm:text-xs text-left border border-[#e8dfc8] mb-4">
                  <thead className="bg-[#f8f1e3] text-[#10151f] font-semibold border-b border-[#e8dfc8]">
                    <tr>
                      <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                        S.N.
                      </th>
                      <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                        Floor Name
                      </th>
                      <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                        Built-up Area (sq.ft.)
                      </th>
                      <th className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                        Construction Rate / sq.ft.
                      </th>
                      <th className="p-2 sm:p-2.5 text-right">Civil Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfc8]">
                    {buildingResult.floors.map((floor, idx) => (
                      <tr key={idx}>
                        <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8]">
                          {idx + 1}
                        </td>
                        <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] font-medium">
                          {floor.floor}
                        </td>
                        <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                          {formatNumber(floor.area)}
                        </td>
                        <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                          {formatNPR(floor.ratePerSqft)}
                        </td>
                        <td className="p-2 sm:p-2.5 text-right font-medium">
                          {formatNPR(floor.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#fffdf8] font-semibold border-t border-[#e8dfc8]">
                    <tr>
                      <td
                        colSpan={2}
                        className="p-2 sm:p-2.5 border-r border-[#e8dfc8]"
                      >
                        Subtotal Civil Construction Cost
                      </td>
                      <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8] text-right">
                        {formatNumber(buildingResult.totalFloorArea)} sq.ft.
                      </td>
                      <td className="p-2 sm:p-2.5 border-r border-[#e8dfc8]"></td>
                      <td className="p-2 sm:p-2.5 text-right font-bold">
                        {formatNPR(buildingResult.civilCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f7f3ea] p-3 sm:p-4 rounded text-[11px] sm:text-xs">
                <div>
                  <span className="block text-[#475569]">
                    Sanitary Installation (
                    {formatPercent(buildingResult.sanitary.rate)})
                  </span>
                  <span className="font-bold text-[#10151f]">
                    {formatNPR(buildingResult.sanitary.cost)}
                  </span>
                </div>
                <div>
                  <span className="block text-[#475569]">
                    Electrical Installation (
                    {formatPercent(buildingResult.electrical.rate)})
                  </span>
                  <span className="font-bold text-[#10151f]">
                    {formatNPR(buildingResult.electrical.cost)}
                  </span>
                </div>
                <div>
                  <span className="block text-[#475569]">
                    Gross Replacement Cost
                  </span>
                  <span className="font-bold text-[#10151f]">
                    {formatNPR(buildingResult.grossBuildingCost)}
                  </span>
                </div>
              </div>

              <div className="mt-4 border border-[#e8dfc8] rounded p-3 sm:p-4 bg-[#fffdf8]">
                <h3 className="font-semibold text-[11px] sm:text-xs text-[#10151f] mb-2 uppercase tracking-wide">
                  Depreciation Statement
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px] sm:text-xs">
                  <div>
                    <span className="block text-[#475569]">Building Age</span>
                    <span className="font-bold text-[#10151f]">
                      {buildingResult.depreciation.age} Years
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">Useful Life</span>
                    <span className="font-bold text-[#10151f]">
                      {buildingResult.depreciation.usefulLife} Years
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">Scrap Value</span>
                    <span className="font-bold text-[#10151f]">
                      {formatPercent(buildingResult.depreciation.scrapValue)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">
                      Depreciation Amount
                    </span>
                    <span className="font-bold text-red-700">
                      -{formatNPR(buildingResult.depreciation.amount)}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-[#f8f1e3] p-2 rounded-r">
                    <span className="block text-[#8a5a00] font-semibold">
                      Net Present Value
                    </span>
                    <span className="font-bold text-[#10151f]">
                      {formatNPR(buildingResult.presentBuildingValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded border border-dashed border-[#e8dfc8] p-3 sm:p-4 text-[11px] sm:text-xs text-[#475569]">
              <strong>Building Valuation:</strong> No structure included in this
              appraisal. Valuated as vacant land plot.
            </div>
          )}

          {/* Section 5: Auction Liquidation Estimate */}
          <div>
            <h2 className="font-serif text-sm sm:text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8a5a00]" />
              Distress Sale & Auction Liquidation Forecast
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3 text-center text-[10px] sm:text-xs">
              <div className="rounded border border-[#fecaca] bg-[#fef2f2] p-2 sm:p-3">
                <span className="block text-[#b91c1c] font-semibold">
                  Conservative (60%)
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#10151f] mt-1 block break-words">
                  {formatNPR(Math.round(result.finalValue * 0.6))}
                </span>
              </div>
              <div className="rounded border border-[#e5c87a] bg-[#fdf6dc] p-2 sm:p-3">
                <span className="block text-[#8a5a00] font-semibold">
                  Expected (70%)
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#10151f] mt-1 block break-words">
                  {formatNPR(Math.round(result.finalValue * 0.7))}
                </span>
              </div>
              <div className="rounded border border-[#bbf7d0] bg-[#f0fdf4] p-2 sm:p-3">
                <span className="block text-green-700 font-semibold">
                  Optimistic (80%)
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#10151f] mt-1 block break-words">
                  {formatNPR(Math.round(result.finalValue * 0.8))}
                </span>
              </div>
            </div>
          </div>

          {/* Section 6: Signatures & Sign-off Certification */}
          <div className="pt-5 sm:pt-6 border-t-2 border-[#10151f]">
            <p className="text-[11px] sm:text-xs text-[#64748b] italic mb-6 sm:mb-8 text-center sm:text-left">
              Declaration: This property valuation report has been computed
              following the official property valuation guidelines of Bagmati
              Province, Nepal.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-[11px] sm:text-xs text-[#10151f]">
              <div>
                <div className="h-14 sm:h-16 border-b border-[#10151f] border-dashed flex items-end justify-center pb-2 text-[#94a3b8]">
                  (Signature)
                </div>
                <p className="font-bold text-center mt-2">Valuation Officer</p>
                <p className="text-[#64748b] text-center">Licensed Assessor</p>
              </div>

              <div>
                <div className="h-14 sm:h-16 border-b border-[#10151f] border-dashed flex items-end justify-center pb-2 text-[#94a3b8]">
                  (Signature & Seal)
                </div>
                <p className="font-bold text-center mt-2">
                  Senior Verifying Authority
                </p>
                <p className="text-[#64748b] text-center">
                  Bank / Municipal Representative
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col justify-end items-center sm:items-end">
                <div className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-dashed border-[#d6a936] rounded-full flex items-center justify-center text-[9px] sm:text-[10px] text-[#8a5a00] font-bold text-center p-2">
                  OFFICIAL VALUATION STAMP
                </div>
              </div>
            </div>
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

function AmenityReportItem({
  icon,
  label,
  value,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="border-b border-r border-[#e8dfc8] p-2.5 sm:p-3">
      <div className="flex items-center gap-2">
        <span className="text-[#8a5a00]">{icon}</span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
          {label}
        </span>
      </div>
      <div
        className={`mt-1.5 text-[11px] sm:text-xs font-bold ${
          positive === true
            ? "text-green-700"
            : positive === false
              ? "text-red-700"
              : "text-[#10151f]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
