import { describe, it } from "node:test";
import assert from "node:assert/strict";
import valuateProperty, {
  calculateLandValue,
  calculateBuildingValue,
} from "./valuationEngine";
import type { PropertyInput } from "@/types";

describe("Valuation Engine Unit Tests", () => {
  const sampleLandProperty: PropertyInput = {
    propertyId: "PROP-001",
    location: {
      district: "Kathmandu",
      municipality: "Kathmandu Metro",
      ward: 4,
    },
    landAreaAana: 10,
    governmentRate: 1_000_000,
    marketRate: 2_000_000,
  };

  it("calculates land valuation using 30% government and 70% market weights", () => {
    const result = calculateLandValue(sampleLandProperty);
    // Weighted rate: (1,000,000 * 0.3) + (2,000,000 * 0.7) = 300,000 + 1,400,000 = 1,700,000
    assert.equal(result.weightedRate, 1_700_000);
    assert.equal(result.adoptedRate, 1_700_000);
    assert.equal(result.landValue, 17_000_000);
  });

  it("respects adopted land rate override if specified", () => {
    const propertyWithAdoptedRate: PropertyInput = {
      ...sampleLandProperty,
      adoptedLandRate: 1_500_000,
    };
    const result = calculateLandValue(propertyWithAdoptedRate);
    assert.equal(result.weightedRate, 1_700_000);
    assert.equal(result.adoptedRate, 1_500_000);
    assert.equal(result.landValue, 15_000_000);
  });

  it("calculates building valuation with straight-line depreciation", () => {
    const propertyWithBuilding: PropertyInput = {
      ...sampleLandProperty,
      hasBuilding: true,
      buildingAge: 10,
      building: {
        defaultRatePerSqft: 3000,
        sanitaryRate: 0.1,
        electricalRate: 0.08,
        usefulLife: 50,
        scrapValue: 0.1,
        floors: [
          { name: "Ground Floor", area: 1000 },
          { name: "First Floor", area: 1000 },
        ],
      },
    };

    const buildingResult = calculateBuildingValue(propertyWithBuilding);
    assert.equal(buildingResult.totalFloorArea, 2000);
    assert.equal(buildingResult.civilCost, 6_000_000); // 2000 * 3000
    assert.equal(buildingResult.sanitary.cost, 600_000); // 10% of 6,000,000
    assert.equal(buildingResult.electrical.cost, 480_000); // 8% of 6,000,000
    assert.equal(buildingResult.grossBuildingCost, 7_080_000);

    // Depreciation rate = (1 - 0.1) / 50 = 0.9 / 50 = 0.018 per year
    // Depreciation amount for 10 years = 7,080,000 * 0.018 * 10 = 1,274,400
    assert.equal(buildingResult.depreciation.amount, 1_274_400);
    assert.equal(buildingResult.presentBuildingValue, 5_805_600);
  });

  it("returns zero building valuation when building is absent or hasBuilding is false", () => {
    const result = calculateBuildingValue({
      ...sampleLandProperty,
      hasBuilding: false,
    });
    assert.equal(result.totalFloorArea, 0);
    assert.equal(result.grossBuildingCost, 0);
    assert.equal(result.presentBuildingValue, 0);
  });

  it("combines land and building values in complete valuateProperty", () => {
    const fullProperty: PropertyInput = {
      ...sampleLandProperty,
      hasBuilding: true,
      buildingAge: 5,
      building: {
        defaultRatePerSqft: 2000,
        sanitaryRate: 0.1,
        electricalRate: 0.08,
        usefulLife: 50,
        scrapValue: 0.1,
        floors: [{ name: "Ground Floor", area: 500 }],
      },
    };

    const result = valuateProperty(fullProperty);
    assert.equal(result.propertyId, "PROP-001");
    assert.equal(result.land.landValue, 17_000_000);
    assert.notEqual(result.building, false);
    if (result.building) {
      assert.equal(result.building.civilCost, 1_000_000);
      assert.equal(result.finalValue, result.land.landValue + result.building.presentBuildingValue);
    }
  });
});
