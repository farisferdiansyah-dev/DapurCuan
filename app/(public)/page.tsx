import { SearchForm } from "@/components/form/search-form";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { mockRecipeService } from "@/lib/services/mock";

export default async function HomePage() {
  // Ambil resep populer lintas kategori untuk homepage
  const popularRecipes = await mockRecipeService.getPopularRecipes(4);

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Masak Apa Hari Ini?</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sesuaikan dengan budgetmu! DapurCuan membantu kamu menemukan resep yang lezat dan terjangkau.
        </p>
      </section>

      {/* Search Section */}
      <section className="max-w-xl mx-auto">
        <SearchForm />
      </section>

      {/* Popular Recipes Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Resep Populer</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pilihan hidangan favorit komunitas dari berbagai kategori
          </p>
        </div>
        <RecipeGrid recipes={popularRecipes} />
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/50 rounded-2xl p-8 md:p-12 text-center space-y-8">
        <h2 className="text-2xl font-bold">Cara Kerja</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="font-bold text-lg">1. Masukkan Budget</div>
            <p className="text-sm text-muted-foreground">Tentukan berapa biaya belanja maksimalmu.</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold text-lg">2. Pilih Filter</div>
            <p className="text-sm text-muted-foreground">Kategori, porsi, dan bahan favorit.</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold text-lg">3. Masak Enak!</div>
            <p className="text-sm text-muted-foreground">Temukan resep terjangkau dan sehat.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
