import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/recipe/empty-state";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeDetailView } from "@/components/recipe/recipe-detail-view";
import type { RecipeWithCost } from "@/types/recipe";

// Mock next/image since next/image has custom layout in Next.js
vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; sizes?: string }) => {
    const { fill, priority, sizes, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={alt || "mocked image"} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const sampleRecipe: RecipeWithCost = {
  id: "recipe-1",
  slug: "nasi-goreng-kampung",
  name: "Nasi Goreng Kampung",
  description: "Nasi goreng lezat dengan bumbu terasi bakar dan telur.",
  category: "makanan",
  image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=640&q=80",
  base_servings: 2,
  prep_minutes: 10,
  cook_minutes: 15,
  difficulty: "mudah",
  status: "published",
  created_at: "2026-01-15T10:00:00Z",
  published_at: "2026-01-15T12:00:00Z",
  total_shopping_cost: 25000,
  total_consumption_cost: 15000,
  cost_per_serving: 12500,
  cost_status: "simulasi",
  ingredients: [
    {
      ingredient_id: "ing-rice",
      ingredient_name: "Nasi Putih",
      quantity: 400,
      unit: "gram",
      package_price: 15000,
    },
    {
      ingredient_id: "ing-egg",
      ingredient_name: "Telur Ayam",
      quantity: 2,
      unit: "butir",
      package_price: 5000,
    },
  ],
  tools: ["Wajan", "Spatula"],
  steps: ["Panaskan wajan.", "Masukkan bumbu dan nasi."],
  nutrition: {
    calories_kcal: 450,
    protein_g: 14,
    carbs_g: 65,
    fat_g: 12,
    source: "Data simulasi",
    is_simulated: true,
  },
  video: {
    platform: "youtube",
    video_id: "exampleId",
    url: "https://www.youtube.com/watch?v=exampleId",
    title: "Tutorial Nasi Goreng",
    channel_name: "Chef Devina",
    is_verified: true,
    embed_allowed: true,
  },
};

describe("FE-014: UI Component Tests with React Testing Library", () => {
  describe("6 & 9. EmptyState Component", () => {
    it("renders the exact PRD empty state message", () => {
      render(<EmptyState />);
      expect(
        screen.getByText(
          "Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu."
        )
      ).toBeDefined();
    });

    it("triggers action callback when action button is clicked", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          actionLabel="Ubah Filter"
          onAction={handleAction}
        />
      );

      const btn = screen.getByRole("button", { name: "Ubah Filter" });
      fireEvent.click(btn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("RecipeCard Component", () => {
    it("renders recipe title, difficulty badge, and formatted shopping cost", () => {
      render(<RecipeCard recipe={sampleRecipe} />);

      expect(screen.getByText("Nasi Goreng Kampung")).toBeDefined();
      expect(screen.getByText("mudah")).toBeDefined();
      expect(screen.getByText(/25\.000/)).toBeDefined();
      expect(screen.getByText("25 menit")).toBeDefined(); // 10 prep + 15 cook
      expect(screen.getByText("2 porsi")).toBeDefined();
    });

    it("includes proper accessible aria-label on card container", () => {
      const { container } = render(<RecipeCard recipe={sampleRecipe} />);
      const card = container.querySelector("[aria-label]");
      expect(card).toBeDefined();
      expect(card?.getAttribute("aria-label")).toContain("Nasi Goreng Kampung");
    });
  });

  describe("RecipeDetailView Interactive Scaling & Checklist", () => {
    it("renders serving controls and allows increasing/decreasing portions", () => {
      render(<RecipeDetailView recipe={sampleRecipe} relatedRecipes={[]} />);

      // Find increase button
      const increaseBtn = screen.getByRole("button", { name: "Tambah 1 porsi" });
      fireEvent.click(increaseBtn);

      // Serving increases to 3 porsi
      expect(screen.getAllByText(/3 porsi/i).length).toBeGreaterThan(0);
    });

    it("allows interactive toggling of ingredient checklist", () => {
      render(<RecipeDetailView recipe={sampleRecipe} relatedRecipes={[]} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);

      const firstBox = checkboxes[0] as HTMLInputElement;

      // Check first item
      fireEvent.click(firstBox);
      expect(firstBox.checked).toBe(true);

      // Uncheck it
      fireEvent.click(firstBox);
      expect(firstBox.checked).toBe(false);
    });

    it("renders video section with watch on YouTube link", () => {
      render(<RecipeDetailView recipe={sampleRecipe} relatedRecipes={[]} />);

      const youtubeLink = screen.getByRole("link", { name: /video tutorial.*di youtube/i });
      expect(youtubeLink).toBeDefined();
      expect(youtubeLink.getAttribute("href")).toBe("https://www.youtube.com/watch?v=exampleId");
      expect(youtubeLink.getAttribute("target")).toBe("_blank");
    });

    it("displays 'Video tutorial belum tersedia' when video is missing", () => {
      const recipeNoVideo: RecipeWithCost = {
        ...sampleRecipe,
        video: undefined,
      };

      render(<RecipeDetailView recipe={recipeNoVideo} relatedRecipes={[]} />);
      expect(screen.getByText(/video tutorial belum tersedia/i)).toBeDefined();
    });
  });
});
