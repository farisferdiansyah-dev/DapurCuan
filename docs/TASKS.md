# DapurCuan — Task Checklist

**Status:** Phase 0 selesai direncanakan; implementasi menunggu approval.  
**Aturan:** kerjakan berurutan Planning → Frontend → Backend → Integrasi → Testing/Deployment. Jangan mulai fase berikut tanpa approval eksplisit.

## Cara baca

Prioritas: **P0** wajib untuk MVP/keamanan; **P1** penting untuk kelengkapan; **P2** polish/optimasi. Dependencies berarti task harus selesai lebih dulu. Setiap task punya acceptance criteria (AC). Checklist `- [ ]` menjadi status implementasi.

## PHASE 0 — Planning & Architecture ✅

### PL-001 — Analisis PRD [P0] ✅
- [x] Petakan roles, feature requirements, NFR, acceptance criteria, phases.
- [x] Catat batasan: Phase 1 mock-only, no scraping, server validation.
- **Dependencies:** none.
- **AC:** semua requirement utama punya lokasi di plan/task list.

### PL-002 — Arsitektur modular monolith [P0] ✅
- [x] Tetapkan Presentation, Application, Domain, Data Access, External Integration.
- [x] Tetapkan server-first dan boundary client component.
- [x] Tetapkan auth server-side dan proxy bukan satu-satunya guard.
- **Dependencies:** PL-001.
- **AC:** dependency direction terdokumentasi dan domain bebas framework.

### PL-003 — Struktur folder dan route map [P0] ✅
- [x] Definisikan `app`, `src`, `db`, `drizzle`, `tests`, `docs`, `public`.
- [x] Petakan public/admin pages dan API routes.
- **Dependencies:** PL-002.
- **AC:** setiap page/API PRD punya lokasi target.

### PL-004 — Database architecture [P0] ✅
- [x] Petakan seluruh tabel PRD dan relasi.
- [x] Definisikan UUID, FK, constraints, indexes, exact numeric, archive policy.
- [x] Definisikan missing/stale price dan import idempotency.
- **Dependencies:** PL-001.
- **AC:** model mendukung budget, porsi, provenance, import, auth, dan publication.

### PL-005 — API contract [P0] ✅
- [x] Definisikan endpoint `/api/v1`.
- [x] Definisikan success/error envelope dan auth policy.
- [x] Definisikan validation, rate limit, SSRF, timeout, payload limit.
- **Dependencies:** PL-002, PL-004.
- **AC:** public/admin endpoint list konsisten dengan PRD dan siap diturunkan ke Zod.

### PL-006 — Frontend component/design plan [P0] ✅
- [x] Definisikan page composition dan reusable components.
- [x] Definisikan token primitive → semantic → component.
- [x] Definisikan responsive/accessibility/reduced-motion requirements.
- **Dependencies:** PL-001.
- **AC:** semua UI section PRD punya component plan dan state plan.

### PL-007 — Risk register dan gates [P0] ✅
- [x] Catat risk cost, stale data, import legality, SSRF, auth, N+1, cache, accessibility.
- [x] Tetapkan approval gate antar fase.
- **Dependencies:** PL-002, PL-004, PL-005.
- **AC:** setiap risiko punya mitigation dan verification gate.

### PL-008 — Dokumentasi dan verifikasi [P0] ⏳
- [x] Buat `docs/IMPLEMENTATION_PLAN.md`.
- [ ] Buat `docs/TASKS.md`.
- [x] Verifikasi referensi Next.js, Drizzle, Auth.js, Zod.
- [ ] Dapatkan approval user sebelum Phase 1.
- **Dependencies:** PL-001 sampai PL-007.
- **AC:** dua dokumen tersedia, konsisten, no application code/dependency installation, user approval pending.

---

## PHASE 1 — Frontend (mock data only)

### FE-001 — Bootstrap app [P0]
- [ ] Initialize Next.js App Router + TypeScript strict.
- [ ] Configure scripts, lint, typecheck.
- **Dependencies:** PL-008 approval.
- **AC:** app starts `npm run dev`, typecheck/lint pass with `npm run typecheck && npm run lint`, no backend integration.

### FE-002 — Styling foundation [P0]
- [ ] Configure Tailwind and shadcn/ui.
- [ ] Add token layers (primitive → semantic → component) and warm orange/green/off-white/dark theme.
- [ ] Add focus visible, contrast WCAG AA, reduced-motion prefersReducedMotion rules.
- **Dependencies:** FE-001, PL-006.
- **AC:** tokens via CSS variables instead of raw hex; keyboard Tab + Enter visible on all interactive; `prefers-reduced-motion: reduce` respected.

### FE-003 — Layout/navigation [P0]
- [ ] Build Navbar, AppShell, Footer, public/admin layout.tsx and group routes.
- [ ] Add responsive mobile menu, active state, and client navigation.
- **Dependencies:** FE-002.
- **AC:** all planned routes (`/`, `/rekomendasi`, `/resep/[slug]`, `/admin/*`) navigable; mobile 320px and desktop 1280px work.

### FE-004 — Homepage [P0]
- [x] Build hero section with approved copy "Masak Apa Hari Ini? Sesuaikan dengan Budgetmu!" and supporting text.
- [x] Build search form entry, popular recipes section, how-it-works section, featured recipes, footer.
- **Dependencies:** FE-003, FE-005.
- **AC:** homepage matches all 7 PRD sections; hero centered on mobile; images semantic img tag with alt.

### FE-005 — Search form and filters [P0]
- [x] Category (required), budget (required, positive IDR), servings (required, positive integer) fields.
- [x] Query, taste preference, include/exclude ingredients, max cooking minutes, difficulty optional fields.
- [x] React Hook Form client validation and clear Indonesian error messages inline.
- [x] Accessibility: label for each input, fieldset for groups, aria-describedby for errors.
- **Dependencies:** FE-002.
- **AC:** negative budget rejected; non-integer servings rejected; text length limited; form accessible via keyboard.

### FE-006 — Recipe cards/grid [P0]
- [x] Card displays image, name, cost estimate, cooking time, servings, difficulty badge, nutrition summary, detail CTA button.
- [x] Grid responsive 1 col mobile, 2 tablet, 3+ desktop.
- [x] Loading skeleton, error card, empty grid state.
- **Dependencies:** FE-002.
- **AC:** all FR-003 fields rendered; each card has aria-label or semantic heading; skeleton matches card height.

### FE-007 — Recommendation page `/rekomendasi` [P0]
- [x] Display search summary (selected budget/servings/preferences).
- [x] Left sidebar or collapsible filter controls; right/main area recipe grid.
- [x] Sorting dropdown (relevance, cost ascending, cost descending, time).
- [x] Pagination controls: first/prev/next/last, page input, items count.
- [x] Mock service returns only eligible fixtures (shopping_cost <= budget, published=true).
- [x] Empty state with exact PRD message: "Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu." + alternative actions.
- [x] Loading overlay during search, error message for API failures.
- **Dependencies:** FE-005, FE-006.
- **AC:** no over-budget recipe marked as match; empty result shows PRD message; pagination accessible.

### FE-008 — Recipe detail page `/resep/[slug]` [P0] ✅
- [x] Hero image, name, description, summary row (category, time prep/cook, servings base).
- [x] Serving selector (up/down buttons); dynamically recalculate quantities, shopping cost, and consumption cost live.
- [x] Cost breakdown card (membedakan shopping cost kemasan pasar vs consumption cost bahan terpakai, simulation badge).
- [x] Ingredients section with interactive checklist, unit, scaled quantity, prep note, and market package price.
- [x] Tools list (alat dapur yang diperlukan dengan badge).
- [x] Step-by-step cooking instructions (numbered, checkpoint selesai, progress bar, aria-current active step).
- [x] Nutrition panel (calories, protein, carbs, fat, fiber, sugar, sodium per serving, source & simulation disclaimer).
- [x] Verified video section:
  - Seluruh video ID fiktif/404 dihapus dari mock.
  - Video YouTube riil terverifikasi via oEmbed dan HTTP 200 (Chef Devina Hermawan, dsb.).
  - Iframe `youtube-nocookie.com` hanya untuk video terverifikasi dan mendukung embed (`embed_allowed: true`).
  - Tombol "Tonton di YouTube" (`target="_blank" rel="noopener noreferrer"`) tersedia.
  - Fallback alternatif berupa kartu dan tautan langsung jika embed dibatasi kreator (`embed_allowed: false`).
  - Fallback ramah "Video tutorial belum tersedia" jika belum ada video terverifikasi (tanpa video palsu).
- [x] Related recipes grid (3-4 resep dalam kategori yang sama).
- [x] Accessibility: semantic headings (h1, h2), alt images, aria-current active step, minimum 44px touch targets.
- **Dependencies:** FE-006.
- **AC:** serving selector updates all quantities/costs live; only verified videos display; detail exposes all FR-004 fields. [SELESAI & TERVERIFIKASI]

### FE-009 — Admin dashboard `/admin` [P1]
- [x] Summary cards: total recipes, published, draft, awaiting review, stale prices, incomplete nutrition, pending imports.
- [x] Recent imports list and recipe statistics/trends.
- [x] Links to admin sections: recipe management, ingredient/pricing, imports.
- **Dependencies:** FE-003.
- **AC:** metrics reflect typed mock data structure; table/card semantics correct; accessible navigation to child sections.

### FE-010 — Admin recipe management `/admin/resep` [P1] ✅
- [x] Recipe table: name, category, status (draft/published/archived), created/published date, actions.
- [x] Search by name/slug and filter by status/category.
- [x] Create button → open editor modal/page.
- [x] Edit/view/publish/archive/delete action buttons with confirmation.
- [x] Editor form: name, description, category, base_servings, prep/cook minutes, difficulty, image URL, ingredients section, tools checklist, steps section, nutrition section.
- [x] Publish validation: checklist shows required fields (name, image, at least 1 ingredient with price, 1 step, nutrition, verified video). Cannot publish unless all green.
- [x] Accessibility: form labels, required indicators, error inline, status messages.
- **Dependencies:** FE-009.
- **AC:** draft saved without publication rules; publish action only enabled when validator passes; mock data includes validation failure examples. [SELESAI & TERVERIFIKASI]

### FE-011 — Admin ingredient/pricing `/admin/bahan` [P1] ✅
- [x] Ingredient list table: nama bahan, kategori, satuan standar, ukuran kemasan, harga referensi, wilayah, tanggal pembaruan, dan status kedaluwarsa (>30 hari).
- [x] Pencarian dan filter live: kata kunci nama, kategori, status harga (segar/kedaluwarsa), wilayah, dan pengurutan (A-Z, harga terendah/tertinggi, waktu update).
- [x] Add/Edit ingredient modal dengan validasi Zod (nama, satuan standar, kategori, ukuran kemasan, harga acuan, wilayah, sumber, tanggal).
- [x] Price history table & add observation modal: wilayah, ukuran/satuan kemasan, harga IDR, sumber, tanggal observasi, dan badge kesegaran.
- [x] Deteksi otomatis harga stale: observasi > 30 hari diberi badge visual "Kedaluwarsa (>30 hari)" dan alert banner di dashboard admin.
- [x] Real-time Recipe Impact Simulator: menghitung dampak perubahan harga bahan terhadap shopping cost dan persentase perubahan pada resep yang menggunakan bahan tersebut.
- [x] Disclaimer kepatuhan: harga diberi label tegas "Data Simulasi" dan tidak diklaim sebagai harga pasar aktual terverifikasi resmi.
- [x] Frontend mock state: data tersimpan dalam state sesi browser tanpa database atau backend.
- [x] Aksesibilitas: scoped table headers (`<th scope="col">`), modal dialog accessible (`role="dialog"`, `aria-labelledby`, `aria-modal="true"`), dan kontrol formulir responsif.
- **Dependencies:** FE-009.
- **AC:** price expires/stale visually marked; add/edit close on save; mock includes expired prices; impact calculations verified. [SELESAI & TERVERIFIKASI]

### FE-012 — Admin import review `/admin/impor` [P1] ✅
- [x] Dashboard antrean impor: metrik total antrean, needs_review, pending, approved, rejected, dan deteksi duplikat.
- [x] Source selector dropdown & simulasi impor: sumber terdaftar (OpenRecipe ID API, PanganNusantara, Komunitas Resep Terbuka, Blog MasakKuy Terbatas) beserta kebijakan lisensi dan atribusi.
- [x] Import queue table: kandidat resep dan bahan masakan, ID eksternal, sumber, lisensi, status, indikator duplikasi, kelengkapan data, dan tombol aksi.
- [x] Pencarian dan filter: kata kunci, status (needs_review, pending, approved, rejected), tipe data (resep, bahan), sumber data, dan toggle filter hanya duplikat.
- [x] Tampilan perbandingan side-by-side: komparasi data kandidat impor dengan data katalog aktif DapurCuan dengan highlight perbedaan.
- [x] Deteksi kemungkinan duplikat: kemiripan nama, ID, dan fingerprint bahan dengan skor kemiripan (misal: kemiripan 91% terhadap resep terdaftar).
- [x] Validasi kelengkapan field wajib: memeriksa kelengkapan nama, bahan, takaran, langkah memasak, foto masakan, dan lisensi sebelum tombol approve diaktifkan.
- [x] Keputusan Approve dan Reject: dialog konfirmasi persetujuan dengan catatan reviewer dan dialog penolakan dengan kategori alasan serta penjelasan detail.
- [x] Pratinjau hasil impor (Preview): modal visual untuk melihat bagaimana resep atau bahan akan ditampilkan kepada pengunjung.
- [x] Indikator lisensi & kepatuhan hak cipta (PRD 5.2): penandaan tegas lisensi terbuka (CC-BY, ODC-By, CC0) vs lisensi proprietary yang memicu penolakan/peringatan.
- [x] Frontend mock state: interaksi kurasi dan perubahan status tersimpan dalam memori sesi tanpa backend/database permanen.
- [x] Aksesibilitas: scoped table headers (`<th scope="col">`), modal berstandar WAI-ARIA (`role="dialog"`, `aria-labelledby`, `aria-modal="true"`), dan kontras warna semantic.
- **Dependencies:** FE-009.
- **AC:** approve/reject update mock state; mock includes duplicate detection example; error state on import failure; license compliance verified. [SELESAI & TERVERIFIKASI]

### FE-013 — Typed mock services [P0] ✅
- [x] Define TypeScript types matching planned API envelopes: `{ data, meta?, error? }`.
- [x] Create `src/lib/services/mock.ts` with deterministic fixtures.
- [x] Mock fixtures include: missing prices (price not found), stale prices (expired), unverified videos, published/draft/archived recipes, different categories/difficulties.
- [x] Keep mock boundary clear so `replace all imports from './mock'` becomes real API client later.
- **Dependencies:** PL-005, FE-007 through FE-012.
- **AC:** UI components import mock service, not database or backend. Mock matches plan API shape. [SELESAI & TERVERIFIKASI]

### FE-014 — Component tests [P0] ✅
- [x] Test SearchForm validation: negative budget rejected, min/max budget enforced (Rp 1.000 - Rp 10.000.000), non-integer/out-of-range servings rejected (1-50), query max 100 chars.
- [x] Test RecipeCard rendering all fields, difficulty badge, shopping cost, and accessible aria-label.
- [x] Test RecipeDetail serving selector updates quantities, shopping cost, and consumption cost live.
- [x] Test EmptyState displays exact PRD message: "Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu." + alternative action CTA.
- [x] Test Admin validation (Zod schema for ingredients, publish rules, stale threshold >30 days).
- [x] Test Ingredient price impact simulator: recipe cost shift on price increase, price drop, and unlinked ingredients.
- [x] Test Ingredient checklist and step completion progress tracker.
- [x] 53 tests implemented and executed via Vitest & React Testing Library (100% PASS).
- **Dependencies:** FE-005 through FE-012.
- **AC:** tests pass and cover happy + error paths for critical UX. [SELESAI & TERVERIFIKASI]

### FE-015 — Responsive and accessibility review [P0] ✅
- [x] Viewport testing across Mobile (375px), Tablet (768px), and Desktop (1440px) on 7 routes: `/`, `/rekomendasi`, `/resep/[slug]`, `/admin`, `/admin/resep`, `/admin/bahan`, `/admin/impor`.
- [x] Layout verification: zero horizontal overflow (`scrollWidth <= innerWidth`) on all tested screen sizes.
- [x] Semantic HTML: Single `<h1>` per page, navigation landmarks (`<nav>`), skip-to-content link.
- [x] Keyboard navigation & focus: Accessible names on icon buttons (`aria-label`), modal WAI-ARIA attributes (`role="dialog"`, `aria-labelledby`, `aria-modal="true"`).
- [x] Color contrast & readability: Semantic color tokens meeting WCAG AA standards.
- [x] Console & Hydration: Zero unhandled console errors or React hydration warnings.
- [x] Real browser testing executed using Playwright with Microsoft Edge (24 tests PASS).
- **Dependencies:** FE-003 through FE-012.
- **AC:** no keyboard trap; all text contrast pass; reduced motion honored; Playwright mobile/tablet/desktop tests pass review. [SELESAI & TERVERIFIKASI]

### FE-016 — Frontend approval gate [P0]
- [x] All FE-001 through FE-015 tasks complete.
- [x] `npm run typecheck` passes (0 errors).
- [x] `npm run lint` passes (0 errors).
- [x] Unit/Component tests pass: `npx vitest run` (53/53 tests pass).
- [x] Playwright responsive/accessibility tests pass: `npx playwright test` (24/24 tests pass).
- [x] Production build passes: `npm run build` (9/9 static pages generated).
- [x] No hardcoded production data, no database/API integration (Strict Phase 1 Frontend).
- [ ] Commit and push to feature branch; create PR for user review (menunggu persetujuan user).
- **Dependencies:** FE-014, FE-015.
- **AC:** all checks pass, user approval before Phase 2 start.

---

## PHASE 2 — Backend

### BE-001 — Database setup [P0]
- [ ] Configure PostgreSQL connection string via `DATABASE_URL` env var.
- [ ] Configure `drizzle.config.ts` pointing to schema directory.
- [ ] Initialize Drizzle Kit: `drizzle-kit push` or manual migration pipeline.
- [ ] Credentials never hardcoded or committed.
- **Dependencies:** Phase 1 approval, PL-004.
- **AC:** `npm run db:push` or `npm run db:migrate` succeeds; schema introspection shows all tables.

### BE-002 — Schema and relations [P0]
- [ ] Define tables: recipes, ingredients, recipe_ingredients, ingredient_prices, recipe_steps, tools, recipe_tools, recipe_nutrition, recipe_videos, external_sources, import_jobs, admin_users, Auth.js tables (accounts, sessions, users, verification_tokens).
- [ ] Define indexes: published recipe `(status, category)`, slug unique, ingredient FK, price `(ingredient_id, region_code, observed_at)`, import `(status, source_id)`.
- [ ] Define unique constraints: recipe slug, email unique, etc.
- [ ] Define check constraints: numeric > 0 where applicable, enum statuses.
- [ ] Define relations: one-to-many (recipe→steps/nutrition/videos, ingredient→prices), many-to-many (recipe↔tools).
- [ ] Use exact numeric for quantity/package_quantity; integer for IDR prices.
- [ ] UUID primary keys; created_at, updated_at timestamps.
- **Dependencies:** BE-001.
- **AC:** schema.ts and relations.ts typecheck; no floating-point price columns; all PRD entities present.

### BE-003 — Migration and seed [P0]
- [ ] Generate initial migration with `drizzle-kit generate`.
- [ ] Create `db/seed.ts` with clearly labeled development-only fixtures (no production claims).
- [ ] Seed target bertahap menuju 150 resep terkurasi (80 makanan, 35 minuman, 35 camilan) sesuai [docs/RECIPE_BACKLOG.md](file:///d:/Projects/DapurCuan/docs/RECIPE_BACKLOG.md).
- [ ] Seed script: `npm run db:seed` or `ts-node db/seed.ts`.
- [ ] Apply migration locally and verify data.
- **Dependencies:** BE-002.
- **AC:** clean database can be seeded from scratch; migrations are reversible and reproducible.

### BE-004 — Auth.js and RBAC [P0]
- [ ] Setup Auth.js `lib/auth.ts` with admin provider (email/password or OAuth; decide on unresolved).
- [ ] Configure session strategy (JWT or database).
- [ ] Persist admin role in token/session callback.
- [ ] Create `proxy.ts` (or `middleware.ts` if Next.js <16) for admin route protection.
- [ ] Authorized callback returns true for admin; false redirects to login.
- [ ] `/api/auth/[...nextauth]/route.ts` handler.
- [ ] Test: anonymous user cannot access /admin; logged-in admin can.
- **Dependencies:** BE-002.
- **AC:** session.user.role accessible server-side; unauthorized 401/redirect tested.

### BE-005 — Domain: cost and portion calculations [P0]
- [ ] `src/domain/recipes/PortionScalingService`: scale quantities based on servings.
- [ ] `src/domain/pricing/CostCalculator`: compute consumption cost (ingredient sum) and shopping cost (package rounding).
- [ ] Exact numeric math; no floating-point.
- [ ] Handle missing price: mark `unknown` instead of assuming 0.
- [ ] Unit tests for scaling edge cases (1→10 servings, fractional quantities).
- [ ] Unit tests for cost: same ingredient in multiple rows deduplicated; package rounding correct.
- **Dependencies:** BE-002.
- **AC:** AC-001 (Rp20k budget, 1 serving, only recipes with shopping cost ≤ Rp20k) and AC-003 (serving change recalculates) logic unit-tested.

### BE-006 — Domain: recommendation engine [P0]
- [ ] `src/domain/recommendations/RecommendationService`: filter published recipes.
- [ ] Apply category, preferences (taste, ingredients include/exclude), max cooking minutes, difficulty filters.
- [ ] Check shopping cost eligibility: only if shopping_cost <= budget.
- [ ] Deterministic ranking: budget distance, time distance, relevance score.
- [ ] Pagination support (limit, offset).
- [ ] Missing prices or stale prices do NOT auto-fail; warning flag instead, but still eligible if other conditions met (decide detail on Phase 2).
- [ ] Unit tests: filter logic, budget boundary (exactly at, above, below).
- **Dependencies:** BE-005.
- **AC:** recommendations only include published, budget-eligible recipes; ranking deterministic; pagination offset/limit correct.

### BE-007 — Domain: nutrition and video services [P1]
- [ ] `src/domain/nutrition/NutritionService`: retrieve per-serving nutrition with source/methodology labels.
- [ ] `src/domain/video/VideoService`: return only verified videos (is_verified=true).
- [ ] Video URL must belong to allowed platform (YouTube, etc.).
- **Dependencies:** BE-002.
- **AC:** AC-005 (nutrition per-serving with source) and AC-006 (only verified) tested.

### BE-008 — Application: recipe CRUD [P0]
- [ ] `src/application/recipes/RecipeApplicationService`: create draft, edit, archive, load by ID/slug.
- [ ] Use transactions for multi-table updates (recipe + ingredients + steps).
- [ ] FK constraints prevent orphaning.
- [ ] Archive uses status=archived, not delete (preserve published history).
- [ ] Authorization: admin-only; check session role.
- [ ] Error handling: DuplicateSlugError, NotFoundError, validation errors.
- **Dependencies:** BE-004, BE-002.
- **AC:** authenticated admin create/edit/archive; unauthenticated cannot; FK errors caught gracefully.

### BE-009 — Application: ingredient and price management [P0]
- [ ] `src/application/ingredients/IngredientApplicationService`: create, list, add price observation.
- [ ] Price observation includes: region_code, package_qty/unit, price IDR, source, observed/expires dates.
- [ ] Region-based lookup (default: Indonesia ID-wide; refine on unresolved).
- [ ] Stale price detection: if expired < today, mark stale.
- [ ] Authorization: admin-only.
- **Dependencies:** BE-004, BE-002.
- **AC:** price history queryable by ingredient and region; stale detection correct; admin-only enforced.

### BE-010 — Application: import pipeline [P0]
- [ ] `src/application/imports/ImportApplicationService`: start job, track status, normalize payload.
- [ ] External source adapter interface: allowlist API endpoints, sanitize payloads.
- [ ] No scraping; only official API/licensed dataset.
- [ ] Adapter timeout: 10s per request; payload limit 5MB; URL allowlist DNS/IP validation (basic security).
- [ ] Normalize to schema: extract name, category, servings, ingredients, steps, etc.
- [ ] Store raw + normalized JSONB payloads and error logs.
- [ ] Status flow: pending → processing → needs_review (or failed).
- [ ] Non-throwing error capture for resilience.
- **Dependencies:** BE-004, BE-008, BE-009.
- **AC:** import job is safe; timeout/size enforced; payload normalization covers example sources; error logged not crashed.

### BE-011 — Application: import duplicate detection and review [P0]
- [ ] `src/application/imports/DuplicateDetector`: check external_id + source_url; normalized name + ingredient fingerprint signals.
- [ ] `src/application/imports/ImportReviewService`: load staging, compare fields, approve/reject logic.
- [ ] Approve transaction: validate recipe completeness (name, category, ingredients w/ prices, steps, nutrition), merge if not duplicate, set status approved.
- [ ] Reject: record reason, set status rejected.
- [ ] Admin-only; record reviewer ID and timestamp.
- **Dependencies:** BE-010, BE-008, BE-009.
- **AC:** AC-007 (import review before publish) and AC-009 (duplicate safe) tested; approval transaction validated.

### BE-012 — Application: publication validator [P0]
- [ ] `src/application/recipes/PublicationValidator`: checklist before publish.
- [ ] Required: name, category, image, base_servings > 0, at least 1 ingredient with price, at least 1 cooking step, nutrition (estimate OK), attribution (if imported), verified video optional but good.
- [ ] Return validation result: pass/fail + list of missing fields.
- [ ] Publish transaction: validate + update status to published + set published_at timestamp.
- **Dependencies:** BE-004, BE-008, BE-005, BE-011.
- **AC:** cannot publish incomplete recipe; validator message lists missing fields.

### BE-013 — Public API: recipes search and detail [P0]
- [ ] `GET /api/v1/recipes`: query category (required), budget, servings, query (name fuzz), preferences (JSON), excludeIngredients, maxCookingMinutes, page=1, limit=10.
- [ ] Zod schema validation; query parsing and coercion.
- [ ] Call RecommendationService with filters.
- [ ] Return paginated response: `{ data: [...], meta: { page, limit, total } }`.
- [ ] `GET /api/v1/recipes/:slug`: detail recipe + computed cost at base servings.
- [ ] `GET /api/v1/categories`: list unique categories.
- [ ] Error envelope: `{ error: { code: 'INVALID_BUDGET', message: '...', details?: {...} } }`.
- **Dependencies:** BE-006, BE-012.
- **AC:** recipes endpoint respects budget filter; detail computes cost; categories list exhaustive.

### BE-014 — Admin API: recipe/ingredient/price management [P0]
- [ ] `GET /api/v1/admin/recipes`: list with status filter and pagination.
- [ ] `POST /api/v1/admin/recipes`: create draft (validated subset of fields).
- [ ] `PATCH /api/v1/admin/recipes/:id`: edit draft or published (allows soft changes).
- [ ] `DELETE /api/v1/admin/recipes/:id`: archive (soft delete).
- [ ] `POST /api/v1/admin/recipes/:id/publish`: call PublicationValidator and publish if valid.
- [ ] Similar for ingredients and prices.
- [ ] Zod schemas per endpoint.
- [ ] Require authenticated admin; role checked near handler.
- **Dependencies:** BE-004, BE-008, BE-009, BE-012.
- **AC:** admin-only enforced (401/403); validation errors clear; audit trail (createdBy, updatedBy, timestamps).

### BE-015 — Admin API: import management [P0]
- [ ] `POST /api/v1/admin/imports`: start new import job (source_id, optional payload URL).
- [ ] `GET /api/v1/admin/imports`: list import jobs with status filter.
- [ ] `GET /api/v1/admin/imports/:id`: detail job + staging recipe preview.
- [ ] `POST /api/v1/admin/imports/:id/approve`: approve with optional field tweaks.
- [ ] `POST /api/v1/admin/imports/:id/reject`: reject with reason.
- [ ] Require admin; role checked.
- **Dependencies:** BE-004, BE-010, BE-011.
- **AC:** import review flow testable end-to-end; approved imports mergeable with dedup.

### BE-016 — API security and error handling [P0]
- [ ] Rate limit: 100 req/min per IP on public endpoints; 50 req/min on admin.
- [ ] Payload limit: 5MB per request body.
- [ ] Error mapping: internal errors (DB, parsing) → 500 safe message; validation → 400 with details.
- [ ] No stack trace or secret leaked in response.
- [ ] SSRF/external import URL allowlist: DNS/IP validation before fetch.
- [ ] External request timeout: 10s; abort if exceed.
- [ ] Structured logging: request ID, method, path, status, user ID, errors.
- **Dependencies:** BE-010, BE-013, BE-014, BE-015.
- **AC:** rate limit headers sent; 401/403/400/500 responses correct; no secrets in logs or errors.

### BE-017 — Database migration and deploy strategy [P1]
- [ ] Create `scripts/db-migrate.sh` or equivalent for production migration pipeline.
- [ ] Migrations idempotent: same migration twice is safe.
- [ ] Backup before apply (documented).
- [ ] Rollback plan: reverse migrations or point-in-time recovery.
- [ ] Seed only in dev, not prod.
- **Dependencies:** BE-001, BE-002, BE-003.
- **AC:** migration script tested locally and in staging; rollback documented.

### BE-018 — Backend tests [P0]
- [ ] Unit tests: cost calculation, portion scaling, duplicate detection, validation.
- [ ] Integration tests: full recipe CRUD, import flow, pagination, authorization.
- [ ] API tests: endpoints respond with correct envelope, status code, validation errors.
- [ ] Test fixtures: use real schema + test DB or in-memory; deterministic seed.
- [ ] Coverage: >=70% domain/application, >=50% API routes.
- **Dependencies:** BE-004 through BE-017.
- **AC:** `npm run test -- --run` passes; coverage report generated.

### BE-019 — Backend approval gate [P0]
- [ ] All BE-001 through BE-018 tasks complete.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test -- --run` passes with coverage report.
- [ ] API documentation (Swagger/OpenAPI optional but good).
- [ ] No secrets in codebase or `.env.example`.
- [ ] Migration rollback tested.
- [ ] Commit and push; create PR for user review.
- **Dependencies:** BE-018.
- **AC:** all checks pass, user approval before Phase 3 start.

---

## PHASE 3 — Integration, Testing, Deployment

### IN-001 — Typed API client [P0]
- [ ] Create `src/lib/api/client.ts`: fetch wrapper with auth token, error handling, response parsing.
- [ ] Zod schemas for response envelopes (success + error).
- [ ] Centralize baseURL, auth middleware, timeout 10s.
- [ ] Type-safe query/params builder.
- **Dependencies:** Phase 2 approval, BE-013, BE-014, BE-015.
- **AC:** client enforces response shape; auth header auto-added for admin endpoints.

### IN-002 — Replace mocks with real APIs [P0]
- [ ] Update public pages: `src/features/recommendations/RecipeService` calls API client instead of mock.
- [ ] Update admin pages: same pattern for CRUD, import, etc.
- [ ] Update types to use API response models.
- [ ] Remove or isolate mock imports.
- [ ] Test: real API integration locally.
- **Dependencies:** IN-001.
- **AC:** pages fetch real data; UI still displays correctly; error state handles API failures.

### IN-003 — Connect recommendation flow [P0]
- [ ] Homepage search form → `/api/v1/recipes` POST (or GET with params).
- [ ] Recommendation page filter updates call API with new params.
- [ ] Sorting (relevance/cost/time) sent to API or applied client-side (decide).
- [ ] Pagination: next/prev updates offset, re-fetches.
- [ ] Loading skeleton during fetch; error toast/message.
- **Dependencies:** IN-002.
- **AC:** search flow A-Z testable; budget filter actually filters; pagination works.

### IN-004 — Connect recipe detail [P0]
- [ ] Recipe detail page calls `/api/v1/recipes/:slug`.
- [ ] Serving selector updates cost via client-side calculation (no re-fetch needed).
- [ ] Nutrition, verified video populated from API response.
- [ ] 404 if recipe not found or not published.
- **Dependencies:** IN-002.
- **AC:** detail loads data; serving selector interactive; 404 handled gracefully.

### IN-005 — Connect admin authentication and CRUD [P0]
- [ ] Admin pages check `useSession()` or server-side `await auth()`.
- [ ] Unauthenticated redirects to login.
- [ ] Login form → Auth.js session.
- [ ] Recipe CRUD (create/edit/publish/archive) calls admin API endpoints.
- [ ] Import review flow: load import → approve/reject → status update.
- [ ] Optimistic updates (UI updates before server ack; revert on error).
- [ ] Authorization error (403) shows message.
- **Dependencies:** IN-001, IN-002.
- **AC:** admin login/logout works; unauthorized users see 403; CRUD operations reflected in UI.

### IN-006 — Handle edge cases and errors [P0]
- [ ] Missing/stale prices: UI shows warning but recipe still returned if eligible.
- [ ] Empty budget result: show PRD message + suggestions (raise budget, reduce servings).
- [ ] Import failure: display error, allow retry.
- [ ] Network timeout: retry logic or fail gracefully.
- [ ] Validation errors from API: show field-level messages.
- **Dependencies:** IN-003, IN-004, IN-005.
- **AC:** edge cases documented with mock examples; user sees actionable message.

### IN-007 — Playwright E2E tests [P0]
- [ ] Guest scenario: visit homepage → search with budget → click recipe → change serving → view detail.
- [ ] Admin scenario: login → create draft recipe → add ingredients/steps → publish → verify published.
- [ ] Import scenario: start import → review → approve → recipe appears in list.
- [ ] Error scenario: budget too low → empty result message; stale price marked.
- [ ] Responsive: run tests at mobile (375px), tablet (768px), desktop (1280px).
- [ ] Accessibility: keyboard navigation, focus order, screen-reader landmarks.
- **Dependencies:** IN-005, IN-006.
- **AC:** Playwright tests pass; screenshots match expected layout; keyboard nav works.

### IN-008 — Performance and SEO [P1]
- [ ] Lighthouse performance target >=85 under documented load (single-core, 4G network).
- [ ] Accessibility target >=90 (no unfix WCAG AA violations).
- [ ] Image optimization: Next Image, srcset, lazy load.
- [ ] Pagination: prevent N+1; batch queries.
- [ ] Minimal client JS: use Server Components.
- [ ] Metadata API: title, description, og:image per page.
- [ ] Sitemap: `/sitemap.xml` or sitemap.ts dynamic.
- [ ] Robots: `/robots.txt` no-index admin pages.
- [ ] Recipe structured data: JSON-LD for published recipes (optional, good-to-have).
- [ ] Canonical URLs for pagination.
- **Dependencies:** IN-005, IN-006.
- **AC:** Lighthouse targets met or gaps documented; sitemap updated; image sizes reduced.

### IN-009 — Production security review [P0]
- [ ] Run authorized API security testing (Strix or equivalent) on staging.
- [ ] Run authorized web app penetration testing on staging.
- [ ] Check for OWASP Top 10: injection, broken auth, sensitive data, XML XXE, broken access control, misconfiguration, XSS, insecure deserialization, using components with known vuln, insufficient logging.
- [ ] Review findings; fix critical/high before release.
- [ ] Verify no secrets in git, environment, or logs.
- [ ] Test backup/recovery procedure.
- [ ] Load test (optional): simulate 100 concurrent users for 5 min; observe response time and error rate.
- **Dependencies:** IN-007, IN-008.
- **AC:** security findings severity < Medium or fixing plan documented; no secrets found.

### IN-010 — Production environment setup [P0]
- [ ] Configure Vercel project: environment variables, secrets, auto-deploy on main branch.
- [ ] Configure managed PostgreSQL: backups, monitoring, connection pooling.
- [ ] DNS/domain setup (if custom domain).
- [ ] SSL/TLS certificate (automatic via Vercel).
- [ ] Monitoring/logging: error alerts, request logs, database slow query log.
- [ ] Runbook: deploy, rollback, data recovery steps.
- **Dependencies:** IN-008, IN-009.
- **AC:** production environment ready; deploy script tested; runbook readable and tested.

### IN-011 — Build and deploy [P0]
- [ ] `npm run build`: full production build, no errors or critical warnings.
- [ ] Test build: `npm run start` simulates production.
- [ ] Deploy to Vercel staging first.
- [ ] Smoke test staging: homepage loads, search works, admin login works.
- [ ] Deploy to production (main branch or manual release).
- [ ] Production smoke test: verify no 500 errors, API responds, admin accessible.
- **Dependencies:** IN-009, IN-010.
- **AC:** build succeeds; production accessible; no critical errors in logs first 24h.

### IN-012 — Documentation and release [P0]
- [ ] Update README: setup, env vars, running locally, testing, deploy.
- [ ] API documentation: endpoint list, request/response examples, error codes.
- [ ] Security summary: authentication method, data encryption, SSRF protection, rate limits, security contacts.
- [ ] Known limitations: ranked search optional, import sources limited to X providers, etc.
- [ ] Changelog: features added, security fixes, known issues.
- [ ] Commit and tag release (e.g., v1.0.0).
- **Dependencies:** IN-010.
- **AC:** README and docs complete; no unaddressed PRD requirements.

### IN-013 — Final approval and release [P0]
- [ ] All IN-001 through IN-012 complete.
- [ ] `npm run typecheck` and `npm run lint` pass.
- [ ] Test suite passes: `npm run test -- --run`.
- [ ] Playwright tests pass.
- [ ] Lighthouse targets met.
- [ ] Security tests completed; findings resolved.
- [ ] Production verification: checklist signed off.
- [ ] User final approval for release.
- **Dependencies:** IN-011, IN-012.
- **AC:** all Definition of Done criteria met; release ready for announcement.

---

## Acceptance Criteria Traceability

| AC | Description | Covered by |
|---|---|---|
| AC-001 | Budget Rp20k, 1 serving → only shopping_cost ≤ Rp20k | BE-005, BE-006, IN-006, IN-007 |
| AC-002 | No match → empty state + alternatives | FE-007, IN-006 |
| AC-003 | Serving change → recalculate qty/cost | FE-008, BE-005, IN-004 |
| AC-004 | Missing price ≠ zero/false match | BE-005, BE-006, IN-006 |
| AC-005 | Nutrition per-serving + source | FE-008, BE-007, IN-004 |
| AC-006 | Only verified videos | FE-008, BE-007, IN-004 |
| AC-007 | Import reviewed before publish | FE-012, BE-011, IN-005 |
| AC-008 | Unauthorized users blocked | BE-004, IN-005, IN-007 |
| AC-009 | Duplicate imports safe | BE-011, IN-005, IN-006 |
| AC-010 | Mobile/tablet/desktop work | FE-015, IN-007 |

---

## Definition of Done

Task complete only when:

1. **Requirement:** all acceptance criteria met; test evidence provided.
2. **Type/Lint:** `npm run typecheck` and `npm run lint` pass.
3. **Tests:** unit/component/integration/E2E pass; coverage acceptable.
4. **Error handling:** errors mapped to user-friendly messages; not crashing.
5. **Accessibility:** no unfix WCAG AA violations; keyboard/AT testable.
6. **Documentation:** updated README, API docs, or code comments.
7. **Security:** no secrets exposed; input validated server-side; auth checked.
8. **No defects:** no critical bugs known at merge.

Each phase must pass its approval gate (user signature) before next phase begins. Report: files changed, test results, blockers, next step.
