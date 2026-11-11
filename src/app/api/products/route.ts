import { connection, NextRequest, NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/api";
import {
  filterAvailable,
  mapProductList,
  mapProductSearch,
} from "@/lib/product-mapper";
import { Locale } from "@/types";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

function localeFromQuery(searchParams: URLSearchParams): Locale {
  return searchParams.get("locale") === "en" ? "en" : "ar";
}

export async function GET(req: NextRequest) {
  // Request-time only — do not prerender this handler at build
  await connection();

  try {
    const { searchParams } = req.nextUrl;
    const locale = localeFromQuery(searchParams);
    const categoryId = searchParams.get("categoryId");
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);
    const limit = Math.min(
      40,
      Math.max(1, Number(searchParams.get("limit") ?? 8) || 8),
    );
    const mode = searchParams.get("mode"); // "full" | null (search)

    const raw = await getProducts();
    let available = filterAvailable(raw);

    // Paginated category batch for catalog "show more"
    if (categoryId) {
      const id = Number(categoryId);
      const categories = await getCategories();
      const cat = categories.find((c) => c.id === id);
      available = available.filter((p) => {
        if (p.product_category_id === id) return true;
        return cat ? (p.categories?.includes(cat.name_en) ?? false) : false;
      });

      const products = available
        .slice(offset, offset + limit)
        .map((p) => mapProductList(p, locale));

      return NextResponse.json(
        { products, total: available.length, offset, limit },
        { headers: CACHE_HEADERS },
      );
    }

    // Slim search index for Header autocomplete (default)
    const mapper = mode === "full" ? mapProductList : mapProductSearch;
    const products = available.map((p) => mapper(p, locale));

    return NextResponse.json({ products }, { headers: CACHE_HEADERS });
  } catch (err) {
    console.error("[/api/products]", err);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
