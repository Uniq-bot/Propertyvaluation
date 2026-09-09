export function formatNPR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function convertToAana(ropani:number, aana:number, paisa:number, dam:number, targetUnit: string) {
    // First convert everything to Aana
    const totalAana =
        (ropani * 16) +
        aana +
        (paisa / 4) +
        (dam / 16);

    return targetUnit === "aana" ? totalAana : totalAana / 16; // If target unit is Ropani, convert Aana to Ropani
}