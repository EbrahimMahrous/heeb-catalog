"use client";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Globe, X, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { Product } from "@/types";
import { getSearchSuggestions } from "@/lib/search";

// =========================================
// SearchInput (extracted to avoid remount)
// =========================================
interface SearchInputProps {
  q: string;
  setQ: (v: string) => void;
  dict: any;
  isEn: boolean;
  suggestions: Product[];
  showSuggestions: boolean;
  highlightIndex: number;
  setHighlightIndex: (i: number) => void;
  setShowSuggestions: (v: boolean) => void;
  onSubmit: () => void;
  onClear: () => void;
  onSelect: (p: Product) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
}

function SearchInput({
  q,
  setQ,
  dict,
  isEn,
  suggestions,
  showSuggestions,
  highlightIndex,
  setHighlightIndex,
  setShowSuggestions,
  onSubmit,
  onClear,
  onSelect,
  onKeyDown,
  inputRef,
  wrapperRef,
  loading,
}: SearchInputProps) {
  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />

      <input
        ref={inputRef}
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={dict.search}
        className="w-full ps-10 pe-10 py-2.5 text-sm rounded-full border border-neutral-200 bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition"
        autoComplete="off"
      />

      {/* Loading spinner (while fetching products for the first time) */}
      {loading && !q && (
        <Loader2 className="absolute inset-e-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 animate-spin" />
      )}

      {/* Clear button */}
      {q && !loading && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-dark transition"
          aria-label={dict.close}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && q.trim() && (
        <div className="absolute top-full inset-s-0 inset-e-0 mt-1.5 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {suggestions.length > 0 ? (
            <>
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {suggestions.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelect(s)}
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
              <button
                type="button"
                onClick={onSubmit}
                className="w-full text-start px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-primary border-t border-neutral-100"
              >
                {dict.showAllResults} «{q}»
              </button>
            </>
          ) : (
            <div className="text-center py-6 px-3">
              <p className="text-sm text-neutral-500 mb-1">🔍</p>
              <p className="text-sm text-neutral-600 font-medium">
                {isEn ? "No suggestions" : "لا توجد اقتراحات"}
              </p>
              <button
                type="button"
                onClick={onSubmit}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                {isEn ? "Search anyway →" : "ابحث على أي حال ←"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================
// Header
// =========================================
export default function Header() {
  const { dict, isEn, toggleLocale } = useLocale();
  const common = dict.common;
  const { count } = useCart();
  const router = useRouter();
  const sp = useSearchParams();

  // Track client mount to prevent hydration mismatch on the cart badge
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ Products: fetched lazily on mount
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Search state
  const [q, setQ] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileWrapperRef = useRef<HTMLDivElement>(null);

  // Sync query with URL
  useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  // Focus mobile search when opened
  useEffect(() => {
    if (openSearch) mobileInputRef.current?.focus();
  }, [openSearch]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = wrapperRef.current?.contains(target);
      const insideMobile = mobileWrapperRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Submit search
  const submitSearch = () => {
    const trimmed = q.trim();
    const params = new URLSearchParams(sp.toString());
    params.delete("cat");
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`);
    setShowSuggestions(false);
    setOpenSearch(false);
  };

  // Clear search
  const clearSearch = () => {
    setQ("");
    setShowSuggestions(false);
    const params = new URLSearchParams(sp.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`);
    (openSearch ? mobileInputRef : inputRef).current?.focus();
  };

  // Select a suggestion
  const selectSuggestion = (product: Product) => {
    const params = new URLSearchParams();
    params.set("q", product.name);
    router.push(`/?${params.toString()}`);
    setShowSuggestions(false);
    setOpenSearch(false);
  };

  // ✅ Compute suggestions from the fetched products
  const suggestions = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    return getSearchSuggestions(products, trimmed, 6);
  }, [q, products]);

  // Auto-show/hide suggestions
  useEffect(() => {
    if (q.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
      setHighlightIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, q]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        setShowSuggestions(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        selectSuggestion(suggestions[highlightIndex]);
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  const logoSrc = isEn ? "/logo-heeb-ltr.webp" : "/logo-heeb-rtl.webp";

  const sharedProps = {
    q,
    setQ,
    dict: common,
    isEn,
    suggestions,
    showSuggestions,
    highlightIndex,
    setHighlightIndex,
    setShowSuggestions,
    onSubmit: submitSearch,
    onClear: clearSearch,
    onSelect: selectSuggestion,
    onKeyDown: handleKeyDown,
    loading: productsLoading,
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label={common.home}
        >
          <Image
            src={logoSrc}
            alt={common.brandShort}
            width={160}
            height={56}
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto">
          <SearchInput
            {...sharedProps}
            inputRef={inputRef}
            wrapperRef={wrapperRef}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* Mobile search toggle */}
        <button
          type="button"
          onClick={() => setOpenSearch((v) => !v)}
          className="md:hidden p-2.5 rounded-full hover:bg-neutral-100 transition shrink-0"
          aria-label={common.search}
        >
          <Search className="w-5 h-5 text-dark" />
        </button>

        {/* Language toggle */}
        <button
          type="button"
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm border border-neutral-200 rounded-full hover:bg-neutral-100 transition shrink-0"
          aria-label="Toggle language"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">
            {common.languageToggle}
          </span>
        </button>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative p-2.5 rounded-full hover:bg-neutral-100 transition shrink-0"
          aria-label={common.cart}
        >
          <ShoppingBag className="w-5 h-5 text-dark" />
          {mounted && count > 0 && (
            <span className="absolute top-0 inset-e-0 bg-orange text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 grid place-items-center">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile search drawer */}
      {openSearch && (
        <div className="md:hidden border-t border-neutral-100 px-3 pb-2.5 pt-2 bg-white">
          <SearchInput
            {...sharedProps}
            inputRef={mobileInputRef}
            wrapperRef={mobileWrapperRef}
          />
        </div>
      )}
    </header>
  );
}
