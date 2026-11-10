"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Product } from "@/types";
import { getSearchSuggestions } from "@/lib/search";

export default function SearchAutocomplete({
  products,
  locale,
  dict,
}: {
  products: Product[];
  locale: "ar" | "en";
  dict: any;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // مزامنة مع URL
  useEffect(() => {
    setQuery(sp.get("q") ?? "");
  }, [sp]);

  // إغلاق عند الضغط برة
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ اقتراحات فورية — حتى مع حرف واحد
  const suggestions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return getSearchSuggestions(products, trimmed, 6);
  }, [query, products]);

  // إظهار الاقتراحات لما تكون فيه نتائج
  useEffect(() => {
    setIsOpen(suggestions.length > 0);
    setHighlightIndex(-1);
  }, [suggestions]);

  const submitSearch = () => {
    const trimmed = query.trim();
    const params = new URLSearchParams(sp.toString());
    params.delete("cat");
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    const params = new URLSearchParams(sp.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        // اذهب للبحث بكلمة المنتج
        const name = suggestions[highlightIndex].name;
        const params = new URLSearchParams();
        params.set("q", name);
        router.push(`/?${params.toString()}`);
      } else {
        submitSearch();
      }
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* حقل البحث */}
      <div className="relative flex items-center">
        <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={dict.search}
          className="w-full ps-10 pe-10 py-2.5 text-sm rounded-full border border-neutral-200 bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-dark transition"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* الاقتراحات */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full inset-s-0 inset-e-0 mt-1.5 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {suggestions.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("q", s.name);
                  router.push(`/?${params.toString()}`);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`w-full text-start flex items-center gap-3 px-3 py-2 transition-colors ${
                  idx === highlightIndex
                    ? "bg-primary/5"
                    : "hover:bg-neutral-50"
                }`}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  {s.imageUrl ? (
                    <Image
                      src={s.imageUrl}
                      alt=""
                      fill
                      sizes="40px"
                      quality={60}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-sm">
                      🛍️
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">
                    {s.name}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {s.price.toFixed(2)} {dict.currency}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* زر "عرض كل النتائج" */}
          <button
            type="button"
            onClick={submitSearch}
            className="w-full text-start px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-primary border-t border-neutral-100"
          >
            {locale === "ar"
              ? `عرض كل النتائج لـ «${query}»`
              : `Show all results for «${query}»`}
          </button>
        </div>
      )}
    </div>
  );
}
