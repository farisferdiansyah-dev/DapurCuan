"use client";

import { useState, useMemo } from "react";
import type {
  ImportCandidate,
  ImportSource,
  ImportStatus,
  ImportType,
} from "@/types/import";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  ShieldAlert,
  Play,
  Eye,
  Columns,
} from "lucide-react";
import { ImportSideBySideDialog } from "./import-side-by-side-dialog";
import { ImportPreviewDialog } from "./import-preview-dialog";
import { ImportDecisionDialog } from "./import-decision-dialog";
import { TriggerImportDialog } from "./trigger-import-dialog";

interface ImportManagementViewProps {
  initialCandidates: ImportCandidate[];
  sources: ImportSource[];
}

export function ImportManagementView({
  initialCandidates,
  sources,
}: ImportManagementViewProps) {
  // Session State
  const [candidates, setCandidates] = useState<ImportCandidate[]>(initialCandidates);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ImportStatus | "all">("all");
  const [selectedType, setSelectedType] = useState<ImportType | "all">("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);

  // Modal Dialogs State
  const [isSideBySideOpen, setIsSideBySideOpen] = useState(false);
  const [sideBySideCandidate, setSideBySideCandidate] = useState<ImportCandidate | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCandidate, setPreviewCandidate] = useState<ImportCandidate | null>(null);

  const [decisionCandidate, setDecisionCandidate] = useState<ImportCandidate | null>(null);
  const [decisionMode, setDecisionMode] = useState<"approve" | "reject" | null>(null);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);

  const [isTriggerOpen, setIsTriggerOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = candidates.length;
    const needsReview = candidates.filter((c) => c.status === "needs_review").length;
    const pending = candidates.filter((c) => c.status === "pending").length;
    const approved = candidates.filter((c) => c.status === "approved").length;
    const rejected = candidates.filter((c) => c.status === "rejected").length;
    const duplicates = candidates.filter((c) => c.duplicate_check.is_duplicate).length;

    return { total, needsReview, pending, approved, rejected, duplicates };
  }, [candidates]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchExtId = c.external_id.toLowerCase().includes(q);
        const matchSource = c.source_name.toLowerCase().includes(q);
        if (!matchTitle && !matchExtId && !matchSource) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && c.status !== selectedStatus) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && c.type !== selectedType) {
        return false;
      }

      // Source filter
      if (selectedSource !== "all" && c.source_id !== selectedSource) {
        return false;
      }

      // Duplicate filter
      if (onlyDuplicates && !c.duplicate_check.is_duplicate) {
        return false;
      }

      return true;
    });
  }, [candidates, searchQuery, selectedStatus, selectedType, selectedSource, onlyDuplicates]);

  // Handlers for Approve and Reject
  const handleConfirmApprove = (candidateId: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: "Admin Reviewer",
          reviewer_notes: notes || "Disetujui untuk publikasi katalog.",
        };
      })
    );
    showToast("Kandidat berhasil disetujui (Approved) ke katalog mock.", "success");
  };

  const handleConfirmReject = (candidateId: string, reason: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: "Admin Reviewer",
          rejection_reason: reason,
          reviewer_notes: notes,
        };
      })
    );
    showToast("Kandidat telah ditolak (Rejected) dengan catatan penolakan.", "info");
  };

  const handleImportTriggered = (newCandidate: ImportCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
    showToast(`Data impor baru "${newCandidate.title}" masuk ke antrean Needs Review.`, "success");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedSource("all");
    setOnlyDuplicates(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-card border-success/30 text-success"
              : toast.type === "info"
              ? "bg-card border-primary/30 text-primary"
              : "bg-card border-warning/30 text-warning"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <Info className="size-5 shrink-0" />
          )}
          <span className="text-xs font-semibold text-foreground">{toast.message}</span>
        </div>
      )}

      {/* Header and Trigger Import CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
              Admin DapurCuan
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
              Data Simulasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tinjau &amp; Kurasi Antrean Impor
          </h1>
          <p className="text-sm text-muted-foreground">
            Verifikasi kandidat resep dan bahan masakan dari sumber data eksternal sebelum dipublikasikan.
          </p>
        </div>

        <Button
          onClick={() => setIsTriggerOpen(true)}
          className="gap-2 shrink-0 font-semibold shadow-sm"
        >
          <Play className="size-4" />
          <span>Jalankan Impor Baru</span>
        </Button>
      </div>

      {/* Legal & Policy Notice (PRD 5.2 Compliance) */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-1 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          <span>Kebijakan Lisensi &amp; Atribusi Impor (PRD Bab 5.2):</span>
        </div>
        <p>
          DapurCuan hanya mengizinkan impor resep dari sumber resmi atau dataset berlisensi terbuka (Creative Commons, Open Data Commons, atau Public Domain). <strong>Scraping tanpa izin dari situs berhak cipta dilarang keras.</strong> Kandidat berlisensi komersial (Proprietary) otomatis ditandai untuk ditolak.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Total Antrean
          </span>
          <div className="text-2xl font-bold text-foreground">{metrics.total}</div>
          <p className="text-[10px] text-muted-foreground">Kandidat staging</p>
        </div>

        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Needs Review
          </span>
          <div className="text-2xl font-bold text-primary">{metrics.needsReview}</div>
          <p className="text-[10px] text-muted-foreground">Perlu verifikasi</p>
        </div>

        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Pending
          </span>
          <div className="text-2xl font-bold text-muted-foreground">{metrics.pending}</div>
          <p className="text-[10px] text-muted-foreground">Dalam antrean</p>
        </div>

        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Disetujui
          </span>
          <div className="text-2xl font-bold text-success">{metrics.approved}</div>
          <p className="text-[10px] text-muted-foreground">Siap publikasi</p>
        </div>

        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Ditolak
          </span>
          <div className="text-2xl font-bold text-destructive">{metrics.rejected}</div>
          <p className="text-[10px] text-muted-foreground">Tidak lolos syarat</p>
        </div>

        <div className="rounded-2xl border bg-card p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Duplikat
          </span>
          <div className="text-2xl font-bold text-warning">{metrics.duplicates}</div>
          <p className="text-[10px] text-muted-foreground">Potensi tumpang tindih</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border bg-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari judul kandidat, ID eksternal, atau sumber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ImportStatus | "all")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none capitalize"
              aria-label="Filter status antrean"
            >
              <option value="all">Semua Status</option>
              <option value="needs_review">Needs Review</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ImportType | "all")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              aria-label="Filter tipe data"
            >
              <option value="all">Semua Tipe Data</option>
              <option value="recipe">Resep Masakan</option>
              <option value="ingredient">Bahan Pangan</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none truncate"
              aria-label="Filter sumber data"
            >
              <option value="all">Semua Sumber Data</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duplicate Quick Toggle & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={onlyDuplicates}
                onChange={(e) => setOnlyDuplicates(e.target.checked)}
                className="rounded border-muted text-warning focus:ring-warning"
              />
              <span>Tampilkan hanya yang terindikasi duplikat</span>
            </label>
            <span className="text-muted-foreground ml-2">
              Menampilkan <strong>{filteredCandidates.length}</strong> dari {candidates.length} kandidat
            </span>
          </div>

          {(searchQuery || selectedStatus !== "all" || selectedType !== "all" || selectedSource !== "all" || onlyDuplicates) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-primary hover:underline font-medium self-start sm:self-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                <th scope="col" className="p-3.5 pl-4">Kandidat &amp; ID Eksternal</th>
                <th scope="col" className="p-3.5">Tipe</th>
                <th scope="col" className="p-3.5">Sumber &amp; Lisensi</th>
                <th scope="col" className="p-3.5">Status &amp; Duplikasi</th>
                <th scope="col" className="p-3.5">Kelengkapan Data</th>
                <th scope="col" className="p-3.5 pr-4 text-center">Aksi Kurasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c) => {
                  const isStaleRejected = c.status === "rejected";
                  const isApproved = c.status === "approved";
                  const isNeedsReview = c.status === "needs_review";

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-muted/20 transition-colors ${
                        c.duplicate_check.is_duplicate ? "bg-warning/[0.02]" : ""
                      }`}
                    >
                      {/* Title & External ID */}
                      <td className="p-3.5 pl-4 font-medium text-foreground max-w-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm text-foreground truncate">{c.title}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span>ID: {c.external_id}</span>
                            <span>•</span>
                            <span>Batch: {c.batch_id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-3.5 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize text-[11px]">
                          {c.type === "recipe" ? "Resep" : "Bahan"}
                        </Badge>
                      </td>

                      {/* Source & License */}
                      <td className="p-3.5 max-w-xs space-y-1">
                        <p className="font-semibold text-foreground truncate">{c.source_name}</p>
                        <div className="flex items-center gap-1.5">
                          {c.is_license_compliant ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-success/10 text-success border-success/30 font-semibold gap-1"
                            >
                              <ShieldCheck className="size-3" />
                              <span>{c.license}</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-destructive/10 text-destructive border-destructive/30 font-semibold gap-1"
                            >
                              <ShieldAlert className="size-3" />
                              <span>{c.license} (Terbatas)</span>
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Status & Duplicate Check */}
                      <td className="p-3.5 space-y-1 whitespace-nowrap">
                        <div>
                          {isNeedsReview && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                              Needs Review
                            </Badge>
                          )}
                          {c.status === "pending" && (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Pending
                            </Badge>
                          )}
                          {isApproved && (
                            <Badge className="bg-success text-success-foreground text-[10px] font-bold">
                              Approved
                            </Badge>
                          )}
                          {isStaleRejected && (
                            <Badge className="bg-destructive text-destructive-foreground text-[10px] font-bold">
                              Rejected
                            </Badge>
                          )}
                        </div>

                        {c.duplicate_check.is_duplicate ? (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-warning">
                            <AlertTriangle className="size-3 shrink-0" />
                            <span>Duplikat ({c.duplicate_check.similarity_score}%)</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground">Unik (0% duplikasi)</div>
                        )}
                      </td>

                      {/* Validation Issues / Completeness */}
                      <td className="p-3.5">
                        {c.validation_issues.length === 0 ? (
                          <div className="flex items-center gap-1 text-success text-[11px] font-semibold">
                            <CheckCircle2 className="size-3.5" />
                            <span>Lengkap</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-destructive text-[11px] font-semibold">
                              <AlertTriangle className="size-3.5" />
                              <span>{c.validation_issues.length} catatan</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                              {c.validation_issues[0]?.message}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* Side-by-side Comparison */}
                          <button
                            type="button"
                            title="Tinjau & Bandingkan Side-by-Side"
                            aria-label={`Bandingkan data untuk ${c.title}`}
                            onClick={() => {
                              setSideBySideCandidate(c);
                              setIsSideBySideOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Columns className="size-3.5" />
                          </button>

                          {/* Preview Card */}
                          <button
                            type="button"
                            title="Pratinjau Hasil Impor"
                            aria-label={`Pratinjau ${c.title}`}
                            onClick={() => {
                              setPreviewCandidate(c);
                              setIsPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {/* Quick Decision Buttons (Only if pending or needs_review) */}
                          {c.status !== "approved" && (
                            <button
                              type="button"
                              title="Setujui Impor"
                              aria-label={`Setujui ${c.title}`}
                              disabled={!c.can_approve}
                              onClick={() => {
                                setDecisionCandidate(c);
                                setDecisionMode("approve");
                                setIsDecisionOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-success/30 bg-success/5 text-success hover:bg-success/15 transition-colors disabled:opacity-40"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </button>
                          )}

                          {c.status !== "rejected" && (
                            <button
                              type="button"
                              title="Tolak Kandidat"
                              aria-label={`Tolak ${c.title}`}
                              onClick={() => {
                                setDecisionCandidate(c);
                                setDecisionMode("reject");
                                setIsDecisionOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 transition-colors"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground space-y-2">
                    <p className="font-bold text-foreground text-sm">Tidak ada kandidat impor yang sesuai filter</p>
                    <p className="text-xs">
                      Ubah kata kunci pencarian atau bersihkan filter yang aktif.
                    </p>
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 text-xs">
                      Reset Filter
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Review Dialog */}
      <ImportSideBySideDialog
        candidate={sideBySideCandidate}
        isOpen={isSideBySideOpen}
        onClose={() => {
          setIsSideBySideOpen(false);
          setSideBySideCandidate(null);
        }}
        onApprove={(c) => {
          setDecisionCandidate(c);
          setDecisionMode("approve");
          setIsDecisionOpen(true);
        }}
        onReject={(c) => {
          setDecisionCandidate(c);
          setDecisionMode("reject");
          setIsDecisionOpen(true);
        }}
      />

      {/* Preview Dialog */}
      <ImportPreviewDialog
        candidate={previewCandidate}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewCandidate(null);
        }}
        onApprove={(c) => {
          setDecisionCandidate(c);
          setDecisionMode("approve");
          setIsDecisionOpen(true);
        }}
      />

      {/* Decision Dialog (Approve / Reject) */}
      <ImportDecisionDialog
        candidate={decisionCandidate}
        mode={decisionMode}
        isOpen={isDecisionOpen}
        onClose={() => {
          setIsDecisionOpen(false);
          setDecisionCandidate(null);
          setDecisionMode(null);
        }}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
      />

      {/* Trigger Import Dialog */}
      <TriggerImportDialog
        sources={sources}
        isOpen={isTriggerOpen}
        onClose={() => setIsTriggerOpen(false)}
        onImportTriggered={handleImportTriggered}
      />
    </div>
  );
}
