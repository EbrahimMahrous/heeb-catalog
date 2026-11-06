import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// تحميل .env قبل قراءة process.env
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

// استخراج hostname من API_BASE_URL — يدعم dev و prod
const apiImageHost = (() => {
  try {
    return new URL(process.env.API_BASE_URL ?? "").hostname || null;
  } catch {
    return null;
  }
})();

const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "app.heebshop.ae", pathname: "/uploads/**" },
];

// إضافة host الـ API لو مختلف (مثلاً في dev: heeb-pos.test)
if (apiImageHost && !remotePatterns.some((p) => p.hostname === apiImageHost)) {
  remotePatterns.push(
    { protocol: "http", hostname: apiImageHost },
    { protocol: "https", hostname: apiImageHost },
  );
}

// السماح بـ localhost/.test فقط في التطوير
const isLocalApiHost =
  !!apiImageHost &&
  (apiImageHost === "localhost" ||
    apiImageHost.endsWith(".test") ||
    apiImageHost.endsWith(".local") ||
    apiImageHost.endsWith(".localhost") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(apiImageHost));

const nextConfig: NextConfig = {
  // ===== الميزات الحالية =====
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // ===== الصور (محسّنة) =====
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: isLocalApiHost,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // ✅ 30 يوم بدل 7
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256],
    // ✅ تحسينات إضافية
    dangerouslyAllowSVG: false,
    contentDispositionType: "inline",
  },

  // ===== الأداء =====
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // ===== تحسين الاستيرادات =====
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // ===== إزالة console.log في الإنتاج =====
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ===== Cache Headers =====
  async headers() {
    return [
      // الملفات الثابتة — cache طويل
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // الصور والأيقونات — cache يوم
      {
        source: "/:file.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },

      // ✅ صور Next.js المحسّنة — cache أطول + stale-while-revalidate
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400", // 30 يوم + 1 يوم SWR
          },
        ],
      },

      // ✅ السلة — بدون cache
      {
        source: "/cart",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },

      // ✅ باقي الصفحات — cache قصير
      {
        source: "/:path((?!api|_next|cart).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
        missing: [{ type: "header", key: "x-nextjs-data" }],
      },

      // ===== Security Headers =====
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
