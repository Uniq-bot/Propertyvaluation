import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect /valuation and /auction-analysis; leave everything else public
  matcher: ["/valuation", "/auction-analysis"],
};

