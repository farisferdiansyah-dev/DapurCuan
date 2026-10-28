"use client";

import { useState } from "react";
import type { MasterIngredient, IngredientPrice } from "@/types/ingredient";
import { REGIONS, checkIsPriceStale } from "@/lib/services/ingredient-mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  History,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";

interface PriceHistoryDialogProps {
  ingredient: MasterIngredient | null;
  isOpen: boolean;
  onClose: () => void;
  onAddObservation: (ingredientId: string, observation: IngredientPrice) => void;
}

export function PriceHistoryDialog({
  ingredient,
  isOpen,
  onClose,
  onAddObservation,
}: PriceHistoryDialogProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // New observation form state
  const [regionCode, setRegionCode] = useState("ID");
  const [packageQty, setPackageQty] = useState(1);
  const [packageUnit, setPackageUnit] = useState("pack");
  const [priceIdr, setPriceIdr] = useState(10000);
  const [source, setSource] = useState("Survei Pasar Tradisional");
  const [observedAt, setObservedAt] = useState("2026-10-28");
  const [formError, setFormError] = useState("");

  if (!isOpen || !ingredient) return null;

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();

    if (priceIdr <= 0) {
      setFormError("Harga harus lebih dari Rp 0");
      return;
    }
    if (!source.trim()) {
      setFormError("Sumber observasi wajib diisi");
      return;
    }

    const regionName = REGIONS.find((r) => r.code === regionCode)?.name ?? "Nasional (ID)";
    const isStale = checkIsPriceStale(observedAt);

    const newObservation: IngredientPrice = {
      id: `prc-${Date.now()}`,
      ingredient_id: ingredient.id,
      region_code: regionCode,
      region_name: regionName,
      package_quantity: packageQty,
      package_unit: packageUnit,
      package_price_idr: priceIdr,
      source: source.trim(),
      observed_at: observedAt,
      is_stale: isStale,
    };

    onAddObservation(ingredient.id, newObservation);
    setShowAddForm(false);
    setFormError("");
  };

  const history = ingredient.price_history || [ingredient.current_price];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-history-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-1">
                <History className="size-3" />
                Riwayat Harga Pasar
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                Data Simulasi
              </span>
            </div>
            <h2 id="price-history-title" className="text-lg font-bold text-foreground truncate">
              {ingredient.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup dialog riwayat"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Bar with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Daftar Observasi &amp; Catatan Harga Acuan
              </p>
              <p className="text-[11px] text-muted-foreground">
                Harga dianggap kedaluwarsa jika observasi dilakukan lebih dari 30 hari yang lalu.
              </p>
            </div>
            {!showAddForm && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() => {
                  setPackageQty(ingredient.current_price.package_quantity);
                  setPackageUnit(ingredient.current_price.package_unit);
                  setPriceIdr(ingredient.current_price.package_price_idr);
                  setRegionCode(ingredient.current_price.region_code);
                  setShowAddForm(true);
                }}
              >
                <Plus className="size-3.5" />
                <span>Catat Observasi</span>
              </Button>
            )}
          </div>

          {/* Form to Add New Observation (Collapsible) */}
          {showAddForm && (
            <form
              onSubmit={handleCreateObservation}
              className="rounded-xl border bg-muted/30 p-4 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Input Observasi Harga Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Batal
                </button>
              </div>

              {formError && (
                <p className="text-xs text-destructive font-semibold">{formError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="obs-region" className="text-xs font-semibold text-foreground">
                    Wilayah
                  </label>
                  <select
                    id="obs-region"
                    value={regionCode}
                    onChange={(e) => setRegionCode(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="obs-qty" className="text-xs font-semibold text-foreground">
                    Ukuran &amp; Satuan Kemasan
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="obs-qty"
                      type="number"
                      min={0.01}
                      step="any"
                      value={packageQty}
                      onChange={(e) => setPackageQty(parseFloat(e.target.value) || 1)}
                      className="w-16 rounded-lg border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      value={packageUnit}
                      onChange={(e) => setPackageUnit(e.target.value)}
                      placeholder="kg / pack"
                      className="flex-1 rounded-lg border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="obs-price" className="text-xs font-semibold text-foreground">
                    Harga Acuan (Rp)
                  </label>
                  <input
                    id="obs-price"
                    type="number"
                    min={100}
                    step={500}
                    value={priceIdr}
                    onChange={(e) => setPriceIdr(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="obs-source" className="text-xs font-semibold text-foreground">
                    Sumber Data Acuan
                  </label>
                  <input
                    id="obs-source"
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Contoh: PIHPS Nasional / Pasar Tradisional"
                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="obs-date" className="text-xs font-semibold text-foreground">
                    Tanggal Observasi
                  </label>
                  <input
                    id="obs-date"
                    type="date"
                    value={observedAt}
                    onChange={(e) => setObservedAt(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" className="gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>Simpan Observasi</span>
                </Button>
              </div>
            </form>
          )}

          {/* History Timeline Table */}
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground font-semibold">
                  <th scope="col" className="p-3">Tanggal</th>
                  <th scope="col" className="p-3">Wilayah</th>
                  <th scope="col" className="p-3">Kemasan Acuan</th>
                  <th scope="col" className="p-3 text-right">Harga Paket</th>
                  <th scope="col" className="p-3">Sumber &amp; Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((obs, idx) => {
                  const isStale = checkIsPriceStale(obs.observed_at);
                  const isCurrent = idx === 0;

                  return (
                    <tr
                      key={obs.id || idx}
                      className={`hover:bg-muted/20 transition-colors ${
                        isCurrent ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <td className="p-3 whitespace-nowrap font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          <span>{obs.observed_at}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                              Terkini
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground" />
                          <span>{obs.region_name || obs.region_code}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {obs.package_quantity} {obs.package_unit}
                      </td>
                      <td className="p-3 text-right font-bold text-foreground whitespace-nowrap">
                        Rp {obs.package_price_idr.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="text-[11px] text-muted-foreground">{obs.source}</div>
                        <div>
                          {isStale ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-warning/10 text-warning border-warning/30 font-semibold gap-1"
                            >
                              <AlertTriangle className="size-3" />
                              <span>Kedaluwarsa (&gt;30 hari)</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-success/10 text-success border-success/30 font-semibold gap-1"
                            >
                              <Clock className="size-3" />
                              <span>Harga Segar</span>
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t bg-muted/20 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
