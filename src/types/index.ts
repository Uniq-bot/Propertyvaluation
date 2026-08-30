// ─────────────────────────────────────────────
// Shared TypeScript types
// Used by API routes (server) and UI (client)
// ─────────────────────────────────────────────

// ── Property input ──────────────────────────

export interface Floor {
  name: string;
  area: number;
  /** Optional per-floor override; falls back to Building.defaultRatePerSqft */
  ratePerSqft?: number;
}

export interface Location {
  district: string;
  municipality: string;
  ward: number;
}

export interface Building {
  defaultRatePerSqft: number;
  sanitaryRate: number;
  electricalRate: number;
  usefulLife: number;
  scrapValue: number;
  floors: Floor[];
}

export interface PropertyInput {
  propertyId: string;
  location: Location;
  landAreaAana: number;
  governmentRate: number;
  marketRate: number;
  adoptedLandRate?: number;
  buildingAge?: number;
  hasBuilding?: boolean;
  building?: Building;
}

// ── Valuation result ────────────────────────

export interface LandInputs {
  landAreaAana: number;
  governmentRate: number;
  marketRate: number;
}

export interface LandResult {
  inputs: LandInputs;
  weights: {
    government: number;
    market: number;
  };
  weightedRate: number;
  adoptedRate: number;
  landValue: number;
}

export interface FloorCalculation {
  floor: string;
  area: number;
  ratePerSqft: number;
  cost: number;
}

export interface BuildingResult {
  totalFloorArea: number;
  floors: FloorCalculation[];
  civilCost: number;
  sanitary: {
    rate: number;
    cost: number;
  };
  electrical: {
    rate: number;
    cost: number;
  };
  grossBuildingCost: number;
  depreciation: {
    age: number;
    usefulLife: number;
    scrapValue: number;
    annualRate: number;
    amount: number;
  };
  presentBuildingValue: number;
}

export interface ValuationResult {
  propertyId: string;
  valuationMethod: {
    land: string;
    building: string;
  };
  land: LandResult;
  building: BuildingResult | false;
  finalValue: number;
  currency: string;
  audit: {
    governmentWeight: number;
    marketWeight: number;
    sanitaryRate: number;
    electricalRate: number;
    depreciationMethod: string;
  };
}

// ── Inflation API ────────────────────────────

export interface YearProjection {
  year: number;
  amount: number;
}

export interface InflationRequest {
  currentAmount: number;
}

export interface InflationResponse {
  currentAmount: number;
  inflationRate: number;
  years: YearProjection[];
}

// ── Auction API ──────────────────────────────

export interface AuctionPrediction {
  label: string;
  rate: number;
  amount: number;
}

export interface AuctionRequest {
  currentAmount: number;
}

export interface AuctionResponse {
  year: number;
  valuationAmount: number;
  predictions: AuctionPrediction[];
}

// ── User session type ──────────────────────
export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// ── Generic error ────────────────────────────

export interface ApiError {
  error?: string;
  message?: string;
}
