import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth (Auth.js v5) configuration.
 * Excludes Node.js / Prisma client dependencies so it can safely be loaded
 * inside Next.js Edge Middleware.
 */
if (
  process.env.NODE_ENV !== "test" &&
  (!process.env.GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET.includes("replace-with"))
) {
  console.warn(
    "\n⚠️  [NextAuth Warning] GOOGLE_CLIENT_SECRET is set to placeholder.\nGoogle OAuth sign-in requires a valid Client Secret from Google Cloud Console in .env or .env.local.\n",
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
};
