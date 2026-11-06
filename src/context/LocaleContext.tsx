"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { Locale } from "@/types";
import { getAllDicts } from "@/lib/i18n";
import { useRouter } from "next/navigation";

interface LocaleCtx {
  locale: Locale;
  isEn: boolean;
  dict: {
    common: any;
    cart: any;
    product: any;
  };
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  isPending: boolean; // ✅ shows if a transition is in flight
}

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [isPending, startTransition] = useTransition();

  // Read the initial locale from cookies on mount.
  useEffect(() => {
    const isEn = document.cookie.split("; ").some((c) => c === "locale=en");
    setLocaleState(isEn ? "en" : "ar");
  }, []);

  // Sync <html> lang/dir when the locale changes.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  // Update locale instantly and refresh server components in the background.
  const setLocale = useCallback(
    (l: Locale) => {
      // 1. Update state immediately (Client Components re-render now).
      setLocaleState(l);

      // 2. Persist to cookie for the server.
      document.cookie = `locale=${l}; path=/; max-age=31536000; SameSite=Lax`;

      // 3. Refresh server components inside a transition (so `isPending` becomes true).
      startTransition(() => {
        router.refresh();
      });
    },
    [router],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  return (
    <Ctx.Provider
      value={{
        locale,
        isEn: locale === "en",
        dict: getAllDicts(locale),
        setLocale,
        toggleLocale,
        isPending,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
