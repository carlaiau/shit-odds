function TagSkeleton() {
  return (
    <div className="h-6 px-4 rounded-full bg-zinc-200 dark:bg-zinc-700 relative overflow-hidden animate-pulse" />
  );
}

export function TagRowSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <TagSkeleton key={i} />
      ))}
    </div>
  );
}
