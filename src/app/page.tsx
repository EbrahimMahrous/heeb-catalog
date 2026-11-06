import { Suspense } from "react";
import BrandHeaderLazy from "@/components/BrandHeaderLazy";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import ProductCard from "@/components/ProductCard";
import {
  CatalogSkeleton,
  CategoryNavSkeleton,
  BrandHeaderSkeleton,
} from "@/skeleton";
import { getCategories, getProducts } from "@/lib/api";
import { filterAvailable, mapProduct } from "@/lib/product-mapper";
import { buildSections, getVisibleCategories } from "@/lib/sections";
import { searchProductsLocal, rankSearchResults } from "@/lib/search";
import { getDict, getLocale } from "@/lib/locale";

interface Props {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

// =========================================
// Top-level Suspense — shows CatalogSkeleton
// ONLY for the product grid area (below BrandHeader/CategoryNav).
// =========================================
export default async function Home({ searchParams }: Props) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({ searchParams }: Props) {
  const locale = await getLocale();
  const common = getDict(locale);
  const sp = await searchParams;
  const q = sp.q?.trim();
  const activeCat = sp.cat;

  const [categories, rawProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const allProducts = filterAvailable(rawProducts).map((p) =>
    mapProduct(p, locale),
  );
  const visibleCats = getVisibleCategories(categories);

  const navItems = [
    { id: null as string | null, label: common.all },
    ...visibleCats.map((c) => ({
      id: String(c.id),
      label: locale === "ar" ? c.name_ar : c.name_en,
    })),
  ];

  // =========================================
  // SEARCH MODE
  // =========================================
  if (q) {
    const matched = searchProductsLocal(allProducts, q);
    const ranked = rankSearchResults(matched, q);
    const results = activeCat
      ? ranked.filter((p) => {
          const cat = visibleCats.find((c) => String(c.id) === activeCat);
          if (!cat) return true;
          return p.categories.includes(cat.name_en);
        })
      : ranked;

    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="min-h-screen bg-white flex flex-col"
      >
        <Suspense fallback={<CategoryNavSkeleton />}>
          <CategoryNav items={navItems} />
        </Suspense>

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4">
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-dark">
                {common.searchResults} «{q}»
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {results.length} {common.products}
              </p>
            </div>
            <a
              href="/"
              className="text-xs sm:text-sm text-primary hover:underline font-semibold"
            >
              ← {common.showAllProducts}
            </a>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-3">🔍</div>
              <p className="text-neutral-500 text-sm mb-2">
                {common.noResults} «{q}»
              </p>
              <p className="text-xs text-neutral-400">{common.noResultsHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // =========================================
  // CATALOG MODE
  // =========================================
  const allSections = buildSections(categories, rawProducts, locale);
  const shownSections = activeCat
    ? allSections.filter((s) => String(s.id) === activeCat)
    : allSections;
  const totalCount = shownSections.reduce(
    (sum, s) => sum + s.products.length,
    0,
  );

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* BrandHeader — Client Component, has its own internal skeleton */}
      <BrandHeaderLazy />

      {/* CategoryNav — uses useSearchParams, needs Suspense */}
      <Suspense fallback={<CategoryNavSkeleton />}>
        <CategoryNav items={navItems} />
      </Suspense>

      {/* Product grid — main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4">
        <div className="py-2.5 text-xs sm:text-sm text-neutral-500 border-b border-neutral-100">
          {common.total}{" "}
          <span className="font-bold text-dark">{totalCount}</span>{" "}
          {common.products}
          {activeCat && shownSections[0] && (
            <span className="ms-2 text-neutral-400">
              — {shownSections[0].title}
            </span>
          )}
        </div>

        {shownSections.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-sm">
            {common.emptyProducts}
          </div>
        ) : (
          <div className={activeCat ? "" : "divide-y divide-neutral-200"}>
            {shownSections.map((section) => (
              <CategorySection
                key={section.id}
                section={section}
                hideHeader={!!activeCat}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
