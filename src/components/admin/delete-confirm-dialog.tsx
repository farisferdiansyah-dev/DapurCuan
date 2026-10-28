"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  recipeName?: string;
  itemName?: string;
  itemType?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  recipeName,
  itemName,
  itemType = "resep",
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  const targetName = itemName || recipeName || "item";
  const capitalizedType = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-card border shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 id="delete-dialog-title" className="text-base font-bold text-foreground">
              Hapus {capitalizedType}?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anda akan menghapus {itemType} <strong className="text-foreground">&quot;{targetName}&quot;</strong> dari daftar master data admin.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-warning">Catatan Sesi Simulasi:</span> Tindakan ini hanya menghapus data dari state frontend saat ini. Tidak ada database permanen yang terhapus (Phase 1).
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            onClick={onConfirm}
          >
            <Trash2 className="size-3.5" />
            <span>Hapus {capitalizedType}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
