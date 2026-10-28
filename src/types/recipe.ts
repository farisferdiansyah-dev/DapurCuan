// Recipe types
export interface Recipe {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: RecipeCategory;
  image_url: string;
  base_servings: number;
  prep_minutes: number;
  cook_minutes: number;
  difficulty: RecipeDifficulty;
  status: RecipeStatus;
  created_at: string;
  published_at: string | null;
}

export type RecipeCategory = "makanan" | "minuman" | "camilan";
export type RecipeDifficulty = "mudah" | "sedang" | "sulit";
export type RecipeStatus = "draft" | "published" | "archived";

// Ingredient types
export interface RecipeIngredient {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  prep_note?: string;
  price_per_unit?: number;
  package_quantity?: number;
  package_unit?: string;
  package_price?: number;
}

// Nutrition types
export interface Nutrition {
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  source: string;
  is_simulated?: boolean;
}

// Video types
export interface RecipeVideo {
  platform: "youtube" | "tiktok" | "instagram";
  video_id: string;
  url: string;
  is_verified: boolean;
  embed_allowed?: boolean;
  title?: string;
  channel_name?: string;
}

// Cost calculation types
export interface CostBreakdown {
  ingredient_id: string;
  ingredient_name: string;
  quantity_needed: number;
  unit: string;
  consumption_cost: number;
  shopping_cost: number;
  package_quantity: number;
  package_unit: string;
  package_price: number;
}

export interface RecipeWithCost extends Recipe {
  total_consumption_cost: number;
  total_shopping_cost: number;
  cost_per_serving: number;
  cost_status?: "simulasi" | "terverifikasi";
  scaled_servings?: number;
  ingredients: RecipeIngredient[];
  tools?: string[];
  steps?: string[];
  nutrition: Nutrition;
  video?: RecipeVideo;
}

// Search types
export interface SearchFilters {
  category: RecipeCategory;
  budget: number;
  servings: number;
  query?: string;
  taste_preferences?: string[];
  include_ingredients?: string[];
  exclude_ingredients?: string[];
  max_cooking_minutes?: number;
  difficulty?: RecipeDifficulty;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
