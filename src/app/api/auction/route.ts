import { NextRequest, NextResponse } from "next/server";
import type { AuctionRequest, AuctionResponse, ApiError } from "@/types";

const AUCTION_RATES = [
  { label: "Conservative", rate: 0.6 },
  { label: "Expected", rate: 0.7 },
  { label: "Optimistic", rate: 0.8 },
] as const;

export async function POST(
  req: NextRequest,
): Promise<NextResponse<AuctionResponse | ApiError>> {
  try {
    const body = (await req.json()) as AuctionRequest;

    if (body.currentAmount == null || isNaN(Number(body.currentAmount))) {
      return NextResponse.json(
        { error: "currentAmount is required" },
        { status: 400 },
      );
    }

    const currentAmount = Number(body.currentAmount);

    const predictions = AUCTION_RATES.map(({ label, rate }) => ({
      label,
      rate: rate * 100,
      amount: Math.round(currentAmount * rate),
    }));

    return NextResponse.json({
      year: new Date().getFullYear(),
      valuationAmount: currentAmount,
      predictions,
    });
  } catch (err: unknown) {
    console.error("[POST /api/auction]", err);
    return NextResponse.json(
      { error: "An error occurred during auction prediction calculation." },
      { status: 500 },
    );
  }
}
