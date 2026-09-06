import type {
  PropertyInput,
  LandResult,
  BuildingResult,
  ValuationResult,
} from "@/types";

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

function calculateAmenityScore(property: PropertyInput) {
  const amenities = property.structuralAmenities;

  if (!amenities) {
    return {
      score: 50,
      adjustment: 0,
      breakdown: {},
    };
  }

  const scores = {
    roadWidth: getRoadWidthScore(amenities.roadWidth ?? 0),
    roadType: getRoadTypeScore(amenities.roadType),
    roadCondition: getRoadConditionScore(
      amenities.roadCondition,
    ),
    landShape: getShapeScore(amenities.landShape),
    landFacing: getFacingScore(amenities.landFacing),

    waterSupply: amenities.waterSupply ? 100 : 0,
    drainage: amenities.drainage ? 100 : 0,
    electricity: amenities.electricity ? 100 : 0,
    parkingAvailable: amenities.parkingAvailable ? 100 : 0,
  };

  const weights = {
    roadWidth: 0.30,
    roadType: 0.15,
    roadCondition: 0.10,
    landShape: 0.10,
    landFacing: 0.05,
    waterSupply: 0.08,
    drainage: 0.07,
    electricity: 0.05,
    parkingAvailable: 0.10,
  };

  const score =
    scores.roadWidth * weights.roadWidth +
    scores.roadType * weights.roadType +
    scores.roadCondition * weights.roadCondition +
    scores.landShape * weights.landShape +
    scores.landFacing * weights.landFacing +
    scores.waterSupply * weights.waterSupply +
    scores.drainage * weights.drainage +
    scores.electricity * weights.electricity +
    scores.parkingAvailable * weights.parkingAvailable;

  /*
   * Convert 0–100 score into a market-rate adjustment.
   *
   * 50 score → 0%
   * 100 score → +15%
   * 0 score → -15%
   *
   * This keeps the amenity effect conservative.
   */
  const adjustment = ((score - 50) / 50) * 0.15;

  return {
    score: Math.round(score * 100) / 100,
    adjustment: Math.round(adjustment * 10000) / 10000,
    breakdown: scores,
  };
}

export function calculateLandValue(property: PropertyInput): LandResult {
  const {
    landAreaAana,
    governmentRate,
    marketRate,
    governmentWeight,
    marketWeight,
  } = property;

  // Calculate property-specific amenity score
  const amenities = calculateAmenityScore(property);

  /*
   * Government rate is kept unchanged.
   *
   * Amenities affect the prevailing market rate instead.
   */
  const adjustedMarketRate =
    marketRate * (1 + amenities.adjustment);

  /*
   * Weighted rate:
   * Government rate × government weight
   * +
   * Adjusted market rate × market weight
   */
  const weightedRate =
    governmentRate * governmentWeight +
    adjustedMarketRate * marketWeight;

  const adoptedRate =
    property.adoptedLandRate ?? weightedRate;

  const landValue =
    landAreaAana * adoptedRate;

  return {
    inputs: {
      landAreaAana,
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

    // If your LandResult type doesn't currently contain these,
    // add them to the type.
    amenityScore: amenities.score,
    amenityAdjustment: amenities.adjustment,
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
  if (
    !building ||
    !building.floors ||
    building.floors.length === 0 ||
    property.hasBuilding === false
  ) {
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
        scrapValue: 0.1,
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
    const rate = floor.ratePerSqft ?? building.defaultRatePerSqft;
    const cost = floor.area * rate;
    civilCost += cost;
    return {
      floor: floor.name,
      area: floor.area,
      ratePerSqft: rate,
      cost,
    };
  });

  const sanitaryRate = building.sanitaryRate ?? 0.1;
  const electricalRate = building.electricalRate ?? 0.08;

  const sanitaryCost = civilCost * sanitaryRate;
  const electricalCost = civilCost * electricalRate;
  const grossBuildingCost = civilCost + sanitaryCost + electricalCost;

  const usefulLife = building.usefulLife ?? 50;
  const scrapValue = building.scrapValue ?? 0.1;
  const depreciationRate = (1 - scrapValue) / usefulLife;
  const depreciation = Math.round(
    grossBuildingCost * depreciationRate * buildingAge,
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
      scrapValue,
      annualRate: depreciationRate,
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

  const building = property.building
    ? calculateBuildingValue(property)
    : false;

  const finalValue =
    land.landValue + (building !== false ? building.presentBuildingValue : 0);

  return {
    propertyId: property.propertyId,
    ownerDetails:property.ownerDetails,
    valuatorDetail:{
      valuatorName:"Nepal Property Valuation",

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
      sanitaryRate: 0.1,
      electricalRate: 0.08,
      depreciationMethod: "straight-line",
    },
    images:property.images,
  };
}
