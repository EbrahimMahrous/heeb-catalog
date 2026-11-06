import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api";
import { filterAvailable, mapProduct } from "@/lib/product-mapper";
import { getLocale } from "@/lib/locale";

export async function GET() {
  try {
    const locale = await getLocale();
    const raw = await getProducts();
    const products = filterAvailable(raw).map((p) => mapProduct(p, locale));
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[/api/products]", err);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
