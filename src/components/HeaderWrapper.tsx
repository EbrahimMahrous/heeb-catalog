"use client";
import dynamic from "next/dynamic";
import { HeaderSkeleton } from "@/skeleton";

// ✅ ssr:false is allowed here — this is a Client Component.
// This avoids blocking prerendering of the entire app.
const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

export default function HeaderWrapper() {
  return <Header />;
}
