# DapurCuan — Implementation Plan

**Status:** Phase 0 — Planning & Architecture only  
**Tanggal:** 28 Oktober 2026  
**Sumber:** `PRD.md` v1.0

## 1. Tujuan dan batasan

DapurCuan adalah platform rekomendasi resep berbasis budget IDR. Guest mencari resep berdasarkan kategori, budget, porsi, dan preferensi. Admin mengelola resep, bahan, harga, nutrisi, video, serta pipeline impor berizin.

Dokumen ini menjadi baseline sebelum coding. Phase 1 memakai mock service saja. Phase 2 membangun backend nyata. Phase 3 menghubungkan keduanya. Tidak ada scraping, data harga/nutrisi/video produksi yang dibuat-buat, atau dependency baru pada Phase 0.

## 2. Keputusan arsitektur

Gunakan Modular Monolith pada satu aplikasi Next.js App Router, dengan batas modul jelas:

- **Presentation:** route pages/layouts, Server Components sebagai default, Client Components hanya untuk form/interaksi.
- **Application:** use case orchestration; validasi input; authorization; response mapping.
- **Domain:** entity, value object, status enum, kalkulasi porsi, consumption cost, shopping cost, ranking, publication rules.
- **Data Access:** Drizzle schema, query repository, transaksi, migration boundary.
- **External Integration:** adapter source resep/video; allowlist URL; timeout; payload limit; attribution; import normalization.

Public page dapat membaca published recipe melalui service application. Admin page dan admin Route Handler memakai Auth.js session plus pengecekan role server-side. Proxy hanya lapisan redirect awal, bukan satu-satunya authorization.

Next.js Route Handlers berada di `app` dan menjadi API `/api/v1`; GET tidak diasumsikan cached kecuali dipilih eksplisit. SEO memakai metadata API, `sitemap.ts`, robots, canonical URL, Open Graph, dan Recipe structured data bila data memenuhi syarat.

## 3. Technology stack

| Area | Pilihan | Aturan |
|---|---|---|
| Runtime/UI | Next.js App Router, React, TypeScript strict | Server-first; client boundary kecil |
| Styling | Tailwind CSS, shadcn/ui | token-driven, accessible primitives |
| Form | React Hook Form + Zod | client UX tidak menggantikan validasi server |
| Animation | Motion | seperlunya; hormati reduced motion |
| API | Next.js Route Handlers `/api/v1` | envelope konsisten, status HTTP tepat |
| Database | PostgreSQL managed | UUID, FK, constraints, indexes, numeric-safe values |
| ORM/migration | Drizzle ORM + Drizzle Kit | schema TypeScript source of truth; generate lalu migrate |
| Auth | Auth.js Credentials provider | email + password, bcrypt/argon2 hashing, admin role only |
| Test | Vitest, React Testing Library, Playwright | unit, component, integration, E2E |
| Deploy | Vercel + managed PostgreSQL | env vars, migration pipeline, backups |
| Image | Cloudinary (production) | Phase 1 pakai mock/placeholder images |
| Import | manual + JSON/CSV dengan izin | adapter interface untuk future official API |

Verifikasi dokumentasi teknologi: Next.js Route Handlers/metadata/sitemap, Drizzle schema/migrations/indexes/numeric, Auth.js RBAC/protection, dan Zod strict validation. Rujukan tercantum pada bagian Sources.

## 4. Struktur folder target

```text
DapurCuan/
├─ app/
│  ├─ (public)/page.tsx
│  ├─ (public)/rekomendasi/page.tsx
│  ├─ (public)/resep/[slug]/page.tsx
│  ├─ admin/page.tsx
│  ├─ admin/resep/page.tsx
│  ├─ admin/bahan/page.tsx
│  ├─ admin/impor/page.tsx
│  ├─ api/v1/recipes/route.ts
│  ├─ api/v1/recipes/[slug]/route.ts
│  ├─ api/v1/categories/route.ts
│  ├─ api/v1/admin/**/route.ts
│  ├─ api/auth/[...nextauth]/route.ts
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ layout.tsx
│  └─ globals.css
├─ src/
│  ├─ components/ui/
│  ├─ components/recipe/
│  ├─ components/search/
│  ├─ components/admin/
│  ├─ components/layout/
│  ├─ features/recipes/
│  ├─ features/recommendations/
│  ├─ features/imports/
│  ├─ features/admin/
│  ├─ domain/recipes/
│  ├─ domain/pricing/
│  ├─ domain/nutrition/
│  ├─ domain/imports/
│  ├─ application/recipes/
│  ├─ application/recommendations/
│  ├─ application/imports/
│  ├─ lib/validation/
│  ├─ lib/auth/
│  ├─ lib/errors/
│  └─ lib/http/
├─ db/
│  ├─ schema/
│  ├─ relations.ts
│  ├─ client.ts
│  └─ seed.ts
├─ drizzle/
│  └─ migrations/
├─ tests/
│  ├─ unit/
│  ├─ component/
│  ├─ integration/
│  └─ e2e/
├─ docs/
│  ├─ IMPLEMENTATION_PLAN.md
│  └─ TASKS.md
└─ public/
```

`app` menangani routing dan composition. `src/domain` tidak mengimpor React, Next.js, atau Drizzle. `src/application` bergantung pada interface repository/adapter. `db` menjadi adapter PostgreSQL. Struktur dapat disesuaikan hanya bila boundary tetap terjaga.

## 5. Data model dan aturan database

Core tables dari PRD: `recipes`, `ingredients`, `recipe_ingredients`, `ingredient_prices`, `recipe_steps`, `tools`, `recipe_tools`, `recipe_nutrition`, `recipe_videos`, `external_sources`, `import_jobs`, `admin_users`, plus tabel Auth.js yang diperlukan.

Relasi utama: recipe memiliki banyak ingredient links, steps, nutrition records, dan videos; ingredient memiliki banyak price observations; recipes dan tools many-to-many; import job merujuk source dan reviewer.

Aturan desain:

- UUID primary key; slug recipe unique.
- Enum/check constraints untuk category, difficulty, recipe status, import status, role, platform, currency.
- `quantity`, package quantity, dan kalkulasi takaran memakai exact numeric; uang IDR berupa integer rupiah. Hindari floating point.
- `recipe_ingredients` unique `(recipe_id, ingredient_id, sort_order)` sesuai kebutuhan domain; cegah duplikasi ingredient dalam satu recipe melalui aturan application/constraint yang dipilih saat implementasi.
- Index published recipe `(status, category)`, slug, ingredient lookup, price `(ingredient_id, region_code, observed_at)`, import `(status, source_id)`, dan full-text/search strategy setelah benchmark.
- FK memakai perilaku delete yang aman; recipe archive memakai status, bukan hard delete untuk data published.
- Harga memiliki `region_code` (default: 'ID' Indonesia-wide, mendukung per-kota seperti 'ID-JKT', 'ID-BDG'), source, observed/expiry. Stale threshold 30 hari dari `observed_at`. Harga stale tidak dipakai sebagai fresh price tanpa label; harga hilang menghasilkan `unknown/unpriceable`, bukan nol.
- Import idempotency memakai source + external ID/source URL, lalu normalized name dan ingredient fingerprint sebagai sinyal duplikasi; nama sama saja bukan bukti duplikasi.
- Publication transaction memvalidasi kelengkapan recipe, bahan, langkah, price policy, nutrition, attribution, dan verified video rules sebelum status published.
- Tambahkan audit fields/metadata bila diperlukan untuk review history tanpa mengubah kontrak PRD.

### Cost model

`Consumption Cost` = nilai takaran yang dipakai. `Shopping Cost` = jumlah paket yang perlu dibeli, dibulatkan ke atas berdasarkan package quantity. Scaling: `scaled_quantity = base_quantity * requested_servings / base_servings`. Bahan identik digabung sebelum package rounding. Recommendation hanya menerima recipe bila shopping cost diketahui dan `shopping_cost <= budget`; missing price tidak lolos sebagai cocok.

## 6. Domain services

`RecipeSearchService` memvalidasi filter dan mengambil published recipes. `PortionScalingService` menghitung quantity aman. `PriceResolver` memilih price observation berdasarkan region, freshness (threshold 30 hari), dan source. `CostCalculator` menghasilkan consumption/shopping cost plus warnings. `RecommendationService` memfilter category, budget, preferences, exclusions, max cooking time, difficulty lalu memberi ranking dengan weights: 60% preference match, 25% budget efficiency, 15% cooking time match. Semua resep harus lolos filter budget (`shopping_cost <= budget`) sebelum ranking diterapkan. `PublicationValidator` memeriksa kelengkapan. `ImportNormalizer`, `DuplicateDetector`, dan `ImportReviewService` mengelola staging sampai approve/reject; mendukung manual JSON/CSV dengan izin. `NutritionService` menampilkan per-serving estimate dan source. `VideoService` hanya mengembalikan verified videos.

## 7. Frontend pages dan komponen

Public routes: `/` homepage; `/rekomendasi` summary, filters, sorting, pagination, loading/empty/error; `/resep/[slug]` detail, serving selector, cost breakdown, ingredients checklist, tools, steps, nutrition, verified video, related recipes.

Admin routes: `/admin` dashboard metrics/warnings; `/admin/resep` table + create/edit/draft/publish/archive; `/admin/bahan` ingredient and price history; `/admin/impor` source, queue, field comparison, approve/reject.

Reusable components: AppShell, Navbar, Footer, SearchForm, CategorySelect, BudgetInput, ServingsInput, PreferenceFilters, RecipeCard, RecipeGrid, CostBreakdown, IngredientsList, ToolsList, CookingSteps, NutritionPanel, VerifiedVideo, EmptyState, LoadingSkeleton, ErrorState, DataTable, RecipeEditor, PriceEditor, ImportReviewPanel, ConfirmDialog, Toast/inline field error.

Design system planning memakai tiga layer: primitive (warna warm orange, fresh green, off-white, dark neutral, typography, spacing, radius, shadow), semantic (background, foreground, primary, success, warning, danger, focus), component (button, input, card, badge, table, dialog). Mobile-first, keyboard navigation, visible focus, semantic landmarks, contrast, reduced motion, and Indonesian copy.

## 8. API contracts

Prefix `/api/v1`. Success envelope: `{ data, meta? }`. Error envelope: `{ error: { code, message, details? } }`. Query/body schemas didefinisikan Zod, limit dibatasi, unknown fields ditolak/ditangani eksplisit.

| Method | Endpoint | Tujuan |
|---|---|---|
| GET | `/recipes` | published search/recommendation; category, budget, servings, query, preferences, excludeIngredients, maxCookingMinutes, page, limit |
| GET | `/recipes/:slug` | detail recipe dan computed cost |
| GET | `/categories` | kategori publik |
| GET | `/admin/recipes` | list admin dengan status/filter |
| POST | `/admin/recipes` | create draft |
| PATCH | `/admin/recipes/:id` | edit recipe |
| DELETE | `/admin/recipes/:id` | archive/delete policy |
| POST | `/admin/recipes/:id/publish` | validate + publish |
| GET/POST/PATCH | `/admin/ingredients[/:id]` | ingredient CRUD |
| POST | `/admin/prices` | price observation |
| POST | `/admin/imports` | start import job |
| GET | `/admin/imports` | import queue |
| GET | `/admin/imports/:id` | import detail/staging |
| POST | `/admin/imports/:id/approve` | approve after review |
| POST | `/admin/imports/:id/reject` | reject with reason |

Public endpoints expose only published, attributed, safe fields. Admin endpoints require authenticated admin session and server-side role check. Rate limiting, payload limit, external URL allowlist/SSRF protection, timeout, safe error mapping, structured logging, and no secret leakage are mandatory.

## 9. Implementation strategy by phase

**Phase 0 decisions (approved 2026-10-28):**

1. **Admin authentication:** email + password via Auth.js Credentials provider; bcrypt/argon2 hashing; admin-only login.
2. **Price region:** Indonesia (ID) default; architecture supports per-kota harga via `region_code` field.
3. **Stale price threshold:** 30 hari dari `observed_at`; configurable via `PRICE_STALE_DAYS` env var.
4. **Import sources:** manual input + JSON/CSV upload dengan izin; adapter interface siap untuk official API eksternal.
5. **Image storage:** Cloudinary (production); Phase 1 gunakan placeholder/mock images.
6. **Pagination:** 12 resep per halaman (`limit=12` default).
7. **Ranking weights:** 60% preference match, 25% budget efficiency (lebih murah = lebih tinggi), 15% cooking time match. Semua resep lolos filter budget (`shopping_cost <= budget`) sebelum ranking diterapkan.

**Phase 1:** build UI shell dan semua public/admin screens dengan typed mock services. Tidak ada database/API integration. Tambahkan component tests, responsive checks, accessibility review. Stop dan request approval.

**Phase 2:** build PostgreSQL/Drizzle schema dan migrations, seed non-production fixture data, Auth.js dengan Credentials provider, domain/application services, APIs, security controls, unit/integration tests, API documentation. Stop dan request approval.

**Phase 3:** typed API client gantikan mocks, connect flows, real error/loading states, Playwright E2E, accessibility, build, environment, deployment, production verification. Testing/security gates wajib sebelum release.

## 10. Technical risks and mitigations

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Shopping vs consumption cost salah | rekomendasi budget salah | exact numeric, pure domain tests, fixtures edge case |
| Missing/stale regional prices | false recommendation | explicit price status, freshness policy, warning UI |
| Import konten tanpa izin | legal/security | official API/licensed dataset only, attribution metadata, allowlist |
| SSRF/import payload besar | compromise/DoS | URL allowlist, DNS/IP policy, timeout, body limit, rate limit |
| Admin authorization hanya di UI | unauthorized mutation | check session+role near handler/service/data |
| Duplicate imports | data duplicate | idempotency keys and fingerprint review |
| N+1 recipe detail | latency | deliberate joins/batched queries, query tests, indexes |
| Nutrition/video provenance lemah | trust issue | source, methodology, verification fields and labels |
| Next.js cache stale | data mismatch | explicit cache/revalidation policy per endpoint/page |
| Mobile/accessibility gaps | poor adoption | mobile-first components, keyboard/AT review, Playwright viewport tests |

## 11. Verification gates

Sebelum Phase 1: PRD traceability, plan approved, unresolved decisions recorded. Sebelum Phase 2: frontend mock-only and review approved. Sebelum Phase 3: schema/API/security tests pass and backend approved. Sebelum release: typecheck, lint, unit/component/integration/E2E, accessibility, Lighthouse targets, migration rehearsal, security testing authorized environment, no secrets, and production smoke test.

## 12. Dokumentasi teknologi diverifikasi

- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-existing)
- [Drizzle schema](https://orm.drizzle.team/docs/sql-schema-declaration)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [Drizzle indexes and constraints](https://orm.drizzle.team/docs/indexes-constraints)
- [Auth.js RBAC](https://authjs.dev/guides/role-based-access-control)
- [Auth.js protecting routes](https://authjs.dev/getting-started/session-management/protecting?framework=Next.js)
- [Zod](https://zod.dev/)
