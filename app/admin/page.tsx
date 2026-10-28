import { mockRecipeService } from "@/lib/services/mock";
import { mockIngredientService } from "@/lib/services/ingredient-mock";
import { mockImportService } from "@/lib/services/import-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, BookOpen, AlertTriangle, Layers } from "lucide-react";

export default async function AdminDashboardPage() {
  const allRecipes = await mockRecipeService.getAllRecipesForAdmin();
  const totalCount = allRecipes.length;
  const publishedCount = allRecipes.filter((r) => r.status === "published").length;
  const draftCount = allRecipes.filter((r) => r.status === "draft").length;

  const allIngredients = await mockIngredientService.getMasterIngredients();
  const staleCount = allIngredients.filter((i) => i.current_price.is_stale).length;

  const allCandidates = await mockImportService.getImportCandidates();
  const queueCount = allCandidates.filter(
    (c) => c.status === "needs_review" || c.status === "pending"
  ).length;

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Kelola resep, harga bahan, dan pantau status sistem DapurCuan.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Resep</CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Seluruh kategori ({draftCount} draft)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dipublikasikan</CardTitle>
            <Utensils className="size-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktif di halaman publik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Harga Bahan Kedaluwarsa</CardTitle>
            <AlertTriangle className="size-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staleCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Perlu pembaruan harga pasar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Antrean Impor</CardTitle>
            <Layers className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu kurasi dan review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links / Navigation */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        <a href="/admin/resep" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow block space-y-2">
          <h2 className="text-xl font-semibold">Kelola Resep</h2>
          <p className="text-sm text-muted-foreground">Tambah, ubah, publikasikan, atau arsipkan resep.</p>
        </a>
        <a href="/admin/bahan" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow block space-y-2">
          <h2 className="text-xl font-semibold">Bahan & Harga</h2>
          <p className="text-sm text-muted-foreground">Pantau harga pasar bahan makanan dan riwayat pembaruan.</p>
        </a>
        <a href="/admin/impor" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow block space-y-2">
          <h2 className="text-xl font-semibold">Tinjau Impor</h2>
          <p className="text-sm text-muted-foreground">Tinjau dan setujui data resep dari sumber eksternal.</p>
        </a>
      </div>
    </div>
  );
}
