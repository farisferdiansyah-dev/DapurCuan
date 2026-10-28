import type { RecipeWithCost } from "@/types/recipe";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeGridProps {
  recipes: RecipeWithCost[];
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
}

export function RecipeGrid({ recipes, isLoading, isEmpty, error }: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
            <Skeleton className="aspect-video w-full rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-destructive">Terjadi kesalahan saat memuat data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <h3 className="text-xl font-semibold">Tidak ada resep ditemukan</h3>
        <p className="mt-2 text-muted-foreground">Coba ubah filter atau budget kamu.</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <p className="text-muted-foreground">Belum ada resep tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
