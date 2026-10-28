import { mockRecipeService } from "@/lib/services/mock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RecipeDetailView } from "@/components/recipe/recipe-detail-view";

interface RecipeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RecipeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await mockRecipeService.getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Resep Tidak Ditemukan | DapurCuan",
      description: "Resep yang Anda cari tidak ditemukan di DapurCuan.",
    };
  }

  return {
    title: `${recipe.name} - Resep Hemat & Praktis | DapurCuan`,
    description: `${recipe.description} Estimasi biaya belanja Rp ${recipe.total_shopping_cost.toLocaleString("id-ID")} untuk ${recipe.base_servings} porsi.`,
    openGraph: {
      title: `${recipe.name} | DapurCuan`,
      description: recipe.description,
      images: [
        {
          url: recipe.image_url,
          width: 1200,
          height: 630,
          alt: recipe.name,
        },
      ],
    },
  };
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await mockRecipeService.getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  // Ambil 3-4 resep serupa dalam kategori yang sama
  const searchResult = await mockRecipeService.searchRecipes({
    category: recipe.category,
    budget: 1000000,
    servings: recipe.base_servings,
  });

  const relatedRecipes = searchResult.data
    .filter((r) => r.id !== recipe.id)
    .slice(0, 4);

  return <RecipeDetailView recipe={recipe} relatedRecipes={relatedRecipes} />;
}
