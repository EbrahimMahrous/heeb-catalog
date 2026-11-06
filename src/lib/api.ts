import "server-only";
import { ApiCategory, ApiProduct } from "@/types";

// =========================================
// Environment
// =========================================
const BASE = process.env.API_BASE_URL!;
const TOKEN = process.env.API_SECRET_TOKEN!;

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

/**
 * Generic GET request to the Heeb API.
 * Adds the bearer token and revalidates the response.
 */
async function apiGet<T>(path: string, revalidate = 120): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

// =========================================
// Public helpers
// =========================================

/** Fetch all active product categories. */
export async function getCategories(): Promise<ApiCategory[]> {
  const data = await apiGet<ApiCategory[]>("/product-categories");
  return data.filter((c) => c.status === 1);
}

/** Fetch products — all products or filtered by category. */
export async function getProducts(
  categoryId?: number | string,
): Promise<ApiProduct[]> {
  const q = categoryId ? `?category_id=${categoryId}` : "";
  const data = await apiGet<ApiProduct[]>(`/products${q}`);
  return data;
}

/** Fetch a single product's full details. */
export async function getProductDetails(
  id: number | string,
): Promise<ApiProduct | null> {
  try {
    const data = await apiGet<ApiProduct>(`/product/details/${id}`);
    return data ?? null;
  } catch {
    return null;
  }
}

/** Search products by query string. */
export async function searchProducts(query: string): Promise<ApiProduct[]> {
  if (!query.trim()) return [];
  const data = await apiGet<ApiProduct[]>(
    `/search/products?search_query=${encodeURIComponent(query)}`,
  );
  return data;
}
