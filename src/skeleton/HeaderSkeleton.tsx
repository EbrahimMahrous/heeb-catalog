import SkeletonBase from "./SkeletonBase";

/**
 * HeaderSkeleton — matches the real Header height to prevent layout shift.
 */
export default function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 h-15">
        {/* Logo */}
        <SkeletonBase
          rounded="lg"
          className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0"
        />
        {/* Search — desktop */}
        <SkeletonBase
          rounded="full"
          className="hidden md:block flex-1 max-w-lg mx-auto h-10"
          delay={60}
        />
        {/* Spacer — mobile */}
        <div className="flex-1 md:hidden" />
        {/* Language button */}
        <SkeletonBase
          rounded="full"
          className="w-10 h-10 shrink-0"
          delay={120}
        />
        {/* Cart button */}
        <SkeletonBase
          rounded="full"
          className="w-10 h-10 shrink-0"
          delay={180}
        />
      </div>
    </header>
  );
}
