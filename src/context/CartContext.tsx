"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { Check, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { CartItem, Product, Locale } from "@/types";
import { getDict } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { calculateShipping, Region } from "@/lib/shipping";

interface CartCtx {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  total: number;
  count: number;
  clear: () => void;
  hydrated: boolean;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "heeb_cart_v1";
const REGION_KEY = "heeb_region";

/** Read locale from cookies (client-side). */
function readLocale(): Locale {
  if (typeof document === "undefined") return "ar";
  const isEn = document.cookie.split("; ").some((c) => c === "locale=en");
  return isEn ? "en" : "ar";
}

/** Read the saved delivery region from localStorage. */
function readRegion(): Region {
  if (typeof window === "undefined") return "standard";
  const saved = localStorage.getItem(REGION_KEY);
  return saved === "western" ? "western" : "standard";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist cart to localStorage after hydration
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((p: Product) => {
    // Compute the updated cart inside the setter, then trigger the toast
    // with the new totals (toast is a side-effect but needs the latest cart).
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      const next = found
        ? prev.map((i) =>
            i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...prev,
            {
              id: p.id,
              name: p.name,
              price: p.price,
              imageUrl: p.imageUrl,
              quantity: 1,
            },
          ];

      // Show the toast on the next tick so React can re-render first.
      setTimeout(() => showAddToast(p, next), 0);

      return next;
    });
  }, []);

  /** Show the "added to cart" toast with a full order summary. */
  const showAddToast = (p: Product, nextItems: CartItem[]) => {
    const locale = readLocale();
    const dict = getDict(locale, "common");
    const cartDict = getDict(locale, "cart");
    const isEn = locale === "en";
    const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

    // Compute totals from the updated cart
    const subtotal = nextItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const region = readRegion();
    const shipping = calculateShipping(subtotal, region);
    const total = subtotal + shipping.cost;

    // Labels
    const subtotalLabel = cartDict.subtotal;
    const shippingLabel = cartDict.shipping;
    const totalLabel = cartDict.total;
    const freeLabel = cartDict.free;

    toast.custom(
      (toastId) => (
        <div
          dir={isEn ? "ltr" : "rtl"}
          className="w-[calc(100vw-24px)] max-w-105 bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-neutral-100 overflow-hidden"
        >
          {/* ===== Header ===== */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
            {/* Right: check icon + product info */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-primary to-primary/80 grid place-items-center shadow-lg shadow-primary/30">
                  <Check
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    strokeWidth={3.5}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] sm:text-[13px] font-black text-dark leading-tight">
                  {dict.addedToCart}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1 flex-1">
                    {p.name}
                  </p>
                  <span className="text-[10px] sm:text-[11px] font-bold text-primary whitespace-nowrap">
                    {formatPrice(p.price)} {dict.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Left: view cart button */}
            <button
              onClick={() => {
                toast.dismiss(toastId);
                window.location.href = "/cart";
              }}
              className="group flex items-center gap-1 sm:gap-1.5 bg-dark hover:bg-primary text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 shrink-0 shadow-sm hover:shadow-md active:scale-95"
              aria-label={dict.viewCart}
            >
              <div className="relative">
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="absolute -top-1 -inset-e-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange rounded-full animate-pulse" />
              </div>
              <span>{dict.viewCart}</span>
              <ArrowIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* ===== Order summary ===== */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-neutral-100">
            <div className="space-y-1 pt-2">
              {/* Subtotal */}
              <div className="flex justify-between text-[11px] sm:text-xs text-neutral-600">
                <span>{subtotalLabel}</span>
                <span className="font-semibold text-dark">
                  {formatPrice(subtotal)} {dict.currency}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-[11px] sm:text-xs text-neutral-600">
                <span>{shippingLabel}</span>
                <span
                  className={
                    shipping.isFree
                      ? "font-bold text-green-600"
                      : "font-semibold text-dark"
                  }
                >
                  {shipping.isFree
                    ? freeLabel
                    : `${formatPrice(shipping.cost)} ${dict.currency}`}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-dashed border-neutral-200">
                <span className="font-bold text-dark text-[12px] sm:text-[13px]">
                  {totalLabel}
                </span>
                <span className="font-black text-primary text-sm sm:text-base">
                  {formatPrice(total)} {dict.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-neutral-100">
            <div className="h-full bg-primary animate-toast-progress" />
          </div>
        </div>
      ),
      { duration: 3500 },
    );
  };

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider
      value={{ items, add, remove, setQty, total, count, clear, hydrated }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
