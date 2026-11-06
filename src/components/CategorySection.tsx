'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductSection } from '@/types';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from './ProductCard';

const INITIAL_BATCH = 8;
const LOAD_BATCH = 8;

export default function CategorySection({
  section,
  hideHeader = false,
}: {
  section: ProductSection;
  hideHeader?: boolean;
}) {
  const { dict } = useLocale();
  const common = dict.common;
  const [visible, setVisible] = useState(INITIAL_BATCH);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visible < section.products.length;

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisible(v => Math.min(v + LOAD_BATCH, section.products.length));
            setLoading(false);
          }, 200);
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, section.products.length]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisible(v => Math.min(v + LOAD_BATCH, section.products.length));
      setLoading(false);
    }, 200);
  };

  const shown = section.products.slice(0, visible);
  const remaining = section.products.length - visible;

  return (
    <section className={hideHeader ? 'pt-2 pb-5' : 'py-5'}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-orange rounded-full" />
            <h2 className="text-base sm:text-lg font-black text-dark">{section.title}</h2>
          </div>
          <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">{section.products.length}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {shown.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex flex-col items-center gap-1.5 mt-4">
          <button
            onClick={loadMore}
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