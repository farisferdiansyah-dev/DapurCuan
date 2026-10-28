// Types for Master Ingredients & Regional Pricing

export type IngredientCategory =
  | "protein"
  | "sayuran"
  | "bumbu_dapur"
  | "sembako"
  | "buah"
  | "susu_olahan"
  | "lainnya";

export interface IngredientPrice {
  id: string;
  ingredient_id: string;
  region_code: string; // e.g. "ID", "ID-JKT", "ID-BDG", "ID-SBY"
  region_name: string; // e.g. "Nasional (ID)", "DKI Jakarta", "Bandung", "Surabaya"
  package_quantity: number;
  package_unit: string;
  package_price_idr: number;
  source: string;
  observed_at: string; // ISO date string (YYYY-MM-DD)
  is_stale: boolean; // True if observed_at > 30 days ago
}

export interface MasterIngredient {
  id: string;
  name: string;
  canonical_unit: string; // gram, ml, butir, buah, ikat, pack, sdm
  category: IngredientCategory;
  current_price: IngredientPrice;
  price_history: IngredientPrice[];
  created_at: string;
  updated_at: string;
}

export interface RecipeImpactSimulation {
  recipe_id: string;
  recipe_name: string;
  recipe_slug: string;
  category: string;
  base_servings: number;
  old_shopping_cost: number;
  new_shopping_cost: number;
  cost_difference: number;
  percentage_change: number;
}
