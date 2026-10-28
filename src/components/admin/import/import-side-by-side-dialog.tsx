"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ImportCandidate } from "@/types/import";
import type { Recipe } from "@/types/recipe";
import type { MasterIngredient } from "@/types/ingredient";
import { mockImportService } from "@/lib/services/import-mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

interface ImportSideBySideDialogProps {
  candidate: ImportCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (candidate: ImportCandidate) => void;
  onReject: (candidate: ImportCandidate) => void;
}

type ExistingMatchResult =
  | { type: "recipe"; item: Recipe }
  | { type: "ingredient"; item: MasterIngredient };

export function ImportSideBySideDialog({
  candidate,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ImportSideBySideDialogProps) {
  const [existingData, setExistingData] = useState<ExistingMatchResult | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  useEffect(() => {
    if (!candidate || !isOpen) {
      setExistingData(null);
      return;
    }

    let isCancelled = false;
    async function loadExisting() {
      setIsLoadingExisting(true);
      try {
        const res = await mockImportService.getExistingMatchDetails(
          candidate!.type,
          candidate!.duplicate_check.existing_id,
          candidate!.duplicate_check.existing_name
        );
        if (!isCancelled) {
          setExistingData(res as ExistingMatchResult | null);
        }
      } catch {
        if (!isCancelled) setExistingData(null);
      } finally {
        if (!isCancelled) setIsLoadingExisting(false);
      }
    }

    loadExisting();
    return () => {
      isCancelled = true;
    };
  }, [candidate, isOpen]);

  if (!isOpen || !candidate) return null;

  const isRecipe = candidate.type === "recipe";
  const recipeData = candidate.recipe_data;
  const ingredientData = candidate.ingredient_data;
  const existingRecipe = existingData?.type === "recipe" ? (existingData.item as Recipe) : null;
  const existingIngredient = existingData?.type === "ingredient" ? (existingData.item as MasterIngredient) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-by-side-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                Tinjauan Perbandingan Side-by-Side
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                Data Simulasi
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded border capitalize font-semibold">
                Tipe: {candidate.type}
              </span>
            </div>
            <h2 id="side-by-side-title" className="text-lg font-bold text-foreground truncate">
              {candidate.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog perbandingan"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banners: License Compliance + Duplicate Detection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* License & Source Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                candidate.is_license_compliant
                  ? "bg-success/5 border-success/30 text-foreground"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {candidate.is_license_compliant ? (
                <ShieldCheck className="size-5 text-success shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="size-5 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {candidate.is_license_compliant
                      ? "Lisensi Data Sah & Terbuka"
                      : "Peringatan Lisensi: Hak Cipta Komersial"}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {candidate.license}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Sumber: <strong>{candidate.source_name}</strong>. {candidate.license_notes}
                </p>
                <a
                  href={candidate.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline mt-1"
                >
                  <span>Buka URL Asli Penyedia</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>

            {/* Duplicate Detection Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                candidate.duplicate_check.is_duplicate
                  ? "bg-warning/10 border-warning/30 text-foreground"
                  : "bg-muted/20 border-muted text-foreground"
              }`}
            >
              <AlertTriangle
                className={`size-5 shrink-0 mt-0.5 ${
                  candidate.duplicate_check.is_duplicate
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {candidate.duplicate_check.is_duplicate
                      ? "Terdeteksi Kemungkinan Duplikasi"
                      : "Pemeriksaan Duplikasi: Data Unik"}
                  </span>
                  <Badge
                    variant={candidate.duplicate_check.is_duplicate ? "default" : "outline"}
                    className={`text-[10px] ${
                      candidate.duplicate_check.is_duplicate
                        ? "bg-warning text-warning-foreground"
                        : ""
                    }`}
                  >
                    Skor: {candidate.duplicate_check.similarity_score}%
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {candidate.duplicate_check.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Checklist if any issues */}
          {candidate.validation_issues.length > 0 && (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2 text-xs">
              <h3 className="font-bold text-destructive flex items-center gap-1.5">
                <AlertTriangle className="size-4" />
                <span>Masalah Validasi Kelengkapan ({candidate.validation_issues.length}):</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {candidate.validation_issues.map((issue, idx) => (
                  <li key={idx}>
                    <strong className="text-foreground capitalize">{issue.field}</strong>: {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SIDE-BY-SIDE COMPARISON COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: CANDIDATE DATA */}
            <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-sm font-bold text-foreground">Data Kandidat Impor</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">ID: {candidate.external_id}</span>
              </div>

              {isRecipe && recipeData ? (
                <div className="space-y-4 text-xs">
                  {recipeData.image_url ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                      <Image
                        src={recipeData.image_url}
                        alt={recipeData.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      Foto belum tersedia
                    </div>
                  )}

                  <div>
                    <span className="text-muted-foreground">Nama Masakan:</span>
                    <p className="text-sm font-bold text-foreground">{recipeData.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{recipeData.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/30 text-center">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kategori</span>
                      <span className="font-bold capitalize">{recipeData.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Porsi</span>
                      <span className="font-bold">{recipeData.base_servings} orang</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Total Waktu</span>
                      <span className="font-bold">{recipeData.prep_time_minutes + recipeData.cook_time_minutes} mnt</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-muted-foreground">Bahan &amp; Takaran ({recipeData.ingredients.length}):</span>
                    <div className="max-h-36 overflow-y-auto rounded-lg border divide-y bg-background p-2 space-y-1">
                      {recipeData.ingredients.map((ing, i) => (
                        <div key={i} className="flex justify-between text-[11px] py-1">
                          <span>{ing.name}</span>
                          <span className="font-semibold text-muted-foreground">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-muted-foreground">Langkah Memasak ({recipeData.steps.length}):</span>
                    {recipeData.steps.length > 0 ? (
                      <div className="max-h-36 overflow-y-auto rounded-lg border p-2 space-y-1.5 bg-background">
                        {recipeData.steps.map((st) => (
                          <div key={st.step_number} className="text-[11px] leading-relaxed flex gap-2">
                            <span className="font-bold text-primary shrink-0">{st.step_number}.</span>
                            <span className="text-muted-foreground">{st.instruction}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center rounded border border-dashed text-destructive text-[11px]">
                        Langkah instruksi memasak kosong!
                      </div>
                    )}
                  </div>
                </div>
              ) : ingredientData ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Nama Bahan:</span>
                    <p className="text-sm font-bold text-foreground">{ingredientData.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/30">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kategori</span>
                      <span className="font-bold capitalize">{ingredientData.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Satuan Standar</span>
                      <span className="font-bold">{ingredientData.canonical_unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kemasan Acuan</span>
                      <span className="font-bold">{ingredientData.package_quantity} {ingredientData.package_unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Harga Acuan</span>
                      <span className="font-bold text-primary">Rp {ingredientData.package_price_idr.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* RIGHT COLUMN: EXISTING DAPURCUAN DATA */}
            <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-muted-foreground" />
                  <h3 className="text-sm font-bold text-foreground">
                    {candidate.duplicate_check.is_duplicate
                      ? "Data Serupa di Katalog DapurCuan"
                      : "Perbandingan Katalog DapurCuan"}
                  </h3>
                </div>
                {existingData && (
                  <Badge variant="outline" className="text-[10px]">
                    {candidate.duplicate_check.similarity_score}% Match
                  </Badge>
                )}
              </div>

              {isLoadingExisting ? (
                <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
                  Mencari data pembanding di katalog...
                </div>
              ) : existingRecipe ? (
                <div className="space-y-4 text-xs">
                  {existingRecipe.image_url ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                      <Image
                        src={existingRecipe.image_url}
                        alt={existingRecipe.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      Foto tidak tersedia
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Resep Terdaftar:</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {existingRecipe.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-foreground">{existingRecipe.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{existingRecipe.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/30 text-center">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kategori</span>
                      <span className="font-bold capitalize">{existingRecipe.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Porsi</span>
                      <span className="font-bold">{existingRecipe.base_servings} orang</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Total Waktu</span>
                      <span className="font-bold">{existingRecipe.prep_minutes + existingRecipe.cook_minutes} mnt</span>
                    </div>
                  </div>

                  {/* Difference Highlights */}
                  <div className="p-3 rounded-lg border border-warning/30 bg-warning/5 text-xs text-muted-foreground space-y-1">
                    <span className="font-semibold text-warning">Analisis Komparasi Duplikat:</span>
                    <p className="text-[11px] leading-relaxed">
                      Resep kandidat memiliki kemiripan nama dan formula bahan dengan menu ini. Menyetujui impor ini dapat menimbulkan konten ganda yang membingungkan pengunjung.
                    </p>
                  </div>
                </div>
              ) : existingIngredient ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Bahan Terdaftar:</span>
                    <p className="text-sm font-bold text-foreground">{existingIngredient.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/30">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kategori</span>
                      <span className="font-bold capitalize">{existingIngredient.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Harga Acuan</span>
                      <span className="font-bold">Rp {existingIngredient.current_price.package_price_idr.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center rounded-xl border border-dashed bg-muted/10 text-xs text-muted-foreground space-y-2">
                  <CheckCircle2 className="size-8 text-success mx-auto opacity-80" />
                  <p className="font-bold text-foreground text-sm">Tidak Ada Duplikasi Ditemukan</p>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Katalog DapurCuan belum memiliki resep atau bahan serupa. Data ini aman dari risiko tumpang tindih.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20 shrink-0">
          <div className="text-xs text-muted-foreground">
            Status Kandidat Saat Ini: <strong className="capitalize">{candidate.status.replace("_", " ")}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Tutup
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5"
              onClick={() => {
                onClose();
                onReject(candidate);
              }}
            >
              <XCircle className="size-4" />
              <span>Tolak Kandidat</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!candidate.can_approve}
              className="gap-1.5 font-semibold bg-success text-success-foreground hover:bg-success/90 disabled:opacity-50"
              onClick={() => {
                onClose();
                onApprove(candidate);
              }}
            >
              <CheckCircle2 className="size-4" />
              <span>Setujui Impor</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
