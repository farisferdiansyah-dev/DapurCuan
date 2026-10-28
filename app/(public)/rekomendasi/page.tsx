"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition, Suspense } from "react";
import { mockRecipeService } from "@/lib/services/mock";
import type { RecipeWithCost, SearchFilters, RecipeCategory, RecipeDifficulty } from "@/types/recipe";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { EmptyState } from "@/components/recipe/empty-state";
import { SearchForm } from "@/components/form/search-form";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowUpDown, X, Home } from "lucide-react";
import Link from "next/link";

function RecommendationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Membaca kategori, budget, dan porsi dari URL
  const validCategories: RecipeCategory[] = ["makanan", "minuman", "camilan"];
  const rawCategory = searchParams.get("category") as RecipeCategory;
  const category: RecipeCategory = validCategories.includes(rawCategory) ? rawCategory : "makanan";

  const rawBudget = Number(searchParams.get("budget"));
  const budget = !isNaN(rawBudget) && rawBudget > 0 ? rawBudget : 50000;

  const rawServings = Number(searchParams.get("servings"));
  const servings = !isNaN(rawServings) && rawServings > 0 ? rawServings : 2;

  const query = searchParams.get("query")?.trim() || undefined;
  const rawDifficulty = searchParams.get("difficulty") as RecipeDifficulty;
  const validDifficulties: RecipeDifficulty[] = ["mudah", "sedang", "sulit"];
  const difficulty: RecipeDifficulty | undefined = validDifficulties.includes(rawDifficulty) ? rawDifficulty : undefined;

  const rawMaxMinutes = searchParams.get("max_cooking_minutes") ? Number(searchParams.get("max_cooking_minutes")) : undefined;
  const maxCookingMinutes = rawMaxMinutes && !isNaN(rawMaxMinutes) && rawMaxMinutes > 0 ? rawMaxMinutes : undefined;

  const [recipes, setRecipes] = useState<RecipeWithCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showFilterForm, setShowFilterForm] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchRecipes() {
      setIsLoading(true);
      setError(null);
      try {
        const filters: SearchFilters = {
          category,
          budget,
          servings,
          query,
          difficulty,
          max_cooking_minutes: maxCookingMinutes,
        };
        const res = await mockRecipeService.searchRecipes(filters, 1, 12);

        if (isCancelled) return;

        const sortedData = [...res.data];
        if (sortBy === "cost-asc") {
          sortedData.sort((a, b) => a.total_shopping_cost - b.total_shopping_cost);
        } else if (sortBy === "cost-desc") {
          sortedData.sort((a, b) => b.total_shopping_cost - a.total_shopping_cost);
        } else if (sortBy === "time") {
          sortedData.sort((a, b) => (a.prep_minutes + a.cook_minutes) - (b.prep_minutes + b.cook_minutes));
        }

        setRecipes(sortedData);
      } catch (err: unknown) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Gagal memuat rekomendasi resep");
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchRecipes();

    return () => {
      isCancelled = true;
    };
  }, [category, budget, servings, query, difficulty, maxCookingMinutes, sortBy]);

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setSortBy(newSort);
    });
  };

  const handleToggleFilter = () => {
    setShowFilterForm((prev) => !prev);
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      {/* Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Home className="size-3" /> Beranda
            </Link>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-medium text-foreground">Rekomendasi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hasil Rekomendasi Resep</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kategori: <span className="font-semibold text-foreground capitalize">{category}</span> | Budget Max: <span className="font-semibold text-foreground">Rp {budget.toLocaleString("id-ID")}</span> | Porsi: <span className="font-semibold text-foreground">{servings} orang</span>
            {query && (
              <> | Kata Kunci: <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showFilterForm ? "secondary" : "outline"}
            onClick={handleToggleFilter}
            className="self-start md:self-auto"
          >
            {showFilterForm ? (
              <>
                <X className="mr-2 size-4" />
                Tutup Filter
              </>
            ) : (
              <>
                <SlidersHorizontal className="mr-2 size-4" />
                Ubah Filter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {showFilterForm && (
        <div className="rounded-2xl border bg-card p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-4 mb-4 border-b">
            <div>
              <h2 className="text-lg font-bold">Ubah Parameter Pencarian</h2>
              <p className="text-xs text-muted-foreground">
                Sesuaikan kategori, budget, atau jumlah porsi untuk mendapatkan rekomendasi baru.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowFilterForm(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <SearchForm
            defaultValues={{
              category,
              budget,
              servings,
              query: query ?? "",
              difficulty,
              max_cooking_minutes: maxCookingMinutes,
            }}
            onSubmit={(data) => {
              const params = new URLSearchParams();
              params.set("category", data.category);
              params.set("budget", data.budget.toString());
              params.set("servings", data.servings.toString());
              if (data.query?.trim()) params.set("query", data.query.trim());
              if (data.difficulty) params.set("difficulty", data.difficulty);
              if (data.max_cooking_minutes) params.set("max_cooking_minutes", data.max_cooking_minutes.toString());
              if (data.include_ingredients?.trim()) params.set("include_ingredients", data.include_ingredients.trim());
              if (data.exclude_ingredients?.trim()) params.set("exclude_ingredients", data.exclude_ingredients.trim());

              setShowFilterForm(false);
              router.push(`/rekomendasi?${params.toString()}`);
            }}
          />
        </div>
      )}

      {/* Controls & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{recipes.length}</span> resep yang sesuai
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="relevance">Paling Sesuai</option>
            <option value="cost-asc">Biaya Belanja Terendah</option>
            <option value="cost-desc">Biaya Belanja Tertinggi</option>
            <option value="time">Waktu Tercepat</option>
          </select>
        </div>
      </div>

      {/* Content Grid / Empty State / Loading */}
      {isEmptyState(recipes, isLoading, isPending) ? (
        <EmptyState
          message="Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu."
          actionLabel="Ubah budget atau filter"
          onAction={() => setShowFilterForm(true)}
        />
      ) : (
        <RecipeGrid recipes={recipes} isLoading={isLoading || isPending} error={error} />
      )}
    </div>
  );
}

function isEmptyState(recipes: RecipeWithCost[], isLoading: boolean, isPending: boolean) {
  return !isLoading && !isPending && recipes.length === 0;
}

export default function RecommendationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-12 px-4 space-y-8">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">Memuat Rekomendasi Resep...</h1>
          </div>
          <RecipeGrid recipes={[]} isLoading={true} />
        </div>
      }
    >
      <RecommendationContent />
    </Suspense>
  );
}
