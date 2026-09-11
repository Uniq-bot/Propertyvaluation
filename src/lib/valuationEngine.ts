import type {
  PropertyInput,
  LandResult,
  BuildingResult,
  ValuationResult,
} from "@/types";
import { convertToAana } from "./functions";

// ─────────────────────────────────────────────────────────────────
// Land Valuation
// Methodology: weighted average — government 40%, market 60%
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// Nepal Property Amenity Adjustment
//
// Important:
// Amenities adjust the MARKET rate only.
// Government/Malpot rate remains unchanged.
// ─────────────────────────────────────────────────────────────────

function getRoadWidthScore(width: number): number {
  if (width >= 20) return 100;
  if (width >= 16) return 90;
  if (width >= 13) return 80;
  if (width >= 10) return 65;
  if (width >= 8) return 50;
  if (width >= 6) return 30;
  return 10;
}

function getRoadTypeScore(type?: string): number {
  switch (type) {
    case "Blacktopped":
      return 100;
    case "Concrete":
      return 90;
    case "Gravel":
      return 60;
    case "Earthen":
      return 35;
    default:
      return 20;
  }
}

function getRoadConditionScore(condition?: string): number {
  switch (condition) {
    case "Good":
      return 100;
    case "Average":
      return 65;
    case "Poor":
      return 30;
    default:
      return 40;
  }
}

function getShapeScore(shape?: string): number {
  switch (shape) {
    case "Rectangular":
      return 100;
    case "Square":
      return 90;
    case "Irregular":
      return 50;
    default:
      return 60;
  }
}

function getFacingScore(facing?: string): number {
  switch (facing) {
    case "East":
      return 100;

    case "North":
      return 90;

    case "South":
      return 85;

    case "West":
      return 80;

    default:
      return 70;
  }
}

function calculateAmenityWeight(property: PropertyInput) {
  const amenities = property.structuralAmenities; // it is an array of objects with factor, observedValue, and adjustment
  if (!amenities || amenities.length === 0) {
    return 0;
  }

  let totalScore = 0;

  const totalAmenityWeight =
    amenities.reduce(
      (sum, amenity) => sum + (amenity.adjustment ?? 0),
      totalScore,
    ) / 100;
  console.log(totalAmenityWeight);

  return totalAmenityWeight;
}

export function calculateLandValue(property: PropertyInput): LandResult {
  const { governmentRate, marketRate, governmentWeight, marketWeight } =
    property;

  // Calculate property-specific amenity score
  const amenityAdjustRate = calculateAmenityWeight(property);
  const adjustedMarketRate = marketRate * (1 + amenityAdjustRate);
  // Compute weighted average of government and market rates. Use weight sum
  // as denominator to support non-100 weight inputs.
  const weightSum = governmentWeight + marketWeight || 100;
  const weightedRate =
    (governmentRate * governmentWeight + adjustedMarketRate * marketWeight) /
    weightSum;

  const adoptedRate = property.adoptedLandRate ?? weightedRate;

  const landValue =
    convertToAana(
      property.landArea.ropani,
      property.landArea.aana,
      property.landArea.paisa,
      property.landArea.dam,
      "aana",
    ) * adoptedRate;

  return {
    inputs: {
      landArea: property.landArea,
      governmentRate,
      marketRate: adjustedMarketRate,
    },

    weights: {
      government: governmentWeight,
      market: marketWeight,
    },

    weightedRate,
    adoptedRate,
    landValue,

    amenityAdjustment: amenityAdjustRate,
    originalMarketRate: marketRate,
  };
}

// ─────────────────────────────────────────────────────────────────
// Building Valuation
// Methodology: cost approach + straight-line depreciation
// ─────────────────────────────────────────────────────────────────

export function calculateBuildingValue(
  property: PropertyInput,
): BuildingResult {
  const { building, buildingAge = 0 } = property;

  // Return zero-value result when there is no building
  if (!building || !building.floors || building.floors.length === 0) {
    return {
      totalFloorArea: 0,
      floors: [],
      civilCost: 0,
      sanitary: { rate: 0, cost: 0 },
      electrical: { rate: 0, cost: 0 },
      grossBuildingCost: 0,
      depreciation: {
        age: 0,
        usefulLife: 50,
        annualRate: 0,
        amount: 0,
      },
      presentBuildingValue: 0,
    };
  }

  const totalFloorArea = building.floors.reduce(
    (total, floor) => total + floor.area,
    0,
  );

  let civilCost = 0;

  const floors = building.floors.map((floor) => {
    const rate = floor.ratePerSqft ?? 0;
    const cost = floor.area * rate;
    civilCost += cost;
    return {
      floor: floor.name,
      area: floor.area,
      ratePerSqft: rate,
      cost,
    };
  });

  const sanitaryRate = building.sanitaryRate ?? 0.05;
  const electricalRate = building.electricalRate ?? 0.05;

  const sanitaryCost = civilCost * sanitaryRate;
  const electricalCost = civilCost * electricalRate;
  const grossBuildingCost = civilCost + sanitaryCost + electricalCost;

  const usefulLife = building.usefulLife ?? 50;

  // depreciationRate stored in the UI is a percent (e.g. 5 for 5%).
  // If not provided, default to straight-line percent = 100 / usefulLife.
  const depreciationRate =
    building.depreciationRate && building.depreciationRate > 0
      ? building.depreciationRate
      : 100 / usefulLife;

  const annualPercent = depreciationRate; // percent value
  const depreciation = Math.round(
    (grossBuildingCost * (annualPercent / 100)) * buildingAge,
  );

  const presentBuildingValue = Math.max(0, grossBuildingCost - depreciation);

  return {
    totalFloorArea,
    floors,
    civilCost,
    sanitary: { rate: sanitaryRate, cost: sanitaryCost },
    electrical: { rate: electricalRate, cost: electricalCost },
    grossBuildingCost,
      depreciation: {
        age: buildingAge,
        usefulLife,
        annualRate: annualPercent / 100,
        amount: depreciation,
      },
    presentBuildingValue,
  };
}

// ─────────────────────────────────────────────────────────────────
// Main entry: full property valuation
// ─────────────────────────────────────────────────────────────────

export default function valuateProperty(
  property: PropertyInput,
): ValuationResult {
  const land = calculateLandValue(property);

  const building = property.building ? calculateBuildingValue(property) : false;

  const finalValue =
    land.landValue + (building !== false ? building.presentBuildingValue : 0);
  const landAreaAana = convertToAana(
    property.landArea.ropani,
    property.landArea.aana,
    property.landArea.paisa,
    property.landArea.dam,
    "aana",
  );
  return {
    propertyId: property.propertyId,
    ownerDetails: property.ownerDetails,
    landArea: {
      ropani: property.landArea.ropani,
      aana: property.landArea.aana,
      paisa: property.landArea.paisa,
      dam: property.landArea.dam,
    },
    landAreaAana: landAreaAana,
    nearestRoad: property.nearestRoad,
    nearestRoadImage: property.nearestRoadImage,
    nearestLandMark: property.nearestLandMark,
    valuatorDetail: {
      valuatorName: "Nepal Property Valuation",
    },

    valuationMethod: {
      land: "Weighted Average Method",
      building: "Cost Approach with Straight-Line Depreciation",
    },
    land,
    building,
    finalValue,
    currency: "NPR",
    audit: {
      governmentWeight: property.governmentWeight,
      marketWeight: property.marketWeight,
      sanitaryRate: 0.05,
      electricalRate: 0.05,
      depreciationMethod: "straight-line",
    },
    images: property.images,
  };
}
