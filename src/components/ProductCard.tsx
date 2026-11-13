"use client";
import Image from "next/image";
import { Plus, PackageX } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import ReadMore from "./ReadMore";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { dict } = useLocale();
  const { add } = useCart();
  const common = dict.common;
  const outOfStock = !product.isAvailable;

  return (
    <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl p-2.5 hover:border-primary/40 hover:shadow-sm transition">
      {/* Product image — larger thumb, vertically centered */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            quality={70}
            priority={priority}
            className="object-cover"
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
        <h3 className="font-bold text-dark text-sm leading-tight line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <ReadMore text={product.description} maxLength={60} compact />
        )}

        <div className="flex items-center gap-1.5 mt-1.5 min-w-0 flex-wrap">
          <span className="font-black text-primary text-sm whitespace-nowrap">
            {formatPrice(product.price)}
            <span className="text-[10px] font-medium text-neutral-400 ms-1">
              {common.currency}
            </span>
          </span>

          {product.weight && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-neutral-600 bg-neutral-100 rounded-full px-1.5 py-0.5 whitespace-nowrap">
              ⚖️ {product.weight}
            </span>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={() => add(product)}
        disabled={outOfStock}
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-primary hover:bg-primary/90 active:bg-primary/70 text-white rounded-md disabled:opacity-40 transition-all duration-150 active:scale-90 shrink-0"
        aria-label={common.addToCart}
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
