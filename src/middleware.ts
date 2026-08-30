import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "auth_token";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY ERROR: AUTH_SECRET environment variable is missing in production.",
      );
    }
    return new TextEncoder().encode(
      "development-fallback-secret-at-least-32-chars-long",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, getJwtSecretKey(), { algorithms: ["HS256"] });
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  const pathname = req.nextUrl.pathname;

  // Lock /login and /register: redirect authenticated users to /valuation
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && isValid) {
    return NextResponse.redirect(new URL("/valuation", req.url));
  }

  // Protected routes: /valuation, /auction-analysis
  const isProtected =
    pathname.startsWith("/valuation") ||
    pathname.startsWith("/auction-analysis");

  if (isProtected && !isValid) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/valuation/:path*",
    "/auction-analysis/:path*",
  ],
};
