import type { Metadata } from "next";
import "./globals.css";
import { PropertyProvider } from "../../public/context/PropertyContext";

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
        <PropertyProvider>{children}</PropertyProvider>
      </body>
    </html>
  );
}
