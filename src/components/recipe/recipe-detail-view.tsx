"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeWithCost } from "@/types/recipe";
import { calculateScaledCost } from "@/lib/services/mock";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ChefHat,
  Info,
  CheckCircle2,
  PlayCircle,
  VideoOff,
  Minus,
  Plus,
  RotateCcw,
  Utensils,
  ShoppingBag,
  Flame,
  Home,
  Check,
  ExternalLink,
} from "lucide-react";

interface RecipeDetailViewProps {
  recipe: RecipeWithCost;
  relatedRecipes: RecipeWithCost[];
}

export function RecipeDetailView({ recipe, relatedRecipes }: RecipeDetailViewProps) {
  // 1. Interactive portion scaling state
  const [servings, setServings] = useState<number>(recipe.base_servings);

  // 2. Interactive ingredients checklist state
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // 3. Interactive cooking steps checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Hitung ulang biaya shopping dan consumption secara dinamis sesuai porsi
  const scaledCost = useMemo(() => {
    return calculateScaledCost(recipe.id, recipe.base_servings, servings);
  }, [recipe.id, recipe.base_servings, servings]);

  // Skalakan takaran bahan secara proporsional sesuai porsi
  const scaledIngredients = useMemo(() => {
    const scaleRatio = servings / recipe.base_servings;
    const packageBatches = Math.ceil(servings / recipe.base_servings);

    return recipe.ingredients.map((ing) => {
      const rawQty = ing.quantity * scaleRatio;
      // Format angka: jika bulat tampilkan integer, jika desimal bulatkan maksimal 1 desimal
      const formattedQty = Number.isInteger(rawQty) ? rawQty : Number(rawQty.toFixed(1));

      return {
        ...ing,
        scaledQuantity: formattedQty,
        scaledPackagePrice: ing.package_price ? ing.package_price * packageBatches : undefined,
      };
    });
  }, [recipe.ingredients, recipe.base_servings, servings]);

  // Handler porsi
  const handleDecreaseServings = () => {
    if (servings > 1) {
      setServings((prev) => prev - 1);
    }
  };

  const handleIncreaseServings = () => {
    if (servings < 50) {
      setServings((prev) => prev + 1);
    }
  };

  const handleResetServings = () => {
    setServings(recipe.base_servings);
  };

  // Handler checklist bahan
  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkAllIngredients = () => {
    const allChecked: Record<string, boolean> = {};
    recipe.ingredients.forEach((ing) => {
      allChecked[ing.ingredient_id] = true;
    });
    setCheckedIngredients(allChecked);
  };

  const uncheckAllIngredients = () => {
    setCheckedIngredients({});
  };

  // Handler langkah memasak
  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx],
    }));
  };

  // Progress kalkulasi
  const totalIngredients = recipe.ingredients.length;
  const checkedIngredientsCount = Object.values(checkedIngredients).filter(Boolean).length;
  const ingredientProgress = totalIngredients > 0 ? Math.round((checkedIngredientsCount / totalIngredients) * 100) : 0;

  const totalSteps = recipe.steps?.length ?? 0;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const stepsProgress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  const totalMinutes = recipe.prep_minutes + recipe.cook_minutes;

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 space-y-12 max-w-5xl">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground inline-flex items-center gap-1">
          <Home className="size-3.5" aria-hidden="true" />
          <span>Beranda</span>
        </Link>
        <span>/</span>
        <Link href={`/rekomendasi?category=${recipe.category}`} className="hover:text-foreground capitalize">
          {recipe.category}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
          {recipe.name}
        </span>
      </nav>

      {/* 1. Hero Section */}
      <section aria-labelledby="recipe-title" className="grid md:grid-cols-2 gap-8 items-start">
        {/* Foto Masakan */}
        <div className="relative aspect-video md:aspect-square overflow-hidden rounded-2xl bg-muted shadow-md border">
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge
              variant={
                recipe.difficulty === "mudah"
                  ? "success"
                  : recipe.difficulty === "sedang"
                  ? "warning"
                  : "destructive"
              }
              className="capitalize shadow-sm px-3 py-1 font-semibold"
            >
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-black/60 text-white backdrop-blur-sm px-2.5 py-1 rounded-md">
              Data Simulasi
            </span>
          </div>
        </div>

        {/* Informasi Utama */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {recipe.category}
              </Badge>
              <span className="text-xs text-muted-foreground">• Resep Terkurasi</span>
            </div>
            <h1 id="recipe-title" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {recipe.name}
            </h1>
            <p className="text-muted-foreground mt-2 leading-relaxed text-sm md:text-base">
              {recipe.description}
            </p>
          </div>

          {/* Time & Base Servings Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-muted/50 border rounded-xl p-3">
              <Clock className="size-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] text-muted-foreground">Total Waktu</p>
                <p className="font-semibold text-foreground">{totalMinutes} menit</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 border rounded-xl p-3">
              <Flame className="size-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] text-muted-foreground">Prep / Masak</p>
                <p className="font-semibold text-foreground">{recipe.prep_minutes}m / {recipe.cook_minutes}m</p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 bg-muted/50 border rounded-xl p-3">
              <ChefHat className="size-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] text-muted-foreground">Porsi Acuan</p>
                <p className="font-semibold text-foreground">{recipe.base_servings} orang</p>
              </div>
            </div>
          </div>

          {/* 2. Interactive Portion Selector */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Sesuaikan Jumlah Porsi</p>
                <p className="text-xs text-muted-foreground">
                  Takaran bahan &amp; estimasi belanja otomatis diperbarui.
                </p>
              </div>
              {servings !== recipe.base_servings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetServings}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  title="Kembalikan ke porsi acuan"
                >
                  <RotateCcw className="size-3.5 mr-1" aria-hidden="true" />
                  Reset ({recipe.base_servings})
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center border rounded-xl bg-background p-1 shadow-inner">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDecreaseServings}
                  disabled={servings <= 1}
                  className="size-9 rounded-lg"
                  aria-label="Kurangi 1 porsi"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-16 text-center font-bold text-base text-foreground" aria-live="polite">
                  {servings} porsi
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleIncreaseServings}
                  disabled={servings >= 50}
                  className="size-9 rounded-lg"
                  aria-label="Tambah 1 porsi"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {servings === recipe.base_servings ? (
                  <span>Sesuai takaran resep asli</span>
                ) : (
                  <span className="text-primary font-medium">
                    Disesuaikan {servings} porsi (acuan: {recipe.base_servings})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 6. Cost Breakdown Card */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Estimasi Biaya Belanja (Shopping Cost)</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                    Data Simulasi
                  </span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  Rp {scaledCost.total_shopping_cost.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rp {scaledCost.cost_per_serving.toLocaleString("id-ID")} / porsi ({servings} porsi)
                </p>
              </div>
              <ShoppingBag className="size-8 text-primary/40 shrink-0 mt-1" aria-hidden="true" />
            </div>

            <div className="rounded-xl bg-muted/60 p-3.5 text-xs text-muted-foreground space-y-2 border">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>Biaya Konsumsi Sebenarnya:</span>
                <span>Rp {scaledCost.total_consumption_cost.toLocaleString("id-ID")}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                *Shopping cost adalah estimasi uang tunai yang perlu disiapkan untuk membeli seluruh kemasan bahan di pasar. Nilai konsumsi mencerminkan porsi bahan yang benar-benar terpakai dalam masakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Ingredients, Tools, & Instructions */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* 3. Ingredients Section with Checklist */}
          <section aria-labelledby="ingredients-heading" className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b">
              <div>
                <h2 id="ingredients-heading" className="text-xl font-bold text-foreground">
                  Daftar Bahan ({recipe.ingredients.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Disesuaikan untuk <span className="font-semibold text-foreground">{servings} porsi</span>. Centang bahan yang sudah siap!
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkAllIngredients}
                  className="h-8 px-2.5 text-xs"
                >
                  Centang Semua
                </Button>
                {checkedIngredientsCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={uncheckAllIngredients}
                    className="h-8 px-2.5 text-xs text-muted-foreground"
                  >
                    Batal
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Checklist Bar */}
            <div className="space-y-1.5 bg-muted/40 p-3 rounded-xl border">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  Kesiapan Bahan: {checkedIngredientsCount} dari {totalIngredients} bahan
                </span>
                <span className="font-semibold text-primary">{ingredientProgress}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ingredientProgress}%` }}
                />
              </div>
            </div>

            {/* Ingredients Checklist Rows */}
            <ul className="divide-y" role="list">
              {scaledIngredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.ingredient_id];
                const inputId = `ing-${ing.ingredient_id}`;

                return (
                  <li
                    key={ing.ingredient_id}
                    className={`py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm transition-colors rounded-lg px-2 ${
                      isChecked ? "bg-muted/30" : "hover:bg-muted/10"
                    }`}
                  >
                    <label
                      htmlFor={inputId}
                      className="flex items-start gap-3 cursor-pointer flex-1 select-none"
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredient(ing.ingredient_id)}
                        className="mt-0.5 size-4 rounded border-stone-300 text-primary focus:ring-primary focus:ring-offset-2 shrink-0 cursor-pointer"
                      />
                      <div>
                        <span
                          className={`font-medium ${
                            isChecked ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {ing.ingredient_name}
                        </span>
                        {ing.prep_note && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({ing.prep_note})
                          </span>
                        )}
                      </div>
                    </label>

                    <div className="flex items-center gap-2 pl-7 sm:pl-0 sm:text-right shrink-0">
                      <span className={`font-semibold ${isChecked ? "text-muted-foreground" : "text-primary"}`}>
                        {ing.scaledQuantity} {ing.unit}
                      </span>
                      {ing.scaledPackagePrice && ing.package_unit && (
                        <span
                          className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded"
                          title="Estimasi harga kemasan bahan di pasar"
                        >
                          Rp {ing.scaledPackagePrice.toLocaleString("id-ID")}/{ing.package_unit}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 4. Kitchen Tools Section */}
          {recipe.tools && recipe.tools.length > 0 && (
            <section aria-labelledby="tools-heading" className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Utensils className="size-5 text-primary" aria-hidden="true" />
                <h2 id="tools-heading" className="text-xl font-bold text-foreground">
                  Alat Memasak yang Diperlukan ({recipe.tools.length})
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Pastikan peralatan dapur berikut sudah siap sebelum mulai memasak:
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {recipe.tools.map((tool, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="px-3.5 py-1.5 text-xs font-medium bg-muted/30 border-stone-300"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* 5. Sequential Cooking Steps */}
          <section aria-labelledby="steps-heading" className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b">
              <div>
                <h2 id="steps-heading" className="text-xl font-bold text-foreground">
                  Langkah Memasak ({totalSteps} Langkah)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ikuti instruksi bertahap berikut. Tandai langkah yang telah selesai!
                </p>
              </div>

              {completedStepsCount > 0 && (
                <div className="text-xs font-medium text-primary bg-secondary/60 px-3 py-1 rounded-lg self-start sm:self-auto">
                  {completedStepsCount} dari {totalSteps} langkah selesai
                </div>
              )}
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-success h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${stepsProgress}%` }}
              />
            </div>

            <ol className="space-y-4" role="list">
              {recipe.steps && recipe.steps.length > 0 ? (
                recipe.steps.map((step, idx) => {
                  const stepNumber = idx + 1;
                  const isDone = !!completedSteps[stepNumber];

                  return (
                    <li
                      key={stepNumber}
                      aria-current={!isDone && completedStepsCount === idx ? "step" : undefined}
                      className={`flex gap-4 p-4 rounded-xl border transition-all ${
                        isDone
                          ? "bg-muted/30 border-border opacity-70"
                          : completedStepsCount === idx
                          ? "border-primary/50 bg-primary/5 shadow-sm"
                          : "bg-card border-border"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleStep(stepNumber)}
                        className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isDone
                            ? "bg-success text-success-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                        aria-label={`Tandai langkah ${stepNumber} ${isDone ? "belum selesai" : "selesai"}`}
                      >
                        {isDone ? <Check className="size-4" /> : stepNumber}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Langkah {stepNumber}
                          </p>
                          {isDone && (
                            <span className="text-[11px] font-medium text-success inline-flex items-center gap-1">
                              <CheckCircle2 className="size-3" /> Selesai
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${
                            isDone ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-muted-foreground">Langkah memasak belum tersedia.</li>
              )}
            </ol>
          </section>

          {/* 8. Video Tutorial Section */}
          <section aria-labelledby="video-heading" className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="size-5 text-primary" aria-hidden="true" />
                <h2 id="video-heading" className="text-xl font-bold text-foreground">
                  Video Tutorial
                </h2>
              </div>
              {recipe.video && recipe.video.is_verified && (
                <Badge variant="success" className="text-xs px-2.5 py-0.5">
                  Terverifikasi
                </Badge>
              )}
            </div>

            {/* Kondisi 1: Video terverifikasi dan mendukung pemutaran embed */}
            {recipe.video && recipe.video.is_verified && recipe.video.embed_allowed !== false ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/90 shadow-md border">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${recipe.video.video_id}`}
                    title={recipe.video.title || `Video panduan memasak ${recipe.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="size-full border-0"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    {recipe.video.title && (
                      <p className="font-medium text-foreground line-clamp-1">{recipe.video.title}</p>
                    )}
                    <p>
                      Sumber: <span className="font-medium text-foreground">{recipe.video.channel_name || "YouTube"}</span> • Platform: YouTube
                    </p>
                  </div>

                  <Button asChild size="sm" variant="outline" className="gap-2 shrink-0 self-start sm:self-auto">
                    <a
                      href={recipe.video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Buka video tutorial ${recipe.name} di YouTube (buka tab baru)`}
                    >
                      <span>Tonton di YouTube</span>
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : recipe.video && recipe.video.is_verified && recipe.video.embed_allowed === false ? (
              /* Kondisi 2: Video asli valid tetapi embed di situs lain dibatasi oleh kreator (Alternative Link Fallback) */
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-6 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="size-12 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0">
                    <PlayCircle className="size-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-semibold text-foreground text-base">
                      Pemutaran di Website Dibatasi
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Video tutorial resmi untuk resep ini tersedia di YouTube ({recipe.video.channel_name || "Kreator"}), namun pemilik video membatasi pemutaran langsung di dalam website lain. Anda dapat menonton panduan lengkapnya langsung di YouTube.
                    </p>
                    {recipe.video.title && (
                      <p className="text-xs font-medium text-foreground/80 italic pt-1">
                        &quot;{recipe.video.title}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end pt-2 border-t border-warning/20">
                  <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a
                      href={recipe.video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Tonton video tutorial ${recipe.name} langsung di YouTube`}
                    >
                      <span>Tonton di YouTube</span>
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              /* Kondisi 3: Belum ada video yang terverifikasi (Dashed Notice Fallback) */
              <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20 space-y-3">
                <VideoOff className="size-10 mx-auto text-muted-foreground/50" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Video Tutorial Belum Tersedia
                  </p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Video tutorial untuk resep ini sedang dalam proses kurasi dan verifikasi standar dapur oleh tim DapurCuan. Kami hanya menayangkan video yang telah terverifikasi keaslian dan kelengkapannya.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar: Nutrition & Meta Information */}
        <div className="space-y-6">
          {/* 7. Nutrition Panel */}
          <section aria-labelledby="nutrition-heading" className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="nutrition-heading" className="text-xl font-bold text-foreground">
                Informasi Gizi
              </h2>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimasi nilai nutrisi per porsi penyajian standar.
            </p>

            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Kalori</span>
                <span className="font-semibold text-foreground">{recipe.nutrition.calories_kcal} kkal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-semibold text-foreground">{recipe.nutrition.protein_g} g</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Karbohidrat</span>
                <span className="font-semibold text-foreground">{recipe.nutrition.carbs_g} g</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Lemak</span>
                <span className="font-semibold text-foreground">{recipe.nutrition.fat_g} g</span>
              </div>
              {recipe.nutrition.fiber_g !== undefined && (
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Serat</span>
                  <span className="font-semibold text-foreground">{recipe.nutrition.fiber_g} g</span>
                </div>
              )}
              {recipe.nutrition.sugar_g !== undefined && (
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Gula</span>
                  <span className="font-semibold text-foreground">{recipe.nutrition.sugar_g} g</span>
                </div>
              )}
              {recipe.nutrition.sodium_mg !== undefined && (
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Natrium</span>
                  <span className="font-semibold text-foreground">{recipe.nutrition.sodium_mg} mg</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground pt-3 border-t space-y-1.5">
              <div>
                <span className="font-medium text-foreground">Sumber acuan:</span> {recipe.nutrition.source}
              </div>
              <div className="text-[10px] text-muted-foreground/80 italic leading-relaxed">
                *Nilai nutrisi merupakan simulasi perhitungan berdasarkan standar bahan umum pangan Indonesia / USDA dan belum melalui uji laboratorium resmi.
              </div>
            </div>
          </section>

          {/* Tips Memasak Hemat */}
          <div className="rounded-2xl border bg-accent/40 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-accent-foreground font-semibold text-sm">
              <Info className="size-4 shrink-0" />
              <span>Tips Belanja Hemat</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Beli bahan kering dan bumbu dalam kemasan reguler untuk dipakai pada resep DapurCuan lainnya agar biaya per masakan semakin ekonomis.
            </p>
          </div>
        </div>
      </div>

      {/* 9. Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-6 pt-8 border-t">
          <div>
            <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-foreground">
              Resep Serupa dalam Kategori {recipe.category}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Rekomendasi hidangan lezat lainnya yang ramah budget dan mudah dimasak.
            </p>
          </div>
          <RecipeGrid recipes={relatedRecipes} />
        </section>
      )}
    </div>
  );
}
