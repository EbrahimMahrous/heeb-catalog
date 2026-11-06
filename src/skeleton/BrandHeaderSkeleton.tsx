import SkeletonBase from "./SkeletonBase";

/**
 * BrandHeaderSkeleton — pixel-perfect match for <BrandHeader />
 *
 * Matches every dimension, spacing, and layout of the real component
 * to eliminate layout shift when the real content loads.
 */
export default function BrandHeaderSkeleton() {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col items-center text-center">
        {/* Logo — w-16 h-16 sm:w-18 sm:h-18 + mb-3 + block */}
        <div className="mb-3 block">
          <SkeletonBase rounded="full" className="w-16 h-16 sm:w-18 sm:h-18" />
        </div>

        {/* Name + verified badge — gap-1.5 + mb-1 */}
        {/* Name: text-xl sm:text-2xl → h-7 sm:h-8 */}
        {/* Badge: w-5 h-5 sm:w-6 sm:h-6 */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <SkeletonBase className="h-7 sm:h-8 w-32 sm:w-40" delay={60} />
          <SkeletonBase
            rounded="full"
            className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
            delay={60}
          />
        </div>

        {/* Tagline — text-xs sm:text-sm + mb-2 → h-4 */}
        <div className="mb-2">
          <SkeletonBase className="h-4 w-48 sm:w-64" delay={120} />
        </div>

        {/* Phone pill — px-3 py-1.5 rounded-full + text-xs sm:text-sm + mb-3 */}
        {/* Height ≈ 1.5rem (24px) on mobile, 1.75rem (28px) on sm */}
        <div className="mb-3">
          <SkeletonBase
            rounded="full"
            className="h-6 sm:h-7 w-36 sm:w-40"
            delay={240}
          />
        </div>

        {/* Categories strip — gap-x-2 + text-[11px] sm:text-xs + mb-2 */}
        {/* Contains: MapPin + Restaurant · Grocery · Shopping */}
        <div className="flex items-center justify-center gap-x-2 mb-2">
          <SkeletonBase className="h-3 w-16" delay={300} />
          <SkeletonBase className="h-3 w-1" delay={300} />
          <SkeletonBase className="h-3 w-20" delay={300} />
          <SkeletonBase className="h-3 w-1" delay={300} />
          <SkeletonBase className="h-3 w-24" delay={300} />
        </div>

        {/* Open 24h pill — px-2.5 py-1 rounded-full + text-[11px] sm:text-xs */}
        {/* Height ≈ 1.25rem (20px) on mobile, 1.5rem (24px) on sm */}
        <SkeletonBase
          rounded="full"
          className="h-5 sm:h-6 w-28 sm:w-32"
          delay={360}
        />
      </div>
    </div>
  );
}
