"use client";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

/**
 * Safe truncation that respects emojis and surrogate pairs.
 */
function safeTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const chars = Array.from(text);
  if (chars.length <= maxLength) return text;
  return chars.slice(0, maxLength).join("").trimEnd() + "…";
}

export default function ReadMore({
  text,
  maxLength = 75,
  compact = false,
}: {
  text: string;
  maxLength?: number;
  compact?: boolean;
}) {
  const { dict } = useLocale();
  const common = dict.common;
  const [open, setOpen] = useState(false);

  // Normalize line endings.
  const cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const charCount = Array.from(cleanText).length;
  const isLong = charCount > maxLength;
  const shown =
    !isLong || open ? cleanText : safeTruncate(cleanText, maxLength);

  return (
    <div
      className={`text-neutral-500 leading-snug whitespace-pre-line ${
        compact ? "text-[11px] mt-0.5" : "text-sm leading-relaxed"
      }`}
    >
      <span suppressHydrationWarning>{shown}</span>
      {isLong && (
        <>
          {" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="text-primary font-semibold hover:underline whitespace-nowrap"
          >
            {open ? common.readLess : common.readMore}
          </button>
        </>
      )}
    </div>
  );
}
