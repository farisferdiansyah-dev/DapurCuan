"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeWithCost, RecipeCategory, RecipeStatus } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Archive,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Utensils,
  BookOpen,
  FileText,
  AlertTriangle,
  Info,
} from "lucide-react";
import { RecipeEditorDialog } from "./recipe-editor-dialog";
import { RecipePreviewDialog } from "./recipe-preview-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface RecipeManagementViewProps {
  initialRecipes: RecipeWithCost[];
}

export function RecipeManagementView({ initialRecipes }: RecipeManagementViewProps) {
  // Session Mock Recipes State
  const [recipes, setRecipes] = useState<RecipeWithCost[]>(initialRecipes);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<RecipeStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "name-asc" | "cost-asc" | "cost-desc">("newest");

  // Dialog States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeWithCost | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingRecipe, setPreviewingRecipe] = useState<RecipeWithCost | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState<RecipeWithCost | null>(null);

  // Feedback Notification Toast
  const [notification, setNotification] = useState<{ type: "success" | "info" | "warning"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = recipes.length;
    const published = recipes.filter((r) => r.status === "published").length;
    const draft = recipes.filter((r) => r.status === "draft").length;
    const archived = recipes.filter((r) => r.status === "archived").length;
    return { total, published, draft, archived };
  }, [recipes]);

  // Filtered & Sorted Recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        // Category filter
        if (selectedCategory !== "all" && r.category !== selectedCategory) return false;

        // Status filter
        if (selectedStatus !== "all" && r.status !== selectedStatus) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = r.name.toLowerCase().includes(q);
          const matchSlug = r.slug.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "cost-asc") {
          return a.total_shopping_cost - b.total_shopping_cost;
        }
        if (sortBy === "cost-desc") {
          return b.total_shopping_cost - a.total_shopping_cost;
        }
        // default newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [recipes, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Actions
  const handleOpenCreate = () => {
    setEditingRecipe(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (recipe: RecipeWithCost) => {
    setEditingRecipe(recipe);
    setIsEditorOpen(true);
  };

  const handleOpenPreview = (recipe: RecipeWithCost) => {
    setPreviewingRecipe(recipe);
    setIsPreviewOpen(true);
  };

  const handleOpenDelete = (recipe: RecipeWithCost) => {
    setDeletingRecipe(recipe);
    setIsDeleteOpen(true);
  };

  const handleSaveRecipe = (savedRecipe: RecipeWithCost, status: RecipeStatus) => {
    const isEditing = recipes.some((r) => r.id === savedRecipe.id);

    setRecipes((prev) => {
      if (isEditing) {
        return prev.map((r) => (r.id === savedRecipe.id ? savedRecipe : r));
      }
      return [savedRecipe, ...prev];
    });

    setIsEditorOpen(false);
    showToast(
      isEditing
        ? `Resep "${savedRecipe.name}" berhasil diperbarui dengan status ${status.toUpperCase()} (simulasi sesi).`
        : `Resep baru "${savedRecipe.name}" berhasil ditambahkan sebagai ${status.toUpperCase()} (simulasi sesi).`,
      "success"
    );
  };

  const handleTogglePublish = (recipe: RecipeWithCost) => {
    const nextStatus: RecipeStatus = recipe.status === "published" ? "draft" : "published";
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipe.id
          ? {
              ...r,
              status: nextStatus,
              published_at: nextStatus === "published" ? new Date().toISOString() : null,
            }
          : r
      )
    );
    showToast(
      `Status resep "${recipe.name}" diubah menjadi ${nextStatus.toUpperCase()} (simulasi sesi).`,
      nextStatus === "published" ? "success" : "info"
    );
  };

  const handleToggleArchive = (recipe: RecipeWithCost) => {
    const nextStatus: RecipeStatus = recipe.status === "archived" ? "draft" : "archived";
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipe.id
          ? {
              ...r,
              status: nextStatus,
            }
          : r
      )
    );
    showToast(
      `Resep "${recipe.name}" ${nextStatus === "archived" ? "diarsipkan" : "dipulihkan ke Draft"} (simulasi sesi).`,
      "info"
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingRecipe) return;
    setRecipes((prev) => prev.filter((r) => r.id !== deletingRecipe.id));
    setIsDeleteOpen(false);
    showToast(`Resep "${deletingRecipe.name}" telah dihapus dari daftar simulasi.`, "warning");
    setDeletingRecipe(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortBy("newest");
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
            notification.type === "success"
              ? "bg-success text-success-foreground border-success/40"
              : notification.type === "warning"
              ? "bg-destructive text-destructive-foreground border-destructive/40"
              : "bg-primary text-primary-foreground border-primary/40"
          }`}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Admin
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Resep</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Kelola Resep
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola koleksi resep DapurCuan, atur status draft/published, dan pantau kelengkapan data.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenCreate}
          className="gap-2 shadow-sm font-semibold shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Resep Baru</span>
        </Button>
      </div>

      {/* Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Simulasi Sesi Frontend:</strong> Penambahan, pengeditan, pengubahan status publikasi, dan penghapusan resep pada halaman ini berjalan di state memory sesi. Perubahan tidak tersimpan permanen ke database nyata karena backend baru akan dibangun di Phase 2.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Total Resep</span>
            <BookOpen className="size-3.5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
          <p className="text-[11px] text-muted-foreground">Seluruh data aktif di sistem</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Dipublikasikan</span>
            <Utensils className="size-3.5 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{metrics.published}</p>
          <p className="text-[11px] text-muted-foreground">Tampil di hasil pencarian publik</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Draft</span>
            <FileText className="size-3.5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">{metrics.draft}</p>
          <p className="text-[11px] text-muted-foreground">Sedang diedit / belum siap publish</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Diarsipkan</span>
            <Archive className="size-3.5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">{metrics.archived}</p>
          <p className="text-[11px] text-muted-foreground">Non-aktif dari rekomendasi</p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama atau slug..."
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as RecipeCategory | "all")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none capitalize"
            >
              <option value="all">Semua Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="camilan">Camilan</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as RecipeStatus | "all")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none capitalize"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
            >
              <option value="newest">Terbaru</option>
              <option value="name-asc">Nama (A-Z)</option>
              <option value="cost-asc">Biaya Terendah</option>
              <option value="cost-desc">Biaya Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Filter status summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>
            Menampilkan <strong>{filteredRecipes.length}</strong> dari <strong>{recipes.length}</strong> resep
          </span>
          {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all" || sortBy !== "newest") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary hover:underline font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Recipes Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 text-muted-foreground border-b uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="p-3.5 pl-4">Resep</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Porsi / Waktu</th>
                <th className="p-3.5">Biaya Belanja</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecipes.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  {/* Recipe Name & Image */}
                  <td className="p-3.5 pl-4">
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className="relative size-12 rounded-lg overflow-hidden bg-muted border shrink-0">
                        {r.image_url ? (
                          <Image src={r.image_url} alt={r.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="size-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{r.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground truncate">{r.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 whitespace-nowrap">
                    <Badge variant="outline" className="capitalize text-[11px]">
                      {r.category}
                    </Badge>
                  </td>

                  {/* Servings & Time */}
                  <td className="p-3.5 whitespace-nowrap text-muted-foreground">
                    <div>
                      <strong className="text-foreground">{r.base_servings}</strong> porsi
                    </div>
                    <div className="text-[11px]">
                      {r.prep_minutes + r.cook_minutes} mnt total
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="p-3.5 whitespace-nowrap">
                    <p className="font-bold text-foreground">
                      Rp {r.total_shopping_cost.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Rp {r.cost_per_serving.toLocaleString("id-ID")}/porsi
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5 whitespace-nowrap">
                    <Badge
                      variant={
                        r.status === "published"
                          ? "success"
                          : r.status === "draft"
                          ? "warning"
                          : "outline"
                      }
                      className="text-[11px] capitalize"
                    >
                      {r.status === "published"
                        ? "Published"
                        : r.status === "draft"
                        ? "Draft"
                        : "Archived"}
                    </Badge>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Preview Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenPreview(r)}
                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                        aria-label={`Pratinjau resep ${r.name}`}
                        title="Pratinjau Resep"
                      >
                        <Eye className="size-4" />
                      </Button>

                      {/* Edit Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(r)}
                        className="size-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                        aria-label={`Edit resep ${r.name}`}
                        title="Edit Resep"
                      >
                        <Edit3 className="size-4" />
                      </Button>

                      {/* Quick Publish / Unpublish Toggle */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(r)}
                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                        aria-label={r.status === "published" ? `Ubah ke draft ${r.name}` : `Publikasikan ${r.name}`}
                        title={r.status === "published" ? "Kembalikan ke Draft" : "Publikasikan"}
                      >
                        {r.status === "published" ? (
                          <RotateCcw className="size-3.5 text-warning" />
                        ) : (
                          <CheckCircle2 className="size-4 text-success" />
                        )}
                      </Button>

                      {/* Archive / Restore Toggle */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleArchive(r)}
                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                        aria-label={r.status === "archived" ? `Pulihkan ${r.name}` : `Arsipkan ${r.name}`}
                        title={r.status === "archived" ? "Pulihkan dari Arsip" : "Arsipkan Resep"}
                      >
                        <Archive className="size-3.5" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(r)}
                        className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label={`Hapus resep ${r.name}`}
                        title="Hapus Resep"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="size-10 mx-auto text-muted-foreground/40" />
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-base">Tidak Ada Resep yang Sesuai</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Tidak ditemukan resep dengan kata kunci atau filter status/kategori yang dipilih. Silakan ubah filter pencarian.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Semua Filter
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <RecipeEditorDialog
        recipe={editingRecipe}
        isOpen={isEditorOpen}
        onSave={handleSaveRecipe}
        onClose={() => setIsEditorOpen(false)}
      />

      <RecipePreviewDialog
        recipe={previewingRecipe}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      <DeleteConfirmDialog
        recipeName={deletingRecipe?.name ?? ""}
        isOpen={isDeleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
