"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

export default function WhatsAppButton() {
  const { dict, isEn } = useLocale();
  const common = dict.common;
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className={`fixed bottom-6 z-60 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${
        isEn ? "right-6" : "left-6"
      }`}
      aria-label={common.cart}
    >
      <ShoppingBag className="w-7 h-7 md:w-8 md:h-8" />

      {/* Cart badge — same as header, only renders after mount */}
      {hydrated && count > 0 && (
        <span className="absolute -top-1 inset-e-0 bg-orange text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 grid place-items-center animate-pulse">
          {count}
        </span>
      )}
    </Link>
  );
}
