import SkeletonBase from "./SkeletonBase";

export default function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex items-start gap-3 bg-white border border-neutral-200 rounded-xl p-2.5">
      {/* Product image placeholder — matches ProductCard's w-16 sm:w-20 */}
      <SkeletonBase
        rounded="lg"
        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
        delay={delay}
      />

      {/* Content placeholders — matches real card layout */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 self-stretch">
        {/* Title */}
        <SkeletonBase className="h-3.5 w-3/4" delay={delay + 40} />
        {/* Description */}
        <SkeletonBase className="h-2.5 w-full" delay={delay + 80} />
        {/* Price + button row */}
        <div className="flex items-center justify-between mt-1">
          <SkeletonBase className="h-3.5 w-16" delay={delay + 120} />
          <SkeletonBase
            rounded="md"
            className="w-7 h-7 sm:w-8 sm:h-8"
            delay={delay + 160}
          />
        </div>
      </div>
    </div>
  );
}
