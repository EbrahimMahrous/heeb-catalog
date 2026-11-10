"use client";
import BrandHeader from "@/components/BrandHeader";

/** Keep as client island for locale hooks, but SSR HTML (no ssr:false). */
export default function BrandHeaderLazy() {
  return <BrandHeader />;
}
