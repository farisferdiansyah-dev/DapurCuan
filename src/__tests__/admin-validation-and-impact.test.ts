import { describe, it, expect } from "vitest";
import { ingredientFormSchema } from "@/lib/validation/ingredient-schema";
import {
  checkIsPriceStale,
  mockIngredientService,
} from "@/lib/services/ingredient-mock";

describe("FE-014: Admin Validation & Ingredient Price Impact Logic", () => {
  describe("7. Admin Ingredient Form Zod Validation", () => {
    it("validates correct ingredient form values", () => {
      const valid = {
        name: "Bawang Merah Brebes",
        canonical_unit: "gram",
        category: "bumbu_dapur",
        package_quantity: 250,
        package_unit: "gram",
        package_price_idr: 10000,
        region_code: "ID",
        source: "Survei Pasar",
        observed_at: "2026-10-25",
      };

      const result = ingredientFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects name with less than 2 characters", () => {
      const invalid = {
        name: "A",
        canonical_unit: "gram",
        category: "sayuran",
        package_quantity: 100,
        package_unit: "gram",
        package_price_idr: 5000,
        region_code: "ID",
        source: "Pasar",
        observed_at: "2026-10-25",
      };
      const res = ingredientFormSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects invalid date format (must be YYYY-MM-DD)", () => {
      const invalid = {
        name: "Wortel Segar",
        canonical_unit: "gram",
        category: "sayuran",
        package_quantity: 500,
        package_unit: "gram",
        package_price_idr: 8000,
        region_code: "ID",
        source: "Pasar",
        observed_at: "25-10-2026", // Wrong format
      };
      const res = ingredientFormSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects non-integer price or price below Rp 100", () => {
      const floatPrice = {
        name: "Garam Halus",
        canonical_unit: "gram",
        category: "bumbu_dapur",
        package_quantity: 250,
        package_unit: "gram",
        package_price_idr: 2500.5,
        region_code: "ID",
        source: "Pasar",
        observed_at: "2026-10-25",
      };
      expect(ingredientFormSchema.safeParse(floatPrice).success).toBe(false);

      const tooLow = { ...floatPrice, package_price_idr: 50 };
      expect(ingredientFormSchema.safeParse(tooLow).success).toBe(false);
    });
  });

  describe("Stale Price Detection (>30 Days Threshold)", () => {
    it("flags dates older than 30 days as stale relative to mock platform date (2026-10-28)", () => {
      expect(checkIsPriceStale("2026-09-20")).toBe(true);
      expect(checkIsPriceStale("2026-08-01")).toBe(true);
    });

    it("flags dates within 30 days as fresh", () => {
      expect(checkIsPriceStale("2026-10-20")).toBe(false);
      expect(checkIsPriceStale("2026-10-01")).toBe(false);
    });
  });

  describe("8. Ingredient Price Change Impact Calculation", () => {
    it("simulates recipe cost shifts when ingredient price increases", async () => {
      const res = await mockIngredientService.simulateRecipePriceImpact(
        "Telur Ayam Negeri",
        8000, // new price (was 5000)
        5000
      );

      expect(res.length).toBeGreaterThan(0);
      for (const item of res) {
        expect(item.new_shopping_cost).toBeGreaterThan(item.old_shopping_cost);
        expect(item.cost_difference).toBeGreaterThan(0);
        expect(item.percentage_change).toBeGreaterThan(0);
      }
    });

    it("simulates recipe cost drops when ingredient price decreases", async () => {
      const res = await mockIngredientService.simulateRecipePriceImpact(
        "Telur Ayam Negeri",
        3500, // new price (was 5000)
        5000
      );

      expect(res.length).toBeGreaterThan(0);
      for (const item of res) {
        expect(item.new_shopping_cost).toBeLessThan(item.old_shopping_cost);
        expect(item.cost_difference).toBeLessThan(0);
        expect(item.percentage_change).toBeLessThan(0);
      }
    });

    it("returns empty array for an ingredient not used by any active recipe", async () => {
      const res = await mockIngredientService.simulateRecipePriceImpact(
        "Caviar Beluga Mewah",
        500000,
        400000
      );

      expect(res.length).toBe(0);
    });
  });
});
