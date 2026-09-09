import { NextRequest, NextResponse } from "next/server";
import valuateProperty from "@/lib/valuationEngine";
import type { PropertyInput, ValuationResult, ApiError } from "@/types";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ValuationResult | ApiError>> {
  try {
    const body = (await req.json()) as PropertyInput;

    if (!body.landArea || body.landArea.ropani == null || body.landArea.aana == null || body.landArea.paisa == null || body.landArea.dam == null) {
      return NextResponse.json(
        { error: "landArea is required" },
        { status: 400 },
      );
    }

    if (body.governmentRate == null || body.marketRate == null) {
      return NextResponse.json(
        { error: "governmentRate and marketRate are required" },
        { status: 400 },
      );
    }
    console.log(body)

    const result = valuateProperty(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[POST /api/valuation]", err);
    return NextResponse.json(
      { error: "An error occurred during property valuation processing." },
      { status: 500 },
    );
  }
}
