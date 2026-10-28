import { describe, it, expect } from "vitest";
import {
  checkIsPriceStale,
  mockIngredientService,
  REGIONS,
  CATEGORIES,
} from "./ingredient-mock";
import { ingredientFormSchema } from "../validation/ingredient-schema";

describe("FE-011: Admin Ingredient & Pricing Logic", () => {
  describe("checkIsPriceStale", () => {
    it("flags dates older than 30 days relative to 2026-10-28 as stale", () => {
      // 2026-09-20 is > 30 days before 2026-10-28
      expect(checkIsPriceStale("2026-09-20")).toBe(true);
      expect(checkIsPriceStale("2026-08-15")).toBe(true);
    });

    it("flags dates within 30 days relative to 2026-10-28 as fresh", () => {
      // 2026-10-15 is ~13 days before 2026-10-28
      expect(checkIsPriceStale("2026-10-15")).toBe(false);
      expect(checkIsPriceStale("2026-10-27")).toBe(false);
    });
  });

  describe("ingredientFormSchema (Zod validation)", () => {
    it("accepts valid ingredient form data", () => {
      const validData = {
        name: "Bawang Merah Brebes",
        canonical_unit: "gram",
        category: "bumbu_dapur",
        package_quantity: 250,
        package_unit: "gram",
        package_price_idr: 12000,
        region_code: "ID-BDG",
        source: "Pasar Tradisional",
        observed_at: "2026-10-25",
      };

      const result = ingredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid or incomplete form data", () => {
      const invalidData = {
        name: "A", // too short
        canonical_unit: "",
        category: "invalid_category",
        package_quantity: 0, // must be > 0
        package_unit: "",
        package_price_idr: 50, // minimum 100
        region_code: "",
        source: "",
        observed_at: "not-a-date",
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path[0] === "name")).toBe(true);
        expect(issues.some((i) => i.path[0] === "package_price_idr")).toBe(true);
        expect(issues.some((i) => i.path[0] === "observed_at")).toBe(true);
      }
    });
  });

  describe("mockIngredientService", () => {
    it("returns all master ingredients with correct stale flags", async () => {
      const ingredients = await mockIngredientService.getMasterIngredients();
      expect(ingredients.length).toBeGreaterThanOrEqual(10);

      // Verify that stale items exist in mock dataset as requested by TASKS.md AC
      const staleItems = ingredients.filter((i) => i.current_price.is_stale);
      expect(staleItems.length).toBeGreaterThan(0);

      const freshItems = ingredients.filter((i) => !i.current_price.is_stale);
      expect(freshItems.length).toBeGreaterThan(0);
    });

    it("calculates recipe cost impact accurately when ingredient price changes", async () => {
      // Simulate price increase for Telur Ayam Negeri from 5000 to 7500 (+50%)
      const simulation = await mockIngredientService.simulateRecipePriceImpact(
        "Telur Ayam Negeri",
        7500,
        5000
      );

      expect(simulation.length).toBeGreaterThan(0);

      for (const impacted of simulation) {
        expect(impacted.new_shopping_cost).toBeGreaterThan(impacted.old_shopping_cost);
        expect(impacted.cost_difference).toBeGreaterThan(0);
        expect(impacted.percentage_change).toBeGreaterThan(0);
      }
    });

    it("calculates price drop correctly", async () => {
      // Simulate price decrease for Telur Ayam Negeri from 5000 to 4000 (-20%)
      const simulation = await mockIngredientService.simulateRecipePriceImpact(
        "Telur Ayam Negeri",
        4000,
        5000
      );

      expect(simulation.length).toBeGreaterThan(0);

      for (const impacted of simulation) {
        expect(impacted.new_shopping_cost).toBeLessThan(impacted.old_shopping_cost);
        expect(impacted.cost_difference).toBeLessThan(0);
        expect(impacted.percentage_change).toBeLessThan(0);
      }
    });
  });

  describe("Metadata & Regions Configuration", () => {
    it("contains required regions", () => {
      const codes = REGIONS.map((r) => r.code);
      expect(codes).toContain("ID");
      expect(codes).toContain("ID-JKT");
    });

    it("contains required categories", () => {
      const values = CATEGORIES.map((c) => c.value);
      expect(values).toContain("protein");
      expect(values).toContain("sayuran");
      expect(values).toContain("bumbu_dapur");
    });
  });
});
