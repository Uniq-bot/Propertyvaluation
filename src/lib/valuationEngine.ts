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

export function calculateLandValue(property: PropertyInput): LandResult {
  const { landAreaAana, governmentRate, marketRate } = property;

  const governmentWeight = 0.3;
  const marketWeight = 0.7;

  const weightedRate =
    governmentRate * governmentWeight + marketRate * marketWeight;

  /*
   * The PDF calculated ~Rs. 15.74 lakh/aana but adopted Rs. 15 lakh/aana.
   * Keep the calculated value separate from the adopted value so callers can
   * override the adopted rate without touching the weighted rate.
   */
  const adoptedRate = property.adoptedLandRate ?? weightedRate;

  const landValue = landAreaAana * adoptedRate;

  return {
    inputs: { landAreaAana, governmentRate, marketRate },
    weights: {
      government: governmentWeight,
      market: marketWeight,
    },
    weightedRate,
    adoptedRate,
    landValue,
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
    valuationMethod: {
      land: "Weighted Average Method",
      building: "Cost Approach with Straight-Line Depreciation",
    },
    land,
    building,
    finalValue,
    currency: "NPR",
    audit: {
      governmentWeight: 0.3,
      marketWeight: 0.7,
      sanitaryRate: 0.1,
      electricalRate: 0.08,
      depreciationMethod: "straight-line",
    },
  };
}
