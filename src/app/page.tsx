import { Suspense } from "react";
import BrandHeaderLazy from "@/components/BrandHeaderLazy";
import CategoryNav from "@/components/CategoryNav";
import CatalogSections from "@/components/CatalogSections";
import SearchResults from "@/components/SearchResults";
import {
  CatalogSkeleton,
  CategoryNavSkeleton,
} from "@/skeleton";
import { getCategories, getProducts } from "@/lib/api";
import { filterAvailable, mapProductList } from "@/lib/product-mapper";
import { buildSections, getVisibleCategories } from "@/lib/sections";
import { searchProductsLocal, rankSearchResults } from "@/lib/search";
import { getDict, getLocale } from "@/lib/locale";

interface Props {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const locale = await getLocale();

  // Brand chrome streams immediately — not blocked on product API
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-white flex flex-col"
    >
      <BrandHeaderLazy />

      <Suspense fallback={<CatalogSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </div>
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
    mapProductList(p, locale),
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
      <>
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
            <SearchResults products={results} />
          )}
        </main>
      </>
    );
  }

  // =========================================
  // CATALOG MODE
  // =========================================
  const allSections = buildSections(categories, rawProducts, locale);
  const shownSections = activeCat
    ? allSections.filter((s) => String(s.id) === activeCat)
    : allSections;
  const totalCount = shownSections.reduce((sum, s) => sum + s.totalCount, 0);

  return (
    <>
      <Suspense fallback={<CategoryNavSkeleton />}>
        <CategoryNav items={navItems} />
      </Suspense>

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
          <CatalogSections
            sections={
              // First 2 sections include products; later ones are metadata only
              // so the RSC payload stays small on cold load.
              activeCat
                ? shownSections
                : shownSections.map((s, i) =>
                    i < 2 ? s : { ...s, products: [] },
                  )
            }
            hideHeader={!!activeCat}
          />
        )}
      </main>
    </>
  );
}
