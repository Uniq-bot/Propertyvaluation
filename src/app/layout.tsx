import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Nepal Property Valuation System",
  description:
    "Land and building valuation for Bagmati Province using government and market rates, straight-line depreciation, and a 10-year inflation forecast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* SessionProvider makes useSession() available to all client components */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
