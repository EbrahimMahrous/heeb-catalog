"use client";
import Image from "next/image";
import { Plus, Minus, PackageX } from "lucide-react";
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
  const { items, add, remove, setQty } = useCart();
  const common = dict.common;
  const cartDict = dict.cart;
  const outOfStock = !product.isAvailable;

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const inCart = quantity > 0;

  const handleDecrease = () => {
    if (quantity <= 1) {
      remove(product.id);
    } else {
      setQty(product.id, quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl p-2.5 hover:border-primary/40 hover:shadow-sm transition">
      {/* Product image */}
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

      {/* ===== Add / Quantity control — same style as cart page (smaller) ===== */}
      {outOfStock ? (
        <div className="flex items-center justify-center w-8 h-8 bg-neutral-100 text-neutral-400 rounded-full shrink-0">
          <Plus className="w-4 h-4" />
        </div>
      ) : inCart ? (
        // ✅ Same layout as the cart page quantity control, but compact
        <div className="flex items-center border border-neutral-200 rounded-full shrink-0 overflow-hidden">
          <button
            onClick={handleDecrease}
            className="px-2 py-1.5 hover:bg-neutral-100 active:bg-neutral-200 transition"
            aria-label={cartDict.decrease}
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
          <span className="w-7 text-center text-xs font-bold tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => add(product)}
            className="px-2 py-1.5 hover:bg-neutral-100 active:bg-neutral-200 transition"
            aria-label={cartDict.increase}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        // ✅ Same as before — single + button
        <button
          onClick={() => add(product)}
          className="flex items-center justify-center w-9 h-9 bg-primary hover:bg-primary/90 active:scale-90 text-white rounded-full transition shrink-0"
          aria-label={common.addToCart}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
