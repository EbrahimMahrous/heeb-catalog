import { Suspense } from "react";
import { ProductDetailsSkeleton } from "@/skeleton";
import ProductContent from "./ProductContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
