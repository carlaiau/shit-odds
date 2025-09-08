import { Subheading } from "@/catalyst/heading";

const LoadingCard = () => {
  return (
    <div className="h-40 p-5 border border-punt-300 rounded-md bg-white dark:bg-punt-900 dark:border-punt-700 my-2 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full"></div>
    </div>
  );
};

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <Subheading>Loading Sport</Subheading>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </>
  );
}
