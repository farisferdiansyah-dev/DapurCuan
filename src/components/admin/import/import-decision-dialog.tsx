"use client";

import { useState } from "react";
import type { ImportCandidate } from "@/types/import";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface ImportDecisionDialogProps {
  candidate: ImportCandidate | null;
  mode: "approve" | "reject" | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApprove: (candidateId: string, notes: string) => void;
  onConfirmReject: (candidateId: string, reason: string, notes: string) => void;
}

const REJECTION_REASONS = [
  "Duplikasi data dengan menu/bahan yang sudah ada di DapurCuan",
  "Lisensi data tidak terbuka / Pelanggaran hak cipta komersial (PRD 5.2)",
  "Data tidak lengkap (kurang langkah memasak, bahan, atau foto)",
  "Kualitas resep atau akurasi takaran tidak memenuhi standar",
  "Sumber data tidak dapat diverifikasi secara sah",
  "Lainnya",
];

export function ImportDecisionDialog({
  candidate,
  mode,
  isOpen,
  onClose,
  onConfirmApprove,
  onConfirmReject,
}: ImportDecisionDialogProps) {
  const [notes, setNotes] = useState("");
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customExplanation, setCustomExplanation] = useState("");
  const [confirmedLicense, setConfirmedLicense] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !candidate || !mode) return null;

  const isApprove = mode === "approve";

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate.is_license_compliant && !confirmedLicense) {
      setErrorMsg("Anda wajib mencentang konfirmasi pemenuhan lisensi sebelum menyetujui.");
      return;
    }
    setErrorMsg("");
    onConfirmApprove(candidate.id, notes.trim());
    onClose();
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReason === "Lainnya"
        ? customExplanation.trim() || "Ditolak oleh reviewer"
        : `${selectedReason}${customExplanation.trim() ? `: ${customExplanation.trim()}` : ""}`;

    if (!finalReason.trim()) {
      setErrorMsg("Alasan penolakan wajib diisi.");
      return;
    }
    setErrorMsg("");
    onConfirmReject(candidate.id, finalReason, notes.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decision-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`size-8 rounded-full flex items-center justify-center ${
                isApprove
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {isApprove ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
            </div>
            <div>
              <h2 id="decision-dialog-title" className="text-base font-bold text-foreground">
                {isApprove ? "Setujui Kandidat Impor" : "Tolak Kandidat Impor"}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                {candidate.title} ({candidate.external_id})
              </p>
            </div>
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
        <form
          onSubmit={isApprove ? handleApproveSubmit : handleRejectSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {errorMsg && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Context Info */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sumber Asal:</span>
              <span className="font-semibold text-foreground">{candidate.source_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lisensi Data:</span>
              <span className="font-semibold text-foreground">{candidate.license}</span>
            </div>
            {candidate.duplicate_check.is_duplicate && (
              <div className="flex items-center justify-between text-warning font-semibold">
                <span>Peringatan Duplikasi:</span>
                <span>{candidate.duplicate_check.similarity_score}% serupa</span>
              </div>
            )}
          </div>

          {/* Mode specific fields */}
          {isApprove ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dengan menyetujui kandidat ini, data akan disahkan ke status <strong>Approved</strong> dan siap ditransfer ke katalog master {candidate.type === "recipe" ? "resep" : "bahan"} DapurCuan.
              </p>

              {/* License Acknowledgement */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedLicense}
                  onChange={(e) => setConfirmedLicense(e.target.checked)}
                  className="mt-0.5 rounded border-muted text-primary focus:ring-primary"
                />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" />
                    Kepatuhan Hak Cipta &amp; Atribusi (PRD 5.2):
                  </span>
                  Saya mengonfirmasi bahwa data ini bersumber sah dari penyedia berlisensi terbuka atau domain publik, bukan hasil scraping tanpa izin.
                </div>
              </label>

              {/* Reviewer Notes */}
              <div className="space-y-1">
                <label htmlFor="approve-notes" className="text-xs font-semibold text-foreground">
                  Catatan Reviewer (Opsional)
                </label>
                <textarea
                  id="approve-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Takaran bahan lengkap, foto resolusi tinggi, siap masuk rilis mingguan."
                  className="w-full rounded-lg border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tolak kandidat impor yang terindikasi duplikat, tidak memenuhi standar kelengkapan, atau bersumber dari situs komersial tanpa izin lisensi terbuka.
              </p>

              {/* Category Reason Selection */}
              <div className="space-y-1">
                <label htmlFor="reject-category" className="text-xs font-semibold text-foreground">
                  Kategori Alasan Penolakan <span className="text-destructive">*</span>
                </label>
                <select
                  id="reject-category"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                >
                  {REJECTION_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-1">
                <label htmlFor="reject-detail" className="text-xs font-semibold text-foreground">
                  Penjelasan Detail untuk Tim / Audit Log <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="reject-detail"
                  rows={3}
                  value={customExplanation}
                  onChange={(e) => setCustomExplanation(e.target.value)}
                  placeholder="Tuliskan alasan penolakan secara spesifik..."
                  className="w-full rounded-lg border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Reviewer Notes */}
              <div className="space-y-1">
                <label htmlFor="reject-notes" className="text-xs font-semibold text-foreground">
                  Catatan Reviewer Tambahan (Opsional)
                </label>
                <input
                  id="reject-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tindak lanjut internal..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Session Disclaimer */}
          <div className="rounded-xl border border-muted bg-muted/20 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
            <FileText className="size-3.5 text-muted-foreground shrink-0" />
            <span>Keputusan impor disimpan dalam state sesi frontend DapurCuan (Phase 1).</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            {isApprove ? (
              <Button type="submit" size="sm" className="bg-success text-success-foreground hover:bg-success/90 gap-1.5 font-semibold">
                <CheckCircle2 className="size-4" />
                <span>Konfirmasi Setujui</span>
              </Button>
            ) : (
              <Button type="submit" size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5 font-semibold">
                <XCircle className="size-4" />
                <span>Konfirmasi Tolak</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
