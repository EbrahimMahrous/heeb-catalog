import { cookies } from "next/headers";
import { Locale } from "@/types";
import { getDict as getDictFromI18n } from "@/lib/i18n";

/**
 * Read the current locale from cookies (server-side).
 */
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return c.get("locale")?.value === "en" ? "en" : "ar";
}

/**
 * Get the "common" dictionary for a locale (server-side helper).
 */
export function getDict(locale: Locale) {
  return getDictFromI18n(locale, "common");
}
