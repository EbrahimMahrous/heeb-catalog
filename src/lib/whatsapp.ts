import { CartItem } from "@/types";
import { formatPrice } from "./format";

interface ShippingInfo {
  cost: number;
  region: string;
  isFree: boolean;
}

/**
 * Build a simple, friendly WhatsApp order message.
 * - Shows the real shipping cost (or "Free" when the order qualifies).
 * - Includes required customer details for delivery.
 */
export function buildOrderMessage(
  items: CartItem[],
  total: number,
  locale: "ar" | "en" = "ar",
  shipping?: ShippingInfo,
): string {
  const isAr = locale === "ar";
  const currency = isAr ? "د.إ" : "AED";

  // ---------- Items ----------
  const lines = items.map(
    (i) =>
      `${i.quantity} × ${i.name} — ${formatPrice(i.price * i.quantity)} ${currency}`,
  );

  // ---------- Header ----------
  const header = isAr
    ? "هلا يالغالي،\nأرغب في تأكيد الطلب التالي:"
    : "Hello,\nI would like to confirm the following order:";

  // ---------- Shipping ----------
  const shippingLines: string[] = [];
  if (shipping) {
    const shippingLabel = isAr ? "التوصيل" : "Shipping";

    const shippingValue =
      shipping.isFree || shipping.cost === 0
        ? isAr
          ? "مجاني 🎉"
          : "Free 🎉"
        : `${formatPrice(shipping.cost)} ${currency}`;

    shippingLines.push(`${shippingLabel}: ${shippingValue}`);
  }

  // ---------- Total ----------
  const totalLine = `${isAr ? "الإجمالي" : "Total"}: ${formatPrice(total)} ${currency}`;

  // ---------- Customer info request ----------
  const customerInfo = isAr
    ? [
        "لكي نكمل طلبك ممكن تعبولي البيانات:",
        "الاسم:",
        "الإمارة:",
        "المنطقة:",
        "رقم التواصل:",
        "اللوكيشن (إجباري):",
        "رقم الفيلا (مهم جدا):",
      ].join("\n")
    : [
        "To complete your order, please provide the following:",
        "Name:",
        "Emirate:",
        "Area:",
        "Contact number:",
        "Location (required):",
        "Villa number (very important):",
      ].join("\n");

  // ---------- Compose ----------
  return [
    header,
    "",
    ...lines,
    ...shippingLines,
    totalLine,
    "",
    customerInfo,
  ].join("\n");
}

export function whatsappLink(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971523630501";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
