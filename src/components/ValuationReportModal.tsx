"use client";

import React from "react";
import type { PropertyInput, ValuationResult, BuildingResult } from "@/types";
import { formatNPR, formatNumber, formatPercent } from "@/lib/functions";
import { Printer, X, ShieldCheck, Building2, MapPin, Scale, TrendingUp, Calendar, FileText } from "lucide-react";

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
  if (!isOpen) return null;

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

  return (
    <div className="report-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 no-print-backdrop">
      {/* Modal Container */}
      <div className="report-modal-content relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden text-[#10151f]">
        
        {/* Top Action Bar (Screen Only) */}
        <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-[#e8dfc8] bg-[#f7f3ea] px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#8a5a00]" />
            <span className="font-serif text-lg font-bold text-[#10151f]">
              Valuation Report Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gold-gradient inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-[#10151f] transition hover:opacity-90 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e8dfc8] bg-white p-2 text-[#475569] hover:bg-[#f7f3ea] transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-white">
          
          {/* Header & Emblem */}
          <div className="border-b-2 border-[#10151f] pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#475569]">
                    Bagmati Province · Nepal Real Estate Appraisal
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#10151f] mt-1">
                  PROPERTY VALUATION REPORT
                </h1>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Official Land & Infrastructure Valuation Assessment
                </p>
              </div>

              <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-[#d6a936] pl-3 sm:pl-0 sm:pr-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf6dc] border border-[#e5c87a] px-3 py-1 text-xs font-bold text-[#8a5a00]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  VERIFIED & COMPLETED
                </div>
                <p className="font-mono text-xs font-semibold text-[#10151f] mt-1.5">
                  Ref: {result.propertyId}
                </p>
                <p className="text-xs text-[#64748b] flex items-center sm:justify-end gap-1 mt-0.5">
                  <Calendar className="h-3 w-3 inline" /> {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div className="rounded-xl border-2 border-[#10151f] bg-[#fffdf8] p-6 shadow-sm">
            <div className="text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#475569]">
                  Total Appraised Property Value
                </p>
                <p className="font-serif text-3xl sm:text-4xl font-extrabold text-[#10151f] mt-1">
                  {formatNPR(result.finalValue)}
                </p>
                <p className="text-xs text-[#64748b] mt-1">
                  Valuation currency: Nepalese Rupee ({result.currency})
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-[#e8dfc8] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto text-center sm:text-left">
                <div>
                  <p className="text-xs font-semibold text-[#475569]">Land Component</p>
                  <p className="font-serif text-lg font-bold text-[#10151f]">
                    {formatNPR(result.land.landValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#475569]">Building Component</p>
                  <p className="font-serif text-lg font-bold text-[#10151f]">
                    {buildingResult ? formatNPR(buildingResult.presentBuildingValue) : "N/A (Land Only)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Location & Specification */}
          <div>
            <h2 className="font-serif text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <MapPin className="h-4 w-4 text-[#8a5a00]" />
              1. Property Location & General Details
            </h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-[#f7f3ea] p-4 text-xs">
              <div>
                <span className="block font-semibold text-[#475569]">District</span>
                <span className="font-bold text-[#10151f]">{property.location.district || "—"}</span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">Municipality</span>
                <span className="font-bold text-[#10151f]">{property.location.municipality || "—"}</span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">Ward No.</span>
                <span className="font-bold text-[#10151f]">Ward {property.location.ward}</span>
              </div>
              <div>
                <span className="block font-semibold text-[#475569]">Land Area</span>
                <span className="font-bold text-[#10151f]">
                  {formatNumber(property.landAreaAana)} Aana ({formatNumber(landAreaSqft)} sq.ft.)
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Land Valuation Schedule */}
          <div>
            <h2 className="font-serif text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <Scale className="h-4 w-4 text-[#8a5a00]" />
              2. Land Valuation Breakdown (Weighted Average Method)
            </h2>
            <p className="text-xs text-[#475569] mt-1.5 mb-3">
              Standard weighting applied: 30% Government Rate + 70% Market Rate per Aana.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#e8dfc8]">
                <thead className="bg-[#f8f1e3] text-[#10151f] font-semibold border-b border-[#e8dfc8]">
                  <tr>
                    <th className="p-2.5 border-r border-[#e8dfc8]">S.N.</th>
                    <th className="p-2.5 border-r border-[#e8dfc8]">Category</th>
                    <th className="p-2.5 border-r border-[#e8dfc8] text-right">Rate / Aana</th>
                    <th className="p-2.5 border-r border-[#e8dfc8] text-center">Weight</th>
                    <th className="p-2.5 text-right">Weighted Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8dfc8]">
                  <tr>
                    <td className="p-2.5 border-r border-[#e8dfc8]">1</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] font-medium">Government Valuation Rate</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] text-right">{formatNPR(result.land.inputs.governmentRate)}</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] text-center">{formatPercent(result.land.weights.government)}</td>
                    <td className="p-2.5 text-right font-medium">{formatNPR(result.land.inputs.governmentRate * result.land.weights.government)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-[#e8dfc8]">2</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] font-medium">Market Valuation Rate</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] text-right">{formatNPR(result.land.inputs.marketRate)}</td>
                    <td className="p-2.5 border-r border-[#e8dfc8] text-center">{formatPercent(result.land.weights.market)}</td>
                    <td className="p-2.5 text-right font-medium">{formatNPR(result.land.inputs.marketRate * result.land.weights.market)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#fffdf8] font-bold border-t-2 border-[#10151f]">
                  <tr>
                    <td colSpan={2} className="p-2.5 border-r border-[#e8dfc8]">Adopted Land Rate</td>
                    <td colSpan={3} className="p-2.5 text-right text-sm text-[#10151f]">
                      {formatNPR(result.land.adoptedRate)} / Aana
                    </td>
                  </tr>
                  <tr className="bg-[#f7f3ea]">
                    <td colSpan={2} className="p-2.5 border-r border-[#e8dfc8]">TOTAL LAND VALUE ({formatNumber(property.landAreaAana)} Aana)</td>
                    <td colSpan={3} className="p-2.5 text-right text-base text-[#10151f]">
                      {formatNPR(result.land.landValue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 2: Building & Depreciation Schedule (if applicable) */}
          {buildingResult ? (
            <div>
              <h2 className="font-serif text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
                <Building2 className="h-4 w-4 text-[#8a5a00]" />
                3. Building Structure & Straight-Line Depreciation Schedule
              </h2>
              <p className="text-xs text-[#475569] mt-1.5 mb-3">
                Calculated using cost approach with 10% sanitary and 8% electrical overhead additions.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-[#e8dfc8] mb-4">
                  <thead className="bg-[#f8f1e3] text-[#10151f] font-semibold border-b border-[#e8dfc8]">
                    <tr>
                      <th className="p-2.5 border-r border-[#e8dfc8]">S.N.</th>
                      <th className="p-2.5 border-r border-[#e8dfc8]">Floor Name</th>
                      <th className="p-2.5 border-r border-[#e8dfc8] text-right">Built-up Area (sq.ft.)</th>
                      <th className="p-2.5 border-r border-[#e8dfc8] text-right">Construction Rate / sq.ft.</th>
                      <th className="p-2.5 text-right">Civil Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfc8]">
                    {buildingResult.floors.map((floor, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 border-r border-[#e8dfc8]">{idx + 1}</td>
                        <td className="p-2.5 border-r border-[#e8dfc8] font-medium">{floor.floor}</td>
                        <td className="p-2.5 border-r border-[#e8dfc8] text-right">{formatNumber(floor.area)}</td>
                        <td className="p-2.5 border-r border-[#e8dfc8] text-right">{formatNPR(floor.ratePerSqft)}</td>
                        <td className="p-2.5 text-right font-medium">{formatNPR(floor.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#fffdf8] font-semibold border-t border-[#e8dfc8]">
                    <tr>
                      <td colSpan={2} className="p-2.5 border-r border-[#e8dfc8]">Subtotal Civil Construction Cost</td>
                      <td className="p-2.5 border-r border-[#e8dfc8] text-right">{formatNumber(buildingResult.totalFloorArea)} sq.ft.</td>
                      <td className="p-2.5 border-r border-[#e8dfc8]"></td>
                      <td className="p-2.5 text-right font-bold">{formatNPR(buildingResult.civilCost)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Building Financial Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f7f3ea] p-4 rounded-lg text-xs">
                <div>
                  <span className="block text-[#475569]">Sanitary Installation ({formatPercent(buildingResult.sanitary.rate)})</span>
                  <span className="font-bold text-[#10151f]">{formatNPR(buildingResult.sanitary.cost)}</span>
                </div>
                <div>
                  <span className="block text-[#475569]">Electrical Installation ({formatPercent(buildingResult.electrical.rate)})</span>
                  <span className="font-bold text-[#10151f]">{formatNPR(buildingResult.electrical.cost)}</span>
                </div>
                <div>
                  <span className="block text-[#475569]">Gross Replacement Cost</span>
                  <span className="font-bold text-[#10151f]">{formatNPR(buildingResult.grossBuildingCost)}</span>
                </div>
              </div>

              {/* Depreciation Table */}
              <div className="mt-4 border border-[#e8dfc8] rounded-lg p-4 bg-[#fffdf8]">
                <h3 className="font-semibold text-xs text-[#10151f] mb-2 uppercase tracking-wide">Depreciation Statement</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <span className="block text-[#475569]">Building Age</span>
                    <span className="font-bold text-[#10151f]">{buildingResult.depreciation.age} Years</span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">Useful Life</span>
                    <span className="font-bold text-[#10151f]">{buildingResult.depreciation.usefulLife} Years</span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">Scrap Value</span>
                    <span className="font-bold text-[#10151f]">{formatPercent(buildingResult.depreciation.scrapValue)}</span>
                  </div>
                  <div>
                    <span className="block text-[#475569]">Depreciation Amount</span>
                    <span className="font-bold text-red-700">-{formatNPR(buildingResult.depreciation.amount)}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-[#f8f1e3] p-2 rounded text-right">
                    <span className="block text-[#8a5a00] font-semibold">Net Present Value</span>
                    <span className="font-bold text-[#10151f]">{formatNPR(buildingResult.presentBuildingValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#e8dfc8] p-4 text-xs text-[#475569]">
              <strong>Building Valuation:</strong> No structure included in this appraisal. Valuated as vacant land plot.
            </div>
          )}

          {/* Section 4: Auction Liquidation Estimate */}
          <div>
            <h2 className="font-serif text-lg font-bold text-[#10151f] flex items-center gap-2 border-b border-[#e8dfc8] pb-2">
              <TrendingUp className="h-4 w-4 text-[#8a5a00]" />
              4. Distress Sale & Auction Liquidation Forecast
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3">
                <span className="block text-[#b91c1c] font-semibold">Conservative (60%)</span>
                <span className="font-serif font-bold text-sm text-[#10151f] mt-1 block">
                  {formatNPR(Math.round(result.finalValue * 0.6))}
                </span>
              </div>
              <div className="rounded-lg border border-[#e5c87a] bg-[#fdf6dc] p-3">
                <span className="block text-[#8a5a00] font-semibold">Expected (70%)</span>
                <span className="font-serif font-bold text-sm text-[#10151f] mt-1 block">
                  {formatNPR(Math.round(result.finalValue * 0.7))}
                </span>
              </div>
              <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-3">
                <span className="block text-green-700 font-semibold">Optimistic (80%)</span>
                <span className="font-serif font-bold text-sm text-[#10151f] mt-1 block">
                  {formatNPR(Math.round(result.finalValue * 0.8))}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Signatures & Sign-off Certification */}
          <div className="pt-6 border-t-2 border-[#10151f]">
            <p className="text-xs text-[#64748b] italic mb-8 text-center sm:text-left">
              Declaration: This property valuation report has been computed following the official property valuation guidelines of Bagmati Province, Nepal.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-[#10151f]">
              <div>
                <div className="h-16 border-b border-[#10151f] border-dashed flex items-end justify-center pb-2 text-[#94a3b8]">
                  (Signature)
                </div>
                <p className="font-bold text-center mt-2">Valuation Officer</p>
                <p className="text-[#64748b] text-center">Licensed Assessor</p>
              </div>

              <div>
                <div className="h-16 border-b border-[#10151f] border-dashed flex items-end justify-center pb-2 text-[#94a3b8]">
                  (Signature & Seal)
                </div>
                <p className="font-bold text-center mt-2">Senior Verifying Authority</p>
                <p className="text-[#64748b] text-center">Bank / Municipal Representative</p>
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col justify-end items-center sm:items-end">
                <div className="h-20 w-20 border-2 border-dashed border-[#d6a936] rounded-full flex items-center justify-center text-[10px] text-[#8a5a00] font-bold text-center p-2">
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
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print,
          .no-print-backdrop {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .report-modal-backdrop {
            position: static !important;
            inset: auto !important;
            display: block !important;
            overflow: visible !important;
            background: none !important;
          }
          .report-modal-content {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
