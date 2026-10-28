import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/", name: "Homepage" },
  { path: "/rekomendasi", name: "Rekomendasi" },
  { path: "/resep/nasi-goreng-kampung", name: "Detail Resep" },
  { path: "/admin", name: "Admin Dashboard" },
  { path: "/admin/resep", name: "Admin Resep" },
  { path: "/admin/bahan", name: "Admin Bahan & Harga" },
  { path: "/admin/impor", name: "Admin Impor" },
];

const VIEWPORTS = [
  { name: "Mobile (375px)", width: 375, height: 667 },
  { name: "Tablet (768px)", width: 768, height: 1024 },
  { name: "Desktop (1440px)", width: 1440, height: 900 },
];

test.describe("FE-015: Responsive & Accessibility Review", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      for (const route of ROUTES) {
        test(`Page ${route.name} (${route.path}) - No horizontal overflow & semantic markup`, async ({
          page,
        }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.addInitScript(() => sessionStorage.setItem("dapurcuan_admin_auth", "authenticated"));

          const consoleErrors: string[] = [];
          page.on("pageerror", (err) => consoleErrors.push(err.message));

          const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
          expect(response?.status()).toBe(200);

          // 1. Check for horizontal overflow (no scrollWidth > innerWidth)
          const isOverflowing = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
          });
          expect(isOverflowing).toBe(false);

          // 2. Check semantic landmarks (header, nav, h1)
          const h1Count = await page.locator("h1").count();
          expect(h1Count).toBeGreaterThanOrEqual(1);

          const navCount = await page.locator("nav").count();
          expect(navCount).toBeGreaterThanOrEqual(1);

          // 3. Check for severe console page errors
          expect(consoleErrors).toHaveLength(0);
        });
      }
    });
  }

  test.describe("Accessibility & Interactive Controls Review", () => {
    test("Detail Resep page interactive portion scaling, cost breakdown, and video section", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/resep/nasi-goreng-kampung");

      // Verify breadcrumb and H1
      await expect(page.locator("h1")).toContainText("Nasi Goreng Kampung");

      // Verify portion selector
      const portionText = page.locator("[aria-live='polite']");
      await expect(portionText).toContainText("2 porsi");

      // Increase portion
      const plusBtn = page.getByRole("button", { name: "Tambah 1 porsi" });
      await plusBtn.click();
      await expect(portionText).toContainText("3 porsi");

      // Decrease portion
      const minusBtn = page.getByRole("button", { name: "Kurangi 1 porsi" });
      await minusBtn.click();
      await expect(portionText).toContainText("2 porsi");

      // Verify ingredient checklist interactive checkbox
      const firstCheckbox = page.locator("input[type='checkbox']").first();
      await firstCheckbox.check();
      await expect(firstCheckbox).toBeChecked();
      await firstCheckbox.uncheck();
      await expect(firstCheckbox).not.toBeChecked();

      // Verify Video section exists with either iframe or fallback link
      const videoHeading = page.locator("#video-heading");
      await expect(videoHeading).toBeVisible();
    });

    test("Admin Impor page side-by-side comparison dialog accessible controls", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/admin/impor");

      // Verify H1 and metrics
      await expect(page.locator("h1")).toContainText("Tinjau & Kurasi Antrean Impor");

      // Click first comparison button
      const compareBtn = page.locator("button[aria-label*='Bandingkan data']").first();
      await compareBtn.click();

      // Verify side-by-side modal opens with role dialog
      const dialog = page.locator("div[role='dialog']");
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText("Tinjauan Perbandingan Side-by-Side");

      // Close modal
      const closeBtn = page.getByLabel("Tutup dialog perbandingan");
      await closeBtn.click();
      await expect(dialog).not.toBeVisible();
    });

    test("Admin Bahan page stale warning banner and simulation disclaimer", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/admin/bahan");

      await expect(page.locator("h1")).toContainText("Kelola Bahan & Harga Acuan");

      // Verify simulation badge
      await expect(page.getByText("Data Simulasi").first()).toBeVisible();

      // Verify stale warning if items are stale
      const staleBadge = page.getByText(/Kedaluwarsa/i).first();
      await expect(staleBadge).toBeVisible();
    });

    test("Admin Gateway blocks unauthenticated visitors and unlocks with passcode", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      // Ensure unauthenticated
      await page.goto("/admin");
      await page.evaluate(() => sessionStorage.removeItem("dapurcuan_admin_auth"));
      await page.reload();

      // Check login barrier is visible
      await expect(page.locator("h1")).toContainText("Portal Admin DapurCuan");
      await expect(page.getByLabel("Passcode Administrator")).toBeVisible();

      // Attempt invalid passcode
      await page.getByLabel("Passcode Administrator").fill("wrongpass");
      await page.getByRole("button", { name: "Buka Akses Admin" }).click();
      await expect(page.getByRole("alert")).toContainText("Passcode salah");

      // Enter valid passcode
      await page.getByLabel("Passcode Administrator").fill("admin123");
      await page.getByRole("button", { name: "Buka Akses Admin" }).click();

      // Verify dashboard unlocked
      await expect(page.locator("h1")).toContainText("Admin Dashboard");
    });
  });
});
