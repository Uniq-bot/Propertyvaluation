import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

// ─────────────────────────────────────────────────────────────────
// Full NextAuth (Auth.js v5) setup with Prisma DB persistence
// ─────────────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    /**
     * Fires on every sign-in. We upsert the user into the DB ourselves
     * so we keep full control of the User model without needing a full adapter.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name ?? undefined,
              image: user.image ?? undefined,
              googleId: account.providerAccountId,
            },
            create: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              googleId: account.providerAccountId,
            },
          });
        } catch (err) {
          console.error("[NextAuth signIn] Prisma upsert failed:", err);
          // Returning false would block login — let it proceed even if DB write fails
        }
      }
      return true;
    },

    /**
     * Embed the DB user id into the JWT so it's available on the session.
     */
    async jwt({ token, account, user }) {
      if (account && user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true },
          });
          if (dbUser) token.dbId = dbUser.id;
        } catch {
          // Non-fatal; proceed without DB id
        }
      }
      return token;
    },

    /**
     * Expose dbId on the client-facing session object.
     */
    async session({ session, token }) {
      if (token.dbId && session.user) {
        (session.user as { id?: string }).id = token.dbId as string;
      }
      return session;
    },
  },
});

