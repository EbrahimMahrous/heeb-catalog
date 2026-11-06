import { ApiCategory, ApiProduct, Locale, ProductSection } from "@/types";
import { mapProduct } from "./product-mapper";

// =========================================
// Order the categories appear in
// =========================================
const PREFERRED_ORDER = [
  "Seasonal Fruits", // فواكه موسمية (id = 1)
  "Dairy Products", // ألبان (id = 2)
  "Dried fish", // أسماك مجففة (id = 8)
  "Pickles & Sauces", // أجارات وصوصات (id = 3)
];

// Categories we never show on the catalog page
const EXCLUDED_CATEGORIES = [
  "Best Seller", // الأكثر مبيعاً
  "New Products",
];

// =========================================
// Helpers
// =========================================

/** Should this category be hidden from the catalog? */
export function isExcludedCategory(cat: ApiCategory): boolean {
  return EXCLUDED_CATEGORIES.includes(cat.name_en);
}

/**
 * Return visible categories in the desired display order:
 * 1. Only status === 1.
 * 2. Exclude EXCLUDED_CATEGORIES.
 * 3. Sort by PREFERRED_ORDER first, then alphabetically.
 */
export function getVisibleCategories(categories: ApiCategory[]): ApiCategory[] {
  return categories
    .filter((c) => c.status === 1 && !isExcludedCategory(c))
    .sort((a, b) => {
      const ia = PREFERRED_ORDER.indexOf(a.name_en);
      const ib = PREFERRED_ORDER.indexOf(b.name_en);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.name_en.localeCompare(b.name_en);
    });
}

/**
 * Group products by category into sections for the catalog page.
 * Products missing a category are skipped.
 */
export function buildSections(
  categories: ApiCategory[],
  products: ApiProduct[],
  locale: Locale,
): ProductSection[] {
  const available = products.filter((p) => p.status === 1);
  const visibleCats = getVisibleCategories(categories);

  const sections: ProductSection[] = [];

  for (const cat of visibleCats) {
    // Match by product_category_id OR by name in the `categories` array
    const catProducts = available.filter((p) => {
      if (p.product_category_id === cat.id) return true;
      return p.categories?.includes(cat.name_en) ?? false;
    });

    if (catProducts.length === 0) continue;

    sections.push({
      id: cat.id,
      title: locale === "ar" ? cat.name_ar : cat.name_en,
      products: catProducts.map((p) => mapProduct(p, locale)),
    });
  }

  return sections;
}
