"use client";
import { Suspense } from "react";
import Header from "@/components/Header";
import { HeaderSkeleton } from "@/skeleton";

/**
 * Header uses useSearchParams — must be under Suspense for prerender.
 * Still SSR'd (no ssr:false) so chrome HTML arrives without waiting on a JS chunk.
 */
export default function HeaderWrapper() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <Header />
    </Suspense>
  );
}
