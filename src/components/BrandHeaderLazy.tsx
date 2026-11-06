"use client";
import dynamic from "next/dynamic";
import { BrandHeaderSkeleton } from "@/skeleton";

// ✅ Loaded client-side with a skeleton fallback
const BrandHeader = dynamic(() => import("@/components/BrandHeader"), {
  ssr: false,
  loading: () => <BrandHeaderSkeleton />,
});

export default function BrandHeaderLazy() {
  return <BrandHeader />;
}
