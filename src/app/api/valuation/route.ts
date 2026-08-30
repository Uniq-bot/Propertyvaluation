import { NextRequest, NextResponse } from "next/server";
import valuateProperty from "@/lib/valuationEngine";
import type { PropertyInput, ValuationResult, ApiError } from "@/types";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ValuationResult | ApiError>> {
  try {
    const body = (await req.json()) as PropertyInput;

    if (!body.landAreaAana) {
      return NextResponse.json(
        { error: "landAreaAana is required" },
        { status: 400 },
      );
    }

    if (body.governmentRate == null || body.marketRate == null) {
      return NextResponse.json(
        { error: "governmentRate and marketRate are required" },
        { status: 400 },
      );
    }

    const result = valuateProperty(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Valuation failed";
    console.error("[POST /api/valuation]", err);
    return NextResponse.json({ error: "Valuation failed", message }, { status: 500 });
  }
}
