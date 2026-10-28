import type { Metadata } from "next";
import { mockRecipeService } from "@/lib/services/mock";
import { RecipeManagementView } from "@/components/admin/recipe-management-view";

export const metadata: Metadata = {
  title: "Kelola Resep | Admin DapurCuan",
  description: "Manajemen katalog resep masakan, minuman, dan camilan DapurCuan.",
};

export default async function AdminRecipesPage() {
  const initialRecipes = await mockRecipeService.getAllRecipesForAdmin();

  return <RecipeManagementView initialRecipes={initialRecipes} />;
}
