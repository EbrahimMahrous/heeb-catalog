"use client";
import { Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const { dict } = useLocale();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        add(product);
        router.push("/cart");
      }}
      className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
    >
      <Plus className="w-5 h-5" /> {dict.common.addToCart}
    </button>
  );
}
