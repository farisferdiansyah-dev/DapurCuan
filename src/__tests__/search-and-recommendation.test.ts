import { describe, it, expect } from "vitest";
import { searchSchema } from "@/components/form/search-form";
import { mockRecipeService } from "@/lib/services/mock";

describe("FE-014: Search Form Validation & Recommendation Algorithm", () => {
  describe("1. Search Form Schema Validation (searchSchema)", () => {
    it("accepts valid search filters", () => {
      const valid = {
        category: "makanan",
        budget: 50000,
        servings: 2,
        query: "Nasi Goreng",
        max_cooking_minutes: 30,
        difficulty: "mudah",
      };

      const result = searchSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects negative or zero budget", () => {
      const negativeBudget = {
        category: "makanan",
        budget: -5000,
        servings: 2,
      };
      const resultNeg = searchSchema.safeParse(negativeBudget);
      expect(resultNeg.success).toBe(false);

      const zeroBudget = {
        category: "makanan",
        budget: 0,
        servings: 2,
      };
      const resultZero = searchSchema.safeParse(zeroBudget);
      expect(resultZero.success).toBe(false);
    });

    it("enforces minimum budget of Rp 1.000 and maximum of Rp 10.000.000", () => {
      const belowMin = { category: "makanan", budget: 999, servings: 2 };
      expect(searchSchema.safeParse(belowMin).success).toBe(false);

      const aboveMax = { category: "makanan", budget: 10000001, servings: 2 };
      expect(searchSchema.safeParse(aboveMax).success).toBe(false);

      const boundaryMin = { category: "makanan", budget: 1000, servings: 2 };
      expect(searchSchema.safeParse(boundaryMin).success).toBe(true);

      const boundaryMax = { category: "makanan", budget: 10000000, servings: 2 };
      expect(searchSchema.safeParse(boundaryMax).success).toBe(true);
    });

    it("rejects non-integer servings and values outside 1-50 range", () => {
      const floatServing = { category: "makanan", budget: 50000, servings: 2.5 };
      expect(searchSchema.safeParse(floatServing).success).toBe(false);

      const zeroServing = { category: "makanan", budget: 50000, servings: 0 };
      expect(searchSchema.safeParse(zeroServing).success).toBe(false);

      const tooMany = { category: "makanan", budget: 50000, servings: 51 };
      expect(searchSchema.safeParse(tooMany).success).toBe(false);

      const validBoundary = { category: "makanan", budget: 50000, servings: 50 };
      expect(searchSchema.safeParse(validBoundary).success).toBe(true);
    });

    it("rejects query exceeding 100 characters", () => {
      const longQuery = {
        category: "makanan",
        budget: 50000,
        servings: 2,
        query: "a".repeat(101),
      };
      expect(searchSchema.safeParse(longQuery).success).toBe(false);
    });
  });

  describe("2 & 3. Recommendation Engine Filtering & Algorithm", () => {
    it("filters recipes strictly by category", async () => {
      const res = await mockRecipeService.searchRecipes({
        category: "minuman",
        budget: 100000,
        servings: 2,
      });

      expect(res.data.length).toBeGreaterThan(0);
      for (const recipe of res.data) {
        expect(recipe.category).toBe("minuman");
      }
    });

    it("NEVER returns recipes whose total_shopping_cost exceeds budget (PRD FR-002 & FR-005)", async () => {
      const budget = 15000;
      const res = await mockRecipeService.searchRecipes({
        category: "makanan",
        budget,
        servings: 2,
      });

      for (const recipe of res.data) {
        expect(recipe.total_shopping_cost).toBeLessThanOrEqual(budget);
      }
    });

    it("returns empty results when budget is lower than any recipe's shopping cost", async () => {
      const res = await mockRecipeService.searchRecipes({
        category: "makanan",
        budget: 1000, // No recipe costs <= 1000
        servings: 2,
      });

      expect(res.data.length).toBe(0);
      expect(res.meta.total).toBe(0);
    });

    it("filters by maximum cooking time", async () => {
      const res = await mockRecipeService.searchRecipes({
        category: "makanan",
        budget: 100000,
        servings: 2,
        max_cooking_minutes: 15,
      });

      expect(res.data.length).toBeGreaterThan(0);
      for (const recipe of res.data) {
        const totalTime = recipe.prep_minutes + recipe.cook_minutes;
        expect(totalTime).toBeLessThanOrEqual(15);
      }
    });

    it("filters by text query in name or description", async () => {
      const res = await mockRecipeService.searchRecipes({
        category: "makanan",
        budget: 100000,
        servings: 2,
        query: "ayam",
      });

      expect(res.data.length).toBeGreaterThan(0);
      for (const recipe of res.data) {
        const text = (recipe.name + " " + recipe.description).toLowerCase();
        expect(text).toContain("ayam");
      }
    });

    it("filters by difficulty level", async () => {
      const res = await mockRecipeService.searchRecipes({
        category: "makanan",
        budget: 100000,
        servings: 2,
        difficulty: "mudah",
      });

      expect(res.data.length).toBeGreaterThan(0);
      for (const recipe of res.data) {
        expect(recipe.difficulty).toBe("mudah");
      }
    });

    it("handles pagination properly", async () => {
      const page1 = await mockRecipeService.searchRecipes(
        { category: "makanan", budget: 200000, servings: 2 },
        1,
        3
      );
      expect(page1.data.length).toBeLessThanOrEqual(3);
      expect(page1.meta.page).toBe(1);
      expect(page1.meta.limit).toBe(3);

      if (page1.meta.total > 3) {
        const page2 = await mockRecipeService.searchRecipes(
          { category: "makanan", budget: 200000, servings: 2 },
          2,
          3
        );
        expect(page2.data.length).toBeGreaterThan(0);
        expect(page2.data[0].id).not.toBe(page1.data[0].id);
      }
    });
  });
});
