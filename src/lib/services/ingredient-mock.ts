import type {
  MasterIngredient,
  IngredientCategory,
  RecipeImpactSimulation,
} from "@/types/ingredient";
import { mockRecipeService } from "./mock";

// Stale threshold is 30 days
const CURRENT_DATE = new Date("2026-10-28T00:00:00Z");

export function checkIsPriceStale(observedAtDateString: string): boolean {
  const observedDate = new Date(observedAtDateString);
  const diffTime = CURRENT_DATE.getTime() - observedDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 30;
}

export const REGIONS = [
  { code: "ID", name: "Nasional (Acuan Indonesia)" },
  { code: "ID-JKT", name: "DKI Jakarta (Jabodetabek)" },
  { code: "ID-BDG", name: "Bandung (Jawa Barat)" },
  { code: "ID-SBY", name: "Surabaya (Jawa Timur)" },
];

export const CATEGORIES: { value: IngredientCategory; label: string }[] = [
  { value: "protein", label: "Protein & Daging" },
  { value: "sayuran", label: "Sayuran Segar" },
  { value: "bumbu_dapur", label: "Bumbu & Rempah" },
  { value: "sembako", label: "Sembako & Tepung" },
  { value: "buah", label: "Buah-buahan" },
  { value: "susu_olahan", label: "Susu & Olahan" },
  { value: "lainnya", label: "Lainnya" },
];

export const mockMasterIngredients: MasterIngredient[] = [
  {
    id: "ing-egg",
    name: "Telur Ayam Negeri",
    canonical_unit: "butir",
    category: "protein",
    current_price: {
      id: "prc-egg-1",
      ingredient_id: "ing-egg",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 2,
      package_unit: "pack (2 butir)",
      package_price_idr: 5000,
      source: "Survei Pasar Tradisional",
      observed_at: "2026-10-20",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-egg-1",
        ingredient_id: "ing-egg",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 2,
        package_unit: "pack (2 butir)",
        package_price_idr: 5000,
        source: "Survei Pasar Tradisional",
        observed_at: "2026-10-20",
        is_stale: false,
      },
      {
        id: "prc-egg-0",
        ingredient_id: "ing-egg",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 2,
        package_unit: "pack (2 butir)",
        package_price_idr: 4500,
        source: "Survei Pasar Tradisional",
        observed_at: "2026-09-10",
        is_stale: true,
      },
    ],
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-10-20T10:00:00Z",
  },
  {
    id: "ing-chicken",
    name: "Daging Ayam Fillet",
    canonical_unit: "gram",
    category: "protein",
    current_price: {
      id: "prc-chk-1",
      ingredient_id: "ing-chicken",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 250,
      package_unit: "gram",
      package_price_idr: 15000,
      source: "Pasar Rakyat & Supermarket",
      observed_at: "2026-10-18",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-chk-1",
        ingredient_id: "ing-chicken",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 250,
        package_unit: "gram",
        package_price_idr: 15000,
        source: "Pasar Rakyat & Supermarket",
        observed_at: "2026-10-18",
        is_stale: false,
      },
    ],
    created_at: "2026-01-12T08:00:00Z",
    updated_at: "2026-10-18T09:00:00Z",
  },
  {
    id: "ing-beef",
    name: "Daging Sapi Gandik / Sengkel",
    canonical_unit: "gram",
    category: "protein",
    current_price: {
      id: "prc-beef-1",
      ingredient_id: "ing-beef",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 250,
      package_unit: "gram",
      package_price_idr: 35000,
      source: "RPA Pasar Induk",
      observed_at: "2026-10-12",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-beef-1",
        ingredient_id: "ing-beef",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 250,
        package_unit: "gram",
        package_price_idr: 35000,
        source: "RPA Pasar Induk",
        observed_at: "2026-10-12",
        is_stale: false,
      },
    ],
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-10-12T08:30:00Z",
  },
  {
    id: "ing-fish",
    name: "Ikan Kembung Segar",
    canonical_unit: "gram",
    category: "protein",
    current_price: {
      id: "prc-fish-1",
      ingredient_id: "ing-fish",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 500,
      package_unit: "gram (2-3 ekor)",
      package_price_idr: 20000,
      source: "Tempat Pelelangan Ikan / Pasar",
      observed_at: "2026-10-15",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-fish-1",
        ingredient_id: "ing-fish",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 500,
        package_unit: "gram (2-3 ekor)",
        package_price_idr: 20000,
        source: "Tempat Pelelangan Ikan / Pasar",
        observed_at: "2026-10-15",
        is_stale: false,
      },
    ],
    created_at: "2026-02-01T08:00:00Z",
    updated_at: "2026-10-15T09:00:00Z",
  },
  {
    id: "ing-tempeh",
    name: "Tempe Kedelai",
    canonical_unit: "papan",
    category: "protein",
    current_price: {
      id: "prc-tem-1",
      ingredient_id: "ing-tempeh",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1,
      package_unit: "papan (200g)",
      package_price_idr: 6000,
      source: "Pengrajin Tempe Pasar",
      observed_at: "2026-10-22",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-tem-1",
        ingredient_id: "ing-tempeh",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1,
        package_unit: "papan (200g)",
        package_price_idr: 6000,
        source: "Pengrajin Tempe Pasar",
        observed_at: "2026-10-22",
        is_stale: false,
      },
    ],
    created_at: "2026-02-05T08:00:00Z",
    updated_at: "2026-10-22T08:00:00Z",
  },
  {
    id: "ing-tofu",
    name: "Tahu Putih Sutra",
    canonical_unit: "kotak",
    category: "protein",
    current_price: {
      id: "prc-tofu-1",
      ingredient_id: "ing-tofu",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1,
      package_unit: "kotak (200g)",
      package_price_idr: 5000,
      source: "Pasar Tradisional",
      observed_at: "2026-10-22",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-tofu-1",
        ingredient_id: "ing-tofu",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1,
        package_unit: "kotak (200g)",
        package_price_idr: 5000,
        source: "Pasar Tradisional",
        observed_at: "2026-10-22",
        is_stale: false,
      },
    ],
    created_at: "2026-02-05T08:00:00Z",
    updated_at: "2026-10-22T08:00:00Z",
  },
  {
    id: "ing-rice",
    name: "Beras Putih Pulen",
    canonical_unit: "gram",
    category: "sembako",
    current_price: {
      id: "prc-rice-1",
      ingredient_id: "ing-rice",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1000,
      package_unit: "kg",
      package_price_idr: 15000,
      source: "Katalog Harga Pangan Bapanas",
      observed_at: "2026-10-10",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-rice-1",
        ingredient_id: "ing-rice",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1000,
        package_unit: "kg",
        package_price_idr: 15000,
        source: "Katalog Harga Pangan Bapanas",
        observed_at: "2026-10-10",
        is_stale: false,
      },
    ],
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-10-10T09:00:00Z",
  },
  {
    id: "ing-shallot",
    name: "Bawang Merah Brebes",
    canonical_unit: "gram",
    category: "bumbu_dapur",
    current_price: {
      id: "prc-shal-1",
      ingredient_id: "ing-shallot",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 250,
      package_unit: "bungkus (250g)",
      package_price_idr: 8000,
      source: "Pasar Induk Kramat Jati",
      observed_at: "2026-10-14",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-shal-1",
        ingredient_id: "ing-shallot",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 250,
        package_unit: "bungkus (250g)",
        package_price_idr: 8000,
        source: "Pasar Induk Kramat Jati",
        observed_at: "2026-10-14",
        is_stale: false,
      },
    ],
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-10-14T09:00:00Z",
  },
  {
    id: "ing-garlic",
    name: "Bawang Putih Kating",
    canonical_unit: "gram",
    category: "bumbu_dapur",
    current_price: {
      id: "prc-gar-1",
      ingredient_id: "ing-garlic",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 250,
      package_unit: "bungkus (250g)",
      package_price_idr: 9000,
      source: "Pasar Tradisional",
      observed_at: "2026-10-14",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-gar-1",
        ingredient_id: "ing-garlic",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 250,
        package_unit: "bungkus (250g)",
        package_price_idr: 9000,
        source: "Pasar Tradisional",
        observed_at: "2026-10-14",
        is_stale: false,
      },
    ],
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-10-14T09:00:00Z",
  },
  {
    id: "ing-oil",
    name: "Minyak Goreng Sawit",
    canonical_unit: "ml",
    category: "sembako",
    current_price: {
      id: "prc-oil-1",
      ingredient_id: "ing-oil",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1000,
      package_unit: "liter",
      package_price_idr: 17500,
      source: "Katalog Ritel Modern",
      observed_at: "2026-10-01",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-oil-1",
        ingredient_id: "ing-oil",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1000,
        package_unit: "liter",
        package_price_idr: 17500,
        source: "Katalog Ritel Modern",
        observed_at: "2026-10-01",
        is_stale: false,
      },
    ],
    created_at: "2026-01-05T08:00:00Z",
    updated_at: "2026-10-01T08:00:00Z",
  },
  // CONTOH HARGA STALE / KEDALUWARSA (> 30 hari dari 2026-10-28)
  {
    id: "ing-sweet-soy",
    name: "Kecap Manis Kedelai Hitam",
    canonical_unit: "ml",
    category: "bumbu_dapur",
    current_price: {
      id: "prc-soy-old",
      ingredient_id: "ing-sweet-soy",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 220,
      package_unit: "botol (220ml)",
      package_price_idr: 9500,
      source: "Katalog Grosir Lama",
      observed_at: "2026-09-15", // 43 hari lalu -> STALE (> 30 hari)
      is_stale: true,
    },
    price_history: [
      {
        id: "prc-soy-old",
        ingredient_id: "ing-sweet-soy",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 220,
        package_unit: "botol (220ml)",
        package_price_idr: 9500,
        source: "Katalog Grosir Lama",
        observed_at: "2026-09-15",
        is_stale: true,
      },
    ],
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-09-15T08:00:00Z",
  },
  {
    id: "ing-spinach",
    name: "Daun Bayam Hijau Segar",
    canonical_unit: "ikat",
    category: "sayuran",
    current_price: {
      id: "prc-spn-1",
      ingredient_id: "ing-spinach",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1,
      package_unit: "ikat sedang",
      package_price_idr: 3000,
      source: "Petani Pasar Subuh",
      observed_at: "2026-10-24",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-spn-1",
        ingredient_id: "ing-spinach",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1,
        package_unit: "ikat sedang",
        package_price_idr: 3000,
        source: "Petani Pasar Subuh",
        observed_at: "2026-10-24",
        is_stale: false,
      },
    ],
    created_at: "2026-02-15T08:00:00Z",
    updated_at: "2026-10-24T08:00:00Z",
  },
  {
    id: "ing-carrot",
    name: "Wortel Brastagi",
    canonical_unit: "gram",
    category: "sayuran",
    current_price: {
      id: "prc-crt-stale",
      ingredient_id: "ing-carrot",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 500,
      package_unit: "bungkus (500g)",
      package_price_idr: 7000,
      source: "Survei Lama Pasar",
      observed_at: "2026-08-20", // 69 hari lalu -> STALE (> 30 hari)
      is_stale: true,
    },
    price_history: [
      {
        id: "prc-crt-stale",
        ingredient_id: "ing-carrot",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 500,
        package_unit: "bungkus (500g)",
        package_price_idr: 7000,
        source: "Survei Lama Pasar",
        observed_at: "2026-08-20",
        is_stale: true,
      },
    ],
    created_at: "2026-02-15T08:00:00Z",
    updated_at: "2026-08-20T08:00:00Z",
  },
  {
    id: "ing-palm-sugar",
    name: "Gula Aren Asli Murni",
    canonical_unit: "gram",
    category: "bumbu_dapur",
    current_price: {
      id: "prc-psg-stale",
      ingredient_id: "ing-palm-sugar",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 250,
      package_unit: "balok (250g)",
      package_price_idr: 12000,
      source: "Pasar Tradisional",
      observed_at: "2026-09-01", // 57 hari lalu -> STALE (> 30 hari)
      is_stale: true,
    },
    price_history: [
      {
        id: "prc-psg-stale",
        ingredient_id: "ing-palm-sugar",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 250,
        package_unit: "balok (250g)",
        package_price_idr: 12000,
        source: "Pasar Tradisional",
        observed_at: "2026-09-01",
        is_stale: true,
      },
    ],
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "ing-milk",
    name: "Susu UHT Plain",
    canonical_unit: "ml",
    category: "susu_olahan",
    current_price: {
      id: "prc-milk-1",
      ingredient_id: "ing-milk",
      region_code: "ID",
      region_name: "Nasional (Acuan Indonesia)",
      package_quantity: 1000,
      package_unit: "kotak (1 Liter)",
      package_price_idr: 18500,
      source: "Ritel Modern",
      observed_at: "2026-10-21",
      is_stale: false,
    },
    price_history: [
      {
        id: "prc-milk-1",
        ingredient_id: "ing-milk",
        region_code: "ID",
        region_name: "Nasional (Acuan Indonesia)",
        package_quantity: 1000,
        package_unit: "kotak (1 Liter)",
        package_price_idr: 18500,
        source: "Ritel Modern",
        observed_at: "2026-10-21",
        is_stale: false,
      },
    ],
    created_at: "2026-03-05T08:00:00Z",
    updated_at: "2026-10-21T08:00:00Z",
  },
];

export const mockIngredientService = {
  async getMasterIngredients(): Promise<MasterIngredient[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return mockMasterIngredients.map((item) => {
      const isStale = checkIsPriceStale(item.current_price.observed_at);
      return {
        ...item,
        current_price: {
          ...item.current_price,
          is_stale: isStale,
        },
      };
    });
  },

  /**
   * Simulasi dampak perubahan harga bahan terhadap resep-resep yang menggunakannya.
   * Aturan PRD:
   * - Menghitung selisih shopping cost baru vs lama
   * - Menghitung persentase kenaikan/penurunan biaya
   */
  async simulateRecipePriceImpact(
    ingredientName: string,
    newPackagePrice: number,
    oldPackagePrice: number
  ): Promise<RecipeImpactSimulation[]> {
    const allRecipes = await mockRecipeService.getAllRecipesForAdmin();
    const impacted: RecipeImpactSimulation[] = [];

    const normTarget = ingredientName.toLowerCase().trim();

    for (const r of allRecipes) {
      // Periksa apakah resep menggunakan bahan ini
      const matchingIng = r.ingredients.find((i) => {
        const normName = i.ingredient_name.toLowerCase();
        return normName.includes(normTarget) || normTarget.includes(normName);
      });

      if (!matchingIng) continue;

      const neededQty = matchingIng.quantity || 1;
      const pkgQty = matchingIng.package_quantity || 1;
      const batches = Math.ceil(neededQty / Math.max(1, pkgQty));

      const oldIngredientCost = oldPackagePrice * batches;
      const newIngredientCost = newPackagePrice * batches;
      const delta = newIngredientCost - oldIngredientCost;

      const oldTotalCost = r.total_shopping_cost;
      const newTotalCost = Math.max(1000, oldTotalCost + delta);

      const percent = oldTotalCost > 0 ? (delta / oldTotalCost) * 100 : 0;

      impacted.push({
        recipe_id: r.id,
        recipe_name: r.name,
        recipe_slug: r.slug,
        category: r.category,
        base_servings: r.base_servings,
        old_shopping_cost: oldTotalCost,
        new_shopping_cost: newTotalCost,
        cost_difference: delta,
        percentage_change: Math.round(percent * 10) / 10,
      });
    }

    return impacted;
  },
};
