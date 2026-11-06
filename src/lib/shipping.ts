// =========================================
// Shipping configuration
// =========================================
export const FREE_SHIPPING_THRESHOLD = 500;
export const DEFAULT_SHIPPING = 35;
export const WESTERN_REGION_SHIPPING = 50;

export type Region = "standard" | "western";

export interface ShippingResult {
  cost: number;
  isFree: boolean;
  reason: "free-threshold" | "paid";
}

/**
 * Calculate the shipping cost for a given subtotal and region.
 *
 * Rules:
 * - If subtotal >= 500 AED → free (regardless of region).
 * - Western Region (المنطقة الغربية) → 50 AED.
 * - Rest of the UAE → 35 AED.
 */
export function calculateShipping(
  subtotal: number,
  region: Region,
): ShippingResult {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, isFree: true, reason: "free-threshold" };
  }
  return {
    cost: region === "western" ? WESTERN_REGION_SHIPPING : DEFAULT_SHIPPING,
    isFree: false,
    reason: "paid",
  };
}
