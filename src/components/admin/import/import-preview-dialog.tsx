"use client";

import Image from "next/image";
import type { ImportCandidate } from "@/types/import";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Clock,
  Users,
  Flame,
  CheckCircle2,
  Utensils,
  ShieldCheck,
} from "lucide-react";

interface ImportPreviewDialogProps {
  candidate: ImportCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (candidate: ImportCandidate) => void;
}

export function ImportPreviewDialog({
  candidate,
  isOpen,
  onClose,
  onApprove,
}: ImportPreviewDialogProps) {
  if (!isOpen || !candidate) return null;

  const isRecipe = candidate.type === "recipe";
  const r = candidate.recipe_data;
  const ing = candidate.ingredient_data;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                Pratinjau Hasil Impor
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <h2 id="preview-dialog-title" className="text-base font-bold text-foreground truncate">
              {candidate.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog pratinjau"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isRecipe && r ? (
            <div className="space-y-6">
              {/* Hero Image */}
              {r.image_url ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border shadow-sm">
                  <Image
                    src={r.image_url}
                    alt={r.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-black/60 backdrop-blur text-white border-0 capitalize">
                      {r.category}
                    </Badge>
                    <Badge className="bg-primary/90 text-primary-foreground border-0 capitalize">
                      Tingkat: {r.difficulty}
                    </Badge>
                  </div>
                </div>
              ) : null}

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </div>

              {/* Metadata Highlights */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl border bg-muted/20 text-center">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="size-3.5" /> Porsi
                  </span>
                  <p className="text-base font-bold text-foreground">{r.base_servings} Orang</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="size-3.5" /> Waktu Masak
                  </span>
                  <p className="text-base font-bold text-foreground">
                    {r.prep_time_minutes + r.cook_time_minutes} Menit
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Flame className="size-3.5" /> Estimasi Kalori
                  </span>
                  <p className="text-base font-bold text-foreground">
                    {r.nutrition?.calories ? `${r.nutrition.calories} kkal` : "Data Estimasi"}
                  </p>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Utensils className="size-4 text-primary" />
                  <span>Daftar Bahan &amp; Takaran ({r.ingredients.length})</span>
                </h4>
                <div className="rounded-xl border divide-y overflow-hidden">
                  {r.ingredients.map((ingItem, i) => (
                    <div key={i} className="p-3 flex items-center justify-between text-xs hover:bg-muted/10">
                      <span className="font-medium text-foreground">{ingItem.name}</span>
                      <span className="font-semibold text-muted-foreground">
                        {ingItem.quantity} {ingItem.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Langkah-Langkah Memasak ({r.steps.length})
                </h4>
                <div className="space-y-2.5">
                  {r.steps.map((st) => (
                    <div key={st.step_number} className="flex gap-3 p-3 rounded-xl border bg-card">
                      <span className="size-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step_number}
                      </span>
                      <p className="text-xs text-foreground leading-relaxed pt-0.5">
                        {st.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attribution and License Info */}
              <div className="p-4 rounded-xl border bg-muted/20 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <ShieldCheck className="size-4 text-success" />
                  <span>Atribusi Sumber &amp; Lisensi ({candidate.license})</span>
                </div>
                <p className="leading-relaxed">
                  Data ini diimpor dari <strong>{candidate.source_name}</strong>. {candidate.license_notes}
                </p>
              </div>
            </div>
          ) : ing ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border bg-muted/20 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Master Bahan</span>
                  <h3 className="text-2xl font-bold text-foreground">{ing.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Kategori</span>
                    <span className="font-bold text-sm capitalize">{ing.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Satuan Standar Resep</span>
                    <span className="font-bold text-sm">{ing.canonical_unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Kemasan Acuan Pasar</span>
                    <span className="font-bold text-sm">{ing.package_quantity} {ing.package_unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Harga Acuan Paket</span>
                    <span className="font-bold text-sm text-primary">
                      Rp {ing.package_price_idr.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-muted/20 shrink-0">
          <p className="text-[11px] text-muted-foreground">
            Pratinjau tampilan kandidat impor sebelum dipublikasikan.
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Tutup
            </Button>
            {onApprove && candidate.status === "needs_review" && candidate.can_approve && (
              <Button
                type="button"
                size="sm"
                className="bg-success text-success-foreground hover:bg-success/90 font-semibold gap-1.5"
                onClick={() => {
                  onClose();
                  onApprove(candidate);
                }}
              >
                <CheckCircle2 className="size-4" />
                <span>Setujui Kandidat Ini</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
