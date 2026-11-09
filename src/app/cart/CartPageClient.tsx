"use client";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import {
  Trash2,
  Minus,
  Plus,
  MessageCircle,
  ArrowRight,
  Truck,
  MapPin,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FREE_SHIPPING_THRESHOLD,
  Region,
  calculateShipping,
} from "@/lib/shipping";

export default function CartPageClient() {
  const { items, remove, setQty } = useCart();
  const { locale, dict, isEn } = useLocale();
  const common = dict.common;
  const cart = dict.cart;

  const [region, setRegion] = useState<Region>("standard");

  // Restore the selected region on mount
  useEffect(() => {
    const saved = localStorage.getItem("heeb_region");
    if (saved === "western" || saved === "standard") setRegion(saved);
  }, []);

  // Persist the selected region
  useEffect(() => {
    localStorage.setItem("heeb_region", region);
  }, [region]);

  // Totals
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = calculateShipping(subtotal, region);
  const total = subtotal + shipping.cost;

  // Free shipping progress
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // ✅ Confirm order — pass full shipping info to WhatsApp message
  const onConfirm = () => {
    if (items.length === 0) return;

    const msg = buildOrderMessage(items, total, locale, {
      cost: shipping.cost,
      isFree: shipping.isFree,
      region: region === "western" ? cart.regionWestern : cart.regionStandard,
    });

    window.open(whatsappLink(msg), "_blank");
  };

  const isEmpty = items.length === 0;

  return (
    <div dir={isEn ? "ltr" : "rtl"} className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
        >
          <ArrowRight className={`w-4 h-4 ${isEn ? "" : "rotate-180"}`} />
          {cart.back}
        </Link>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-dark mt-3 mb-6">
          {cart.title}
          {!isEmpty && (
            <span className="text-base font-medium text-neutral-400 ms-2">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          )}
        </h1>

        {isEmpty ? (
          /* ========== EMPTY CART ========== */
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 grid place-items-center">
              <ShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <p className="text-lg font-bold text-dark mb-1">{cart.empty}</p>
            <p className="text-sm text-neutral-500 mb-6">{cart.emptyDesc}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition"
            >
              {cart.shopNow}
            </Link>
          </div>
        ) : (
          <>
            {/* ========== FREE COLD DELIVERY BANNER ========== */}
            <div
              className={`rounded-2xl p-4 mb-4 transition-all ${
                shipping.isFree
                  ? "bg-green-50 border border-green-200"
                  : "bg-primary/5 border border-primary/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {shipping.isFree ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-700 text-sm">
                      {cart.freeUnlocked}
                    </span>
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary text-sm">
                      {cart.freeProgress.replace(
                        "{amount}",
                        remaining.toFixed(0),
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className="relative w-full bg-white/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                    shipping.isFree ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>
                  {subtotal.toFixed(0)} {common.currency}
                </span>
                <span>
                  {progressPercent.toFixed(0)}% — {FREE_SHIPPING_THRESHOLD}{" "}
                  {common.currency}
                </span>
              </div>
            </div>

            {/* ========== REGION PICKER ========== */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-bold text-dark text-sm">
                  {cart.regionLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRegion("standard")}
                  className={`p-3 rounded-xl border-2 text-start transition ${
                    region === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-semibold text-sm text-dark">
                      {cart.regionStandard}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${
                        region === "standard"
                          ? "border-primary"
                          : "border-neutral-300"
                      }`}
                    >
                      {region === "standard" && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {cart.regionStandardDesc}
                  </span>
                </button>
                <button
                  onClick={() => setRegion("western")}
                  className={`p-3 rounded-xl border-2 text-start transition ${
                    region === "western"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-semibold text-sm text-dark">
                      {cart.regionWestern}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${
                        region === "western"
                          ? "border-primary"
                          : "border-neutral-300"
                      }`}
                    >
                      {region === "western" && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {cart.regionWesternDesc}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2 text-center">
                {cart.shippingNote}
              </p>
            </div>

            {/* ========== CART ITEMS ========== */}
            <div className="space-y-3">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-3 flex items-center gap-3"
                >
                  {/* Product image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    {i.imageUrl ? (
                      <Image
                        src={i.imageUrl}
                        alt={i.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-2xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  {/* Product info — unit price + quantity + line total */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark truncate">{i.name}</p>

                    {/* Unit price */}
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {i.price.toFixed(2)} {common.currency}
                    </p>

                    {/* Line total: × quantity = total */}
                    <p className="text-primary font-bold text-sm mt-1">
                      {i.quantity > 1 && (
                        <span className="text-neutral-400 font-normal me-1">
                          × {i.quantity} =
                        </span>
                      )}
                      {(i.price * i.quantity).toFixed(2)} {common.currency}
                    </p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-1 border border-neutral-200 rounded-xl">
                    <button
                      onClick={() => setQty(i.id, i.quantity - 1)}
                      disabled={i.quantity <= 1}
                      className="p-2 hover:bg-neutral-100 disabled:opacity-40 rounded-s-xl"
                      aria-label={cart.decrease}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">
                      {i.quantity}
                    </span>
                    <button
                      onClick={() => setQty(i.id, i.quantity + 1)}
                      className="p-2 hover:bg-neutral-100 rounded-e-xl"
                      aria-label={cart.increase}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => remove(i.id)}
                    className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl"
                    aria-label={cart.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ========== SUMMARY ========== */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 mt-4">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>{cart.subtotal}</span>
                  <span className="font-semibold text-dark">
                    {subtotal.toFixed(2)} {common.currency}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    {cart.shipping}
                  </span>
                  <span
                    className={
                      shipping.isFree
                        ? "font-bold text-green-600"
                        : "font-semibold text-dark"
                    }
                  >
                    {shipping.isFree
                      ? cart.free
                      : `${shipping.cost.toFixed(2)} ${common.currency}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-neutral-200 pt-3 mt-1 flex justify-between items-center">
                  <span className="font-bold text-dark text-base">
                    {cart.total}
                  </span>
                  <span className="font-black text-primary text-xl">
                    {total.toFixed(2)} {common.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* ========== WHATSAPP CONFIRM ========== */}
            <button
              onClick={onConfirm}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              {cart.confirm}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
