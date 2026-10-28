import type {
  ImportCandidate,
  ImportSource,
  ImportType,
} from "@/types/import";
import { mockRecipeService } from "./mock";
import { mockIngredientService } from "./ingredient-mock";

export const mockImportSources: ImportSource[] = [
  {
    id: "src-open-recipe",
    name: "OpenRecipe ID API (v1.2)",
    base_url: "https://api.openrecipe.id",
    default_license: "CC-BY-4.0",
    is_verified_license: true,
    attribution_required: true,
    terms_note:
      "API data terbuka berlisensi Creative Commons Attribution 4.0. Memerlukan penulisan nama sumber dan kreator asli.",
  },
  {
    id: "src-pangan-nusantara",
    name: "PanganNusantara Open Dataset",
    base_url: "https://data.pangannusantara.go.id",
    default_license: "ODC-By",
    is_verified_license: true,
    attribution_required: true,
    terms_note:
      "Dataset bahan pangan dan komoditas pasar terbuka berlisensi Open Data Commons Attribution (ODC-By).",
  },
  {
    id: "src-kuliner-komunitas",
    name: "Komunitas Resep Rumahan Terbuka",
    base_url: "https://komunitas.dapurterbuka.org",
    default_license: "CC0-PublicDomain",
    is_verified_license: true,
    attribution_required: false,
    terms_note:
      "Kontribusi publik yang didedikasikan secara sukarela ke Domain Publik (CC0 1.0 Universal). Bebas digunakan tanpa pembatasan.",
  },
  {
    id: "src-food-blog-unverified",
    name: "Blog MasakKuy Eksklusif (Restricted)",
    base_url: "https://masakkuy-blog.id",
    default_license: "Proprietary-Restricted",
    is_verified_license: false,
    attribution_required: true,
    terms_note:
      "PERINGATAN LISENSI: Situs komersial tanpa lisensi data terbuka. Sesuai PRD Bab 5.2, scraping konten tanpa izin hak cipta dilarang keras.",
  },
];

export const initialImportCandidates: ImportCandidate[] = [
  {
    id: "imp-001",
    batch_id: "batch-20261028-01",
    type: "recipe",
    source_id: "src-open-recipe",
    source_name: "OpenRecipe ID API (v1.2)",
    source_url: "https://api.openrecipe.id/v1/recipes/sayur-asem-betawi",
    external_id: "or-9842",
    license: "CC-BY-4.0",
    license_notes: "Lisensi CC-BY 4.0 terverifikasi. Nama kreator: Dapur Ibu Eni.",
    is_license_compliant: true,
    title: "Sayur Asem Khas Betawi Segar",
    status: "needs_review",
    created_at: "2026-10-28T09:15:00Z",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 18,
      match_type: "none",
      reason: "Tidak ditemukan resep Sayur Asem pada katalog aktif DapurCuan.",
    },
    validation_issues: [],
    can_approve: true,
    recipe_data: {
      name: "Sayur Asem Khas Betawi Segar",
      slug: "sayur-asem-khas-betawi-segar",
      category: "makanan",
      description:
        "Sayur asem berkuah keruh khas Betawi dengan kacang tanah, melinjo, jagung manis, dan belimbing wuluh yang asam menyegarkan.",
      base_servings: 4,
      prep_time_minutes: 15,
      cook_time_minutes: 25,
      difficulty: "mudah",
      image_url:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80",
      ingredients: [
        { name: "Jagung Manis", quantity: 1, unit: "buah", estimated_cost_idr: 4000 },
        { name: "Labu Siam", quantity: 1, unit: "buah", estimated_cost_idr: 3000 },
        { name: "Kacang Panjang", quantity: 100, unit: "gram", estimated_cost_idr: 2500 },
        { name: "Kacang Tanah", quantity: 50, unit: "gram", estimated_cost_idr: 3000 },
        { name: "Melinjo dan Daun Melinjo", quantity: 1, unit: "ikat", estimated_cost_idr: 3000 },
        { name: "Asam Jawa Muda", quantity: 3, unit: "buah", estimated_cost_idr: 1500 },
      ],
      tools: ["Panci Sedang", "Ulekan / Cobek", "Sendok Sayur"],
      steps: [
        { step_number: 1, instruction: "Didihkan 1.500 ml air dalam panci bersama bumbu halus (bawang merah, cabai merah, terasi bakar, kemiri)." },
        { step_number: 2, instruction: "Masukkan jagung manis, melinjo, dan kacang tanah terlebih dahulu hingga empuk." },
        { step_number: 3, instruction: "Tambahkan labu siam, asam jawa muda, lengkuas, dan daun salam. Masak sampai labu matang." },
        { step_number: 4, instruction: "Masukkan kacang panjang dan daun melinjo, bumbui garam dan gula merah. Masak 3 menit, lalu sajikan hangat." },
      ],
      nutrition: {
        calories: 145,
        protein: 5,
        carbs: 26,
        fat: 3,
      },
      video_url: "https://www.youtube.com/watch?v=kYvH57-example",
    },
  },
  {
    id: "imp-002",
    batch_id: "batch-20261028-01",
    type: "recipe",
    source_id: "src-kuliner-komunitas",
    source_name: "Komunitas Resep Rumahan Terbuka",
    source_url: "https://komunitas.dapurterbuka.org/r/nasi-goreng-kampung-telur",
    external_id: "kom-4412",
    license: "CC0-PublicDomain",
    license_notes: "Lisensi CC0 Domain Publik. Kontribusi terbuka.",
    is_license_compliant: true,
    title: "Nasi Goreng Kampung Orak Arik Telur",
    status: "needs_review",
    created_at: "2026-10-28T09:20:00Z",
    duplicate_check: {
      is_duplicate: true,
      similarity_score: 91,
      match_type: "similar_name",
      existing_id: "recipe-1",
      existing_name: "Nasi Goreng Kampung",
      reason:
        "Kemiripan nama 91% dan susunan bahan 88% identik dengan resep terbitan 'recipe-1: Nasi Goreng Kampung'. Disarankan tolak atau gabungkan.",
    },
    validation_issues: [
      {
        field: "duplicate",
        message: "Potensi duplikasi tinggi terhadap resep 'Nasi Goreng Kampung' yang sudah aktif.",
        severity: "warning",
      },
    ],
    can_approve: true, // Can approve if admin deliberately wants an alternative, but shows warning
    recipe_data: {
      name: "Nasi Goreng Kampung Orak Arik Telur",
      slug: "nasi-goreng-kampung-orak-arik-telur",
      category: "makanan",
      description:
        "Nasi goreng bumbu bawang merah, bawang putih, cabai rawit dengan orak-arik telur gurih tanpa kecap manis.",
      base_servings: 2,
      prep_time_minutes: 8,
      cook_time_minutes: 12,
      difficulty: "mudah",
      image_url:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=640&q=80",
      ingredients: [
        { name: "Nasi Putih Dingin", quantity: 400, unit: "gram", estimated_cost_idr: 6000 },
        { name: "Telur Ayam", quantity: 2, unit: "butir", estimated_cost_idr: 5000 },
        { name: "Bawang Merah", quantity: 5, unit: "siung", estimated_cost_idr: 2000 },
        { name: "Bawang Putih", quantity: 3, unit: "siung", estimated_cost_idr: 1500 },
        { name: "Cabai Rawit Merah", quantity: 5, unit: "buah", estimated_cost_idr: 1000 },
        { name: "Terasi Bakar", quantity: 0.5, unit: "sdt", estimated_cost_idr: 500 },
      ],
      tools: ["Wajan Penggorengan", "Spatula"],
      steps: [
        { step_number: 1, instruction: "Tumis bumbu halus bawang merah, bawang putih, cabai rawit, dan terasi hingga harum." },
        { step_number: 2, instruction: "Sisihkan bumbu di tepi wajan, ceplok telur lalu orak-arik hingga setengah matang." },
        { step_number: 3, instruction: "Masukkan nasi putih dingin, aduk rata dengan api besar sampai bulir nasi berasap harum." },
      ],
      nutrition: {
        calories: 380,
        protein: 11,
        carbs: 58,
        fat: 12,
      },
    },
  },
  {
    id: "imp-003",
    batch_id: "batch-20261028-01",
    type: "recipe",
    source_id: "src-open-recipe",
    source_name: "OpenRecipe ID API (v1.2)",
    source_url: "https://api.openrecipe.id/v1/recipes/ayam-goreng-lengkuas",
    external_id: "or-5521",
    license: "CC-BY-4.0",
    license_notes: "Lisensi CC-BY 4.0 terverifikasi.",
    is_license_compliant: true,
    title: "Ayam Goreng Lengkuas Rempah",
    status: "needs_review",
    created_at: "2026-10-28T09:30:00Z",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 30,
      match_type: "none",
      reason: "Nama resep unik, belum ada di katalog.",
    },
    validation_issues: [
      {
        field: "steps",
        message: "Langkah instruksi memasak kosong dari data penyedia.",
        severity: "error",
      },
      {
        field: "image_url",
        message: "URL foto masakan belum tersedia.",
        severity: "error",
      },
    ],
    can_approve: false, // Incomplete fields block approval
    recipe_data: {
      name: "Ayam Goreng Lengkuas Rempah",
      slug: "ayam-goreng-lengkuas-rempah",
      category: "makanan",
      description: "Ayam ungkep rempah gurih bertabur serundeng parutan lengkuas garing keemasan.",
      base_servings: 4,
      prep_time_minutes: 20,
      cook_time_minutes: 30,
      difficulty: "sedang",
      image_url: "",
      ingredients: [
        { name: "Daging Ayam", quantity: 500, unit: "gram", estimated_cost_idr: 25000 },
        { name: "Lengkuas Muda Parut", quantity: 150, unit: "gram", estimated_cost_idr: 4000 },
        { name: "Kunyit dan Bumbu Halus", quantity: 1, unit: "porsi", estimated_cost_idr: 3000 },
      ],
      tools: ["Wajan Dalam", "Saringan Minyak"],
      steps: [], // EMPTY STEPS triggers validation error!
    },
  },
  {
    id: "imp-004",
    batch_id: "batch-20261028-02",
    type: "recipe",
    source_id: "src-food-blog-unverified",
    source_name: "Blog MasakKuy Eksklusif (Restricted)",
    source_url: "https://masakkuy-blog.id/resep/rendang-padang-asli",
    external_id: "mk-993",
    license: "Proprietary-Restricted",
    license_notes:
      "Konten blog berhak cipta (All Rights Reserved). Tidak mengizinkan redistribusi tanpa izin tertulis.",
    is_license_compliant: false,
    title: "Rendang Daging Sapi Payakumbuh",
    status: "needs_review",
    created_at: "2026-10-28T10:00:00Z",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 25,
      match_type: "none",
      reason: "Resep unik, namun terkendala lisensi.",
    },
    validation_issues: [
      {
        field: "license",
        message:
          "PELANGGARAN LISENSI: Sumber bersumber dari situs komersial tanpa lisensi data terbuka. Sesuai PRD Bab 5.2, impor konten ini tidak dapat disetujui.",
        severity: "error",
      },
    ],
    can_approve: false,
    recipe_data: {
      name: "Rendang Daging Sapi Payakumbuh",
      slug: "rendang-daging-sapi-payakumbuh",
      category: "makanan",
      description: "Rendang daging sapi hitam pekat dengan karamelisasi santan kelapa murni dan rempah Minang.",
      base_servings: 6,
      prep_time_minutes: 30,
      cook_time_minutes: 180,
      difficulty: "sulit",
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=640&q=80",
      ingredients: [
        { name: "Daging Sapi", quantity: 1000, unit: "gram", estimated_cost_idr: 130000 },
        { name: "Santan Kental", quantity: 1000, unit: "ml", estimated_cost_idr: 25000 },
      ],
      tools: ["Kuali Besi", "Spatula Kayu"],
      steps: [
        { step_number: 1, instruction: "Didihkan santan dengan bumbu halus sampai mengeluarkan minyak (kalio)." },
        { step_number: 2, instruction: "Masukkan daging sapi, aduk perlahan dengan api kecil selama 4 jam hingga kehitaman." },
      ],
    },
  },
  {
    id: "imp-005",
    batch_id: "batch-20261028-02",
    type: "ingredient",
    source_id: "src-pangan-nusantara",
    source_name: "PanganNusantara Open Dataset",
    source_url: "https://data.pangannusantara.go.id/komoditas/daging-sapi-has-luar",
    external_id: "pn-beef-sirloin",
    license: "ODC-By",
    license_notes: "Lisensi Open Data Commons Attribution (ODC-By).",
    is_license_compliant: true,
    title: "Daging Sapi Has Luar (Sirloin)",
    status: "needs_review",
    created_at: "2026-10-28T10:15:00Z",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 15,
      match_type: "none",
      reason: "Bahan pangan baru, belum terdaftar pada master bahan DapurCuan.",
    },
    validation_issues: [],
    can_approve: true,
    ingredient_data: {
      name: "Daging Sapi Has Luar (Sirloin)",
      canonical_unit: "gram",
      category: "protein",
      package_quantity: 250,
      package_unit: "gram",
      package_price_idr: 35000,
      region_code: "ID",
      source: "PanganNusantara Survey Pasar Induk",
    },
  },
  {
    id: "imp-006",
    batch_id: "batch-20261028-03",
    type: "recipe",
    source_id: "src-open-recipe",
    source_name: "OpenRecipe ID API (v1.2)",
    source_url: "https://api.openrecipe.id/v1/recipes/gado-gado-surabaya",
    external_id: "or-7731",
    license: "CC-BY-4.0",
    license_notes: "Lisensi CC-BY 4.0 terverifikasi.",
    is_license_compliant: true,
    title: "Gado-Gado Siram Bumbu Kacang Santan",
    status: "pending",
    created_at: "2026-10-28T11:00:00Z",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 12,
      match_type: "none",
      reason: "Menunggu giliran proses validasi staging.",
    },
    validation_issues: [],
    can_approve: true,
    recipe_data: {
      name: "Gado-Gado Siram Bumbu Kacang Santan",
      slug: "gado-gado-siram-bumbu-kacang-santan",
      category: "makanan",
      description: "Sayuran rebus berpadu telur, kentang, dan siraman saus kacang gurih bersantan khas Jawa Timur.",
      base_servings: 2,
      prep_time_minutes: 15,
      cook_time_minutes: 15,
      difficulty: "mudah",
      image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=640&q=80",
      ingredients: [
        { name: "Tauge dan Kangkung", quantity: 1, unit: "piring", estimated_cost_idr: 4000 },
        { name: "Bumbu Kacang Siap Pakai", quantity: 150, unit: "gram", estimated_cost_idr: 7000 },
      ],
      tools: ["Panci Rebus"],
      steps: [
        { step_number: 1, instruction: "Rebus sayuran dan tiriskan." },
        { step_number: 2, instruction: "Siram saus kacang hangat dan taburi bawang goreng." },
      ],
    },
  },
  {
    id: "imp-007",
    batch_id: "batch-20261027-01",
    type: "recipe",
    source_id: "src-open-recipe",
    source_name: "OpenRecipe ID API (v1.2)",
    source_url: "https://api.openrecipe.id/v1/recipes/soto-ayam-lamongan",
    external_id: "or-1102",
    license: "CC-BY-4.0",
    license_notes: "Lisensi CC-BY 4.0 terverifikasi.",
    is_license_compliant: true,
    title: "Soto Ayam Lamongan Koya Gurih",
    status: "approved",
    created_at: "2026-10-27T08:00:00Z",
    reviewed_at: "2026-10-27T10:30:00Z",
    reviewed_by: "Admin Timotius",
    reviewer_notes:
      "Data lengkap, foto jernih, dan lisensi CC-BY 4.0 valid. Resep siap dipublikasikan ke katalog.",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 22,
      match_type: "none",
      reason: "Resep unik terverifikasi.",
    },
    validation_issues: [],
    can_approve: true,
    recipe_data: {
      name: "Soto Ayam Lamongan Koya Gurih",
      slug: "soto-ayam-lamongan-koya-gurih",
      category: "makanan",
      description: "Soto ayam berkuah kuning rempah kaya aroma dengan taburan bubuk koya kerupuk udang gurih.",
      base_servings: 4,
      prep_time_minutes: 20,
      cook_time_minutes: 35,
      difficulty: "sedang",
      image_url: "https://images.unsplash.com/photo-1572656639466-8301371ea724?w=640&q=80",
      ingredients: [
        { name: "Daging Ayam", quantity: 500, unit: "gram", estimated_cost_idr: 25000 },
        { name: "Kerupuk Udang (Koya)", quantity: 5, unit: "keping", estimated_cost_idr: 3000 },
      ],
      tools: ["Panci Kaldu", "Ulekan"],
      steps: [
        { step_number: 1, instruction: "Rebus ayam hingga empuk, tiriskan lalu suwir halus." },
        { step_number: 2, instruction: "Tumis bumbu soto, masukkan ke kuah kaldu, sajikan dengan koya." },
      ],
    },
  },
  {
    id: "imp-008",
    batch_id: "batch-20261027-01",
    type: "recipe",
    source_id: "src-kuliner-komunitas",
    source_name: "Komunitas Resep Rumahan Terbuka",
    source_url: "https://komunitas.dapurterbuka.org/r/es-cendol-nangka",
    external_id: "kom-881",
    license: "CC0-PublicDomain",
    license_notes: "Lisensi CC0 Public Domain.",
    is_license_compliant: true,
    title: "Es Cendol Nangka Santan Manis",
    status: "rejected",
    created_at: "2026-10-27T08:30:00Z",
    reviewed_at: "2026-10-27T11:00:00Z",
    reviewed_by: "Admin Timotius",
    rejection_reason: "Duplikasi data & gambar berhak cipta tanpa atribusi yang sah.",
    reviewer_notes:
      "Ditolak karena katalog sudah memiliki 'Es Cendol Nangka Segar' dan gambar sumber terlacak memakai watermark situs pihak ketiga.",
    duplicate_check: {
      is_duplicate: true,
      similarity_score: 95,
      match_type: "similar_name",
      existing_id: "recipe-16",
      existing_name: "Es Cendol Nangka Segar",
      reason: "Nama dan takaran 95% identik dengan menu terbitan DapurCuan.",
    },
    validation_issues: [],
    can_approve: false,
    recipe_data: {
      name: "Es Cendol Nangka Santan Manis",
      slug: "es-cendol-nangka-santan-manis",
      category: "minuman",
      description: "Cendol kenyal dengan santan gurih, gula aren cair, dan potongan nangka wangi.",
      base_servings: 2,
      prep_time_minutes: 10,
      cook_time_minutes: 5,
      difficulty: "mudah",
      image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=640&q=80",
      ingredients: [
        { name: "Cendol Hijau", quantity: 200, unit: "gram", estimated_cost_idr: 5000 },
        { name: "Gula Merah Cair", quantity: 100, unit: "ml", estimated_cost_idr: 3000 },
      ],
      tools: ["Gelas Saji"],
      steps: [
        { step_number: 1, instruction: "Tuang gula merah cair ke dasar gelas, beri es batu." },
        { step_number: 2, instruction: "Tambahkan cendol dan nangka, lalu siram santan." },
      ],
    },
  },
  {
    id: "imp-009",
    batch_id: "batch-20261026-01",
    type: "ingredient",
    source_id: "src-pangan-nusantara",
    source_name: "PanganNusantara Open Dataset",
    source_url: "https://data.pangannusantara.go.id/komoditas/minyak-goreng-sawit-1l",
    external_id: "pn-oil-1l",
    license: "ODC-By",
    license_notes: "Lisensi ODC-By Open Dataset.",
    is_license_compliant: true,
    title: "Minyak Goreng Sawit 1 Liter",
    status: "approved",
    created_at: "2026-10-26T14:00:00Z",
    reviewed_at: "2026-10-26T15:20:00Z",
    reviewed_by: "Admin Timotius",
    reviewer_notes: "Harga acuan terkonfirmasi sesuai data PIHPS pasar tradisional.",
    duplicate_check: {
      is_duplicate: false,
      similarity_score: 10,
      match_type: "none",
      reason: "Bahan valid dan belum terdaftar.",
    },
    validation_issues: [],
    can_approve: true,
    ingredient_data: {
      name: "Minyak Goreng Sawit Kemasan",
      canonical_unit: "ml",
      category: "sembako",
      package_quantity: 1000,
      package_unit: "ml",
      package_price_idr: 17500,
      region_code: "ID",
      source: "PIHPS Pasar Tradisional",
    },
  },
  {
    id: "imp-010",
    batch_id: "batch-20261028-03",
    type: "recipe",
    source_id: "src-kuliner-komunitas",
    source_name: "Komunitas Resep Rumahan Terbuka",
    source_url: "https://komunitas.dapurterbuka.org/r/telur-dadar-padang-tebal",
    external_id: "kom-1902",
    license: "CC0-PublicDomain",
    license_notes: "Lisensi CC0 Domain Publik.",
    is_license_compliant: true,
    title: "Telur Dadar Bumbu Kelapa Gurih",
    status: "needs_review",
    created_at: "2026-10-28T11:30:00Z",
    duplicate_check: {
      is_duplicate: true,
      similarity_score: 84,
      match_type: "ingredient_fingerprint",
      existing_id: "recipe-2",
      existing_name: "Telur Dadar Padang Tebal",
      reason:
        "Susunan bahan (fingerprint) 84% serupa dengan resep 'Telur Dadar Padang Tebal' (telur ayam, kelapa parut, daun bawang, cabai merah).",
    },
    validation_issues: [],
    can_approve: true,
    recipe_data: {
      name: "Telur Dadar Bumbu Kelapa Gurih",
      slug: "telur-dadar-bumbu-kelapa-gurih",
      category: "makanan",
      description: "Telur dadar tebal khas Minang dengan kelapa parut sangrai dan bumbu cabai giling pedas gurih.",
      base_servings: 4,
      prep_time_minutes: 10,
      cook_time_minutes: 15,
      difficulty: "mudah",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640&q=80",
      ingredients: [
        { name: "Telur Bebek / Ayam", quantity: 4, unit: "butir", estimated_cost_idr: 10000 },
        { name: "Kelapa Parut Sangrai", quantity: 50, unit: "gram", estimated_cost_idr: 2000 },
        { name: "Daun Bawang", quantity: 2, unit: "batang", estimated_cost_idr: 1500 },
      ],
      tools: ["Wajan Cekung", "Spatula"],
      steps: [
        { step_number: 1, instruction: "Kocok telur bersama kelapa sangrai dan bumbu halus." },
        { step_number: 2, instruction: "Goreng dalam minyak banyak dan panas sampai tebal keemasan." },
      ],
    },
  },
];

export const mockImportService = {
  async getImportSources(): Promise<ImportSource[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockImportSources;
  },

  async getImportCandidates(): Promise<ImportCandidate[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return initialImportCandidates;
  },

  /**
   * Helper untuk mencari data resep atau bahan yang sudah ada di DapurCuan
   * untuk keperluan tampilan perbandingan side-by-side
   */
  async getExistingMatchDetails(type: ImportType, existingId?: string, existingName?: string) {
    if (type === "recipe") {
      const allRecipes = await mockRecipeService.getAllRecipesForAdmin();
      if (existingId) {
        const found = allRecipes.find((r) => r.id === existingId);
        if (found) return { type: "recipe", item: found };
      }
      if (existingName) {
        const norm = existingName.toLowerCase();
        const found = allRecipes.find(
          (r) => r.name.toLowerCase().includes(norm) || norm.includes(r.name.toLowerCase())
        );
        if (found) return { type: "recipe", item: found };
      }
      return null;
    } else {
      const allIngredients = await mockIngredientService.getMasterIngredients();
      if (existingId) {
        const found = allIngredients.find((i) => i.id === existingId);
        if (found) return { type: "ingredient", item: found };
      }
      if (existingName) {
        const norm = existingName.toLowerCase();
        const found = allIngredients.find(
          (i) => i.name.toLowerCase().includes(norm) || norm.includes(i.name.toLowerCase())
        );
        if (found) return { type: "ingredient", item: found };
      }
      return null;
    }
  },

  /**
   * Simulasi eksekusi impor baru dari salah satu sumber eksternal
   */
  simulateFetchFromSource(sourceId: string): ImportCandidate {
    const source = mockImportSources.find((s) => s.id === sourceId) || mockImportSources[0];
    const timestamp = new Date().toISOString();
    const id = `imp-${Date.now()}`;

    return {
      id,
      batch_id: `batch-${Date.now()}`,
      type: "recipe",
      source_id: source.id,
      source_name: source.name,
      source_url: `${source.base_url}/recipes/sample-${Date.now().toString().slice(-4)}`,
      external_id: `ext-${Date.now().toString().slice(-5)}`,
      license: source.default_license,
      license_notes: source.terms_note,
      is_license_compliant: source.is_verified_license,
      title: "Resep Eksperimen Impor Terbuka",
      status: "needs_review",
      created_at: timestamp,
      duplicate_check: {
        is_duplicate: false,
        similarity_score: 5,
        match_type: "none",
        reason: "Kandidat baru hasil simulasi pengambilan data.",
      },
      validation_issues: source.is_verified_license
        ? []
        : [
            {
              field: "license",
              message: "Lisensi dari sumber ini belum terverifikasi atau proprietary.",
              severity: "warning",
            },
          ],
      can_approve: source.is_verified_license,
      recipe_data: {
        name: "Resep Eksperimen Impor Terbuka",
        slug: `resep-eksperimen-impor-${Date.now().toString().slice(-4)}`,
        category: "makanan",
        description: "Contoh resep hasil simulasi pipeline impor staging eksternal.",
        base_servings: 2,
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        difficulty: "mudah",
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80",
        ingredients: [
          { name: "Bahan Contoh", quantity: 100, unit: "gram", estimated_cost_idr: 5000 },
        ],
        tools: ["Wajan"],
        steps: [
          { step_number: 1, instruction: "Langkah persiapan awal hasil impor." },
          { step_number: 2, instruction: "Masak hingga matang dan sajikan." },
        ],
      },
    };
  },
};
