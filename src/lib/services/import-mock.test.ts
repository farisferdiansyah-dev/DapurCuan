import { describe, it, expect } from "vitest";
import type { Recipe } from "@/types/recipe";
import { mockImportService } from "./import-mock";

describe("FE-012: Admin Import Review Logic", () => {
  describe("Import Sources and Licensing Compliance", () => {
    it("returns sources with specified licenses and attribution policies", async () => {
      const sources = await mockImportService.getImportSources();
      expect(sources.length).toBeGreaterThanOrEqual(3);

      const openRecipe = sources.find((s) => s.id === "src-open-recipe");
      expect(openRecipe).toBeDefined();
      expect(openRecipe?.default_license).toBe("CC-BY-4.0");
      expect(openRecipe?.is_verified_license).toBe(true);

      const unverified = sources.find((s) => s.id === "src-food-blog-unverified");
      expect(unverified).toBeDefined();
      expect(unverified?.default_license).toBe("Proprietary-Restricted");
      expect(unverified?.is_verified_license).toBe(false);
    });
  });

  describe("Import Candidates Queue & Pipeline Statuses", () => {
    it("provides candidates spanning all required statuses (needs_review, pending, approved, rejected)", async () => {
      const candidates = await mockImportService.getImportCandidates();
      expect(candidates.length).toBeGreaterThanOrEqual(8);

      const statuses = new Set(candidates.map((c) => c.status));
      expect(statuses.has("needs_review")).toBe(true);
      expect(statuses.has("pending")).toBe(true);
      expect(statuses.has("approved")).toBe(true);
      expect(statuses.has("rejected")).toBe(true);
    });

    it("detects and flags candidate duplicates with similarity score and reason", async () => {
      const candidates = await mockImportService.getImportCandidates();
      const duplicateItem = candidates.find((c) => c.duplicate_check.is_duplicate);

      expect(duplicateItem).toBeDefined();
      expect(duplicateItem?.duplicate_check.similarity_score).toBeGreaterThanOrEqual(80);
      expect(duplicateItem?.duplicate_check.existing_id).toBeDefined();
      expect(duplicateItem?.duplicate_check.reason).toBeTruthy();
    });

    it("flags validation issues for candidates with missing required fields", async () => {
      const candidates = await mockImportService.getImportCandidates();
      const invalidItem = candidates.find((c) => c.validation_issues.length > 0 && !c.can_approve);

      expect(invalidItem).toBeDefined();
      expect(invalidItem?.can_approve).toBe(false);
      expect(invalidItem?.validation_issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("blocks approval for candidates violating license compliance rules (PRD 5.2)", async () => {
      const candidates = await mockImportService.getImportCandidates();
      const restrictedItem = candidates.find((c) => !c.is_license_compliant);

      expect(restrictedItem).toBeDefined();
      expect(restrictedItem?.license).toBe("Proprietary-Restricted");
      expect(restrictedItem?.can_approve).toBe(false);
    });
  });

  describe("Existing Data Matcher for Side-by-Side Comparison", () => {
    it("finds existing recipe data when matching by ID or name", async () => {
      const match = await mockImportService.getExistingMatchDetails("recipe", "recipe-1");
      expect(match).not.toBeNull();
      expect(match?.type).toBe("recipe");
      expect((match?.item as Recipe).name).toBe("Nasi Goreng Kampung");
    });

    it("returns null when no existing data matches", async () => {
      const match = await mockImportService.getExistingMatchDetails("recipe", "non-existent-id-999");
      expect(match).toBeNull();
    });
  });

  describe("Simulated External Source Ingestion", () => {
    it("creates a new candidate with valid staging metadata from an open source", () => {
      const newCand = mockImportService.simulateFetchFromSource("src-open-recipe");
      expect(newCand.id).toMatch(/^imp-/);
      expect(newCand.status).toBe("needs_review");
      expect(newCand.license).toBe("CC-BY-4.0");
      expect(newCand.is_license_compliant).toBe(true);
    });

    it("creates a candidate with license warning when fetching from unverified source", () => {
      const newCand = mockImportService.simulateFetchFromSource("src-food-blog-unverified");
      expect(newCand.is_license_compliant).toBe(false);
      expect(newCand.can_approve).toBe(false);
      expect(newCand.validation_issues.some((i) => i.field === "license")).toBe(true);
    });
  });
});
