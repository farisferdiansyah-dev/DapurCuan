"use client";

import { useState, useEffect } from "react";
import type { MasterIngredient, RecipeImpactSimulation } from "@/types/ingredient";
import { mockIngredientService } from "@/lib/services/ingredient-mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRight,
  Info,
  Utensils,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface IngredientImpactDialogProps {
  ingredient: MasterIngredient | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyNewPrice?: (ingredientId: string, newPriceIdr: number) => void;
}

export function IngredientImpactDialog({
  ingredient,
  isOpen,
  onClose,
  onApplyNewPrice,
}: IngredientImpactDialogProps) {
  const currentPrice = ingredient?.current_price.package_price_idr ?? 0;
  const [simulatedPrice, setSimulatedPrice] = useState<number>(currentPrice);
  const [impactedRecipes, setImpactedRecipes] = useState<RecipeImpactSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setSimulatedPrice(ingredient.current_price.package_price_idr);
    }
  }, [ingredient, isOpen]);

  useEffect(() => {
    if (!ingredient || !isOpen) return;

    let isCancelled = false;

    async function runSimulation() {
      setIsLoading(true);
      try {
        const res = await mockIngredientService.simulateRecipePriceImpact(
          ingredient!.name,
          simulatedPrice,
          ingredient!.current_price.package_price_idr
        );
        if (!isCancelled) {
          setImpactedRecipes(res);
        }
      } catch {
        if (!isCancelled) {
          setImpactedRecipes([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(runSimulation, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [ingredient, simulatedPrice, isOpen]);

  if (!isOpen || !ingredient) return null;

  const handleQuickPercent = (pct: number) => {
    const calculated = Math.max(100, Math.round(currentPrice * (1 + pct / 100)));
    // round to nearest 100
    const rounded = Math.round(calculated / 100) * 100;
    setSimulatedPrice(rounded);
  };

  const priceDiff = simulatedPrice - currentPrice;
  const pricePctDiff = currentPrice > 0 ? Math.round((priceDiff / currentPrice) * 100 * 10) / 10 : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="impact-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                Simulasi Biaya Resep
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <h2 id="impact-dialog-title" className="text-lg font-bold text-foreground truncate">
              Dampak Harga: {ingredient.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog simulasi"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* PRD Legal/Simulation Notice */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-start gap-2.5">
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Simulasi Perhitungan:</strong> Simulasi ini memperlihatkan bagaimana penyesuaian harga acuan bahan makanan mempengaruhi estimasi modal belanja (Shopping Cost) resep DapurCuan. Tidak dimaksudkan sebagai klaim harga pasar resmi.
            </div>
          </div>

          {/* Pricing Controls Card */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Harga Acuan Saat Ini</p>
                <p className="text-lg font-bold text-foreground">
                  Rp {currentPrice.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / {ingredient.current_price.package_quantity} {ingredient.current_price.package_unit}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Uji Coba Harga Baru:</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min={100}
                    step={500}
                    value={simulatedPrice}
                    onChange={(e) => setSimulatedPrice(parseInt(e.target.value) || 0)}
                    className="w-36 rounded-lg border bg-background pl-8 pr-3 py-1.5 text-sm font-bold text-primary focus:border-primary focus:outline-none"
                    aria-label="Input harga simulasi baru"
                  />
                </div>
              </div>
            </div>

            {/* Quick Adjustment Buttons */}
            <div className="pt-2 border-t flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground mr-1 text-[11px] font-medium">Uji Penyesuaian:</span>
              <button
                type="button"
                onClick={() => handleQuickPercent(-20)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-success transition-colors"
              >
                -20%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(-10)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-success transition-colors"
              >
                -10%
              </button>
              <button
                type="button"
                onClick={() => setSimulatedPrice(currentPrice)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-muted-foreground transition-colors"
              >
                Reset (0%)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(10)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-warning transition-colors"
              >
                +10%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(25)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-destructive transition-colors"
              >
                +25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(50)}
                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-destructive transition-colors"
              >
                +50%
              </button>
            </div>

            {/* Price Delta Status */}
            <div className="text-xs pt-1 flex items-center gap-2">
              <span className="text-muted-foreground">Selisih harga bahan:</span>
              {priceDiff === 0 ? (
                <span className="font-semibold text-muted-foreground">Sama dengan harga acuan awal</span>
              ) : priceDiff > 0 ? (
                <span className="font-bold text-destructive">
                  +Rp {priceDiff.toLocaleString("id-ID")} (+{pricePctDiff}%)
                </span>
              ) : (
                <span className="font-bold text-success">
                  -Rp {Math.abs(priceDiff).toLocaleString("id-ID")} ({pricePctDiff}%)
                </span>
              )}
            </div>
          </div>

          {/* Impacted Recipes List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Utensils className="size-3.5 text-primary" />
                <span>Resep yang Menggunakan Bahan Ini ({impactedRecipes.length})</span>
              </h3>
              <Badge variant="outline" className="text-[11px]">
                {impactedRecipes.length} resep terdaftar
              </Badge>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 animate-pulse">
                <RefreshCw className="size-4 animate-spin text-primary" />
                <span>Menghitung ulang dampak biaya belanja resep...</span>
              </div>
            ) : impactedRecipes.length > 0 ? (
              <div className="rounded-xl border divide-y overflow-hidden max-h-64 overflow-y-auto">
                {impactedRecipes.map((item) => (
                  <div
                    key={item.recipe_id}
                    className="p-3 flex items-center justify-between text-xs hover:bg-muted/20 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">{item.recipe_name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Porsi standar: {item.base_servings} orang
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="flex items-center justify-end gap-1.5 font-bold">
                        <span className="text-muted-foreground line-through text-[11px]">
                          Rp {item.old_shopping_cost.toLocaleString("id-ID")}
                        </span>
                        <ArrowRight className="size-3 text-muted-foreground" />
                        <span className="text-foreground">
                          Rp {item.new_shopping_cost.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold">
                        {item.cost_difference === 0 ? (
                          <span className="text-muted-foreground">Biaya tetap</span>
                        ) : item.cost_difference > 0 ? (
                          <span className="text-destructive font-bold">
                            +Rp {item.cost_difference.toLocaleString("id-ID")} (+{item.percentage_change}%)
                          </span>
                        ) : (
                          <span className="text-success font-bold">
                            -Rp {Math.abs(item.cost_difference).toLocaleString("id-ID")} ({item.percentage_change}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed bg-muted/10 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Tidak Ada Resep Terpengaruh Langsung</p>
                <p>
                  Belum ada resep terdaftar dalam sistem mock yang menggunakan bahan &quot;{ingredient.name}&quot;.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20 shrink-0">
          <p className="text-[11px] text-muted-foreground">
            Perubahan harga di sini bersifat preview dan tidak merusak data.
          </p>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Tutup
            </Button>
            {onApplyNewPrice && priceDiff !== 0 && (
              <Button
                type="button"
                size="sm"
                className="gap-1.5 font-semibold"
                onClick={() => {
                  onApplyNewPrice(ingredient.id, simulatedPrice);
                  onClose();
                }}
              >
                <Sparkles className="size-3.5" />
                <span>Terapkan Harga Ini</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
