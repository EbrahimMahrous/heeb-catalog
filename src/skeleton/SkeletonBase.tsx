// =========================================
// SkeletonBase — the foundation of every skeleton.
// Uses a smooth shimmer effect (YouTube-style) instead of a plain pulse.
// =========================================

interface SkeletonBaseProps {
  className?: string;
  /** Adds rounded corners if not provided via className. */
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Applies a subtle animation delay for staggered sections. */
  delay?: number;
}

export default function SkeletonBase({
  className = "",
  rounded,
  delay = 0,
}: SkeletonBaseProps) {
  const roundedClass = rounded ? `rounded-${rounded}` : "";

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 ${roundedClass} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {/* Shimmer wave that sweeps across the block */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
