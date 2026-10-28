"use client";

import { useState, useMemo } from "react";
import type { MasterIngredient, IngredientCategory, IngredientPrice } from "@/types/ingredient";
import { REGIONS, CATEGORIES, checkIsPriceStale } from "@/lib/services/ingredient-mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  History,
  TrendingUp,
  Clock,
  MapPin,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { IngredientEditorDialog } from "./ingredient-editor-dialog";
import { IngredientImpactDialog } from "./ingredient-impact-dialog";
import { PriceHistoryDialog } from "./price-history-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface IngredientManagementViewProps {
  initialIngredients: MasterIngredient[];
}

type SortOption = "name-asc" | "price-asc" | "price-desc" | "newest";

export function IngredientManagementView({
  initialIngredients,
}: IngredientManagementViewProps) {
  // Session Mock State
  const [ingredients, setIngredients] = useState<MasterIngredient[]>(initialIngredients);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | "all">("all");
  const [selectedFreshness, setSelectedFreshness] = useState<"all" | "fresh" | "stale">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  // Modal Dialogs
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<MasterIngredient | null>(null);

  const [isImpactOpen, setIsImpactOpen] = useState(false);
  const [impactIngredient, setImpactIngredient] = useState<MasterIngredient | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyIngredient, setHistoryIngredient] = useState<MasterIngredient | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingIngredient, setDeletingIngredient] = useState<MasterIngredient | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const total = ingredients.length;
    let freshCount = 0;
    let staleCount = 0;
    const catSet = new Set<string>();

    for (const ing of ingredients) {
      catSet.add(ing.category);
      const isStale = checkIsPriceStale(ing.current_price.observed_at);
      if (isStale) {
        staleCount++;
      } else {
        freshCount++;
      }
    }

    return {
      total,
      freshCount,
      staleCount,
      categoryCount: catSet.size,
    };
  }, [ingredients]);

  // Filtered and Sorted Ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((ing) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = ing.name.toLowerCase().includes(q);
          const matchCat = ing.category.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== "all" && ing.category !== selectedCategory) {
          return false;
        }

        // Freshness / Stale filter
        const isStale = checkIsPriceStale(ing.current_price.observed_at);
        if (selectedFreshness === "fresh" && isStale) return false;
        if (selectedFreshness === "stale" && !isStale) return false;

        // Region filter
        if (selectedRegion !== "all" && ing.current_price.region_code !== selectedRegion) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "price-asc") {
          return a.current_price.package_price_idr - b.current_price.package_price_idr;
        }
        if (sortBy === "price-desc") {
          return b.current_price.package_price_idr - a.current_price.package_price_idr;
        }
        if (sortBy === "newest") {
          return new Date(b.current_price.observed_at).getTime() - new Date(a.current_price.observed_at).getTime();
        }
        return 0;
      });
  }, [ingredients, searchQuery, selectedCategory, selectedFreshness, selectedRegion, sortBy]);

  // Handlers
  const handleSaveIngredient = (saved: MasterIngredient) => {
    setIngredients((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });

    setIsEditorOpen(false);
    setEditingIngredient(null);
    showToast(`Bahan "${saved.name}" berhasil disimpan ke mock state.`);
  };

  const handleApplySimulatedPrice = (ingredientId: string, newPriceIdr: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== ingredientId) return ing;
        const updatedCurrent: IngredientPrice = {
          ...ing.current_price,
          package_price_idr: newPriceIdr,
          observed_at: "2026-10-28",
          is_stale: false,
        };
        return {
          ...ing,
          current_price: updatedCurrent,
          price_history: [updatedCurrent, ...ing.price_history],
          updated_at: new Date().toISOString(),
        };
      })
    );
    showToast(`Harga simulasi baru Rp ${newPriceIdr.toLocaleString("id-ID")} diterapkan pada bahan.`);
  };

  const handleAddObservation = (ingredientId: string, newObservation: IngredientPrice) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== ingredientId) return ing;
        return {
          ...ing,
          current_price: newObservation,
          price_history: [newObservation, ...(ing.price_history || [])],
          updated_at: new Date().toISOString(),
        };
      })
    );

    // Update history modal if currently opened
    if (historyIngredient && historyIngredient.id === ingredientId) {
      setHistoryIngredient((prev) =>
        prev
          ? {
              ...prev,
              current_price: newObservation,
              price_history: [newObservation, ...(prev.price_history || [])],
            }
          : null
      );
    }

    showToast(`Observasi harga baru Rp ${newObservation.package_price_idr.toLocaleString("id-ID")} dicatat.`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingIngredient) return;
    const name = deletingIngredient.name;
    setIngredients((prev) => prev.filter((i) => i.id !== deletingIngredient.id));
    setIsDeleteOpen(false);
    setDeletingIngredient(null);
    showToast(`Bahan "${name}" dihapus dari sesi frontend.`, "info");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedFreshness("all");
    setSelectedRegion("all");
    setSortBy("name-asc");
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

      {/* Header & Simulation Notice */}
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
            Kelola Bahan &amp; Harga Acuan
          </h1>
          <p className="text-sm text-muted-foreground">
            Katalog master bahan masakan, harga acuan regional, dan simulasi dampak biaya resep.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingIngredient(null);
            setIsEditorOpen(true);
          }}
          className="gap-2 shrink-0 font-semibold shadow-sm"
        >
          <Plus className="size-4" />
          <span>Tambah Bahan Baru</span>
        </Button>
      </div>

      {/* Legal & Stale Warnings */}
      <div className="space-y-3">
        {metrics.staleCount > 0 && (
          <div className="p-3.5 rounded-xl border border-warning/30 bg-warning/10 text-xs text-foreground flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 text-warning shrink-0" />
              <span>
                Terdapat <strong>{metrics.staleCount} bahan</strong> dengan harga acuan lebih dari 30 hari (kedaluwarsa). Perbarui data observasi untuk menjaga akurasi estimasi resep.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFreshness("stale")}
              className="text-xs h-7 shrink-0 border-warning/40 hover:bg-warning/20"
            >
              Lihat Bahan Kedaluwarsa
            </Button>
          </div>
        )}

        <div className="p-3 rounded-xl border bg-muted/20 text-xs text-muted-foreground flex items-start gap-2.5">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Catatan Sesi Simulasi:</strong> Harga bahan merupakan data estimasi/simulasi untuk menghitung kebutuhan belanja resep DapurCuan. Tidak diklaim sebagai harga pasar aktual terverifikasi resmi. Perubahan data disimpan dalam state memori sesi frontend (Phase 1).
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bahan</span>
            <ShoppingBag className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{metrics.total}</div>
          <p className="text-[11px] text-muted-foreground">Master bahan makanan</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Harga Segar</span>
            <Clock className="size-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">{metrics.freshCount}</div>
          <p className="text-[11px] text-muted-foreground">Tercatat &lt;= 30 hari</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Kedaluwarsa</span>
            <AlertTriangle className="size-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">{metrics.staleCount}</div>
          <p className="text-[11px] text-muted-foreground">Perlu pembaruan (&gt; 30 hari)</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Kategori</span>
            <Layers className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{metrics.categoryCount}</div>
          <p className="text-[11px] text-muted-foreground">Kelompok bahan pangan</p>
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
              placeholder="Cari nama bahan pangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as IngredientCategory | "all")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              aria-label="Filter kategori bahan"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Freshness Filter */}
          <div>
            <select
              value={selectedFreshness}
              onChange={(e) => setSelectedFreshness(e.target.value as "all" | "fresh" | "stale")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              aria-label="Filter kesegaran harga"
            >
              <option value="all">Semua Status Harga</option>
              <option value="fresh">Harga Segar (&lt;= 30 hari)</option>
              <option value="stale">Kedaluwarsa (&gt; 30 hari)</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              aria-label="Filter wilayah"
            >
              <option value="all">Semua Wilayah</option>
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom Sorting & Reset Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border bg-background px-2.5 py-1 text-xs focus:border-primary focus:outline-none"
              aria-label="Urutkan daftar bahan"
            >
              <option value="name-asc">Nama (A-Z)</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="newest">Terakhir Diperbarui</option>
            </select>
            <span className="text-muted-foreground ml-2">
              Menampilkan <strong>{filteredIngredients.length}</strong> dari {ingredients.length} bahan
            </span>
          </div>

          {(searchQuery || selectedCategory !== "all" || selectedFreshness !== "all" || selectedRegion !== "all" || sortBy !== "name-asc") && (
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

      {/* Ingredients Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                <th scope="col" className="p-3.5 pl-4">Bahan Masakan</th>
                <th scope="col" className="p-3.5">Kategori</th>
                <th scope="col" className="p-3.5">Kemasan Acuan</th>
                <th scope="col" className="p-3.5 text-right">Harga Acuan</th>
                <th scope="col" className="p-3.5">Wilayah</th>
                <th scope="col" className="p-3.5">Status &amp; Observasi</th>
                <th scope="col" className="p-3.5 pr-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => {
                  const isStale = checkIsPriceStale(item.current_price.observed_at);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Name & Canonical Unit */}
                      <td className="p-3.5 pl-4 font-medium text-foreground">
                        <div>
                          <p className="font-bold text-sm text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Satuan standar: <span className="font-semibold text-foreground">{item.canonical_unit}</span>
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-muted-foreground capitalize">
                          {item.category.replace("_", " ")}
                        </span>
                      </td>

                      {/* Package info */}
                      <td className="p-3.5 text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {item.current_price.package_quantity} {item.current_price.package_unit}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {item.current_price.source}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 text-right">
                        <div className="font-bold text-sm text-foreground">
                          Rp {item.current_price.package_price_idr.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Simulasi
                        </div>
                      </td>

                      {/* Region */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <MapPin className="size-3 text-muted-foreground" />
                          <span>{item.current_price.region_name || item.current_price.region_code}</span>
                        </div>
                      </td>

                      {/* Date & Stale Status */}
                      <td className="p-3.5 whitespace-nowrap space-y-1">
                        <div className="text-[11px] text-muted-foreground font-medium">
                          {item.current_price.observed_at}
                        </div>
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

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* Simulasi Dampak Biaya Resep */}
                          <button
                            type="button"
                            title="Simulasi Dampak Biaya Resep"
                            aria-label={`Simulasi dampak biaya resep untuk ${item.name}`}
                            onClick={() => {
                              setImpactIngredient(item);
                              setIsImpactOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <TrendingUp className="size-3.5" />
                          </button>

                          {/* Riwayat Harga */}
                          <button
                            type="button"
                            title="Riwayat Observasi Harga"
                            aria-label={`Riwayat observasi harga untuk ${item.name}`}
                            onClick={() => {
                              setHistoryIngredient(item);
                              setIsHistoryOpen(true);
                            }}
                            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <History className="size-3.5" />
                          </button>

                          {/* Edit Bahan */}
                          <button
                            type="button"
                            title="Edit Bahan &amp; Harga"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => {
                              setEditingIngredient(item);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit3 className="size-3.5" />
                          </button>

                          {/* Hapus Bahan */}
                          <button
                            type="button"
                            title="Hapus Bahan"
                            aria-label={`Hapus ${item.name}`}
                            onClick={() => {
                              setDeletingIngredient(item);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 rounded-lg border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground space-y-2">
                    <p className="font-bold text-foreground text-sm">Tidak ada bahan yang sesuai filter</p>
                    <p className="text-xs">
                      Coba ganti kata kunci pencarian atau bersihkan filter yang aktif.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="mt-2 text-xs"
                    >
                      Reset Filter
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingredient Editor Dialog */}
      <IngredientEditorDialog
        ingredient={editingIngredient}
        isOpen={isEditorOpen}
        onSave={handleSaveIngredient}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingIngredient(null);
        }}
      />

      {/* Recipe Impact Simulation Dialog */}
      <IngredientImpactDialog
        ingredient={impactIngredient}
        isOpen={isImpactOpen}
        onClose={() => {
          setIsImpactOpen(false);
          setImpactIngredient(null);
        }}
        onApplyNewPrice={handleApplySimulatedPrice}
      />

      {/* Price History Dialog */}
      <PriceHistoryDialog
        ingredient={historyIngredient}
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setHistoryIngredient(null);
        }}
        onAddObservation={handleAddObservation}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        itemName={deletingIngredient?.name}
        itemType="bahan makanan"
        isOpen={isDeleteOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingIngredient(null);
        }}
      />
    </div>
  );
}
