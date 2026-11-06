'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';

interface NavItem {
  id: string | null;
  label: string;
}

export default function CategoryNav({ items }: { items: NavItem[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const active = sp.get('cat') ?? 'all';
  const hasSearch = !!sp.get('q');
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  const go = (id: string | null) => {
    const params = new URLSearchParams(sp.toString());
    if (!id) params.delete('cat');
    else params.set('cat', id);
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ''}`, { scroll: false });
    if (!hasSearch) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-hide">
          {items.map(item => {
            const key = item.id ?? 'all';
            const isActive = active === key;
            return (
              <button
                key={key}
                ref={isActive ? activeBtnRef : null}
                onClick={() => go(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-dark border-neutral-200 hover:border-primary/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}