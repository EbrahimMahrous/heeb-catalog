import SkeletonBase from "./SkeletonBase";

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Back link */}
        <SkeletonBase className="h-4 w-28 mb-4" />
        {/* Title */}
        <SkeletonBase className="h-8 w-44 mb-6" delay={60} />

        {/* Free shipping banner */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <SkeletonBase rounded="full" className="w-5 h-5" />
            <SkeletonBase className="h-4 w-48" delay={120} />
          </div>
          <SkeletonBase rounded="full" className="h-2.5 w-full" delay={180} />
          <div className="flex justify-between mt-2">
            <SkeletonBase className="h-2.5 w-12" delay={240} />
            <SkeletonBase className="h-2.5 w-20" delay={240} />
          </div>
        </div>

        {/* Region picker */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <SkeletonBase className="w-4 h-4" />
            <SkeletonBase className="h-4 w-32" delay={300} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="p-3 rounded-xl border-2 border-neutral-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <SkeletonBase className="h-4 w-20" delay={360 + i * 40} />
                  <SkeletonBase
                    rounded="full"
                    className="w-4 h-4"
                    delay={360 + i * 40}
                  />
                </div>
                <SkeletonBase className="h-3 w-12" delay={400 + i * 40} />
              </div>
            ))}
          </div>
        </div>

        {/* Cart items */}
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-neutral-200 p-3 flex items-center gap-3"
            >
              <SkeletonBase
                rounded="lg"
                className="w-20 h-20 shrink-0"
                delay={500 + i * 80}
              />
              <div className="flex-1 min-w-0 space-y-2">
                <SkeletonBase className="h-4 w-3/4" delay={520 + i * 80} />
                <SkeletonBase className="h-3 w-1/3" delay={540 + i * 80} />
              </div>
              <SkeletonBase
                rounded="lg"
                className="w-24 h-10"
                delay={560 + i * 80}
              />
              <SkeletonBase
                rounded="lg"
                className="w-10 h-10"
                delay={580 + i * 80}
              />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 mt-4 space-y-3">
          <div className="flex justify-between">
            <SkeletonBase className="h-4 w-24" delay={800} />
            <SkeletonBase className="h-4 w-16" delay={800} />
          </div>
          <div className="flex justify-between">
            <SkeletonBase className="h-4 w-20" delay={840} />
            <SkeletonBase className="h-4 w-14" delay={840} />
          </div>
          <div className="border-t border-dashed border-neutral-200 pt-3 flex justify-between items-center">
            <SkeletonBase className="h-5 w-16" delay={880} />
            <SkeletonBase className="h-6 w-24" delay={880} />
          </div>
        </div>

        {/* Confirm button */}
        <SkeletonBase rounded="2xl" className="h-14 w-full mt-4" delay={920} />
      </div>
    </div>
  );
}
