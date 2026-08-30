import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Sign a JWT token for the user.
 */
export async function signSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

/**
 * Verify a JWT session token.
 */
export async function verifySessionToken(
  token: string,
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ["HS256"],
    });
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Set HTTP-Only session cookie on response.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Get and verify current session from HTTP-Only cookie.
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Clear the HTTP-Only session cookie (Logout).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
