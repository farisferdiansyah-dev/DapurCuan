"use client";

import { useState, useEffect, useMemo } from "react";
import type { MasterIngredient, IngredientCategory, RecipeImpactSimulation } from "@/types/ingredient";
import { ingredientFormSchema, type IngredientFormValues } from "@/lib/validation/ingredient-schema";
import { REGIONS, CATEGORIES, checkIsPriceStale, mockIngredientService } from "@/lib/services/ingredient-mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CheckCircle2,
  TrendingUp,
  Info,
  ArrowRight,
} from "lucide-react";

interface IngredientEditorDialogProps {
  ingredient: MasterIngredient | null;
  isOpen: boolean;
  onSave: (ingredient: MasterIngredient) => void;
  onClose: () => void;
}

export function IngredientEditorDialog({
  ingredient,
  isOpen,
  onSave,
  onClose,
}: IngredientEditorDialogProps) {
  // Form state
  const [name, setName] = useState("");
  const [canonicalUnit, setCanonicalUnit] = useState("gram");
  const [category, setCategory] = useState<IngredientCategory>("protein");
  const [packageQuantity, setPackageQuantity] = useState(250);
  const [packageUnit, setPackageUnit] = useState("gram");
  const [packagePriceIdr, setPackagePriceIdr] = useState(10000);
  const [regionCode, setRegionCode] = useState("ID");
  const [source, setSource] = useState("Survei Pasar Tradisional");
  const [observedAt, setObservedAt] = useState("2026-10-25");

  // Errors state from Zod
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Impact simulation state
  const [impactedRecipes, setImpactedRecipes] = useState<RecipeImpactSimulation[]>([]);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);

  // Populate form
  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setCanonicalUnit(ingredient.canonical_unit);
      setCategory(ingredient.category);
      setPackageQuantity(ingredient.current_price.package_quantity);
      setPackageUnit(ingredient.current_price.package_unit);
      setPackagePriceIdr(ingredient.current_price.package_price_idr);
      setRegionCode(ingredient.current_price.region_code);
      setSource(ingredient.current_price.source);
      setObservedAt(ingredient.current_price.observed_at);
      setErrors({});
    } else {
      setName("");
      setCanonicalUnit("gram");
      setCategory("protein");
      setPackageQuantity(250);
      setPackageUnit("gram");
      setPackagePriceIdr(10000);
      setRegionCode("ID");
      setSource("Survei Pasar Tradisional");
      setObservedAt("2026-10-25");
      setErrors({});
      setImpactedRecipes([]);
    }
  }, [ingredient, isOpen]);

  // Check if price is stale based on observedAt
  const isStale = useMemo(() => {
    return checkIsPriceStale(observedAt);
  }, [observedAt]);

  // Real-time Impact Simulator: Run simulation when price or name changes
  useEffect(() => {
    let isCancelled = false;

    async function runImpactSimulation() {
      if (!name.trim()) {
        setImpactedRecipes([]);
        return;
      }

      setIsLoadingImpact(true);
      try {
        const oldPrice = ingredient?.current_price.package_price_idr ?? packagePriceIdr;
        const res = await mockIngredientService.simulateRecipePriceImpact(
          name,
          packagePriceIdr,
          oldPrice
        );
        if (!isCancelled) {
          setImpactedRecipes(res);
        }
      } catch {
        if (!isCancelled) setImpactedRecipes([]);
      } finally {
        if (!isCancelled) setIsLoadingImpact(false);
      }
    }

    const timer = setTimeout(runImpactSimulation, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [name, packagePriceIdr, ingredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formValues: IngredientFormValues = {
      name: name.trim(),
      canonical_unit: canonicalUnit.trim(),
      category,
      package_quantity: Number(packageQuantity),
      package_unit: packageUnit.trim(),
      package_price_idr: Number(packagePriceIdr),
      region_code: regionCode,
      source: source.trim(),
      observed_at: observedAt,
    };

    // Zod validation
    const result = ingredientFormSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const selectedRegion = REGIONS.find((r) => r.code === regionCode)?.name ?? "Nasional (ID)";
    const priceId = `prc-${Date.now()}`;

    const newPriceObj = {
      id: priceId,
      ingredient_id: ingredient?.id ?? `ing-${Date.now()}`,
      region_code: regionCode,
      region_name: selectedRegion,
      package_quantity: formValues.package_quantity,
      package_unit: formValues.package_unit,
      package_price_idr: formValues.package_price_idr,
      source: formValues.source,
      observed_at: formValues.observed_at,
      is_stale: isStale,
    };

    const updatedIngredient: MasterIngredient = {
      id: ingredient?.id ?? `ing-${Date.now()}`,
      name: formValues.name,
      canonical_unit: formValues.canonical_unit,
      category: formValues.category,
      current_price: newPriceObj,
      price_history: ingredient
        ? [newPriceObj, ...ingredient.price_history]
        : [newPriceObj],
      created_at: ingredient?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(updatedIngredient);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                {ingredient ? "Edit Bahan & Harga" : "Tambah Bahan Baru"}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <h2 id="ingredient-editor-title" className="text-lg font-bold text-foreground truncate">
              {ingredient ? ingredient.name : "Input Bahan Pangan Baru"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Simulation Disclaimer Notice */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              Harga yang dimasukkan merupakan <strong>data simulasi</strong> untuk kalkulasi biaya rekomendasi resep. Tidak diklaim sebagai harga pasar aktual terverifikasi resmi.
            </div>
          </div>

          {/* Master Info: Name, Canonical Unit, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="ing-name" className="text-xs font-semibold text-foreground">
                Nama Bahan Masakan <span className="text-destructive">*</span>
              </label>
              <input
                id="ing-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Telur Ayam Negeri"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="ing-category" className="text-xs font-semibold text-foreground">
                Kategori Bahan <span className="text-destructive">*</span>
              </label>
              <select
                id="ing-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="ing-unit" className="text-xs font-semibold text-foreground">
              Satuan Standar Resep (Canonical Unit) <span className="text-destructive">*</span>
            </label>
            <input
              id="ing-unit"
              type="text"
              value={canonicalUnit}
              onChange={(e) => setCanonicalUnit(e.target.value)}
              placeholder="Contoh: gram, ml, butir, lembar, ikat"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            {errors.canonical_unit && <p className="text-[11px] text-destructive font-medium">{errors.canonical_unit}</p>}
          </div>

          {/* Pricing Info: Package Qty, Package Unit, Price */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Kemasan Pasar & Harga Acuan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label htmlFor="pkg-qty" className="text-xs font-semibold text-foreground">
                  Ukuran Paket Pasar <span className="text-destructive">*</span>
                </label>
                <input
                  id="pkg-qty"
                  type="number"
                  min={0.01}
                  step="any"
                  value={packageQuantity}
                  onChange={(e) => setPackageQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                {errors.package_quantity && <p className="text-[11px] text-destructive font-medium">{errors.package_quantity}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="pkg-unit" className="text-xs font-semibold text-foreground">
                  Satuan Paket Pasar <span className="text-destructive">*</span>
                </label>
                <input
                  id="pkg-unit"
                  type="text"
                  value={packageUnit}
                  onChange={(e) => setPackageUnit(e.target.value)}
                  placeholder="pack / kg / ikat"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                {errors.package_unit && <p className="text-[11px] text-destructive font-medium">{errors.package_unit}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="pkg-price" className="text-xs font-semibold text-foreground">
                  Harga Paket (Rp) <span className="text-destructive">*</span>
                </label>
                <input
                  id="pkg-price"
                  type="number"
                  min={100}
                  step={500}
                  value={packagePriceIdr}
                  onChange={(e) => setPackagePriceIdr(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold text-primary focus:border-primary focus:outline-none"
                />
                {errors.package_price_idr && <p className="text-[11px] text-destructive font-medium">{errors.package_price_idr}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label htmlFor="price-region" className="text-xs font-semibold text-foreground">
                  Wilayah Acuan
                </label>
                <select
                  id="price-region"
                  value={regionCode}
                  onChange={(e) => setRegionCode(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                >
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="price-source" className="text-xs font-semibold text-foreground">
                  Sumber Acuan Harga
                </label>
                <input
                  id="price-source"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Pasar Tradisional / PIHPS"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                />
                {errors.source && <p className="text-[11px] text-destructive font-medium">{errors.source}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="price-date" className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Tanggal Observasi</span>
                  {isStale ? (
                    <span className="text-[10px] text-warning font-bold">Kedaluwarsa (&gt;30 hari)</span>
                  ) : (
                    <span className="text-[10px] text-success font-semibold">Harga Segar</span>
                  )}
                </label>
                <input
                  id="price-date"
                  type="date"
                  value={observedAt}
                  onChange={(e) => setObservedAt(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
                {errors.observed_at && <p className="text-[11px] text-destructive font-medium">{errors.observed_at}</p>}
              </div>
            </div>
          </div>

          {/* REALTIME RECIPE IMPACT SIMULATOR PANEL */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">
                  Simulasi Dampak pada Biaya Resep DapurCuan
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {impactedRecipes.length} Resep Terpengaruh
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Jika harga bahan ini diubah ke <strong>Rp {packagePriceIdr.toLocaleString("id-ID")}</strong>, berikut simulasi penyesuaian biaya belanja pada resep yang menggunakan bahan ini:
            </p>

            {isLoadingImpact ? (
              <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
                Menghitung simulasi dampak resep...
              </div>
            ) : impactedRecipes.length > 0 ? (
              <div className="max-h-48 overflow-y-auto rounded-lg border divide-y divide-border">
                {impactedRecipes.map((imp) => (
                  <div key={imp.recipe_id} className="p-2.5 flex items-center justify-between text-xs hover:bg-muted/30">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <p className="font-semibold text-foreground truncate">{imp.recipe_name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {imp.category} • {imp.base_servings} porsi
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-muted-foreground line-through text-[11px]">
                          Rp {imp.old_shopping_cost.toLocaleString("id-ID")}
                        </span>
                        <ArrowRight className="size-3 text-muted-foreground" />
                        <span className="text-foreground">
                          Rp {imp.new_shopping_cost.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold">
                        {imp.cost_difference === 0 ? (
                          <span className="text-muted-foreground">Tidak ada perubahan</span>
                        ) : imp.cost_difference > 0 ? (
                          <span className="text-destructive">
                            +Rp {imp.cost_difference.toLocaleString("id-ID")} (+{imp.percentage_change}%)
                          </span>
                        ) : (
                          <span className="text-success">
                            -Rp {Math.abs(imp.cost_difference).toLocaleString("id-ID")} ({imp.percentage_change}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border border-dashed bg-muted/10 text-xs text-muted-foreground">
                Tidak ada resep aktif yang menggunakan bahan ini secara langsung.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 font-semibold">
              <CheckCircle2 className="size-4" />
              <span>Simpan Bahan & Harga</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
