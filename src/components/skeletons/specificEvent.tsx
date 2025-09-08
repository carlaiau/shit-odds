import { Skeleton } from "@/components/skeletons/skeleton"; // from earlier shimmer util

export function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-md shadow-sm flex flex-col gap-3">
      {/* Heading line */}
      <Skeleton className="h-5 w-3/4 rounded" />

      {/* Date/time */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>

      {/* Market label */}
      <Skeleton className="h-4 w-10 rounded" />

      {/* Team rows */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </div>

      {/* CTA button */}
      <Skeleton className="h-8 w-32 rounded-md mt-2" />
    </div>
  );
}
