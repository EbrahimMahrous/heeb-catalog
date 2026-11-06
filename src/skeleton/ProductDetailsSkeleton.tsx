import SkeletonBase from "./SkeletonBase";

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6">
      {/* Back link */}
      <SkeletonBase className="h-4 w-32 mb-4" />

      <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        {/* Image column */}
        <div className="space-y-2">
          <SkeletonBase
            rounded="xl"
            className="aspect-square w-full"
            delay={60}
          />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <SkeletonBase
                key={i}
                rounded="lg"
                className="w-16 h-16 shrink-0"
                delay={120 + i * 40}
              />
            ))}
          </div>
        </div>

        {/* Info column */}
        <div className="flex flex-col">
          <SkeletonBase className="h-7 w-3/4 mb-3" delay={80} />
          <SkeletonBase rounded="md" className="h-6 w-20 mb-4" delay={140} />
          <SkeletonBase className="h-8 w-28 mb-4" delay={200} />
          <div className="space-y-2 mb-4">
            <SkeletonBase className="h-3 w-full" delay={260} />
            <SkeletonBase className="h-3 w-full" delay={280} />
            <SkeletonBase className="h-3 w-2/3" delay={300} />
          </div>
          <div className="mt-auto pt-6">
            <SkeletonBase rounded="xl" className="h-12 w-full" delay={360} />
          </div>
        </div>
      </div>
    </div>
  );
}
