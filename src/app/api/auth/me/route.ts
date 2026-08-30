import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
