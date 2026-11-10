"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product, ProductSection } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import ProductCard from "./ProductCard";

const LOAD_BATCH = 8;

export default function CategorySection({
  section,
  hideHeader = false,
  priorityCount = 0,
}: {
  section: ProductSection;
  hideHeader?: boolean;
  /** How many leading cards get next/image priority (above-the-fold only). */
  priorityCount?: number;
}) {
  const { dict } = useLocale();
  const common = dict.common;
  const [products, setProducts] = useState<Product[]>(section.products);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const totalCount = section.totalCount ?? section.products.length;
  const hasMore = products.length < totalCount;

  // Reset when category changes (avoid resetting on parent re-renders)
  useEffect(() => {
    setProducts(section.products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const offset = products.length;
      const res = await fetch(
        `/api/products?categoryId=${section.id}&offset=${offset}&limit=${LOAD_BATCH}`,
      );
      const data = await res.json();
      const next: Product[] = data.products ?? [];
      if (next.length) {
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...next.filter((p) => !seen.has(p.id))];
        });
      }
    } catch {
      // keep current list on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, products.length, section.id]);

  const remaining = totalCount - products.length;

  return (
    <section className={hideHeader ? "pt-2 pb-5" : "py-5"}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-orange rounded-full" />
            <h2 className="text-base sm:text-lg font-black text-dark">
              {section.title}
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
            {totalCount}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            priority={i < priorityCount}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex flex-col items-center gap-1.5 mt-4"
        >
          <button
            onClick={() => void loadMore()}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {common.loading}
              </>
            ) : (
              <>
                {common.showMore}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
          <span className="text-[10px] text-neutral-400">
            {common.remaining} {remaining}
          </span>
        </div>
      )}
    </section>
  );
}
