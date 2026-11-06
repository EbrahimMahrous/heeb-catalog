import { Suspense } from "react";
import { CartSkeleton } from "@/skeleton";
import CartPageClient from "./CartPageClient";

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPageClient />
    </Suspense>
  );
}
