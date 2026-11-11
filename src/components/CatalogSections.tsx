"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product, ProductSection } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import CategorySection from "./CategorySection";

/** How many category sections mount on first paint (cold-load critical). */
const INITIAL_SECTIONS = 2;
const SECTION_BATCH = 2;

type SectionMeta = Pick<ProductSection, "id" | "title" | "totalCount">;

export default function CatalogSections({
  sections,
  hideHeader = false,
}: {
  sections: ProductSection[];
  hideHeader?: boolean;
}) {
  const { dict, isEn } = useLocale();
  const common = dict.common;
  const locale = isEn ? "en" : "ar";

  // Only keep the first N sections hydrated with products; rest are metadata
  const [loaded, setLoaded] = useState<ProductSection[]>(() =>
    sections.slice(0, INITIAL_SECTIONS),
  );
  const [pending, setPending] = useState<SectionMeta[]>(() =>
    sections.slice(INITIAL_SECTIONS).map(({ id, title, totalCount }) => ({
      id,
      title,
      totalCount,
    })),
  );
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(sections.slice(0, INITIAL_SECTIONS));
    setPending(
      sections.slice(INITIAL_SECTIONS).map(({ id, title, totalCount }) => ({
        id,
        title,
        totalCount,
      })),
    );
  }, [sections]);

  const revealMore = useCallback(async () => {
    if (loading || pending.length === 0) return;
    setLoading(true);
    const batch = pending.slice(0, SECTION_BATCH);
    const rest = pending.slice(SECTION_BATCH);

    try {
      const nextSections = await Promise.all(
        batch.map(async (meta) => {
          const res = await fetch(
            `/api/products?locale=${locale}&categoryId=${meta.id}&offset=0&limit=8`,
          );
          const data = await res.json();
          const products: Product[] = data.products ?? [];
          return {
            id: meta.id,
            title: meta.title,
            products,
            totalCount: meta.totalCount,
          } satisfies ProductSection;
        }),
      );
      setLoaded((prev) => [...prev, ...nextSections]);
      setPending(rest);
    } catch {
      // keep pending so user can retry
    } finally {
      setLoading(false);
    }
  }, [loading, pending, locale]);

  useEffect(() => {
    if (pending.length === 0) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void revealMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pending.length, revealMore]);

  return (
    <div className={hideHeader ? "" : "divide-y divide-neutral-200"}>
      {loaded.map((section, idx) => (
        <CategorySection
          key={section.id}
          section={section}
          hideHeader={hideHeader}
          priorityCount={idx === 0 ? 4 : 0}
        />
      ))}

      {pending.length > 0 && (
        <div
          ref={sentinelRef}
          className="flex flex-col items-center gap-1.5 py-6"
        >
          <button
            type="button"
            onClick={() => void revealMore()}
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
            {common.remaining} {pending.length}
          </span>
        </div>
      )}
    </div>
  );
}
