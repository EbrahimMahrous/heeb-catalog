import SkeletonBase from "./SkeletonBase";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface SectionSkeletonProps {
  cards?: number;
  showHeader?: boolean;
  baseDelay?: number;
}

export default function SectionSkeleton({
  cards = 4,
  showHeader = true,
  baseDelay = 0,
}: SectionSkeletonProps) {
  return (
    <section className="py-5">
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Orange accent bar */}
            <SkeletonBase
              rounded="full"
              className="w-1 h-5"
              delay={baseDelay}
            />
            {/* Section title */}
            <SkeletonBase className="h-5 w-32" delay={baseDelay + 30} />
          </div>
          {/* Product count */}
          <SkeletonBase className="h-3 w-6" delay={baseDelay + 60} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: cards }).map((_, i) => (
          <ProductCardSkeleton key={i} delay={baseDelay + i * 60} />
        ))}
      </div>
    </section>
  );
}
