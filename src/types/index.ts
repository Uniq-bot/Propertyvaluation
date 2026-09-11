// ─────────────────────────────────────────────
// Shared TypeScript types
// Used by API routes (server) and UI (client)
// ─────────────────────────────────────────────

// ── Property input ──────────────────────────

export interface Floor {
  name: string;
  area: number;
  ratePerSqft?: number;
}

export interface Location {
  district: string;
  municipality: string;
  ward: number;
  latitude: number;
  longitude: number;
}

export interface Building {
  
  sanitaryRate: number;
  electricalRate: number;
  usefulLife: number;
  depreciationRate: number;
  floors: Floor[];
}

export interface PropertyInput {
  propertyId: string;
  plotNumber: string;
  possibleFutureInhanceMents: string;
  ownerDetails: OwnerDetail;
  clientDetails: ClientDetail;
  location: Location;
  boundaryDetails: {
    east: string;
    west: string;
    north: string;
    south: string;
  };
  nearestRoad: string;
  nearestRoadImage: File;
  nearestLandMark: string;
  landArea: {
    ropani: number;
    aana: number;
    paisa: number;
    dam: number;
  };
  governmentRate: number;
  marketRate: number;
  adoptedLandRate?: number;

  buildingAge?: number;
  hasBuilding?: boolean;
  building?: Building;

  governmentWeight: number;
  marketWeight: number;

  structuralAmenities?: {
    factor: string;
    observedValue: string;
    adjustment: number;
  }[];
  images?: PropertyImage[];
}

// ── Valuation result ────────────────────────

export interface LandInputs {
  landArea:{
    ropani: number;
    aana: number;
    paisa: number;
    dam: number;
  },
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
  amenityAdjustment: number;
  originalMarketRate: number;
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
    annualRate: number;
    amount: number;
  };
  presentBuildingValue: number;
}

export interface ValuationResult {
  propertyId: string;
  ownerDetails: OwnerDetail;
  landArea: {
    ropani: number;
    aana: number;
    paisa: number;
    dam: number;
  };
  
  landAreaAana: number;
  nearestRoad: string;
  nearestRoadImage?: File;
  nearestLandMark: string;
  structuralAmenities?: {
    factor: string;
    observedValue: string;
    adjustment: number;
  }[];
  valuatorDetail: {
    valuatorName: string;
  };
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
  images?: PropertyImage[];
}

export interface OwnerDetail {
  ownerName: string;
  ownerNumber: number;
  ownerLocation: string;
}

export interface ClientDetail {
  clientName: string;
  clientAddress: string;
  ContactNumber: number;
}

export type PropertyImageType = "satellite" | "trace" | "physical";

export interface PropertyImage {
  type: PropertyImageType;
  name: string;
  file: File;
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
