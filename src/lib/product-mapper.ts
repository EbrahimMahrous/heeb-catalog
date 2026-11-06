import { ApiProduct, Locale, Product } from "@/types";

/**
 * Build the full image URL from the API image object.
 */
function imageUrl(p: ApiProduct): string | null {
  const img = p.cover_image ?? p.images?.[0];
  if (!img) return null;
  return `${img.image_path}${img.image}`;
}

/**
 * Build a human-readable weight label (e.g. "2 كيلو" / "2 kg").
 * Returns null when the product has no weight.
 */
function weightLabel(p: ApiProduct, locale: Locale): string | null {
  if (!p.weight) return null;

  const isAr = locale === "ar";
  const unitShort = p.unit
    ? isAr
      ? p.unit.short_code_ar
      : p.unit.short_code
    : isAr
      ? "كيلو"
      : "kg";

  return `${p.weight} ${unitShort}`;
}

/**
 * Convert an API product into the unified UI shape.
 */
export function mapProduct(p: ApiProduct, locale: Locale): Product {
  const isAr = locale === "ar";

  // Effective price: prefer discounted_price when available
  const price =
    p.discounted_price > 0 ? p.discounted_price : Number(p.product_price);

  return {
    id: p.id,
    name: isAr ? p.product_name : p.product_name_en || p.product_name,
    nameEn: p.product_name_en || p.product_name,
    description: isAr
      ? p.product_description || ""
      : p.product_description_en || p.product_description || "",
    descriptionEn: p.product_description_en || "",
    price,
    imageUrl: imageUrl(p),
    isAvailable: p.status === 1, // status 1 = available
    stock: p.available_stock ?? 0,
    categories: p.categories ?? [],
    badge: isAr ? p.is_available_ar : p.is_available_en,
    weight: weightLabel(p, locale), // ✅ e.g. "2 كيلو" or "2 kg"
  };
}

/**
 * Keep only available products (status === 1).
 */
export function filterAvailable(products: ApiProduct[]): ApiProduct[] {
  return products.filter((p) => p.status === 1);
}
