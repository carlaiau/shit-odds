import { Skeleton } from "./skeleton";
import { EventCardSkeleton } from "./specificEvent";
import { TagRowSkeleton } from "./tag";

export default function LeagueLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <Skeleton className="h-8 w-32 rounded-md" />

      {/* Tags */}
      <TagRowSkeleton />

      {/* Card grid (responsive like your real app) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
