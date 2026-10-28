"use client";

import Image from "next/image";
import type { RecipeWithCost } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Clock,
  ChefHat,
  ShoppingBag,
  Utensils,
  PlayCircle,
  ExternalLink,
  VideoOff,
  Flame,
} from "lucide-react";

interface RecipePreviewDialogProps {
  recipe: RecipeWithCost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipePreviewDialog({ recipe, isOpen, onClose }: RecipePreviewDialogProps) {
  if (!isOpen || !recipe) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
              Mode Pratinjau
            </span>
            <h2 id="preview-modal-title" className="text-lg font-bold truncate">
              {recipe.name || "Pratinjau Resep"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup pratinjau"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-muted border">
              {recipe.image_url ? (
                <Image
                  src={recipe.image_url}
                  alt={recipe.name || "Foto resep"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                  Belum ada foto
                </div>
              )}
            </div>

            <div className="sm:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {recipe.category}
                </Badge>
                <Badge
                  variant={
                    recipe.difficulty === "mudah"
                      ? "success"
                      : recipe.difficulty === "sedang"
                      ? "warning"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {recipe.difficulty}
                </Badge>
                <Badge
                  variant={
                    recipe.status === "published"
                      ? "success"
                      : recipe.status === "draft"
                      ? "warning"
                      : "outline"
                  }
                >
                  {recipe.status === "published"
                    ? "Published"
                    : recipe.status === "draft"
                    ? "Draft"
                    : "Archived"}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {recipe.name || "Nama Resep Belum Diisi"}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {recipe.description || "Deskripsi resep belum diisi."}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t">
                <div className="flex items-center gap-1.5">
                  <ChefHat className="size-4 text-primary" />
                  <span>Porsi: <strong>{recipe.base_servings}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  <span>Persiapan: <strong>{recipe.prep_minutes} mnt</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="size-4 text-primary" />
                  <span>Memasak: <strong>{recipe.cook_minutes} mnt</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Estimates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-primary/5 p-4 space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Estimasi Biaya Belanja (Shopping Cost)</span>
              <p className="text-xl font-bold text-primary">
                Rp {recipe.total_shopping_cost.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Dihitung dari total pembelian paket kemasan di pasar.
              </p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-4 space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Biaya Bahan Terpakai (Consumption Cost)</span>
              <p className="text-xl font-bold text-foreground">
                Rp {recipe.total_consumption_cost.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Proporsi takaran bahan yang murni digunakan untuk {recipe.base_servings} porsi.
              </p>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              Daftar Bahan ({recipe.ingredients.length})
            </h4>
            {recipe.ingredients.length > 0 ? (
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted text-muted-foreground border-b">
                    <tr>
                      <th className="p-2.5 font-semibold">Nama Bahan</th>
                      <th className="p-2.5 font-semibold">Takaran Resep</th>
                      <th className="p-2.5 font-semibold">Kemasan Pasar</th>
                      <th className="p-2.5 font-semibold text-right">Harga Pasar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recipe.ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2.5 font-medium">{ing.ingredient_name}</td>
                        <td className="p-2.5 text-muted-foreground">
                          {ing.quantity} {ing.unit} {ing.prep_note ? `(${ing.prep_note})` : ""}
                        </td>
                        <td className="p-2.5 text-muted-foreground">
                          {ing.package_quantity ? `${ing.package_quantity} ${ing.package_unit || ""}` : "-"}
                        </td>
                        <td className="p-2.5 text-right font-medium">
                          Rp {(ing.package_price || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">Belum ada bahan yang ditambahkan.</p>
            )}
          </div>

          {/* Tools & Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Utensils className="size-4 text-primary" />
                Alat Memasak
              </h4>
              {recipe.tools && recipe.tools.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tools.map((t, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2.5 py-1 rounded-md border text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Belum ada alat yang dicatat.</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground">Informasi Gizi per Porsi</h4>
              <div className="grid grid-cols-2 gap-2 text-xs rounded-xl border p-3 bg-muted/20">
                <div>Kalori: <strong>{recipe.nutrition?.calories_kcal ?? 0} kkal</strong></div>
                <div>Protein: <strong>{recipe.nutrition?.protein_g ?? 0} g</strong></div>
                <div>Karbohidrat: <strong>{recipe.nutrition?.carbs_g ?? 0} g</strong></div>
                <div>Lemak: <strong>{recipe.nutrition?.fat_g ?? 0} g</strong></div>
              </div>
            </div>
          </div>

          {/* Cooking Steps */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-foreground">Langkah Memasak ({recipe.steps?.length ?? 0})</h4>
            {recipe.steps && recipe.steps.length > 0 ? (
              <ol className="space-y-2 text-xs">
                {recipe.steps.map((st, idx) => (
                  <li key={idx} className="flex gap-2.5 p-2.5 rounded-lg border bg-muted/10">
                    <span className="size-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-muted-foreground italic">Belum ada langkah memasak yang ditambahkan.</p>
            )}
          </div>

          {/* Video Preview */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <PlayCircle className="size-4 text-primary" />
              Video Tutorial
            </h4>
            {recipe.video?.url ? (
              <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{recipe.video.title || "Video Tutorial"}</span>
                  <a
                    href={recipe.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Buka di YouTube <ExternalLink className="size-3" />
                  </a>
                </div>
                {recipe.video.video_id && recipe.video.embed_allowed !== false && (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/90">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${recipe.video.video_id}`}
                      title={recipe.video.title || "Preview video"}
                      className="size-full border-0"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg border border-dashed bg-muted/10">
                <VideoOff className="size-4 shrink-0" />
                <span>Video tutorial belum dikaitkan pada resep ini.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t bg-muted/40 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Tutup Pratinjau
          </Button>
        </div>
      </div>
    </div>
  );
}
