import SkeletonBase from "./SkeletonBase";

export default function CategoryNavSkeleton() {
  // Fixed widths to avoid layout jump when real data loads
  const widths = ["w-16", "w-24", "w-20", "w-28", "w-24", "w-20"];

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-hide">
          {widths.map((w, i) => (
            <SkeletonBase
              key={i}
              rounded="full"
              className={`h-7 ${w} shrink-0`}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
