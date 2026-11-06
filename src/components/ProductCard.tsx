"use client";
import { Plus, PackageX } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import ReadMore from "./ReadMore";

export default function ProductCard({ product }: { product: Product }) {
  const { dict } = useLocale();
  const { add } = useCart();
  const common = dict.common;
  const outOfStock = !product.isAvailable;

  return (
    <div className="flex items-start gap-3 bg-white border border-neutral-200 rounded-xl p-2.5 hover:border-primary/40 hover:shadow-sm transition">
      {/* Product image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-2xl text-neutral-400">
            🛍️
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-dark/60 grid place-items-center">
            <PackageX className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center self-stretch">
        {/* Name */}
        <h3 className="font-bold text-dark text-sm leading-tight line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <ReadMore text={product.description} maxLength={60} compact />
        )}

        {/* Price + weight + add button */}
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            {/* Price */}
            <span className="font-black text-primary text-sm whitespace-nowrap">
              {product.price.toFixed(2)}
              <span className="text-[10px] font-medium text-neutral-400 ms-1">
                {common.currency}
              </span>
            </span>

            {/* Weight badge */}
            {product.weight && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-neutral-600 bg-neutral-100 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                ⚖️ {product.weight}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={() => add(product)}
            disabled={outOfStock}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-40 transition shrink-0"
            aria-label={common.addToCart}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
