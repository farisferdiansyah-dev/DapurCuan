import { describe, it, expect } from "vitest";
import { calculateScaledCost } from "@/lib/services/mock";

describe("FE-014: Cost Calculation & Portion Scaling (PRD FR-005)", () => {
  describe("Cost Calculator & Portion Scaling Logic", () => {
    it("distinguishes shopping cost from consumption cost", () => {
      // For recipe-1 (Nasi Goreng Kampung, base_servings = 2)
      const cost2 = calculateScaledCost("recipe-1", 2, 2);
      expect(cost2.total_shopping_cost).toBeGreaterThanOrEqual(cost2.total_consumption_cost);
      expect(cost2.cost_status).toBe("simulasi");
    });

    it("rounds package batches up for market package shopping cost", () => {
      // Base servings: 2. If target is 3, packageBatches = ceil(3 / 2) = 2 batches.
      const cost2 = calculateScaledCost("recipe-1", 2, 2);
      const cost3 = calculateScaledCost("recipe-1", 2, 3);

      // Shopping cost for 3 servings equals 2 batches (same as 4 servings)
      const cost4 = calculateScaledCost("recipe-1", 2, 4);
      expect(cost3.total_shopping_cost).toBe(cost4.total_shopping_cost);
      expect(cost3.total_shopping_cost).toBe(cost2.total_shopping_cost * 2);
    });

    it("scales consumption cost linearly with target servings", () => {
      const baseServings = 2;
      const costBase = calculateScaledCost("recipe-1", baseServings, 2);
      const costDouble = calculateScaledCost("recipe-1", baseServings, 4);

      // Consumption cost should double when servings double
      expect(costDouble.total_consumption_cost).toBe(costBase.total_consumption_cost * 2);
    });

    it("safely handles boundary edge cases (servings = 0, negative servings, decimals)", () => {
      // 0 servings should fallback to at least 1 serving
      const costZero = calculateScaledCost("recipe-1", 2, 0);
      expect(costZero.total_shopping_cost).toBeGreaterThan(0);
      expect(costZero.total_consumption_cost).toBeGreaterThan(0);

      // Negative servings should fallback safely
      const costNegative = calculateScaledCost("recipe-1", 2, -5);
      expect(costNegative.total_shopping_cost).toBeGreaterThan(0);

      // Decimals should be rounded
      const costFloat = calculateScaledCost("recipe-1", 2, 2.7);
      const costInt = calculateScaledCost("recipe-1", 2, 3);
      expect(costFloat.total_shopping_cost).toBe(costInt.total_shopping_cost);
    });

    it("calculates cost per serving correctly", () => {
      const cost = calculateScaledCost("recipe-1", 2, 4);
      expect(cost.cost_per_serving).toBe(Math.round(cost.total_shopping_cost / 4));
    });

    it("falls back gracefully when recipeId has no base cost defined", () => {
      const costUnknown = calculateScaledCost("non-existent-recipe", 2, 2);
      expect(costUnknown.total_shopping_cost).toBe(25000);
      expect(costUnknown.total_consumption_cost).toBe(15000);
    });
  });
});
