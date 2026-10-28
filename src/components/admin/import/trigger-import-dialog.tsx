"use client";

import { useState } from "react";
import type { ImportSource, ImportCandidate } from "@/types/import";
import { mockImportService } from "@/lib/services/import-mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Play,
  ShieldCheck,
  ShieldAlert,
  Info,
  RefreshCw,
} from "lucide-react";

interface TriggerImportDialogProps {
  sources: ImportSource[];
  isOpen: boolean;
  onClose: () => void;
  onImportTriggered: (newCandidate: ImportCandidate) => void;
}

export function TriggerImportDialog({
  sources,
  isOpen,
  onClose,
  onImportTriggered,
}: TriggerImportDialogProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    sources[0]?.id || "src-open-recipe"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const handleStartImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network delay and pipeline execution
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newCandidate = mockImportService.simulateFetchFromSource(selectedSourceId);
    setIsProcessing(false);
    onImportTriggered(newCandidate);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trigger-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
              Simulasi Pipeline Impor
            </span>
            <h2 id="trigger-dialog-title" className="text-base font-bold text-foreground">
              Ambil Data dari Sumber Eksternal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleStartImport} className="p-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="source-selector" className="text-xs font-semibold text-foreground">
              Pilih Sumber Eksternal Terdaftar
            </label>
            <select
              id="source-selector"
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
            >
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.default_license})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Source Policy Card */}
          {currentSource && (
            <div
              className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                currentSource.is_verified_license
                  ? "bg-success/5 border-success/30 text-foreground"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  {currentSource.is_verified_license ? (
                    <ShieldCheck className="size-4 text-success" />
                  ) : (
                    <ShieldAlert className="size-4 text-destructive" />
                  )}
                  {currentSource.name}
                </span>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {currentSource.default_license}
                </Badge>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {currentSource.terms_note}
              </p>

              {!currentSource.is_verified_license && (
                <div className="p-2 rounded bg-destructive/10 text-destructive font-semibold text-[11px]">
                  Peringatan: Mengimpor dari sumber ini akan menghasilkan peringatan lisensi dan tidak dapat disetujui tanpa izin tertulis (PRD 5.2).
                </div>
              )}
            </div>
          )}

          {/* Pipeline Notice */}
          <div className="p-3 rounded-xl border bg-muted/20 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              Data yang diambil akan diproses melalui pipeline normalisasi dan deteksi duplikasi otomatis sebelum masuk ke antrean <strong>Needs Review</strong>.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isProcessing}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isProcessing}
              className="gap-1.5 font-semibold"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Memproses Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  <span>Jalankan Impor Staging</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
