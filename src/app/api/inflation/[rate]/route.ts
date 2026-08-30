import { NextRequest, NextResponse } from "next/server";
import type { InflationRequest, InflationResponse, ApiError } from "@/types";

interface RouteParams {
  params: Promise<{ rate: string }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<InflationResponse | ApiError>> {
  try {
    const { rate: rateParam } = await params;
    const body = (await req.json()) as InflationRequest;

    const number = Number(rateParam);

    if (isNaN(number) || number <= 0) {
      return NextResponse.json(
        { error: "Inflation rate must be a positive number" },
        { status: 400 },
      );
    }

    if (body.currentAmount == null || isNaN(Number(body.currentAmount))) {
      return NextResponse.json(
        { error: "currentAmount is required" },
        { status: 400 },
      );
    }

    const inflationRate = number / 100;
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10;

    let amount = Number(body.currentAmount);
    const years: InflationResponse["years"] = [];

    for (let year = currentYear; year <= maxYear; year++) {
      years.push({ year, amount: Math.round(amount) });
      amount = amount * (1 + inflationRate);
    }

    return NextResponse.json({
      currentAmount: body.currentAmount,
      inflationRate: number,
      years,
    });
  } catch (err: unknown) {
    console.error("[POST /api/inflation/[rate]]", err);
    return NextResponse.json(
      { error: "An error occurred during inflation projection calculation." },
      { status: 500 },
    );
  }
}
