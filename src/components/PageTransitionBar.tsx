"use client";
import { useLocale } from "@/context/LocaleContext";

export default function PageTransitionBar() {
  const { isPending } = useLocale();

  if (!isPending) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 h-0.5 bg-primary/20 overflow-hidden">
      <div className="h-full w-1/3 bg-primary animate-progress-bar" />
    </div>
  );
}
