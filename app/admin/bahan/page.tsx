import type { Metadata } from "next";
import { mockIngredientService } from "@/lib/services/ingredient-mock";
import { IngredientManagementView } from "@/components/admin/ingredient-management-view";

export const metadata: Metadata = {
  title: "Kelola Bahan & Harga | Admin DapurCuan",
  description: "Manajemen master bahan masakan, harga acuan pasar regional, dan simulasi dampak biaya resep DapurCuan.",
};

export default async function AdminBahanPage() {
  const initialIngredients = await mockIngredientService.getMasterIngredients();

  return <IngredientManagementView initialIngredients={initialIngredients} />;
}
