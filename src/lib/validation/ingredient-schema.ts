import { z } from "zod";

export const ingredientCategoryEnum = z.enum([
  "protein",
  "sayuran",
  "bumbu_dapur",
  "sembako",
  "buah",
  "susu_olahan",
  "lainnya",
]);

export const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nama bahan minimal 2 karakter")
    .max(80, "Nama bahan maksimal 80 karakter"),
  canonical_unit: z
    .string()
    .min(1, "Satuan standar wajib diisi (contoh: gram, ml, butir)"),
  category: ingredientCategoryEnum,
  package_quantity: z
    .number({ invalid_type_error: "Ukuran kemasan harus berupa angka" })
    .min(0.01, "Ukuran kemasan harus lebih dari 0"),
  package_unit: z
    .string()
    .min(1, "Satuan kemasan wajib diisi (contoh: pack, bungkus, kg)"),
  package_price_idr: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat rupiah")
    .min(100, "Harga minimal Rp 100"),
  region_code: z.string().min(2, "Wilayah acuan wajib dipilih"),
  source: z.string().min(3, "Sumber acuan harga minimal 3 karakter"),
  observed_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;
