"use client";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

export default function Loading() {
  const { dict, isEn } = useLocale();
  const common = dict.common;

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-white flex items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Loading ring around logo */}
        <div className="relative w-28 h-28">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#338a43"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="70 220"
              className="animate-spin"
              style={{ transformOrigin: "center" }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-md p-2">
              <Image
                src="/logo-icon.svg"
                alt={common.brandShort}
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-dark mb-1">
            {common.thanksWaiting}
          </p>
          <p className="text-[11px] text-neutral-400">
            {common.loadingProducts}
          </p>
        </div>
      </div>
    </div>
  );
}
