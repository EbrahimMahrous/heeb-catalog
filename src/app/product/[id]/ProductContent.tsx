import { getProductDetails } from "@/lib/api";
import { getDict, getLocale } from "@/lib/locale";
import { mapProduct } from "@/lib/product-mapper";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductContent({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const common = getDict(locale);

  const raw = await getProductDetails(id);
  if (!raw || raw.status !== 1) notFound();

  const product = mapProduct(raw, locale);
  const images = raw.images ?? (raw.cover_image ? [raw.cover_image] : []);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-primary text-sm hover:underline mb-4"
        >
          <ArrowRight
            className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`}
          />
          {common.backToCatalog}
        </Link>

        <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="space-y-2">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
              {images[0] ? (
                <Image
                  src={`${images[0].image_path}${images[0].image}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-6xl text-gray-300">
                  🛍️
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0"
                  >
                    <Image
                      src={`${img.image_path}${img.image}`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
            {product.badge && (
              <span className="inline-block mt-2 self-start bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                {product.badge}
              </span>
            )}

            <div className="mt-4">
              <span className="font-black text-primary text-2xl">
                {product.price.toFixed(2)}{" "}
                <span className="text-sm font-medium">{common.currency}</span>
              </span>
            </div>

            {product.description && (
              <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            <div className="mt-auto pt-6">
              {product.isAvailable ? (
                <AddToCartButton product={product} />
              ) : (
                <div className="w-full text-center bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">
                  {common.outOfStock}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
