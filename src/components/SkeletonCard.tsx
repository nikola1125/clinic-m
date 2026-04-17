/**
 * Reusable skeleton loader — use while async data is fetching.
 * Respects prefers-reduced-motion (animation pauses via CSS).
 *
 * Usage:
 *   <SkeletonCard lines={3} showAvatar />
 *   <SkeletonCard variant="article" />
 */
interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  variant?: "default" | "article" | "stat";
  className?: string;
}

export function SkeletonCard({
  lines = 2,
  showAvatar = false,
  variant = "default",
  className = "",
}: SkeletonCardProps) {
  if (variant === "article") {
    return (
      <div
        className={`rounded-2xl overflow-hidden ${className}`}
        aria-busy="true"
        aria-label="Loading article"
        role="status"
      >
        {/* Image placeholder */}
        <div className="skeleton h-48 w-full rounded-none" />
        <div className="p-4 flex flex-col gap-3">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-4 w-4/5" />
          <div className="skeleton h-3 w-24 mt-2 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div
        className={`rounded-2xl p-5 ${className}`}
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        aria-busy="true"
        role="status"
        aria-label="Loading"
      >
        <div className="skeleton h-8 w-20 mb-2" />
        <div className="skeleton h-4 w-28" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-5 flex gap-3 ${className}`}
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      aria-busy="true"
      role="status"
      aria-label="Loading"
    >
      {showAvatar && <div className="skeleton shrink-0 h-10 w-10 rounded-full" />}
      <div className="flex flex-col gap-2 flex-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-4"
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

/** Inline skeleton text replacement — drop-in for text nodes */
export function SkeletonText({ className = "h-4 w-32" }: { className?: string }) {
  return (
    <span
      className={`skeleton inline-block ${className}`}
      aria-hidden="true"
    />
  );
}
