// components/skeletons/Skeleton.tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
      {/* base layer */}
      <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}
