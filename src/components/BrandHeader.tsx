"use client";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Phone, Clock, MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export default function BrandHeader() {
  const { dict, isEn } = useLocale();
  const common = dict.common;

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col items-center text-center">
        {/* Logo */}
        <Link href="/" className="mb-3 block">
          <Image
            src="/logo-icon.webp"
            alt={common.brandShort}
            width={72}
            height={72}
            className="w-16 h-16 sm:w-18 sm:h-18 object-contain"
          />
        </Link>

        {/* Name + verified badge */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-xl sm:text-2xl font-black text-dark">
            {common.brandShort}
          </h1>
          <BadgeCheck
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#1DA1F2] shrink-0"
            fill="#1DA1F2"
            stroke="white"
            aria-label={common.verified}
          />
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-neutral-500 font-medium mb-2">
          {common.tagline}
        </p>

        {/* Phone */}
        <a
          href="https://wa.me/971523630501"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full transition mb-3"
        >
          <Phone className="w-3.5 h-3.5" />
          <span dir="ltr">+971 52 363 0501</span>
        </a>

        {/* Categories strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-neutral-500 mb-2">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange" />
            {common.restaurant}
          </span>
          <span className="text-neutral-400">·</span>
          <span>{common.grocery}</span>
          <span className="text-neutral-400">·</span>
          <span>{common.shoppingRetail}</span>
        </div>

        {/* Open 24h */}
        <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          {/* <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> */}
          <Clock className="w-3 h-3" />
          {common.open24}
        </div>
      </div>
    </div>
  );
}
