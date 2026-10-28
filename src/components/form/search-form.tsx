"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Zod validation schema
export const searchSchema = z.object({
  category: z.enum(["makanan", "minuman", "camilan"], { message: "Pilih kategori hidangan" }),
  budget: z.coerce.number().min(1000, "Budget minimal Rp 1.000").max(10000000, "Budget maksimal Rp 10.000.000"),
  servings: z.coerce.number().int().min(1, "Minimal 1 porsi").max(50, "Maksimal 50 porsi"),
  query: z.string().max(100, "Nama masakan maksimal 100 karakter").optional(),
  taste_preferences: z.array(z.string()).optional(),
  include_ingredients: z.string().max(200, "Maksimal 200 karakter").optional(),
  exclude_ingredients: z.string().max(200, "Maksimal 200 karakter").optional(),
  max_cooking_minutes: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(5, "Minimal 5 menit").max(480, "Maksimal 480 menit").optional()
  ),
  difficulty: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.enum(["mudah", "sedang", "sulit"]).optional()
  ),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  defaultValues?: Partial<SearchFormData>;
  onSubmit?: (data: SearchFormData) => void;
}

export function SearchForm({ defaultValues, onSubmit }: SearchFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      category: "makanan",
      budget: 50000,
      servings: 2,
      query: "",
      include_ingredients: "",
      exclude_ingredients: "",
      ...defaultValues,
    },
  });

  // Sinkronkan form saat defaultValues berubah (misal dari URL query params)
  useEffect(() => {
    if (defaultValues) {
      reset({
        category: defaultValues.category ?? "makanan",
        budget: defaultValues.budget ?? 50000,
        servings: defaultValues.servings ?? 2,
        query: defaultValues.query ?? "",
        difficulty: defaultValues.difficulty ?? undefined,
        max_cooking_minutes: defaultValues.max_cooking_minutes ?? undefined,
        include_ingredients: defaultValues.include_ingredients ?? "",
        exclude_ingredients: defaultValues.exclude_ingredients ?? "",
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: SearchFormData) => {
    const params = new URLSearchParams();
    params.set("category", data.category);
    params.set("budget", data.budget.toString());
    params.set("servings", data.servings.toString());
    if (data.query?.trim()) params.set("query", data.query.trim());
    if (data.difficulty) params.set("difficulty", data.difficulty);
    if (data.max_cooking_minutes) params.set("max_cooking_minutes", data.max_cooking_minutes.toString());
    if (data.include_ingredients?.trim()) params.set("include_ingredients", data.include_ingredients.trim());
    if (data.exclude_ingredients?.trim()) params.set("exclude_ingredients", data.exclude_ingredients.trim());

    if (onSubmit) {
      onSubmit(data);
    } else {
      router.push(`/rekomendasi?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Required fields */}
      <fieldset className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <legend className="px-2 text-sm font-semibold text-card-foreground">Wajib diisi</legend>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Kategori <span className="text-destructive">*</span>
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-describedby={errors.category ? "category-error" : undefined}
            aria-invalid={!!errors.category}
          >
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="camilan">Camilan</option>
          </select>
          {errors.category && (
            <p id="category-error" className="text-sm text-destructive" role="alert">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-medium">
            Budget (Rp) <span className="text-destructive">*</span>
          </label>
          <input
            id="budget"
            type="number"
            step="1000"
            {...register("budget")}
            placeholder="50000"
            className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-describedby={errors.budget ? "budget-error" : "budget-hint"}
            aria-invalid={!!errors.budget}
          />
          <p id="budget-hint" className="text-xs text-muted-foreground">
            Masukkan budget dalam Rupiah (Rp)
          </p>
          {errors.budget && (
            <p id="budget-error" className="text-sm text-destructive" role="alert">
              {errors.budget.message}
            </p>
          )}
        </div>

        {/* Servings */}
        <div className="space-y-2">
          <label htmlFor="servings" className="block text-sm font-medium">
            Jumlah Porsi <span className="text-destructive">*</span>
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            {...register("servings")}
            className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-describedby={errors.servings ? "servings-error" : "servings-hint"}
            aria-invalid={!!errors.servings}
          />
          <p id="servings-hint" className="text-xs text-muted-foreground">
            Berapa porsi yang ingin kamu masak?
          </p>
          {errors.servings && (
            <p id="servings-error" className="text-sm text-destructive" role="alert">
              {errors.servings.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Optional fields */}
      <details className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-medium text-card-foreground hover:text-foreground">
          Filter tambahan (opsional)
        </summary>

        <div className="mt-4 space-y-4">
          {/* Query */}
          <div className="space-y-2">
            <label htmlFor="query" className="block text-sm font-medium">
              Nama masakan
            </label>
            <input
              id="query"
              type="text"
              {...register("query")}
              placeholder="Contoh: nasgor, ayam"
              className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.query && (
              <p className="text-sm text-destructive" role="alert">
                {errors.query.message}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label htmlFor="difficulty" className="block text-sm font-medium">
              Tingkat kesulitan
            </label>
            <select
              id="difficulty"
              {...register("difficulty")}
              className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Semua tingkat</option>
              <option value="mudah">Mudah</option>
              <option value="sedang">Sedang</option>
              <option value="sulit">Sulit</option>
            </select>
          </div>

          {/* Max cooking time */}
          <div className="space-y-2">
            <label htmlFor="max_cooking_minutes" className="block text-sm font-medium">
              Waktu memasak maksimal
            </label>
            <select
              id="max_cooking_minutes"
              {...register("max_cooking_minutes")}
              className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Tidak terbatas</option>
              <option value="15">15 menit</option>
              <option value="30">30 menit</option>
              <option value="60">1 jam</option>
              <option value="120">2 jam</option>
              <option value="240">4 jam</option>
            </select>
          </div>

          {/* Include ingredients */}
          <div className="space-y-2">
            <label htmlFor="include_ingredients" className="block text-sm font-medium">
              Bahan yang diinginkan
            </label>
            <input
              id="include_ingredients"
              type="text"
              {...register("include_ingredients")}
              placeholder="Contoh: ayam, telur (pisahkan dengan koma)"
              className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Exclude ingredients */}
          <div className="space-y-2">
            <label htmlFor="exclude_ingredients" className="block text-sm font-medium">
              Bahan yang dihindari
            </label>
            <input
              id="exclude_ingredients"
              type="text"
              {...register("exclude_ingredients")}
              placeholder="Contoh: cabe, santan (pisahkan dengan koma)"
              className="w-full min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </details>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full min-h-12 text-base">
        <Search className="mr-2 size-5" aria-hidden="true" />
        {isSubmitting ? "Mencari..." : "Cari Resep"}
      </Button>
    </form>
  );
}