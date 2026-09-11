"use client";

import {
  ApiError,
  Building,
  ClientDetail,
  Floor,
  OwnerDetail,
  PropertyImage,
  PropertyImageType,
  PropertyInput,
  ValuationResult,
} from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

interface PropertyContextType {
  // ─────────────────────────────────────
  // Property
  // ─────────────────────────────────────
  property: PropertyInput;
  setProperty: React.Dispatch<React.SetStateAction<PropertyInput>>;

  updateProperty: <K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K],
  ) => void;

  // ─────────────────────────────────────
  // Owner
  // ─────────────────────────────────────
  ownerDetails: OwnerDetail;
  updateOwnerDetails: (
    key: keyof OwnerDetail,
    value: string | number,
  ) => void;

  // ─────────────────────────────────────
  // Client
  // ─────────────────────────────────────
  clientDetails: ClientDetail;
  updateClientDetails: (
    key: keyof ClientDetail,
    value: string | number,
  ) => void;

  // ─────────────────────────────────────
  // Location
  // ─────────────────────────────────────
  updateLocation: (
    key: keyof PropertyInput["location"],
    value: string | number,
  ) => void;

  // ─────────────────────────────────────
  // Boundary
  // ─────────────────────────────────────
  updateBoundary: (
    key: keyof PropertyInput["boundaryDetails"],
    value: string,
  ) => void;

  // ─────────────────────────────────────
  // Land
  // ─────────────────────────────────────
  updateLandArea: (
    key: keyof PropertyInput["landArea"],
    value: number,
  ) => void;

  // ─────────────────────────────────────
  // Building
  // ─────────────────────────────────────
  updateBuilding: <K extends keyof Building>(
    key: K,
    value: Building[K],
  ) => void;

  setBuilding: (building: Building | undefined) => void;

  addFloor: () => void;

  updateFloor: (
    index: number,
    key: keyof Floor,
    value: string | number,
  ) => void;

  deleteFloor: (index: number) => void;

  // ─────────────────────────────────────
  // Factors / Amenities
  // ─────────────────────────────────────
  factorsField: NonNullable<PropertyInput["structuralAmenities"]>;

  addFactor: () => void;

  updateFactor: (
    index: number,
    key: "factor" | "observedValue" | "adjustment",
    value: string | number,
  ) => void;

  deleteFactor: (index: number) => void;

  // ─────────────────────────────────────
  // Images
  // ─────────────────────────────────────
  images: PropertyImage[];

  addImage: (image: PropertyImage) => void;

  deleteImage: (
    type: PropertyImageType,
    index: number,
  ) => void;

  setImages: React.Dispatch<React.SetStateAction<PropertyImage[]>>;

  // ─────────────────────────────────────
  // Wizard
  // ─────────────────────────────────────
  step: StepIndex;
  setStep: React.Dispatch<React.SetStateAction<StepIndex>>;

  furthestUnlocked: StepIndex;

  goTo: (target: StepIndex) => void;
  advance: (from: StepIndex) => void;

  // ─────────────────────────────────────
  // Validation
  // ─────────────────────────────────────
  locationDone: boolean;
  landDone: boolean;
  buildingDone: boolean;

  // ─────────────────────────────────────
  // Building toggle
  // ─────────────────────────────────────
  includeBuilding: boolean;
  setIncludeBuilding: React.Dispatch<React.SetStateAction<boolean>>;

  // ─────────────────────────────────────
  // Valuation
  // ─────────────────────────────────────
  result: ValuationResult | null;
  loading: boolean;
  error: string;

  calculateValuation: () => Promise<void>;

  // ─────────────────────────────────────
  // Modals
  // ─────────────────────────────────────
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isReportOpen: boolean;
  setIsReportOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


// ─────────────────────────────────────────
// Initial Property
// ─────────────────────────────────────────

const createInitialProperty = (): PropertyInput => ({
  propertyId: "",
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
    ward: 0,
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
  adoptedLandRate: undefined,

  buildingAge: 0,
  hasBuilding: false,

  building: undefined,

  governmentWeight: 30,
  marketWeight: 70,

  structuralAmenities: [
    {
      factor: "",
      observedValue: "",
      adjustment: 0,
    },
  ],

  images: [],
});


// ─────────────────────────────────────────
// Context
// ─────────────────────────────────────────

export const PropertyContext =
  createContext<PropertyContextType | undefined>(undefined);


// ─────────────────────────────────────────
// Provider
// ─────────────────────────────────────────

export const PropertyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [property, setProperty] =
    useState<PropertyInput>(createInitialProperty);

  const [step, setStep] = useState<StepIndex>(0);

  const [furthestUnlocked, setFurthestUnlocked] =
    useState<StepIndex>(0);

  const [includeBuilding, setIncludeBuilding] =
    useState(false);

  const [result, setResult] =
    useState<ValuationResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [isReportOpen, setIsReportOpen] =
    useState(false);

  // ─────────────────────────────────────
  // Generic Property Update
  // ─────────────────────────────────────

  const updateProperty = <K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K],
  ) => {
    setProperty((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  // ─────────────────────────────────────
  // Owner
  // ─────────────────────────────────────

  const ownerDetails = property.ownerDetails;

  const updateOwnerDetails = (
    key: keyof OwnerDetail,
    value: string | number,
  ) => {
    setProperty((prev) => ({
      ...prev,
      ownerDetails: {
        ...prev.ownerDetails,
        [key]: value,
      },
    }));
  };


  // ─────────────────────────────────────
  // Client
  // ─────────────────────────────────────

  const clientDetails = property.clientDetails;

  const updateClientDetails = (
    key: keyof ClientDetail,
    value: string | number,
  ) => {
    setProperty((prev) => ({
      ...prev,
      clientDetails: {
        ...prev.clientDetails,
        [key]: value,
      },
    }));
  };


  // ─────────────────────────────────────
  // Location
  // ─────────────────────────────────────

  const updateLocation = (
    key: keyof PropertyInput["location"],
    value: string | number,
  ) => {
    setProperty((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  };


  // ─────────────────────────────────────
  // Boundary
  // ─────────────────────────────────────

  const updateBoundary = (
    key: keyof PropertyInput["boundaryDetails"],
    value: string,
  ) => {
    setProperty((prev) => ({
      ...prev,
      boundaryDetails: {
        ...prev.boundaryDetails,
        [key]: value,
      },
    }));
  };


  // ─────────────────────────────────────
  // Land Area
  // ─────────────────────────────────────

  const updateLandArea = (
    key: keyof PropertyInput["landArea"],
    value: number,
  ) => {
    setProperty((prev) => ({
      ...prev,
      landArea: {
        ...prev.landArea,
        [key]: value,
      },
    }));
  };


  // ─────────────────────────────────────
  // Building
  // ─────────────────────────────────────

  const updateBuilding = <K extends keyof Building>(
    key: K,
    value: Building[K],
  ) => {
    setProperty((prev) => ({
      ...prev,
      building: {
        ...(prev.building ?? {
          sanitaryRate: 0,
          electricalRate: 0,
          usefulLife: 0,
          depreciationRate: 0,
          floors: [],
        }),
        [key]: value,
      },
    }));
  };

  const setBuilding = (building: Building | undefined) => {
    setProperty((prev) => ({
      ...prev,
      building,
    }));
  };


  // ─────────────────────────────────────
  // Floors
  // ─────────────────────────────────────

  const addFloor = () => {
    setProperty((prev) => ({
      ...prev,

      building: {
        ...(prev.building ?? {
          sanitaryRate: 0,
          electricalRate: 0,
          usefulLife: 0,
          depreciationRate: 0,
          floors: [],
        }),

        floors: [
          ...(prev.building?.floors ?? []),
          {
            name: "",
            area: 0,
            ratePerSqft: 0,
          },
        ],
      },
    }));
  };

  const updateFloor = (
    index: number,
    key: keyof Floor,
    value: string | number,
  ) => {
    setProperty((prev) => {
      if (!prev.building) return prev;

      const floors = [...prev.building.floors];

      floors[index] = {
        ...floors[index],
        [key]: value,
      };

      return {
        ...prev,
        building: {
          ...prev.building,
          floors,
        },
      };
    });
  };

  const deleteFloor = (index: number) => {
    setProperty((prev) => {
      if (!prev.building) return prev;

      return {
        ...prev,
        building: {
          ...prev.building,
          floors: prev.building.floors.filter(
            (_, i) => i !== index,
          ),
        },
      };
    });
  };


  // ─────────────────────────────────────
  // Factors
  // ─────────────────────────────────────

  const factorsField =
    property.structuralAmenities ?? [];

  const addFactor = () => {
    setProperty((prev) => ({
      ...prev,

      structuralAmenities: [
        ...(prev.structuralAmenities ?? []),
        {
          factor: "",
          observedValue: "",
          adjustment: 0,
        },
      ],
    }));
  };

  const updateFactor = (
    index: number,
    key: "factor" | "observedValue" | "adjustment",
    value: string | number,
  ) => {
    setProperty((prev) => ({
      ...prev,

      structuralAmenities:
        prev.structuralAmenities?.map((factor, i) =>
          i === index
            ? {
                ...factor,
                [key]: value,
              }
            : factor,
        ) ?? [],
    }));
  };

  const deleteFactor = (index: number) => {
    setProperty((prev) => ({
      ...prev,

      structuralAmenities:
        prev.structuralAmenities?.filter(
          (_, i) => i !== index,
        ) ?? [],
    }));
  };


  // ─────────────────────────────────────
  // Images
  // ─────────────────────────────────────

  const images = property.images ?? [];

  const addImage = (image: PropertyImage) => {
    setProperty((prev) => ({
      ...prev,

      images: [
        ...(prev.images ?? []),
        {
          ...image,
          type: image.type as PropertyImageType,
        },
      ],
    }));
  };

  const deleteImage = (
    type: PropertyImageType,
    index: number,
  ) => {
    setProperty((prev) => ({
      ...prev,

      images:
        prev.images?.filter(
          (image, i) =>
            !(image.type === type && i === index),
        ) ?? [],
    }));
  };


  // ─────────────────────────────────────
  // Validation
  // ─────────────────────────────────────

  const locationDone =
    !!property.location.district &&
    !!property.location.municipality &&
    property.location.ward > 0;

  const landDone =
    property.landArea.ropani > 0 ||
    property.landArea.aana > 0 ||
    property.landArea.paisa > 0 ||
    property.landArea.dam > 0
      ? property.governmentRate > 0 &&
        property.marketRate > 0
      : false;

  const buildingDone =
    !includeBuilding ||
    (!!property.building &&
      property.building.floors.length > 0 &&
      property.building.floors.every(
        (floor) =>
          floor.area > 0 &&
          floor.name.trim() !== "",
      ));


  // ─────────────────────────────────────
  // Wizard
  // ─────────────────────────────────────

  const goTo = (target: StepIndex) => {
    if (target > furthestUnlocked) return;

    setStep(target);
  };

  const advance = (from: StepIndex) => {
    const next = (from + 1) as StepIndex;

    setFurthestUnlocked((prev) =>
      next > prev ? next : prev,
    );

    setStep(next);
  };


  // ─────────────────────────────────────
  // Valuation
  // ─────────────────────────────────────

  const calculateValuation = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload: Partial<PropertyInput> = {
        ...property,
      };

      if (!includeBuilding) {
        delete payload.building;
      }

      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const apiError = data as ApiError;

        throw new Error(
          apiError.error ??
            apiError.message ??
            "Valuation failed",
        );
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
    }
  };


  return (
    <PropertyContext.Provider
      value={{
        property,
        setProperty,
        updateProperty,

        ownerDetails,
        updateOwnerDetails,

        clientDetails,
        updateClientDetails,

        updateLocation,
        updateBoundary,
        updateLandArea,

        updateBuilding,
        setBuilding,

        addFloor,
        updateFloor,
        deleteFloor,

        factorsField,
        addFactor,
        updateFactor,
        deleteFactor,

        images,
        addImage,
        deleteImage,
        setImages: (value: React.SetStateAction<PropertyImage[]>) => {
          setProperty((prev) => ({
            ...prev,
            images:
              typeof value === "function"
                ? value(prev.images ?? [])
                : value,
          }));
        },

        step,
        setStep,
        furthestUnlocked,
        goTo,
        advance,

        locationDone,
        landDone,
        buildingDone,

        includeBuilding,
        setIncludeBuilding,

        result,
        loading,
        error,

        calculateValuation,

        formOpen,
        setFormOpen,

        isReportOpen,
        setIsReportOpen,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};


// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────

export const useProperty = () => {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error(
      "useProperty must be used inside PropertyProvider",
    );
  }

  return context;
};