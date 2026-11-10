// =========================================
// Locale
// =========================================
export type Locale = "ar" | "en";

// =========================================
// API Types — match the actual Heeb API shape
// =========================================

export interface ApiImage {
  id: number;
  product_id: number;
  image: string;
  image_path: string;
}

export interface ApiCategory {
  id: number;
  name_en: string;
  name_ar: string;
  image: string | null;
  image_path: string;
  status: number;
}

export interface ApiUnit {
  id: number;
  name: string;
  name_ar: string;
  short_code: string;
  short_code_ar: string;
  label: string;
}

export interface ApiCountry {
  id: number;
  name_en: string;
  name_ar: string;
  flag: string;
  image_path: string;
}

export interface ApiProduct {
  id: number;
  product_category_id: number | null;
  product_name: string;
  product_name_en: string | null;
  product_description: string | null;
  product_description_en: string | null;
  product_price: string;
  discounted_price: number;
  discount_percantage?: string;
  status: number;
  available_stock: number;
  is_available_ar: string | null;
  is_available_en: string | null;
  categories: string[];
  cover_image: ApiImage | null;
  images?: ApiImage[];
  unit?: ApiUnit | null;
  country?: ApiCountry | null;
  weight?: number | null;
}

// =========================================
// UI Types — unified shape used across the app
// =========================================

export interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  /** Original price before any discount (when applicable). */
  originalPrice?: number;
  imageUrl: string | null;
  isAvailable: boolean;
  stock: number;
  categories: string[];
  badge: string | null;
  /** Human-readable weight, e.g. "2 كيلو" or "2 kg". */
  weight?: string | null;
  /** Country flag URL (optional). */
  flagUrl?: string | null;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export interface ProductSection {
  id: number;
  title: string;
  /** Initial batch only — remaining products load on demand. */
  products: Product[];
  /** Total products in this category (for show-more). */
  totalCount: number;
}
