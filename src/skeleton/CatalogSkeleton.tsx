import SkeletonBase from "./SkeletonBase";
import SectionSkeleton from "./SectionSkeleton";
import CategoryNavSkeleton from "./CategoryNavSkeleton";
import BrandHeaderSkeleton from "./BrandHeaderSkeleton";

/**
 * Full-page catalog skeleton.
 * Used as the Suspense fallback for the entire Home page.
 * Includes Header/Footer placeholders — but the actual layout.tsx
 * already renders HeaderWrapper + Footer, so we only render
 * the middle section (BrandHeader → CategoryNav → Product grid).
 */
export default function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* BrandHeader skeleton (in case BrandHeader is still loading) */}
      <BrandHeaderSkeleton />

      {/* CategoryNav skeleton */}
      <CategoryNavSkeleton />

      {/* Product grid skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4">
        {/* Total count bar */}
        <div className="py-2.5 border-b border-neutral-100">
          <SkeletonBase className="h-3 w-32" />
        </div>

        {/* Two sections with divider */}
        <div className="divide-y divide-neutral-200">
          <SectionSkeleton cards={8} showHeader baseDelay={100} />
          <SectionSkeleton cards={4} showHeader baseDelay={600} />
        </div>
      </main>
    </div>
  );
}
