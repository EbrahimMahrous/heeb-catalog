'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiCategory, Locale } from '@/types';

export default function CategoryTabs({
  categories, locale, dict,
}: { categories: ApiCategory[]; locale: Locale; dict: any }) {
  const router = useRouter();
  const sp = useSearchParams();
  const active = sp.get('cat') ?? 'all';

  const go = (id: string) => {
    const params = new URLSearchParams(sp.toString());
    params.delete('q');
    if (id === 'all') params.delete('cat');
    else params.set('cat', id);
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ''}`);
  };

  const label = (c: ApiCategory) => locale === 'ar' ? c.name_ar : c.name_en;

  return (
    <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide -mx-1 px-1">
      <button
        onClick={() => go('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${
          active === 'all'
            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
        }`}
      >
        {dict.all}
      </button>
      {categories.map(c => (
        <button
          key={c.id}
          onClick={() => go(String(c.id))}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${
            active === String(c.id)
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
          }`}
        >
          {label(c)}
        </button>
      ))}
    </div>
  );
}