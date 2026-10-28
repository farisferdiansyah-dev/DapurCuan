import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeDetailLoading() {
  return (
    <div className="container mx-auto py-8 md:py-12 px-4 space-y-12 max-w-5xl animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      {/* Hero Skeleton */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Skeleton className="aspect-video md:aspect-square w-full rounded-2xl" />

        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>

          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
