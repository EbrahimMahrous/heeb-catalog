"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import ProductCard from "./ProductCard";

const INITIAL = 16;
const BATCH = 16;

export default function SearchResults({ products }: { products: Product[] }) {
  const { dict } = useLocale();
  const common = dict.common;
  const [visible, setVisible] = useState(Math.min(INITIAL, products.length));

  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {shown.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
      {hasMore && (
        <div className="flex flex-col items-center gap-1.5 mt-4">
          <button
            type="button"
            onClick={() =>
              setVisible((v) => Math.min(v + BATCH, products.length))
            }
            className="flex items-center gap-1.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition"
          >
            {common.showMore}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-neutral-400">
            {common.remaining} {products.length - visible}
          </span>
        </div>
      )}
    </>
  );
}
