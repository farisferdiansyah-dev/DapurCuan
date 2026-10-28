import type { Recipe, RecipeWithCost, RecipeIngredient, RecipeVideo, SearchFilters, PaginatedResponse, RecipeCategory, RecipeDifficulty } from "@/types/recipe";

// Mock recipes data (20 resep valid terkurasi: 8 Makanan, 6 Minuman, 6 Camilan dengan rentang budget Rp5.000–Rp88.000)
const mockRecipes: Recipe[] = [
  // --- MAKANAN ---
  {
    id: "recipe-7",
    slug: "nasi-telur-kecap-pontianak",
    name: "Nasi Telur Kecap Pontianak",
    description: "Telur ceplok krispi berpadu tumisan bawang putih dan siraman kecap manis gurih di atas nasi hangat.",
    category: "makanan",
    image_url: "/images/recipes/nasi-telur-kecap-pontianak.jpg",
    base_servings: 1,
    prep_minutes: 5,
    cook_minutes: 5,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-01T08:00:00Z",
    published_at: "2026-03-01T09:00:00Z",
  },
  {
    id: "recipe-8",
    slug: "tahu-tempe-orek-manis",
    name: "Tahu Tempe Orek Manis Gurih",
    description: "Olahan tahu dan tempe potong dadu berpadu bumbu lengkuas, daun salam, cabai merah, dan kecap manis pekat.",
    category: "makanan",
    image_url: "/images/recipes/tahu-tempe-orek-manis.jpg",
    base_servings: 2,
    prep_minutes: 10,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-02T10:00:00Z",
    published_at: "2026-03-02T11:00:00Z",
  },
  {
    id: "recipe-1",
    slug: "nasi-goreng-kampung",
    name: "Nasi Goreng Kampung",
    description: "Nasi goreng khas nusantara dengan aroma terasi bakar, bawang merah gurih, telur orak-arik, dan cabai rawit.",
    category: "makanan",
    image_url: "/images/recipes/nasi-goreng-kampung.jpg",
    base_servings: 2,
    prep_minutes: 10,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-01-15T10:00:00Z",
    published_at: "2026-01-15T12:00:00Z",
  },
  {
    id: "recipe-10",
    slug: "ikan-kembung-bakar-colo-colo",
    name: "Ikan Kembung Bakar Sambal Colo-Colo",
    description: "Ikan kembung bumbu ketumbar dibakar gurih, disajikan dengan sambal colo-colo tomat hijau segar dan pedas.",
    category: "makanan",
    image_url: "/images/recipes/ikan-kembung-bakar-colo-colo.jpg",
    base_servings: 2,
    prep_minutes: 15,
    cook_minutes: 20,
    difficulty: "sedang",
    status: "published",
    created_at: "2026-03-06T11:00:00Z",
    published_at: "2026-03-06T12:00:00Z",
  },
  {
    id: "recipe-9",
    slug: "soto-ayam-lamongan",
    name: "Soto Ayam Lamongan Kuah Koya",
    description: "Soto ayam berkuah kuning gurih segar dengan suwiran ayam, soun, tauge, serta taburan bubuk koya renyah.",
    category: "makanan",
    image_url: "/images/recipes/soto-ayam-lamongan.jpg",
    base_servings: 3,
    prep_minutes: 20,
    cook_minutes: 40,
    difficulty: "sedang",
    status: "published",
    created_at: "2026-03-04T07:00:00Z",
    published_at: "2026-03-04T08:30:00Z",
  },
  {
    id: "recipe-2",
    slug: "ayam-teriyaki",
    name: "Ayam Teriyaki Rumahan",
    description: "Ayam fillet paha empuk ditumis dengan irisan bawang bombai, saus teriyaki manis gurih, dan taburan wijen.",
    category: "makanan",
    image_url: "/images/recipes/ayam-teriyaki.jpg",
    base_servings: 4,
    prep_minutes: 15,
    cook_minutes: 25,
    difficulty: "sedang",
    status: "published",
    created_at: "2026-02-10T08:00:00Z",
    published_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "recipe-11",
    slug: "sup-daging-sapi-wortel",
    name: "Sup Daging Sapi Wortel Kentang",
    description: "Potongan daging sapi empuk dalam kuah kaldu rempah pala hangat bersama kentang, wortel, dan buncis segar.",
    category: "makanan",
    image_url: "/images/recipes/sup-daging-sapi-wortel.jpg",
    base_servings: 4,
    prep_minutes: 20,
    cook_minutes: 50,
    difficulty: "sedang",
    status: "published",
    created_at: "2026-03-08T09:00:00Z",
    published_at: "2026-03-08T10:00:00Z",
  },
  {
    id: "recipe-5",
    slug: "rendang-daging-sapi",
    name: "Rendang Daging Sapi Padang",
    description: "Daging sapi gandik dimasak perlahan bersama bumbu rempah Minang dan santan kelapa hingga berminyak dan pekat.",
    category: "makanan",
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=640&q=80",
    base_servings: 4,
    prep_minutes: 25,
    cook_minutes: 120,
    difficulty: "sulit",
    status: "published",
    created_at: "2026-02-28T07:00:00Z",
    published_at: "2026-02-28T09:00:00Z",
  },

  // --- MINUMAN ---
  {
    id: "recipe-3",
    slug: "es-teh-manis",
    name: "Es Teh Manis Melati",
    description: "Minuman teh melati segar seduh dingin dengan rasa manis alami seimbang pelepas dahaga.",
    category: "minuman",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=640&q=80",
    base_servings: 1,
    prep_minutes: 5,
    cook_minutes: 0,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-01-20T14:00:00Z",
    published_at: "2026-01-20T15:00:00Z",
  },
  {
    id: "recipe-12",
    slug: "es-jeruk-peras-segar",
    name: "Es Jeruk Peras Segar",
    description: "Perasan jeruk manis peras asli dipadukan gula cair dan es batu kristal yang dingin mantap.",
    category: "minuman",
    image_url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=640&q=80",
    base_servings: 2,
    prep_minutes: 5,
    cook_minutes: 0,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-11T10:00:00Z",
    published_at: "2026-03-11T11:00:00Z",
  },
  {
    id: "recipe-13",
    slug: "wedang-jahe-serai",
    name: "Wedang Jahe Serai Gula Aren",
    description: "Minuman rempah hangat dari jahe bakar geprek, serai wangi, dan manis legit gula aren murni.",
    category: "minuman",
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=640&q=80",
    base_servings: 2,
    prep_minutes: 5,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-12T08:00:00Z",
    published_at: "2026-03-12T09:00:00Z",
  },
  {
    id: "recipe-6",
    slug: "smoothie-mangga",
    name: "Smoothie Mangga Madu",
    description: "Jus mangga harum manis lembut diblender dengan yogurt tawar dan madu murni, kaya vitamin.",
    category: "minuman",
    image_url: "https://images.unsplash.com/photo-1546173159-315724a31696?w=640&q=80",
    base_servings: 2,
    prep_minutes: 8,
    cook_minutes: 0,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-10T12:00:00Z",
    published_at: "2026-03-10T13:00:00Z",
  },
  {
    id: "recipe-14",
    slug: "es-cincau-susu-kedelai",
    name: "Es Cincau Susu Kedelai",
    description: "Potongan cincau hitam kenyal disajikan dalam susu kedelai dingin beraroma sirup pandan wangi.",
    category: "minuman",
    image_url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=640&q=80",
    base_servings: 3,
    prep_minutes: 10,
    cook_minutes: 0,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-13T14:00:00Z",
    published_at: "2026-03-13T15:00:00Z",
  },
  {
    id: "recipe-15",
    slug: "es-kopi-susu-gula-aren",
    name: "Es Kopi Susu Gula Aren",
    description: "Seduhan kopi espreso rumahan dipadukan susu evaporasi creamy dan sirup gula aren kental yang harum.",
    category: "minuman",
    image_url: "/images/recipes/es-kopi-susu-gula-aren.jpg",
    base_servings: 2,
    prep_minutes: 8,
    cook_minutes: 0,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-14T09:00:00Z",
    published_at: "2026-03-14T10:00:00Z",
  },

  // --- CAMILAN ---
  {
    id: "recipe-17",
    slug: "cireng-krispi-bumbu-rujak",
    name: "Cireng Krispi Bumbu Rujak",
    description: "Camilan aci goreng gurih renyah di luar kenyal di dalam dengan cocolan sambal rujak gula merah pedas manis.",
    category: "camilan",
    image_url: "/images/recipes/cireng-krispi-bumbu-rujak.jpg",
    base_servings: 3,
    prep_minutes: 15,
    cook_minutes: 10,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-16T13:00:00Z",
    published_at: "2026-03-16T14:00:00Z",
  },
  {
    id: "recipe-4",
    slug: "pisang-goreng-crispy",
    name: "Pisang Goreng Crispy",
    description: "Pisang kepok manis berbalut adonan tepung krispi keemasan yang gurih dan tahan renyah.",
    category: "camilan",
    image_url: "/images/recipes/pisang-goreng-crispy.jpg",
    base_servings: 3,
    prep_minutes: 10,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-05T09:00:00Z",
    published_at: "2026-03-05T11:00:00Z",
  },
  {
    id: "recipe-16",
    slug: "bakwan-sayur-renyah",
    name: "Bakwan Sayur Renyah Gurih",
    description: "Gorengan irisan kol, wortel, dan tauge dengan adonan tepung bumbu bawang putih dan ketumbar harum.",
    category: "camilan",
    image_url: "/images/recipes/bakwan-sayur-renyah.jpg",
    base_servings: 4,
    prep_minutes: 15,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-15T10:00:00Z",
    published_at: "2026-03-15T11:00:00Z",
  },
  {
    id: "recipe-20",
    slug: "pancake-pisang-cokelat",
    name: "Pancake Pisang Cokelat Lumer",
    description: "Pancake teflon lembut beraroma pisang manis alami dengan lelehan saus cokelat dark compound.",
    category: "camilan",
    image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=640&q=80",
    base_servings: 2,
    prep_minutes: 10,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-19T09:00:00Z",
    published_at: "2026-03-19T10:00:00Z",
  },
  {
    id: "recipe-18",
    slug: "martabak-telur-kulit-lumpia",
    name: "Martabak Telur Kulit Lumpia",
    description: "Isian telur, daun bawang, dan cacahan ayam berbumbu kari dibalut kulit lumpia tipis goreng kering.",
    category: "camilan",
    image_url: "/images/recipes/martabak-telur-kulit-lumpia.jpg",
    base_servings: 3,
    prep_minutes: 15,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "published",
    created_at: "2026-03-17T15:00:00Z",
    published_at: "2026-03-17T16:00:00Z",
  },
  {
    id: "recipe-19",
    slug: "dimsum-ayam-jamur",
    name: "Dimsum Ayam Jamur Kukus",
    description: "Siomay ayam lembut berpadu jamur kuping kenyal dan parutan wortel, disajikan bersama saus cocolan cabai asam manis.",
    category: "camilan",
    image_url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=640&q=80",
    base_servings: 4,
    prep_minutes: 20,
    cook_minutes: 25,
    difficulty: "sedang",
    status: "published",
    created_at: "2026-03-18T11:00:00Z",
    published_at: "2026-03-18T12:00:00Z",
  },
  // --- RESEP DRAFT (Untuk simulasi manajemen & validasi publikasi admin) ---
  {
    id: "recipe-21",
    slug: "omelet-sayur-keju-lumer",
    name: "Omelet Sayur Keju Lumer",
    description: "Omelet telur lembut dengan cincangan wortel, bayam, dan lelehan keju cheddar gurih di dalamnya.",
    category: "makanan",
    image_url: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=640&q=80",
    base_servings: 2,
    prep_minutes: 10,
    cook_minutes: 10,
    difficulty: "mudah",
    status: "draft",
    created_at: "2026-03-25T10:00:00Z",
    published_at: null,
  },
  {
    id: "recipe-22",
    slug: "sayur-bening-bayam-jagung",
    name: "Sayur Bening Bayam Jagung Manis",
    description: "Kuah bening temu kunci hangat berpadu daun bayam segar dan manis renyah jagung pipil muda.",
    category: "makanan",
    image_url: "/images/recipes/sayur-bening-bayam-jagung.jpg",
    base_servings: 3,
    prep_minutes: 10,
    cook_minutes: 15,
    difficulty: "mudah",
    status: "draft",
    created_at: "2026-03-26T11:00:00Z",
    published_at: null,
  },
  // --- RESEP ARCHIVED (Untuk simulasi arsip resep lama) ---
  {
    id: "recipe-23",
    slug: "kwetiau-goreng-spesial-kos",
    name: "Kwetiau Goreng Spesial Kos",
    description: "Kwetiau beras kenyal ditumis dengan sawi hijau, telur, dan bakso sapi beraroma kecap manis gurih.",
    category: "makanan",
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=640&q=80",
    base_servings: 1,
    prep_minutes: 10,
    cook_minutes: 10,
    difficulty: "mudah",
    status: "archived",
    created_at: "2026-02-01T08:00:00Z",
    published_at: "2026-02-01T09:00:00Z",
  },
];

// Mock base cost data pada porsi acuan (base_servings) dalam IDR - Status data simulasi
// Semua harga berada dalam rentang variasi Rp5.000 s/d Rp88.000 (sesuai target Rp5.000–Rp100.000)
const mockBaseCosts: Record<string, { consumption_cost: number; shopping_cost: number }> = {
  // Makanan
  "recipe-7": { consumption_cost: 6000, shopping_cost: 12000 },   // Nasi Telur Kecap (1 porsi)
  "recipe-8": { consumption_cost: 10000, shopping_cost: 18000 },  // Tahu Tempe Orek (2 porsi)
  "recipe-1": { consumption_cost: 14000, shopping_cost: 25000 },  // Nasi Goreng (2 porsi)
  "recipe-10": { consumption_cost: 24000, shopping_cost: 38000 }, // Ikan Kembung Bakar (2 porsi)
  "recipe-9": { consumption_cost: 28000, shopping_cost: 45000 },  // Soto Lamongan (3 porsi)
  "recipe-2": { consumption_cost: 36000, shopping_cost: 60000 },  // Ayam Teriyaki (4 porsi)
  "recipe-11": { consumption_cost: 55000, shopping_cost: 75000 }, // Sup Daging Sapi (4 porsi)
  "recipe-5": { consumption_cost: 68000, shopping_cost: 88000 },  // Rendang Daging Sapi (4 porsi)

  // Minuman
  "recipe-3": { consumption_cost: 2000, shopping_cost: 5000 },    // Es Teh Manis (1 porsi)
  "recipe-12": { consumption_cost: 7000, shopping_cost: 12000 },  // Es Jeruk Peras (2 porsi)
  "recipe-13": { consumption_cost: 8000, shopping_cost: 15000 },  // Wedang Jahe Serai (2 porsi)
  "recipe-6": { consumption_cost: 14000, shopping_cost: 22000 },  // Smoothie Mangga (2 porsi)
  "recipe-14": { consumption_cost: 16000, shopping_cost: 25000 }, // Es Cincau Susu (3 porsi)
  "recipe-15": { consumption_cost: 16000, shopping_cost: 28000 }, // Es Kopi Susu Aren (2 porsi)

  // Camilan
  "recipe-17": { consumption_cost: 8000, shopping_cost: 14000 },  // Cireng Bumbu Rujak (3 porsi)
  "recipe-4": { consumption_cost: 9000, shopping_cost: 15000 },   // Pisang Goreng Crispy (3 porsi)
  "recipe-16": { consumption_cost: 10000, shopping_cost: 16000 }, // Bakwan Sayur (4 porsi)
  "recipe-20": { consumption_cost: 15000, shopping_cost: 25000 }, // Pancake Pisang (2 porsi)
  "recipe-18": { consumption_cost: 18000, shopping_cost: 28000 }, // Martabak Telur Kulit Lumpia (3 porsi)
  "recipe-19": { consumption_cost: 30000, shopping_cost: 45000 }, // Dimsum Ayam Jamur (4 porsi)
  "recipe-21": { consumption_cost: 12000, shopping_cost: 20000 }, // Omelet Sayur Keju Lumer (2 porsi)
  "recipe-22": { consumption_cost: 10000, shopping_cost: 16000 }, // Sayur Bening Bayam Jagung (3 porsi)
  "recipe-23": { consumption_cost: 11000, shopping_cost: 18000 }, // Kwetiau Goreng Spesial (1 porsi)
};

// Mock nutrition data (Nilai gizi per porsi penyajian - Data simulasi berbasis standar porsi umum)
const mockNutrition: Record<string, { per_serving: { calories_kcal: number; protein_g: number; carbs_g: number; fat_g: number; fiber_g?: number; sugar_g?: number; sodium_mg?: number; source: string; is_simulated: boolean } }> = {
  "recipe-7": { per_serving: { calories_kcal: 310, protein_g: 14, carbs_g: 38, fat_g: 12, fiber_g: 1, sugar_g: 5, sodium_mg: 480, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-8": { per_serving: { calories_kcal: 240, protein_g: 16, carbs_g: 18, fat_g: 12, fiber_g: 4, sugar_g: 7, sodium_mg: 390, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-1": { per_serving: { calories_kcal: 350, protein_g: 12, carbs_g: 45, fat_g: 14, fiber_g: 3, sugar_g: 4, sodium_mg: 580, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-10": { per_serving: { calories_kcal: 290, protein_g: 27, carbs_g: 6, fat_g: 18, fiber_g: 2, sugar_g: 3, sodium_mg: 460, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-9": { per_serving: { calories_kcal: 380, protein_g: 26, carbs_g: 32, fat_g: 15, fiber_g: 2, sugar_g: 4, sodium_mg: 840, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-2": { per_serving: { calories_kcal: 420, protein_g: 28, carbs_g: 18, fat_g: 22, fiber_g: 1, sugar_g: 10, sodium_mg: 820, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-11": { per_serving: { calories_kcal: 450, protein_g: 32, carbs_g: 22, fat_g: 25, fiber_g: 4, sugar_g: 4, sodium_mg: 790, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-5": { per_serving: { calories_kcal: 460, protein_g: 35, carbs_g: 9, fat_g: 32, fiber_g: 3, sugar_g: 3, sodium_mg: 720, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-3": { per_serving: { calories_kcal: 85, protein_g: 0, carbs_g: 22, fat_g: 0, fiber_g: 0, sugar_g: 21, sodium_mg: 5, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-12": { per_serving: { calories_kcal: 95, protein_g: 1, carbs_g: 23, fat_g: 0, fiber_g: 1, sugar_g: 20, sodium_mg: 4, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-13": { per_serving: { calories_kcal: 70, protein_g: 0, carbs_g: 17, fat_g: 0, fiber_g: 1, sugar_g: 16, sodium_mg: 8, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-6": { per_serving: { calories_kcal: 175, protein_g: 5, carbs_g: 36, fat_g: 2, fiber_g: 3, sugar_g: 30, sodium_mg: 45, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-14": { per_serving: { calories_kcal: 130, protein_g: 6, carbs_g: 20, fat_g: 3, fiber_g: 2, sugar_g: 15, sodium_mg: 60, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-15": { per_serving: { calories_kcal: 160, protein_g: 3, carbs_g: 24, fat_g: 6, fiber_g: 0, sugar_g: 20, sodium_mg: 55, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-17": { per_serving: { calories_kcal: 210, protein_g: 1, carbs_g: 34, fat_g: 8, fiber_g: 1, sugar_g: 9, sodium_mg: 280, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-4": { per_serving: { calories_kcal: 260, protein_g: 3, carbs_g: 40, fat_g: 11, fiber_g: 3, sugar_g: 16, sodium_mg: 120, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-16": { per_serving: { calories_kcal: 180, protein_g: 3, carbs_g: 22, fat_g: 9, fiber_g: 2, sugar_g: 3, sodium_mg: 240, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-20": { per_serving: { calories_kcal: 270, protein_g: 5, carbs_g: 44, fat_g: 9, fiber_g: 3, sugar_g: 22, sodium_mg: 160, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-18": { per_serving: { calories_kcal: 320, protein_g: 15, carbs_g: 22, fat_g: 19, fiber_g: 2, sugar_g: 2, sodium_mg: 440, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-19": { per_serving: { calories_kcal: 230, protein_g: 14, carbs_g: 18, fat_g: 11, fiber_g: 2, sugar_g: 3, sodium_mg: 520, source: "Data simulasi (estimasi nilai gizi per porsi)", is_simulated: true } },
  "recipe-21": { per_serving: { calories_kcal: 280, protein_g: 15, carbs_g: 8, fat_g: 21, fiber_g: 1, sugar_g: 2, sodium_mg: 420, source: "Data simulasi (estimasi)", is_simulated: true } },
  "recipe-22": { per_serving: { calories_kcal: 110, protein_g: 4, carbs_g: 22, fat_g: 1, fiber_g: 3, sugar_g: 5, sodium_mg: 310, source: "Data simulasi (estimasi)", is_simulated: true } },
  "recipe-23": { per_serving: { calories_kcal: 440, protein_g: 16, carbs_g: 58, fat_g: 16, fiber_g: 2, sugar_g: 5, sodium_mg: 690, source: "Data simulasi (estimasi)", is_simulated: true } },
};

// Data bahan terinci (RecipeIngredient) untuk setiap resep
const mockIngredients: Record<string, RecipeIngredient[]> = {
  "recipe-7": [
    { ingredient_id: "ing-egg", ingredient_name: "Telur Ayam", quantity: 2, unit: "butir", prep_note: "ceplok krispi", price_per_unit: 2500, package_quantity: 1, package_unit: "pack (2 btr)", package_price: 5000 },
    { ingredient_id: "ing-rice", ingredient_name: "Nasi Putih", quantity: 200, unit: "gram", prep_note: "nasi hangat", price_per_unit: 15, package_quantity: 200, package_unit: "porsi", package_price: 3000 },
    { ingredient_id: "ing-garlic", ingredient_name: "Bawang Putih", quantity: 2, unit: "siung", prep_note: "cincang halus", price_per_unit: 500, package_quantity: 1, package_unit: "ikat kecil", package_price: 1500 },
    { ingredient_id: "ing-scallion", ingredient_name: "Daun Bawang", quantity: 1, unit: "batang", prep_note: "iris tipis", price_per_unit: 1000, package_quantity: 1, package_unit: "batang", package_price: 1000 },
    { ingredient_id: "ing-soysauce", ingredient_name: "Kecap Manis & Asin", quantity: 2, unit: "sdm", prep_note: "campur rata", price_per_unit: 750, package_quantity: 1, package_unit: "sachet", package_price: 1500 },
  ],
  "recipe-8": [
    { ingredient_id: "ing-tempeh", ingredient_name: "Tempe Kedelai", quantity: 1, unit: "papan (200g)", prep_note: "potong dadu kecil", price_per_unit: 6000, package_quantity: 1, package_unit: "papan", package_price: 6000 },
    { ingredient_id: "ing-tofu", ingredient_name: "Tahu Putih", quantity: 1, unit: "kotak (200g)", prep_note: "potong dadu kecil", price_per_unit: 5000, package_quantity: 1, package_unit: "kotak", package_price: 5000 },
    { ingredient_id: "ing-shallot", ingredient_name: "Bawang Merah & Putih", quantity: 6, unit: "siung", prep_note: "iris tipis", price_per_unit: 500, package_quantity: 1, package_unit: "bungkus", package_price: 3000 },
    { ingredient_id: "ing-chili-red", ingredient_name: "Cabai Merah Keriting", quantity: 3, unit: "buah", prep_note: "iris serong", price_per_unit: 600, package_quantity: 1, package_unit: "ikat", package_price: 2000 },
    { ingredient_id: "ing-sweetsoysauce", ingredient_name: "Kecap Manis", quantity: 3, unit: "sdm", prep_note: "sesuai selera", price_per_unit: 600, package_quantity: 1, package_unit: "sachet", package_price: 2000 },
  ],
  "recipe-1": [
    { ingredient_id: "ing-rice-cold", ingredient_name: "Nasi Putih Pera/Dingin", quantity: 400, unit: "gram", prep_note: "nasi kemarin", price_per_unit: 15, package_quantity: 400, package_unit: "gram", package_price: 6000 },
    { ingredient_id: "ing-egg", ingredient_name: "Telur Ayam", quantity: 2, unit: "butir", prep_note: "kocok lepas", price_per_unit: 2500, package_quantity: 1, package_unit: "pack", package_price: 5000 },
    { ingredient_id: "ing-shallot-garlic", ingredient_name: "Bawang Merah & Putih", quantity: 7, unit: "siung", prep_note: "cincang kasar", price_per_unit: 500, package_quantity: 1, package_unit: "bungkus", package_price: 4000 },
    { ingredient_id: "ing-rawit", ingredient_name: "Cabai Rawit Merah", quantity: 5, unit: "buah", prep_note: "iris halus", price_per_unit: 500, package_quantity: 1, package_unit: "ikat", package_price: 2500 },
    { ingredient_id: "ing-terasi", ingredient_name: "Terasi Bakar & Garam", quantity: 1, unit: "sdt", prep_note: "haluskan", price_per_unit: 1500, package_quantity: 1, package_unit: "sachet", package_price: 2500 },
    { ingredient_id: "ing-sweetsoysauce", ingredient_name: "Kecap Manis", quantity: 2, unit: "sdm", prep_note: "bumbu pelengkap", price_per_unit: 1000, package_quantity: 1, package_unit: "sachet", package_price: 2000 },
    { ingredient_id: "ing-oil", ingredient_name: "Minyak Goreng", quantity: 3, unit: "sdm", prep_note: "untuk menumis", price_per_unit: 1000, package_quantity: 1, package_unit: "pouch mini", package_price: 3000 },
  ],
  "recipe-10": [
    { ingredient_id: "ing-kembung", ingredient_name: "Ikan Kembung Segar", quantity: 2, unit: "ekor (350g)", prep_note: "siangi dan kerat badan", price_per_unit: 12000, package_quantity: 2, package_unit: "ekor", package_price: 24000 },
    { ingredient_id: "ing-lime", ingredient_name: "Jeruk Nipis", quantity: 1, unit: "buah", prep_note: "peras airnya", price_per_unit: 2000, package_quantity: 1, package_unit: "buah", package_price: 2000 },
    { ingredient_id: "ing-tomatohijau", ingredient_name: "Tomat Hijau & Merah", quantity: 2, unit: "buah", prep_note: "potong dadu kecil", price_per_unit: 1500, package_quantity: 2, package_unit: "buah", package_price: 3000 },
    { ingredient_id: "ing-shallot-rawit", ingredient_name: "Bawang Merah & Cabai Rawit", quantity: 8, unit: "butir", prep_note: "iris tipis", price_per_unit: 500, package_quantity: 1, package_unit: "bungkus", package_price: 4000 },
    { ingredient_id: "ing-sweetsoysauce", ingredient_name: "Kecap Manis", quantity: 3, unit: "sdm", prep_note: "saus colo-colo", price_per_unit: 1500, package_quantity: 1, package_unit: "sachet", package_price: 5000 },
  ],
  "recipe-9": [
    { ingredient_id: "ing-chicken", ingredient_name: "Daging Ayam Bagian Dada/Paha", quantity: 350, unit: "gram", prep_note: "rebus untuk kaldu dan suwir", price_per_unit: 65, package_quantity: 350, package_unit: "gram", package_price: 23000 },
    { ingredient_id: "ing-cabbage-sprout", ingredient_name: "Kol & Tauge Segar", quantity: 150, unit: "gram", prep_note: "iris tipis & seduh", price_per_unit: 30, package_quantity: 1, package_unit: "bungkus sayur", package_price: 4500 },
    { ingredient_id: "ing-soun", ingredient_name: "Soun Kering", quantity: 50, unit: "gram", prep_note: "seduh air panas", price_per_unit: 60, package_quantity: 1, package_unit: "pack kecil", package_price: 3500 },
    { ingredient_id: "ing-bumbu-soto", ingredient_name: "Bumbu Soto Komplit (Kunyit, Jahe, Serai, Daun Jeruk)", quantity: 1, unit: "paket", prep_note: "haluskan & tumis", price_per_unit: 7000, package_quantity: 1, package_unit: "paket", package_price: 7000 },
    { ingredient_id: "ing-koya", ingredient_name: "Kerupuk Udang & Bawang Goreng", quantity: 1, unit: "bungkus", prep_note: "tumbuk halus untuk koya", price_per_unit: 7000, package_quantity: 1, package_unit: "bungkus", package_price: 7000 },
  ],
  "recipe-2": [
    { ingredient_id: "ing-chicken-fillet", ingredient_name: "Daging Ayam Fillet Paha", quantity: 500, unit: "gram", prep_note: "potong dadu 2 cm", price_per_unit: 70, package_quantity: 500, package_unit: "gram", package_price: 35000 },
    { ingredient_id: "ing-onion", ingredient_name: "Bawang Bombai", quantity: 1, unit: "buah", prep_note: "iris memanjang", price_per_unit: 5000, package_quantity: 1, package_unit: "buah", package_price: 5000 },
    { ingredient_id: "ing-teriyaki-sauce", ingredient_name: "Saus Teriyaki Siap Pakai", quantity: 4, unit: "sdm", prep_note: "marinasi dan tumis", price_per_unit: 2500, package_quantity: 1, package_unit: "botol kecil", package_price: 11000 },
    { ingredient_id: "ing-sesame", ingredient_name: "Wijen Sangrai & Minyak Wijen", quantity: 1, unit: "sdm", prep_note: "taburan", price_per_unit: 4000, package_quantity: 1, package_unit: "sachet", package_price: 5000 },
    { ingredient_id: "ing-garlic-ginger", ingredient_name: "Bawang Putih & Jahe", quantity: 3, unit: "siung", prep_note: "parut halus", price_per_unit: 1000, package_quantity: 1, package_unit: "bungkus", package_price: 4000 },
  ],
  "recipe-11": [
    { ingredient_id: "ing-beef-soup", ingredient_name: "Daging Sapi Tetelan / Sandung Lamur", quantity: 350, unit: "gram", prep_note: "potong dadu dan rebus empuk", price_per_unit: 130, package_quantity: 350, package_unit: "gram", package_price: 45000 },
    { ingredient_id: "ing-carrot-potato", ingredient_name: "Wortel & Kentang", quantity: 3, unit: "buah", prep_note: "potong bulat dan dadu", price_per_unit: 3000, package_quantity: 1, package_unit: "ikat", package_price: 9000 },
    { ingredient_id: "ing-beans-celery", ingredient_name: "Buncis, Daun Bawang & Seledri", quantity: 1, unit: "ikat", prep_note: "potong serasi", price_per_unit: 6000, package_quantity: 1, package_unit: "ikat", package_price: 6000 },
    { ingredient_id: "ing-pala-merica", ingredient_name: "Bumbu Sop (Pala, Merica, Bawang Putih Geprek)", quantity: 1, unit: "porsi", prep_note: "haluskan", price_per_unit: 8000, package_quantity: 1, package_unit: "paket bumbu", package_price: 8000 },
    { ingredient_id: "ing-fried-shallot", ingredient_name: "Bawang Goreng Tabur", quantity: 1, unit: "bungkus kecil", prep_note: "taburan akhir", price_per_unit: 7000, package_quantity: 1, package_unit: "bungkus", package_price: 7000 },
  ],
  "recipe-5": [
    { ingredient_id: "ing-beef-rendang", ingredient_name: "Daging Sapi Gandik", quantity: 500, unit: "gram", prep_note: "potong melawan serat", price_per_unit: 110, package_quantity: 500, package_unit: "gram", package_price: 55000 },
    { ingredient_id: "ing-coconut-milk", ingredient_name: "Santan Kelapa Kental & Encer", quantity: 600, unit: "ml", prep_note: "dari 1 butir kelapa tua", price_per_unit: 25, package_quantity: 1, package_unit: "butir kelapa", package_price: 13000 },
    { ingredient_id: "ing-rendang-spices", ingredient_name: "Bumbu Halus Rendang (Cabai, Bawang Merah/Putih, Lengkuas, Jahe)", quantity: 1, unit: "paket giling", prep_note: "bumbu basah pasar", price_per_unit: 14000, package_quantity: 1, package_unit: "paket", package_price: 14000 },
    { ingredient_id: "ing-daun-aromatis", ingredient_name: "Daun Kunyit, Serai, Daun Jeruk & Asam Kandis", quantity: 1, unit: "ikat", prep_note: "ikat simpul", price_per_unit: 6000, package_quantity: 1, package_unit: "ikat", package_price: 6000 },
  ],
  "recipe-3": [
    { ingredient_id: "ing-tea", ingredient_name: "Teh Melati Celup/Tubruk", quantity: 1, unit: "kantong", prep_note: "seduh air panas", price_per_unit: 1000, package_quantity: 1, package_unit: "sachet", package_price: 1500 },
    { ingredient_id: "ing-sugar", ingredient_name: "Gula Pasir", quantity: 2, unit: "sdm (25g)", prep_note: "larutkan", price_per_unit: 40, package_quantity: 1, package_unit: "sachet mini", package_price: 1500 },
    { ingredient_id: "ing-ice", ingredient_name: "Es Batu Kristal", quantity: 1, unit: "gelas", prep_note: "siap saji", price_per_unit: 2000, package_quantity: 1, package_unit: "porsi", package_price: 2000 },
  ],
  "recipe-12": [
    { ingredient_id: "ing-orange", ingredient_name: "Jeruk Peras Manis", quantity: 4, unit: "buah (400g)", prep_note: "belah dua dan peras", price_per_unit: 2000, package_quantity: 1, package_unit: "kantong (500g)", package_price: 8000 },
    { ingredient_id: "ing-sugar", ingredient_name: "Gula Pasir Cair", quantity: 3, unit: "sdm", prep_note: "larutkan dalam air hangat", price_per_unit: 600, package_quantity: 1, package_unit: "sachet", package_price: 2000 },
    { ingredient_id: "ing-ice", ingredient_name: "Es Batu Kristal", quantity: 2, unit: "gelas", prep_note: "dingin segar", price_per_unit: 1000, package_quantity: 1, package_unit: "kantong", package_price: 2000 },
  ],
  "recipe-13": [
    { ingredient_id: "ing-ginger", ingredient_name: "Jahe Emprit", quantity: 60, unit: "gram", prep_note: "bakar dan geprek", price_per_unit: 100, package_quantity: 1, package_unit: "ikat (100g)", package_price: 6000 },
    { ingredient_id: "ing-lemongrass", ingredient_name: "Serai", quantity: 2, unit: "batang", prep_note: "memarkan bagian putih", price_per_unit: 1500, package_quantity: 1, package_unit: "ikat", package_price: 3000 },
    { ingredient_id: "ing-arenga-sugar", ingredient_name: "Gula Aren / Gula Merah", quantity: 60, unit: "gram", prep_note: "sisir halus", price_per_unit: 80, package_quantity: 1, package_unit: "gandu", package_price: 6000 },
  ],
  "recipe-6": [
    { ingredient_id: "ing-mango", ingredient_name: "Mangga Harum Manis Matang", quantity: 1, unit: "buah (300g)", prep_note: "kupas dan potong dadu", price_per_unit: 12000, package_quantity: 1, package_unit: "buah", package_price: 12000 },
    { ingredient_id: "ing-yogurt", ingredient_name: "Yogurt Tawar / Susu UHT", quantity: 150, unit: "ml", prep_note: "dingin", price_per_unit: 40, package_quantity: 1, package_unit: "kemasan 200ml", package_price: 6000 },
    { ingredient_id: "ing-honey", ingredient_name: "Madu Murni", quantity: 2, unit: "sdm", prep_note: "pemanis alami", price_per_unit: 2000, package_quantity: 1, package_unit: "sachet", package_price: 4000 },
  ],
  "recipe-14": [
    { ingredient_id: "ing-cincau", ingredient_name: "Cincau Hitam Segar", quantity: 200, unit: "gram", prep_note: "potong dadu kecil", price_per_unit: 35, package_quantity: 1, package_unit: "kotak (250g)", package_price: 7000 },
    { ingredient_id: "ing-soymilk", ingredient_name: "Susu Kedelai Cair", quantity: 600, unit: "ml", prep_note: "dingin", price_per_unit: 20, package_quantity: 2, package_unit: "kantong", package_price: 12000 },
    { ingredient_id: "ing-pandansyrup", ingredient_name: "Sirup Pandan / Gula Merah", quantity: 5, unit: "sdm", prep_note: "pemanis wangi", price_per_unit: 1200, package_quantity: 1, package_unit: "botol kecil", package_price: 6000 },
  ],
  "recipe-15": [
    { ingredient_id: "ing-coffee", ingredient_name: "Kopi Espresso Rumahan / Robusta", quantity: 2, unit: "shot (60ml)", prep_note: "seduh kental", price_per_unit: 4000, package_quantity: 1, package_unit: "pack sachet", package_price: 8000 },
    { ingredient_id: "ing-evaporated-milk", ingredient_name: "Susu UHT / Susu Evaporasi", quantity: 250, unit: "ml", prep_note: "dingin creamy", price_per_unit: 44, package_quantity: 1, package_unit: "kotak 250ml", package_price: 11000 },
    { ingredient_id: "ing-aren-liquid", ingredient_name: "Sirup Gula Aren Cair", quantity: 4, unit: "sdm", prep_note: "legit harum", price_per_unit: 2250, package_quantity: 1, package_unit: "kemasan", package_price: 9000 },
  ],
  "recipe-17": [
    { ingredient_id: "ing-tapioca", ingredient_name: "Tepung Tapioka / Aci", quantity: 200, unit: "gram", prep_note: "bagi biang dan taburan", price_per_unit: 25, package_quantity: 1, package_unit: "pack 250g", package_price: 5000 },
    { ingredient_id: "ing-garlic-scallion", ingredient_name: "Bawang Putih & Daun Bawang", quantity: 1, unit: "paket", prep_note: "cincang halus", price_per_unit: 3000, package_quantity: 1, package_unit: "paket", package_price: 3000 },
    { ingredient_id: "ing-rujak-sauce", ingredient_name: "Bahan Sambal Rujak (Gula Merah, Rawit, Asam)", quantity: 1, unit: "paket", prep_note: "ulek halus", price_per_unit: 3500, package_quantity: 1, package_unit: "paket", package_price: 3500 },
    { ingredient_id: "ing-oil", ingredient_name: "Minyak Goreng", quantity: 200, unit: "ml", prep_note: "untuk menggoreng", price_per_unit: 12, package_quantity: 1, package_unit: "kemasan mini", package_price: 2500 },
  ],
  "recipe-4": [
    { ingredient_id: "ing-banana", ingredient_name: "Pisang Kepok Kuning Matang", quantity: 6, unit: "buah", prep_note: "belah bentuk kipas", price_per_unit: 1500, package_quantity: 1, package_unit: "sisir mini", package_price: 9000 },
    { ingredient_id: "ing-flour-crispy", ingredient_name: "Tepung Beras & Terigu", quantity: 150, unit: "gram", prep_note: "adonan celup renyah", price_per_unit: 20, package_quantity: 1, package_unit: "pack", package_price: 3000 },
    { ingredient_id: "ing-oil", ingredient_name: "Minyak Goreng", quantity: 250, unit: "ml", prep_note: "untuk deep fry", price_per_unit: 12, package_quantity: 1, package_unit: "kantong mini", package_price: 3000 },
  ],
  "recipe-16": [
    { ingredient_id: "ing-veggies", ingredient_name: "Sayuran Campur (Kol, Wortel, Tauge)", quantity: 250, unit: "gram", prep_note: "cuci bersih dan iris tipis", price_per_unit: 24, package_quantity: 1, package_unit: "paket sayur", package_price: 6000 },
    { ingredient_id: "ing-bakwan-flour", ingredient_name: "Tepung Terigu & Bumbu Ketumbar Bawang", quantity: 150, unit: "gram", prep_note: "adonan gurih", price_per_unit: 40, package_quantity: 1, package_unit: "paket adonan", package_price: 6000 },
    { ingredient_id: "ing-oil", ingredient_name: "Minyak Goreng", quantity: 300, unit: "ml", prep_note: "untuk menggoreng krispi", price_per_unit: 13, package_quantity: 1, package_unit: "pouch mini", package_price: 4000 },
  ],
  "recipe-20": [
    { ingredient_id: "ing-ripe-banana", ingredient_name: "Pisang Ambon Matang", quantity: 1, unit: "buah", prep_note: "lumatkan dengan garpu", price_per_unit: 4000, package_quantity: 1, package_unit: "buah", package_price: 4000 },
    { ingredient_id: "ing-flour-pancake", ingredient_name: "Tepung Terigu & Baking Powder", quantity: 100, unit: "gram", prep_note: "ayak halus", price_per_unit: 40, package_quantity: 1, package_unit: "pack kecil", package_price: 4000 },
    { ingredient_id: "ing-egg-milk", ingredient_name: "Telur Ayam & Susu Cair", quantity: 1, unit: "paket (1 telur + 100ml susu)", prep_note: "kocok rata", price_per_unit: 9000, package_quantity: 1, package_unit: "paket", package_price: 9000 },
    { ingredient_id: "ing-choco-sauce", ingredient_name: "Saus Cokelat Compound Lumer", quantity: 3, unit: "sdm", prep_note: "topping hangat", price_per_unit: 2600, package_quantity: 1, package_unit: "sachet", package_price: 8000 },
  ],
  "recipe-18": [
    { ingredient_id: "ing-lumpia-skin", ingredient_name: "Kulit Lumpia Siap Pakai", quantity: 10, unit: "lembar", prep_note: "suhu ruang", price_per_unit: 600, package_quantity: 1, package_unit: "pack (10 lbr)", package_price: 6000 },
    { ingredient_id: "ing-duck-egg", ingredient_name: "Telur Bebek / Ayam", quantity: 2, unit: "butir", prep_note: "kocok lepas", price_per_unit: 3500, package_quantity: 2, package_unit: "butir", package_price: 7000 },
    { ingredient_id: "ing-minced-chicken", ingredient_name: "Daging Ayam Cincang Berbumbu Kari", quantity: 100, unit: "gram", prep_note: "tumis matang awal", price_per_unit: 80, package_quantity: 100, package_unit: "gram", package_price: 8000 },
    { ingredient_id: "ing-scallions", ingredient_name: "Daun Bawang", quantity: 3, unit: "batang", prep_note: "iris halus melimpah", price_per_unit: 1000, package_quantity: 1, package_unit: "ikat", package_price: 3000 },
    { ingredient_id: "ing-oil", ingredient_name: "Minyak Goreng", quantity: 200, unit: "ml", prep_note: "untuk menggoreng garing", price_per_unit: 20, package_quantity: 1, package_unit: "kantong", package_price: 4000 },
  ],
  "recipe-19": [
    { ingredient_id: "ing-ground-chicken", ingredient_name: "Daging Ayam Paha Giling", quantity: 300, unit: "gram", prep_note: "berlemak lembut", price_per_unit: 75, package_quantity: 300, package_unit: "gram", package_price: 22500 },
    { ingredient_id: "ing-mushroom", ingredient_name: "Jamur Kuping Basah", quantity: 50, unit: "gram", prep_note: "cincang halus", price_per_unit: 80, package_quantity: 1, package_unit: "bungkus", package_price: 4000 },
    { ingredient_id: "ing-dimsum-skin", ingredient_name: "Kulit Pangsit Khusus Kukus", quantity: 16, unit: "lembar", prep_note: "bentuk siomay", price_per_unit: 500, package_quantity: 1, package_unit: "pack", package_price: 8000 },
    { ingredient_id: "ing-sesame-sauce", ingredient_name: "Minyak Wijen & Saus Tiram", quantity: 2, unit: "sdm", prep_note: "bumbu dasar", price_per_unit: 2750, package_quantity: 1, package_unit: "paket bumbu", package_price: 5500 },
    { ingredient_id: "ing-dimsum-sauce", ingredient_name: "Saus Cabai Cocolan Asam Manis", quantity: 1, unit: "botol kecil", prep_note: "pelengkap saji", price_per_unit: 5000, package_quantity: 1, package_unit: "botol", package_price: 5000 },
  ],
  "recipe-21": [
    { ingredient_id: "ing-egg-omlet", ingredient_name: "Telur Ayam", quantity: 2, unit: "butir", prep_note: "kocok lepas", price_per_unit: 2500, package_quantity: 2, package_unit: "butir", package_price: 5000 },
    { ingredient_id: "ing-carrot-omlet", ingredient_name: "Wortel Manis", quantity: 50, unit: "gram", prep_note: "cincang dadu sangat halus", price_per_unit: 60, package_quantity: 1, package_unit: "buah", package_price: 3000 },
    { ingredient_id: "ing-spinach-omlet", ingredient_name: "Daun Bayam Segar", quantity: 30, unit: "gram", prep_note: "iris halus", price_per_unit: 100, package_quantity: 1, package_unit: "ikat kecil", package_price: 3000 },
    { ingredient_id: "ing-cheese-omlet", ingredient_name: "Keju Cheddar Parut", quantity: 40, unit: "gram", prep_note: "isian lumer", price_per_unit: 225, package_quantity: 1, package_unit: "kotak kecil", package_price: 9000 },
  ],
  "recipe-22": [
    { ingredient_id: "ing-spinach-sayur", ingredient_name: "Daun Bayam Hijau Segar", quantity: 1, unit: "ikat besar", prep_note: "petik daun muda", price_per_unit: 3000, package_quantity: 1, package_unit: "ikat", package_price: 3000 },
    { ingredient_id: "ing-corn-sayur", ingredient_name: "Jagung Manis Muda", quantity: 1, unit: "buah", prep_note: "potong bulat", price_per_unit: 5000, package_quantity: 1, package_unit: "buah", package_price: 5000 },
    { ingredient_id: "ing-kunci-sayur", ingredient_name: "Temu Kunci", quantity: 2, unit: "ruas", prep_note: "memarkan", price_per_unit: 1000, package_quantity: 1, package_unit: "bungkus", package_price: 2000 },
    { ingredient_id: "ing-shallot-sayur", ingredient_name: "Bawang Merah", quantity: 4, unit: "butir", prep_note: "iris tipis", price_per_unit: 750, package_quantity: 1, package_unit: "bungkus", package_price: 3000 },
    { ingredient_id: "ing-seasoning-sayur", ingredient_name: "Garam & Gula Pasir", quantity: 1, unit: "sdt", prep_note: "penyedap rasa", price_per_unit: 1500, package_quantity: 1, package_unit: "sachet", package_price: 3000 },
  ],
  "recipe-23": [
    { ingredient_id: "ing-kwetiau", ingredient_name: "Kwetiau Basah", quantity: 200, unit: "gram", prep_note: "cuci air hangat", price_per_unit: 35, package_quantity: 200, package_unit: "pack", package_price: 7000 },
    { ingredient_id: "ing-egg-kwetiau", ingredient_name: "Telur Ayam", quantity: 1, unit: "butir", prep_note: "orak-arik", price_per_unit: 2500, package_quantity: 1, package_unit: "butir", package_price: 2500 },
    { ingredient_id: "ing-meatball-kwetiau", ingredient_name: "Bakso Sapi", quantity: 3, unit: "butir", prep_note: "iris bulat", price_per_unit: 1500, package_quantity: 1, package_unit: "bungkus (3 butir)", package_price: 4500 },
    { ingredient_id: "ing-greens-kwetiau", ingredient_name: "Sawi Hijau", quantity: 50, unit: "gram", prep_note: "potong sedang", price_per_unit: 40, package_quantity: 1, package_unit: "ikat kecil", package_price: 2000 },
    { ingredient_id: "ing-sauce-kwetiau", ingredient_name: "Kecap Manis & Saus Tiram", quantity: 2, unit: "sdm", prep_note: "campur rata", price_per_unit: 1000, package_quantity: 1, package_unit: "sachet", package_price: 2000 },
  ],
};

// Data alat memasak untuk setiap resep
const mockTools: Record<string, string[]> = {
  "recipe-7": ["Wajan anti-lengket (teflon)", "Spatula silikon", "Mangkuk kecil", "Piring saji"],
  "recipe-8": ["Wajan penggorengan", "Spatula", "Pisau dapur", "Talenan"],
  "recipe-1": ["Wajan besar (Wok)", "Spatula", "Cobek / Ulekan", "Piring saji"],
  "recipe-10": ["Wajan teflon grill / Panggangan", "Kuas masak", "Mangkuk sambal", "Pisau & Talenan"],
  "recipe-9": ["Panci kaldu sedang", "Saringan soto", "Cobek / Blender bumbu", "Mangkok sup"],
  "recipe-2": ["Wajan anti-lengket", "Spatula", "Pisau daging", "Talenan", "Mangkuk marinasi"],
  "recipe-11": ["Panci sup kapasitas 3 liter", "Sendok sayur besar", "Pisau & Talenan", "Mangkuk saji"],
  "recipe-5": ["Wajan kuali besar", "Spatula kayu panjang", "Cobek / Blender bumbu", "Piring saji"],
  "recipe-3": ["Gelas saji 350ml", "Sendok pengaduk panjang", "Saringan teh"],
  "recipe-12": ["Alat peras jeruk manual", "Gelas saji", "Sendok pengaduk", "Saringan biji"],
  "recipe-13": ["Panci kecil", "Saringan minuman", "Gelas tahan panas", "Sendok"],
  "recipe-6": ["Blender listrik", "Gelas saji 400ml", "Sendok takar", "Pisau buah"],
  "recipe-14": ["Mangkuk / Gelas saji besar", "Sendok sayur", "Pisau jelly", "Talenan"],
  "recipe-15": ["Gelas ukur / Shaker kopi", "Sendok panjang", "Gelas kaca saji"],
  "recipe-17": ["Wajan penggorengan", "Serokan tirisan", "Wadah adonan", "Cobek sambal rujak"],
  "recipe-4": ["Wajan cekung", "Spatula & Serokan minyak", "Mangkuk adonan tepung", "Pisau buah"],
  "recipe-16": ["Wajan penggorengan", "Sendok sayur stainless (cetakan)", "Serokan tirisan", "Baskom adonan"],
  "recipe-20": ["Wajan datar anti-lengket (teflon)", "Spatula silikon", "Garpu pelumat", "Mangkuk adonan"],
  "recipe-18": ["Wajan datar / Teflon", "Spatula penggoreng", "Mangkuk kocokan telur", "Talenan melipat"],
  "recipe-19": ["Kukusan (Klakat bambu / Panci kukus)", "Mangkuk adonan", "Sendok takar isian", "Piring saji"],
  "recipe-21": ["Wajan teflon anti-lengket", "Spatula silikon", "Mangkuk kocok telur", "Garpu"],
  "recipe-22": ["Panci kuah sedang", "Sendok sayur", "Pisau dapur & talenan"],
  "recipe-23": ["Wajan wok", "Spatula penggorengan", "Piring saji"],
};

// Data langkah-langkah memasak runut untuk setiap resep
const mockSteps: Record<string, string[]> = {
  "recipe-7": [
    "Panaskan 2 sdm minyak di wajan anti-lengket dengan api sedang.",
    "Tumis bawang putih cincang dan daun bawang iris hingga wangi dan sedikit kecokelatan.",
    "Pecahkan 2 butir telur langsung di atas minyak bawang, biarkan bagian bawah telur matang krispi (rendah minyak).",
    "Tuangkan campuran kecap manis dan kecap asin di sekeliling pinggiran telur, biarkan berbuih harum sebentar.",
    "Angkat dan tuangkan telur beserta minyak kecap panas ke atas sepiring nasi hangat, siap dinikmati.",
  ],
  "recipe-8": [
    "Goreng tempe dan tahu yang telah dipotong dadu hingga setengah matang berkulit, lalu tiriskan.",
    "Tumis bawang merah, bawang putih, lengkuas, dan daun salam hingga harum matang.",
    "Masukkan irisan cabai merah keriting, aduk rata sebentar.",
    "Tambahkan kecap manis, sedikit air (50ml), garam, dan kaldu bubuk, aduk hingga mendidih.",
    "Masukkan tahu dan tempe goreng, masak dengan api kecil sambil diaduk hingga kuah meresap dan bumbu terkaramelisasi.",
  ],
  "recipe-1": [
    "Haluskan bawang merah, bawang putih, cabai rawit, terasi bakar, dan sedikit garam.",
    "Panaskan 3 sdm minyak goreng dalam wajan wajan (wok) dengan api sedang ke tinggi.",
    "Tumis bumbu halus hingga matang tanak dan harum semerbak.",
    "Sisihkan bumbu di tepi wajan, masukkan telur kocok lalu buat orak-arik hingga matang.",
    "Masukkan nasi putih dingin, aduk cepat bersama bumbu dan telur dengan gerakan menekan agar butiran nasi tidak menggumpal.",
    "Tuangkan kecap manis di pinggiran wajan panas agar aroma smokey keluar, aduk rata dan koreksi rasa sebelum disajikan.",
  ],
  "recipe-10": [
    "Lumuri ikan kembung dengan perasan jeruk nipis, ketumbar halus, garam, dan kunyit, diamkan 10 menit.",
    "Panaskan wajan teflon grill, olesi sedikit minyak, lalu bakar ikan kembung hingga kedua sisinya matang sempurna dan kecokelatan.",
    "Untuk sambal colo-colo: campur irisan tomat hijau, tomat merah, cabai rawit, dan bawang merah dalam mangkuk.",
    "Beri perasan jeruk nipis dan tuangkan kecap manis secukupnya ke campuran sambal, aduk rata.",
    "Tata ikan kembung bakar di piring saji, lalu siram sambal colo-colo segar di atasnya.",
  ],
  "recipe-9": [
    "Rebus daging ayam dalam 1 liter air dengan api kecil hingga empuk untuk menghasilkan kaldu gurih.",
    "Tumis bumbu soto kuning (kunyit, jahe, bawang, kemiri) bersama serai dan daun jeruk hingga harum, lalu masukkan ke dalam panci rebusan ayam.",
    "Angkat daging ayam, tiriskan lalu goreng sebentar hingga berkulit, kemudian suwir-suwir.",
    "Untuk bubuk koya: tumbuk kerupuk udang matang bersama bawang putih goreng hingga menjadi bubuk renyah.",
    "Tata soun, kol, tauge, dan suwiran ayam di mangkuk, siram dengan kuah soto kuning panas, lalu taburi bubuk koya melimpah.",
  ],
  "recipe-2": [
    "Marinasi potongan ayam fillet dengan 2 sdm saus teriyaki, bawang putih parut, dan jahe selama 15 menit.",
    "Panaskan sedikit minyak di wajan anti-lengket, masukkan potongan ayam dan masak hingga berubah warna dan matang merata.",
    "Masukkan irisan bawang bombai, tumis sebentar hingga layu dan harum.",
    "Tuangkan sisa saus teriyaki dan sedikit air, masak dengan api sedang hingga saus mengental dan menyelimuti daging ayam.",
    "Beri tetesan minyak wijen, aduk sebentar, lalu angkat dan taburi wijen sangrai di atasnya.",
  ],
  "recipe-11": [
    "Rebus potongan daging sapi dengan 1.5 liter air mendidih. Buang buih kotoran pertama, lalu rebus kembali dengan api kecil hingga daging empuk.",
    "Tumis bawang putih geprek dan pala halus hingga wangi, lalu masukkan ke dalam rebusan kaldu daging.",
    "Masukkan potongan kentang dan wortel, masak selama 10 menit hingga sayuran mulai empuk.",
    "Masukkan buncis, garam, gula, dan merica bubuk, masak 3 menit lagi.",
    "Sajikan sup hangat dengan taburan daun bawang, seledri segar, dan bawang goreng renyah.",
  ],
  "recipe-5": [
    "Tumis bumbu halus rendang bersama serai, daun kunyit, daun jeruk, dan asam kandis hingga harum dan matang tanak.",
    "Masukkan potongan daging sapi gandik, aduk rata hingga daging berubah warna dan mengencang.",
    "Tuangkan santan cair secara bertahap sambil diaduk perlahan agar santan tidak pecah.",
    "Setelah kuah menyusut, tuangkan santan kental dan masak dengan api kecil (proses kalio).",
    "Teruskan memasak perlahan sambil diaduk sesekali hingga minyak kelapa keluar, kuah mengering kehitaman, dan bumbu meresap sempurna.",
  ],
  "recipe-3": [
    "Seduh teh melati celup atau tubruk dengan 150ml air panas mendidih selama 3-4 menit hingga pekat.",
    "Tambahkan 2 sdm gula pasir, aduk hingga larut merata.",
    "Siapkan gelas saji yang sudah diisi es batu kristal melimpah.",
    "Tuangkan air seduhan teh manis hangat ke dalam gelas es batu, aduk hingga dingin menyegarkan.",
  ],
  "recipe-12": [
    "Belah jeruk peras manis menjadi dua bagian melintang.",
    "Peras menggunakan alat pemeras jeruk manual dan saring bijinya.",
    "Larutkan gula pasir dengan 50ml air hangat, lalu tuangkan ke sari jeruk peras murni.",
    "Tambahkan es batu kristal ke dalam gelas, aduk hingga dingin sejuk dan siap disajikan.",
  ],
  "recipe-13": [
    "Bakar jahe emprit sebentar di atas api kecil, kupas kulit kasarnya, lalu memarkan hingga pipih.",
    "Didihkan 500ml air di panci kecil, masukkan jahe geprek dan batang serai yang sudah dimemarkan.",
    "Rebus dengan api kecil selama 10-15 menit agar sari pedas hangat jahe keluar sempurna.",
    "Masukkan sisiran gula aren, aduk hingga gula larut sempurna.",
    "Saring air wedang ke dalam cangkir saji tahan panas, nikmati selagi hangat.",
  ],
  "recipe-6": [
    "Kupas mangga harum manis matang, potong-potong dadu daging buahnya.",
    "Masukkan potongan mangga, yogurt tawar dingin, madu murni, dan es batu ke dalam tabung blender.",
    "Blender dengan kecepatan tinggi selama 45-60 detik hingga teksturnya lembut kental merata.",
    "Tuangkan ke dalam gelas saji tinggi, hias dengan potongan mangga kecil di atasnya.",
  ],
  "recipe-14": [
    "Potong cincau hitam menjadi dadu berukuran 1.5 cm, cuci dengan air matang dingin.",
    "Siapkan mangkuk atau gelas saji, masukkan potongan cincau hitam.",
    "Tuangkan susu kedelai dingin secukupnya.",
    "Tambahkan sirup pandan atau gula merah cair sesuai tingkat manis yang diinginkan, aduk lembut.",
  ],
  "recipe-15": [
    "Seduh kopi espresso atau bubuk kopi robusta dengan 60ml air panas hingga menghasilkan ekstrak kopi kental.",
    "Tuangkan sirup gula aren cair di dasar gelas saji.",
    "Masukkan es batu hingga memenuhi 3/4 volume gelas.",
    "Tuangkan susu evaporasi atau susu cair dingin secara perlahan agar membentuk lapisan.",
    "Tuangkan ekstrak kopi hitam di lapisan paling atas, aduk rata sebelum diminum.",
  ],
  "recipe-17": [
    "Buat adonan biang: campur 2 sdm tapioka dengan 150ml air, bawang putih halus, garam, dan kaldu bubuk di panci kecil. Masak hingga mengental seperti lem bening.",
    "Tuangkan adonan biang panas ke dalam sisa tepung tapioka kering dan irisan daun bawang.",
    "Aduk asal dengan garpu atau ujung jari (jangan diuleni kalis agar cireng tidak alot).",
    "Bentuk pipih adonan, lalu goreng dalam minyak panas api sedang hingga mekar krispi dan matang.",
    "Untuk bumbu rujak: ulek cabai rawit, gula merah, sedikit asam jawa, garam, dan air hangat hingga larut pedas kental.",
  ],
  "recipe-4": [
    "Kupas pisang kepok kuning, belah menjadi 2-3 bagian membentuk kipas tanpa putus di pangkal.",
    "Campur tepung beras, tepung terigu, gula pasir, sedikit garam, dan air es hingga menjadi adonan celup yang pas (tidak terlalu encer).",
    "Celupkan pisang ke dalam adonan tepung hingga rata ke seluruh sela-sela.",
    "Goreng dalam minyak panas berlimpah dengan api sedang hingga berwarna kuning keemasan dan kulitnya renyah krispi.",
    "Angkat dan tiriskan di atas serokan kawat, sajikan selagi hangat.",
  ],
  "recipe-16": [
    "Campur irisan kol, wortel, tauge, dan daun bawang dalam wadah baskom.",
    "Tambahkan tepung terigu, ketumbar bubuk, bawang putih halus, garam, dan merica.",
    "Tuang air dingin sedikit demi sedikit sambil diaduk hingga sayuran terikat adonan tepung kental.",
    "Panaskan minyak banyak. Ambil 1 sendok sayur adonan, tuangkan di tepi wajan agar pipih melebar.",
    "Goreng hingga bakwan kering keemasan dan renyah garing, tiriskan dan sajikan dengan cabai rawit hijau.",
  ],
  "recipe-20": [
    "Lumatkan pisang ambon matang dengan garpu di mangkuk hingga halus.",
    "Tambahkan telur ayam dan susu cair, aduk dengan whisk hingga tercampur rata.",
    "Masukkan tepung terigu dan baking powder yang sudah diayak, aduk lipat perlahan hingga adonan menyatu tanpa gumpalan.",
    "Panaskan wajan teflon anti-lengket dengan api kecil, oles sedikit margarin.",
    "Tuang 1 sendok sayur adonan, masak hingga muncul gelembung berpori di permukaan, lalu balik dan masak 1 menit lagi.",
    "Angkat tumpuk pancake, lalu siram dengan saus cokelat lumer selagi hangat.",
  ],
  "recipe-18": [
    "Kocok telur bebek bersama daun bawang iris, garam, dan bumbu kari bubuk.",
    "Campurkan tumisan daging ayam cincang matang ke dalam adonan telur.",
    "Siapkan selembar kulit lumpia di atas piring datar, beri 2 sdm isian telur daun bawang di tengahnya, lalu lipat rapi seperti amplop.",
    "Panaskan wajan datar dengan minyak secukupnya, goreng martabak dengan lipatan menghadap bawah terlebih dahulu.",
    "Goreng hingga kedua sisinya kuning kecokelatan dan renyah garing, angkat dan potong-potong siap disajikan.",
  ],
  "recipe-19": [
    "Campur daging ayam paha giling, cincangan jamur kuping, putih telur, bawang putih halus, saus tiram, minyak wijen, dan tepung sagu.",
    "Aduk adonan hingga kalis kenyal dan saling menyatu.",
    "Ambil selembar kulit pangsit kukus, beri 1 sdm adonan di tengah, lalu lipat dan rapikan tepiannya ke atas menyerupai bunga siomay.",
    "Beri sedikit parutan wortel di bagian atas sebagai pemanis warna.",
    "Panaskan kukusan yang sudah diolesi sedikit minyak, kukus dimsum selama 20-25 menit hingga matang empuk.",
    "Sajikan hangat bersama saus cocolan cabai asam manis.",
  ],
  "recipe-21": [
    "Kocok telur ayam bersama cincangan wortel, bayam halus, dan sedikit garam serta lada.",
    "Panaskan wajan teflon anti-lengket dengan api kecil, beri 1 sdt margarin.",
    "Tuang adonan telur dan ratakan, masak perlahan hingga bagian bawah mulai kokoh.",
    "Taburkan keju cheddar parut di atas salah satu sisi omelet, lalu lipat dua menjadi setengah lingkaran.",
    "Masak sebentar hingga keju lumer meleleh, angkat dan sajikan selagi hangat.",
  ],
  "recipe-22": [
    "Didihkan 750ml air dalam panci bersama irisan bawang merah dan temu kunci geprek hingga harum.",
    "Masukkan potongan jagung manis muda, rebus dengan api sedang sekitar 5 menit hingga matang manis.",
    "Bumbui kuah dengan garam dan gula pasir secukupnya, aduk rata dan koreksi rasa kuah bening.",
    "Masukkan daun bayam hijau segar, masak cepat selama 1-2 menit saja agar daun tetap hijau segar dan tidak layu berlebih.",
    "Angkat dan tuang ke dalam mangkuk saji, nikmati hangat bersama lauk pendamping.",
  ],
  "recipe-23": [
    "Panaskan 2 sdm minyak di wajan wok dengan api besar, tumis bawang putih hingga wangi.",
    "Pecahkan telur ke wajan, orak-arik cepat hingga matang berkulit.",
    "Masukkan irisan bakso sapi dan sawi hijau, aduk cepat hingga sawi sedikit layu.",
    "Masukkan kwetiau basah, tuangkan kecap manis, saus tiram, dan sedikit merica.",
    "Aduk rata dengan api besar hingga tercium aroma gosong harum khas wajan (wok-hei), angkat dan sajikan.",
  ],
};

// Data video tutorial kurasi (Hanya diverifikasi jika video aktif, lolos oEmbed YouTube, dan relevan dengan resep)
export const mockVideos: Record<string, RecipeVideo> = {
  // 1. Nasi Goreng Kampung
  "recipe-1": {
    platform: "youtube",
    video_id: "oyF-9otkSy0",
    url: "https://www.youtube.com/watch?v=oyF-9otkSy0",
    title: "Cukup 4 Menit! Resep NASI GORENG KAMPUNG JADUL",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 2. Ayam Teriyaki Rumahan
  "recipe-2": {
    platform: "youtube",
    video_id: "cu73eSCdG5k",
    url: "https://www.youtube.com/watch?v=cu73eSCdG5k",
    title: "Empuk & Meresap! Resep CHICKEN TERIYAKI: Praktis Bikin di Rumah",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 3. Pisang Goreng Crispy
  "recipe-4": {
    platform: "youtube",
    video_id: "GlSRjTrWBpA",
    url: "https://www.youtube.com/watch?v=GlSRjTrWBpA",
    title: "Resep Pisang Goreng Madu yang Garing & Empuk",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 4. Rendang Daging Sapi Padang
  "recipe-5": {
    platform: "youtube",
    video_id: "GNfRXKsvG04",
    url: "https://www.youtube.com/watch?v=GNfRXKsvG04",
    title: "Empuk, Meresap, Tahan Lama! Resep Rendang Daging Khas Padang",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 5. Smoothie Mangga Madu - Simulasi video valid dengan pemutaran dibatasi kreator (uji alternatif link YouTube)
  "recipe-6": {
    platform: "youtube",
    video_id: "II3ngDuIt0E",
    url: "https://www.youtube.com/watch?v=II3ngDuIt0E",
    title: "Membuat Smoothies Mangga Dirumah Asli Nyegerin Enak Banget",
    channel_name: "Puguh Kristanto Kitchen",
    is_verified: true,
    embed_allowed: false, // Embed dibatasi oleh kreator, UI menampilkan alternatif tombol ke YouTube langsung
  },
  // 6. Nasi Telur Kecap Pontianak
  "recipe-7": {
    platform: "youtube",
    video_id: "PY0q2ANe_gY",
    url: "https://www.youtube.com/watch?v=PY0q2ANe_gY",
    title: "Murah Bukan Murahan! Resep NASI TELUR CEPLOK [Scallion Oil]",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 7. Tahu Tempe Orek Manis Gurih
  "recipe-8": {
    platform: "youtube",
    video_id: "RZwbPJIiows",
    url: "https://www.youtube.com/watch?v=RZwbPJIiows",
    title: "Resep Tempe Orek Khas Sunda",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 8. Soto Ayam Lamongan Kuah Koya
  "recipe-9": {
    platform: "youtube",
    video_id: "ljKgmrjmqk4",
    url: "https://www.youtube.com/watch?v=ljKgmrjmqk4",
    title: "Soto Ayam Khas Lamongan Koya Gurih",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 9. Ikan Kembung Bakar Sambal Colo-Colo
  "recipe-10": {
    platform: "youtube",
    video_id: "YwC7mB8glkE",
    url: "https://www.youtube.com/watch?v=YwC7mB8glkE",
    title: "Cukup Pakai Teflon! Resep IKAN KEMBUNG BAKAR SAMBAL COLO-COLO",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 10. Sup Daging Sapi Wortel Kentang
  "recipe-11": {
    platform: "youtube",
    video_id: "UXfavkVsso4",
    url: "https://www.youtube.com/watch?v=UXfavkVsso4",
    title: "Kuahnya Segar, Dagingnya Lembut! Resep SOP SENGKEL",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },

  // 12. Bakwan Sayur Renyah Gurih
  "recipe-16": {
    platform: "youtube",
    video_id: "tVCaK158ar8",
    url: "https://www.youtube.com/watch?v=tVCaK158ar8",
    title: "Gurih Renyah! Resep BAKWAN SAYUR SAMBAL KACANG",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 13. Cireng Krispi Bumbu Rujak
  "recipe-17": {
    platform: "youtube",
    video_id: "wHQcNL2_8yI",
    url: "https://www.youtube.com/watch?v=wHQcNL2_8yI",
    title: "Garing Kopong! Resep CIRENG KRISPI MONTOK BUMBU RUJAK",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 14. Martabak Telur Kulit Lumpia
  "recipe-18": {
    platform: "youtube",
    video_id: "jbcv73hjUxY",
    url: "https://www.youtube.com/watch?v=jbcv73hjUxY",
    title: "Jangan Didadar! Resep Telur Camilan Satu Keluarga Suka",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // 15. Dimsum Ayam Jamur Kukus
  "recipe-19": {
    platform: "youtube",
    video_id: "Y6CPyuQ1jAU",
    url: "https://www.youtube.com/watch?v=Y6CPyuQ1jAU",
    title: "Murah Bukan Murahan! Resep Dimsum Ayam Istimewa",
    channel_name: "Devina Hermawan",
    is_verified: true,
    embed_allowed: true,
  },
  // Resep-resep lain (recipe-3, recipe-12, recipe-13, recipe-14, recipe-20) sengaja TIDAK dimasukkan
  // agar menampilkan status "Video tutorial belum tersedia" sesuai PRD dan instruksi pengguna (tanpa video palsu).
};

/**
 * Hitung biaya belanja dan konsumsi yang disesuaikan dengan jumlah porsi yang dipilih pengguna.
 * Aturan PRD:
 * - Takaran disesuaikan dengan jumlah porsi.
 * - Kemasan bahan dibulatkan ke kelipatan paket pembelian pasar (pembelian tidak bisa pecahan paket acuan).
 * - Biaya belanja (shopping_cost) inilah yang dibandingkan dengan budget pengguna.
 */
export function calculateScaledCost(recipeId: string, baseServings: number, targetServings: number) {
  const base = mockBaseCosts[recipeId] ?? { consumption_cost: 15000, shopping_cost: 25000 };
  const safeServings = Math.max(1, Math.round(targetServings));
  const safeBaseServings = Math.max(1, baseServings);

  // Pembulatan ke kelipatan paket belanja pasar:
  const packageBatches = Math.ceil(safeServings / safeBaseServings);
  const total_shopping_cost = base.shopping_cost * packageBatches;

  // Biaya konsumsi proporsional langsung dengan porsi:
  const total_consumption_cost = Math.round((base.consumption_cost / safeBaseServings) * safeServings);

  // Biaya per porsi dihitung dari biaya belanja dibagi jumlah porsi yang dimasak:
  const cost_per_serving = Math.round(total_shopping_cost / safeServings);

  return {
    total_shopping_cost,
    total_consumption_cost,
    cost_per_serving,
    cost_status: "simulasi" as const,
  };
}

// Mock service functions
export const mockRecipeService = {
  async searchRecipes(filters: SearchFilters, page = 1, limit = 12): Promise<PaginatedResponse<RecipeWithCost>> {
    await new Promise((resolve) => setTimeout(resolve, 150)); // Simulasikan delay jaringan

    const targetServings = filters.servings && filters.servings > 0 ? filters.servings : 2;

    const filtered = mockRecipes.filter((recipe) => {
      if (recipe.status !== "published") return false;

      // Filter kategori wajib
      if (recipe.category !== filters.category) return false;

      // Hitung shopping cost sesuai jumlah porsi yang dipilih
      const cost = calculateScaledCost(recipe.id, recipe.base_servings, targetServings);

      // Filter ketat budget: jika estimasi belanja melebihi budget, TOLAK (tidak boleh lolos)
      if (cost.total_shopping_cost > filters.budget) return false;

      // Filter opsional: tingkat kesulitan
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;

      // Filter opsional: waktu memasak maksimal
      if (filters.max_cooking_minutes && (recipe.prep_minutes + recipe.cook_minutes) > filters.max_cooking_minutes) {
        return false;
      }

      // Filter opsional: pencarian query nama / deskripsi
      if (filters.query) {
        const queryLower = filters.query.toLowerCase().trim();
        if (queryLower) {
          const nameMatch = recipe.name.toLowerCase().includes(queryLower);
          const descMatch = recipe.description.toLowerCase().includes(queryLower);
          if (!nameMatch && !descMatch) return false;
        }
      }

      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    const data: RecipeWithCost[] = paged.map((recipe) => {
      const cost = calculateScaledCost(recipe.id, recipe.base_servings, targetServings);
      const nutrition = mockNutrition[recipe.id]?.per_serving ?? {
        calories_kcal: 250,
        protein_g: 10,
        carbs_g: 30,
        fat_g: 8,
        source: "Data simulasi (estimasi nilai gizi per porsi)",
        is_simulated: true,
      };

      const ingredients = mockIngredients[recipe.id] ?? [];
      const tools = mockTools[recipe.id] ?? [];
      const steps = mockSteps[recipe.id] ?? [];
      const video = mockVideos[recipe.id];

      return {
        ...recipe,
        total_consumption_cost: cost.total_consumption_cost,
        total_shopping_cost: cost.total_shopping_cost,
        cost_per_serving: cost.cost_per_serving,
        cost_status: "simulasi",
        scaled_servings: targetServings,
        ingredients,
        tools,
        steps,
        nutrition,
        video,
      };
    });

    return { data, meta: { page, limit, total, total_pages: totalPages } };
  },

  async getRecipeBySlug(slug: string, targetServings?: number): Promise<RecipeWithCost | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const recipe = mockRecipes.find((r) => r.slug === slug && r.status === "published");
    if (!recipe) return null;

    const servings = targetServings && targetServings > 0 ? targetServings : recipe.base_servings;
    const cost = calculateScaledCost(recipe.id, recipe.base_servings, servings);
    const nutrition = mockNutrition[recipe.id]?.per_serving ?? {
      calories_kcal: 250,
      protein_g: 10,
      carbs_g: 30,
      fat_g: 8,
      source: "Data simulasi (estimasi nilai gizi per porsi)",
      is_simulated: true,
    };

    const ingredients = mockIngredients[recipe.id] ?? [];
    const tools = mockTools[recipe.id] ?? [];
    const steps = mockSteps[recipe.id] ?? [];
    const video = mockVideos[recipe.id];

    return {
      ...recipe,
      total_consumption_cost: cost.total_consumption_cost,
      total_shopping_cost: cost.total_shopping_cost,
      cost_per_serving: cost.cost_per_serving,
      cost_status: "simulasi",
      scaled_servings: servings,
      ingredients,
      tools,
      steps,
      nutrition,
      video,
    };
  },

  /**
   * Mengambil resep populer untuk ditampilkan di section beranda.
   * Dipisahkan dari hasil pencarian dinamis agar mencakup hidangan favorit dari berbagai kategori.
   */
  async getPopularRecipes(limit = 4): Promise<RecipeWithCost[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Pilihan resep populer unggulan lintas kategori
    const popularIds = ["recipe-1", "recipe-2", "recipe-4", "recipe-12"];
    const popular = mockRecipes
      .filter((r) => r.status === "published" && popularIds.includes(r.id))
      .slice(0, limit);

    return popular.map((recipe) => {
      const cost = calculateScaledCost(recipe.id, recipe.base_servings, recipe.base_servings);
      const nutrition = mockNutrition[recipe.id]?.per_serving ?? {
        calories_kcal: 250,
        protein_g: 10,
        carbs_g: 30,
        fat_g: 8,
        source: "Data simulasi (estimasi nilai gizi per porsi)",
        is_simulated: true,
      };

      const ingredients = mockIngredients[recipe.id] ?? [];
      const tools = mockTools[recipe.id] ?? [];
      const steps = mockSteps[recipe.id] ?? [];

      return {
        ...recipe,
        total_consumption_cost: cost.total_consumption_cost,
        total_shopping_cost: cost.total_shopping_cost,
        cost_per_serving: cost.cost_per_serving,
        cost_status: "simulasi",
        scaled_servings: recipe.base_servings,
        ingredients,
        tools,
        steps,
        nutrition,
      };
    });
  },

  async getFeaturedRecipes(limit = 3): Promise<RecipeWithCost[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const featured = mockRecipes.filter((r) => r.status === "published" && r.category === "makanan").slice(0, limit);
    return featured.map((recipe) => {
      const cost = calculateScaledCost(recipe.id, recipe.base_servings, recipe.base_servings);
      const nutrition = mockNutrition[recipe.id]?.per_serving ?? {
        calories_kcal: 250,
        protein_g: 10,
        carbs_g: 30,
        fat_g: 8,
        source: "Data simulasi (estimasi nilai gizi per porsi)",
        is_simulated: true,
      };

      const ingredients = mockIngredients[recipe.id] ?? [];
      const tools = mockTools[recipe.id] ?? [];
      const steps = mockSteps[recipe.id] ?? [];

      return {
        ...recipe,
        total_consumption_cost: cost.total_consumption_cost,
        total_shopping_cost: cost.total_shopping_cost,
        cost_per_serving: cost.cost_per_serving,
        cost_status: "simulasi",
        scaled_servings: recipe.base_servings,
        ingredients,
        tools,
        steps,
        nutrition,
      };
    });
  },

  async getCategories(): Promise<RecipeCategory[]> {
    return ["makanan", "minuman", "camilan"];
  },

  async getDifficulties(): Promise<RecipeDifficulty[]> {
    return ["mudah", "sedang", "sulit"];
  },

  /**
   * Mengambil seluruh data resep untuk modul Admin (termasuk status published, draft, dan archived).
   */
  async getAllRecipesForAdmin(): Promise<RecipeWithCost[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockRecipes.map((recipe) => {
      const cost = calculateScaledCost(recipe.id, recipe.base_servings, recipe.base_servings);
      const nutrition = mockNutrition[recipe.id]?.per_serving ?? {
        calories_kcal: 250,
        protein_g: 10,
        carbs_g: 30,
        fat_g: 8,
        source: "Data simulasi (estimasi)",
        is_simulated: true,
      };

      const ingredients = mockIngredients[recipe.id] ?? [];
      const tools = mockTools[recipe.id] ?? [];
      const steps = mockSteps[recipe.id] ?? [];
      const video = mockVideos[recipe.id];

      return {
        ...recipe,
        total_consumption_cost: cost.total_consumption_cost,
        total_shopping_cost: cost.total_shopping_cost,
        cost_per_serving: cost.cost_per_serving,
        cost_status: "simulasi",
        scaled_servings: recipe.base_servings,
        ingredients,
        tools,
        steps,
        nutrition,
        video,
      };
    });
  },
};
