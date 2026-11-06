import { CartItem } from "@/types";

export function buildOrderMessage(
  items: CartItem[],
  total: number,
  locale: "ar" | "en" = "ar",
  shipping?: { cost: number; region: string },
) {
  const currency = "AED";
  const header =
    locale === "ar"
      ? "مرحباً، أريد الطلب عبر كتالوج حيب الفاخر:"
      : "Hello, I would like to order from Heeb Catalog:";

  const lines = items.map(
    (i) =>
      `${i.quantity} × ${i.name} — ${(i.price * i.quantity).toFixed(2)} ${currency}`,
  );

  const totalLabel = locale === "ar" ? "الإجمالي" : "Total";
  const shippingLabel = locale === "ar" ? "التوصيل" : "Shipping";
  const regionLabel = locale === "ar" ? "المنطقة" : "Region";

  const parts = [header, "", ...lines, ""];

  if (shipping) {
    parts.push(
      `${shippingLabel}: ${
        shipping.cost === 0
          ? locale === "ar"
            ? "مجاني"
            : "Free"
          : `${shipping.cost.toFixed(2)} ${currency}`
      }`,
      `${regionLabel}: ${shipping.region}`,
    );
  }

  parts.push(
    "",
    `${totalLabel}: ${total.toFixed(2)} ${currency}`,
    "",
    "+971 52 363 0501",
  );

  return parts.join("\n");
}

export function whatsappLink(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971523630501";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
