import { Locale } from "@/types";

import arCommon from "@/locales/ar/common.json";
import enCommon from "@/locales/en/common.json";
import arCart from "@/locales/ar/cart.json";
import enCart from "@/locales/en/cart.json";
import arProduct from "@/locales/ar/product.json";
import enProduct from "@/locales/en/product.json";

const DICTS = {
  ar: { common: arCommon, cart: arCart, product: arProduct },
  en: { common: enCommon, cart: enCart, product: enProduct },
};

export type DictNamespace = "common" | "cart" | "product";

export function getDict<N extends DictNamespace>(locale: Locale, ns: N) {
  return DICTS[locale][ns];
}

export function getAllDicts(locale: Locale) {
  return DICTS[locale];
}
