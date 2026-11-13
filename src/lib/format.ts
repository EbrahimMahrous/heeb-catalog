/**
 * Format a price:
 * - Removes trailing ".00" (e.g. 7726.00 → "7726")
 * - Keeps decimals only when present (e.g. 7726.50 → "7726.5")
 * - Rounds to 2 decimals max (e.g. 7726.456 → "7726.46")
 */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;

  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }

  return rounded.toString().replace(/\.?0+$/, "");
}
