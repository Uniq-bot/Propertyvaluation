import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await signSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (err: unknown) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { error: "An internal error occurred during login. Please try again." },
      { status: 500 },
    );
  }
}
