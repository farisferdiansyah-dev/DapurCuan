\# PRODUCT REQUIREMENTS DOCUMENT (PRD)

\# DapurCuan — Smart Budget Recipe Recommendation Platform



\*\*Version:\*\* 1.0  

\*\*Status:\*\* Ready for Development  

\*\*Date:\*\* 28 Oktober 2026  

\*\*Product Type:\*\* Full-Stack Web Application  

\*\*Language:\*\* Bahasa Indonesia  

\*\*Currency:\*\* Indonesian Rupiah (IDR)



\---



\## 1. PRODUCT OVERVIEW



\### 1.1 Product Vision



DapurCuan adalah platform website yang membantu pengguna menemukan resep makanan, minuman, dan camilan berdasarkan budget yang mereka miliki.



Pengguna cukup memasukkan jenis masakan, budget, jumlah porsi, serta preferensi. Sistem kemudian merekomendasikan resep yang sesuai dengan anggaran tersebut.



Setiap rekomendasi dilengkapi:



\- Foto masakan.

\- Nama dan deskripsi resep.

\- Estimasi biaya belanja.

\- Daftar alat memasak.

\- Daftar bahan dan jumlahnya.

\- Langkah-langkah memasak.

\- Estimasi waktu memasak.

\- Informasi nutrisi per porsi.

\- Video tutorial dari YouTube atau platform lain yang relevan.



\### 1.2 Target Users



\- Mahasiswa dan anak kos.

\- Pelajar yang ingin belajar memasak.

\- Pengguna rumahan.

\- Orang yang ingin menghemat pengeluaran belanja.

\- Pemula yang membutuhkan panduan memasak.



\### 1.3 Product Goals



1\. Membantu pengguna menemukan resep sesuai budget.

2\. Memberikan estimasi biaya bahan secara transparan.

3\. Menyediakan panduan memasak lengkap.

4\. Menampilkan informasi gizi setiap resep.

5\. Menyediakan video tutorial yang relevan.

6\. Memudahkan admin mengelola resep.

7\. Mendukung impor resep dari sumber eksternal.

8\. Menghasilkan website modern yang layak menjadi portofolio full-stack.



\---



\## 2. TECHNOLOGY STACK



\### Frontend



\- Next.js App Router.

\- TypeScript strict mode.

\- Tailwind CSS.

\- shadcn/ui.

\- React Hook Form.

\- Zod.

\- Motion untuk animasi seperlunya.



\### Backend



\- Next.js Route Handlers.

\- PostgreSQL.

\- Drizzle ORM.

\- Drizzle Kit.

\- Auth.js untuk autentikasi admin.

\- Zod untuk validasi API.



\### Testing



\- Vitest.

\- React Testing Library.

\- Playwright.

\- Security testing pada lingkungan yang diizinkan.



\### Deployment



\- Vercel.

\- Managed PostgreSQL.

\- Environment variables.

\- Automated database migrations.



\### Architecture



Gunakan Modular Monolith Architecture dengan pemisahan:



\- Presentation Layer.

\- Application Layer.

\- Domain Layer.

\- Data Access Layer.

\- External Integration Layer.



\---



\## 3. USER ROLES



\### 3.1 Guest User



Pengunjung tanpa login dapat:



\- Mencari resep.

\- Memilih kategori makanan, minuman, atau camilan.

\- Memasukkan budget.

\- Memilih jumlah porsi.

\- Mengatur preferensi.

\- Melihat rekomendasi.

\- Melihat detail resep.

\- Melihat informasi nutrisi.

\- Menonton video tutorial.



\### 3.2 Administrator



Admin dapat:



\- Login ke dashboard.

\- Menambah resep.

\- Mengedit resep.

\- Mengarsipkan resep.

\- Mengelola bahan dan harga.

\- Mengelola alat memasak.

\- Mengelola langkah memasak.

\- Mengelola informasi nutrisi.

\- Mengelola video tutorial.

\- Mengimpor resep eksternal.

\- Memverifikasi resep.

\- Mempublikasikan resep.



\---



\## 4. CORE FEATURES



\### FR-001 — Recipe Search



Input wajib:



\- Kategori hidangan.

\- Budget dalam Rupiah.

\- Jumlah porsi.



Input opsional:



\- Nama masakan.

\- Preferensi rasa.

\- Bahan yang diinginkan.

\- Bahan yang dihindari.

\- Durasi memasak maksimum.

\- Tingkat kesulitan.



Validasi:



\- Budget harus positif.

\- Jumlah porsi harus bilangan bulat positif.

\- Input tidak valid harus menampilkan pesan error.

\- Input teks harus dibatasi panjangnya.



\### FR-002 — Recommendation Engine



Alur:



1\. Validasi input pengguna.

2\. Ambil resep berstatus published.

3\. Filter berdasarkan kategori.

4\. Filter berdasarkan preferensi.

5\. Hitung kebutuhan bahan sesuai jumlah porsi.

6\. Hitung estimasi biaya belanja.

7\. Bandingkan biaya dengan budget.

8\. Urutkan berdasarkan relevansi.

9\. Tampilkan resep yang memenuhi kriteria.



Jika harga bahan tidak tersedia, jangan menganggap harganya nol.



\### FR-003 — Recipe Result Cards



Setiap kartu menampilkan:



\- Gambar.

\- Nama resep.

\- Estimasi biaya.

\- Waktu memasak.

\- Jumlah porsi.

\- Tingkat kesulitan.

\- Ringkasan nutrisi.

\- Tombol lihat detail.



\### FR-004 — Recipe Detail



Halaman detail memuat:



\- Foto dan deskripsi masakan.

\- Jumlah porsi.

\- Estimasi biaya.

\- Waktu persiapan.

\- Waktu memasak.

\- Alat memasak.

\- Bahan dan takaran.

\- Harga bahan.

\- Total biaya belanja.

\- Instruksi memasak bertahap.

\- Informasi nutrisi.

\- Video tutorial.

\- Sumber dan tanggal pembaruan harga.



\### FR-005 — Budget Calculation



Sistem harus membedakan:



\*\*Consumption Cost:\*\* nilai bahan yang digunakan dalam resep.



\*\*Shopping Cost:\*\* estimasi uang yang perlu dikeluarkan untuk membeli bahan.



Shopping Cost digunakan untuk menentukan apakah resep sesuai budget.



Ketentuan:



\- Takaran disesuaikan dengan jumlah porsi.

\- Kemasan bahan dibulatkan sesuai kebutuhan pembelian.

\- Bahan yang sama tidak dihitung dua kali.

\- Harga memiliki wilayah acuan dan tanggal pembaruan.

\- Harga yang tidak tersedia tidak boleh dianggap gratis.

\- Harga kedaluwarsa diberi status stale.



\### FR-006 — Nutrition Information



Minimal:



\- Kalori (kkal).

\- Protein (g).

\- Karbohidrat (g).

\- Lemak (g).



Tambahan:



\- Serat (g).

\- Gula (g).

\- Natrium (mg).



Nilai ditampilkan per porsi dan diberi label estimasi beserta sumbernya.



\### FR-007 — Video Tutorial



Simpan:



\- Platform.

\- URL.

\- Video ID.

\- Judul.

\- Nama kreator.

\- Bahasa.

\- Status verifikasi.

\- Tanggal verifikasi.



Hanya video terverifikasi yang ditampilkan.



\### FR-008 — Empty State



Jika budget tidak mencukupi atau tidak ada resep yang sesuai, tampilkan:



"Maaf, kami belum menemukan resep yang sesuai dengan budget dan preferensimu."



Berikan opsi:



\- Ubah budget.

\- Kurangi porsi.

\- Ubah preferensi.

\- Hapus filter tertentu.



Jangan menampilkan resep melebihi budget sebagai rekomendasi yang cocok.



\### FR-009 — Admin Dashboard



Menampilkan:



\- Total resep.

\- Resep published.

\- Resep draft.

\- Resep menunggu review.

\- Resep dengan harga kedaluwarsa.

\- Resep dengan data nutrisi belum lengkap.

\- Impor yang menunggu verifikasi.



\### FR-010 — Recipe Management



Admin dapat membuat, mengedit, menyimpan draft, memublikasikan, dan mengarsipkan resep.



Publikasi harus melewati validasi kelengkapan data.



\---



\## 5. HYBRID RECIPE DATA SYSTEM



Sumber resep menggunakan pendekatan hybrid.



\### 5.1 Manual Recipe Management



Admin memasukkan resep secara manual melalui dashboard.



\### 5.2 External Recipe Import



Impor menggunakan:



\- API resmi.

\- Dataset yang mengizinkan penggunaan.

\- Sumber eksternal dengan izin sesuai ketentuan.



Jangan melakukan scraping atau menyalin konten tanpa izin.



\### 5.3 Import Pipeline



1\. Admin memilih sumber.

2\. Sistem mengambil data.

3\. Sistem menyimpan metadata impor.

4\. Data dinormalisasi.

5\. Sistem memeriksa duplikasi.

6\. Data masuk staging.

7\. Admin melakukan review.

8\. Admin menyetujui atau menolak.

9\. Resep dipublikasikan setelah validasi.



\### 5.4 Import Status



\- pending.

\- processing.

\- needs\_review.

\- approved.

\- rejected.

\- failed.



\### 5.5 Duplicate Detection



Gunakan:



\- External recipe ID.

\- Source URL.

\- Normalized recipe name.

\- Ingredient fingerprint.



Resep dengan nama sama tidak otomatis dianggap duplikat.



\### 5.6 Source Attribution



Simpan nama penyedia, URL asli, lisensi, aturan atribusi, dan tanggal impor.



\---



\## 6. DATABASE DESIGN — DRIZZLE ORM



Gunakan PostgreSQL dengan Drizzle ORM.



\### Table: recipes



\- id UUID primary key.

\- slug unique.

\- name.

\- description.

\- category.

\- base\_servings.

\- prep\_minutes.

\- cook\_minutes.

\- difficulty.

\- image\_url.

\- status.

\- source\_id nullable.

\- created\_at.

\- updated\_at.

\- published\_at nullable.



\### Table: ingredients



\- id UUID primary key.

\- name.

\- canonical\_unit.

\- category.

\- created\_at.

\- updated\_at.



\### Table: recipe\_ingredients



\- id UUID primary key.

\- recipe\_id foreign key.

\- ingredient\_id foreign key.

\- quantity numeric.

\- unit.

\- optional.

\- preparation\_note.

\- sort\_order.



\### Table: ingredient\_prices



\- id UUID primary key.

\- ingredient\_id foreign key.

\- region\_code.

\- package\_quantity numeric.

\- package\_unit.

\- package\_price\_idr integer.

\- currency.

\- observed\_at.

\- expires\_at.

\- source\_name.



\### Table: recipe\_steps



\- id UUID primary key.

\- recipe\_id foreign key.

\- step\_number.

\- instruction.

\- estimated\_minutes nullable.



\### Table: tools



\- id UUID primary key.

\- name.

\- description.



\### Table: recipe\_tools



\- recipe\_id foreign key.

\- tool\_id foreign key.

\- composite primary key.



\### Table: recipe\_nutrition



\- id UUID primary key.

\- recipe\_id foreign key.

\- serving\_basis.

\- calories\_kcal.

\- protein\_g.

\- carbohydrates\_g.

\- fat\_g.

\- fiber\_g.

\- sugar\_g.

\- sodium\_mg.

\- source\_name.

\- methodology.

\- verified\_at.



\### Table: recipe\_videos



\- id UUID primary key.

\- recipe\_id foreign key.

\- platform.

\- video\_id.

\- url.

\- title.

\- creator\_name.

\- language.

\- is\_verified.

\- verified\_at.



\### Table: external\_sources



\- id UUID primary key.

\- provider\_name.

\- base\_url.

\- license\_name.

\- attribution\_rules.

\- is\_enabled.



\### Table: import\_jobs



\- id UUID primary key.

\- source\_id foreign key.

\- external\_recipe\_id.

\- source\_url.

\- status.

\- raw\_payload JSONB.

\- normalized\_payload JSONB.

\- error\_message.

\- reviewed\_by.

\- created\_at.

\- reviewed\_at.



\### Table: admin\_users



\- id UUID primary key.

\- email unique.

\- name.

\- role.

\- created\_at.



Tambahkan tabel autentikasi yang diperlukan oleh Auth.js.



Gunakan foreign keys, unique constraints, indexes, serta numeric-safe calculations.



\---



\## 7. API SPECIFICATION



Gunakan endpoint dengan prefix `/api/v1`.



\### Public API



GET `/api/v1/recipes`



Query:



\- category.

\- budget.

\- servings.

\- query.

\- preferences.

\- excludeIngredients.

\- maxCookingMinutes.

\- page.

\- limit.



GET `/api/v1/recipes/:slug`



GET `/api/v1/categories`



\### Admin API



GET `/api/v1/admin/recipes`



POST `/api/v1/admin/recipes`



PATCH `/api/v1/admin/recipes/:id`



DELETE `/api/v1/admin/recipes/:id`



POST `/api/v1/admin/recipes/:id/publish`



GET `/api/v1/admin/ingredients`



POST `/api/v1/admin/ingredients`



PATCH `/api/v1/admin/ingredients/:id`



POST `/api/v1/admin/prices`



POST `/api/v1/admin/imports`



GET `/api/v1/admin/imports`



GET `/api/v1/admin/imports/:id`



POST `/api/v1/admin/imports/:id/approve`



POST `/api/v1/admin/imports/:id/reject`



\### API Response Format



Success:



\- data.

\- meta jika diperlukan.



Error:



\- error.code.

\- error.message.

\- error.details.



\### Security



\- Zod validation.

\- Server-side authorization.

\- Rate limiting.

\- Secure sessions.

\- Input sanitization.

\- SSRF protection untuk external imports.

\- External request timeouts.

\- Payload size limits.

\- No secrets exposed to frontend.



\---



\## 8. UI/UX DESIGN



\### Design Style



\- Modern.

\- Minimalist.

\- Professional.

\- Warm and friendly.

\- Food-focused.

\- Responsive.

\- Mobile-first.



\### Color Direction



\- Primary: warm orange.

\- Secondary: fresh green.

\- Background: warm off-white.

\- Text: dark neutral.



\### Homepage `/`



Sections:



1\. Navbar.

2\. Hero.

3\. Recipe search form.

4\. Popular recipes.

5\. How it works.

6\. Featured recipes.

7\. Footer.



Hero headline:



\*\*Masak Apa Hari Ini? Sesuaikan dengan Budgetmu!\*\*



Supporting text:



Temukan ide makanan, minuman, dan camilan lengkap dengan bahan, estimasi biaya, nutrisi, serta video tutorial.



\### Recommendation Page `/rekomendasi`



\- Search summary.

\- Filter sidebar.

\- Recipe grid.

\- Sorting.

\- Pagination.

\- Loading state.

\- Empty state.

\- Error state.



\### Recipe Detail `/resep/\[slug]`



\- Hero image.

\- Recipe summary.

\- Servings selector.

\- Cost breakdown.

\- Ingredients checklist.

\- Cooking tools.

\- Cooking steps.

\- Nutrition information.

\- Video tutorial.

\- Related recipes.



\### Admin Dashboard `/admin`



\- Sidebar.

\- Summary cards.

\- Recipe statistics.

\- Recent imports.

\- Data warnings.



\### Admin Recipe Management `/admin/resep`



\- Recipe table.

\- Search.

\- Filter.

\- Create/edit form.

\- Status actions.

\- Publish validation.



\### Admin Ingredient Management `/admin/bahan`



\- Ingredient list.

\- Price history.

\- Region and units.

\- Price management.



\### Admin Import Management `/admin/impor`



\- Import source selection.

\- Import queue.

\- Review interface.

\- Field comparison.

\- Approve/reject.



\### UX Requirements



\- Accessible forms.

\- Responsive layout.

\- Keyboard navigation.

\- Visible focus indicators.

\- Loading skeletons.

\- Clear validation messages.

\- Error handling.

\- Empty states.

\- Reduced-motion support.



\---



\## 9. NON-FUNCTIONAL REQUIREMENTS



\### Performance



\- Target Lighthouse performance >= 85 under documented conditions.

\- Target Lighthouse accessibility >= 90.

\- Optimized images.

\- Pagination.

\- Avoid unnecessary client JavaScript.

\- Avoid N+1 database queries.



\### Security



\- Admin authentication.

\- Role-based authorization.

\- Input validation.

\- Secure environment variables.

\- Safe external imports.

\- No exposed database credentials.



\### SEO



\- Page metadata.

\- Open Graph.

\- Sitemap.

\- Canonical URLs.

\- Recipe structured data when appropriate.



\### Reliability



\- Graceful API failures.

\- Reproducible migrations.

\- Import idempotency.

\- Database backup strategy.

\- Structured error logging.



\---



\## 10. DEVELOPMENT PHASES



Development order is mandatory:



\*\*Planning → Frontend → Backend → Integration → Testing → Deployment.\*\*



\### PHASE 0 — PLANNING



Tasks:



\- Analyze PRD.

\- Define architecture.

\- Define folder structure.

\- Define reusable components.

\- Define API contracts.

\- Identify technical risks.

\- Create `docs/IMPLEMENTATION\_PLAN.md`.

\- Create `docs/TASKS.md`.



Do not begin coding until planning is approved.



\### PHASE 1 — FRONTEND



Tasks:



\- FE-001: Initialize Next.js + TypeScript.

\- FE-002: Configure Tailwind and shadcn/ui.

\- FE-003: Define design system.

\- FE-004: Build navigation and layout.

\- FE-005: Build homepage.

\- FE-006: Build category selection.

\- FE-007: Build budget form.

\- FE-008: Build preference filters.

\- FE-009: Build recipe cards.

\- FE-010: Build recommendation page.

\- FE-011: Build recipe detail.

\- FE-012: Build ingredient and tools UI.

\- FE-013: Build cooking steps.

\- FE-014: Build nutrition panel.

\- FE-015: Build video placeholder.

\- FE-016: Build empty/loading/error states.

\- FE-017: Build admin dashboard UI.

\- FE-018: Build recipe management UI.

\- FE-019: Build ingredient management UI.

\- FE-020: Build import review UI.

\- FE-021: Implement typed mock services.

\- FE-022: Add component tests.

\- FE-023: Test responsive layouts.

\- FE-024: Perform accessibility review.



\*\*Frontend must use mock data only.\*\*



Stop after Phase 1 and wait for approval.



\### PHASE 2 — BACKEND



Tasks:



\- BE-001: Setup PostgreSQL.

\- BE-002: Setup Drizzle ORM.

\- BE-003: Create database schema.

\- BE-004: Generate migrations.

\- BE-005: Create seed data.

\- BE-006: Implement admin authentication.

\- BE-007: Implement authorization.

\- BE-008: Implement recipe CRUD.

\- BE-009: Implement ingredient CRUD.

\- BE-010: Implement price observations.

\- BE-011: Implement unit conversion.

\- BE-012: Implement portion scaling.

\- BE-013: Implement shopping cost calculation.

\- BE-014: Implement recommendation filtering.

\- BE-015: Implement recommendation ranking.

\- BE-016: Implement nutrition services.

\- BE-017: Implement video metadata services.

\- BE-018: Implement external source adapters.

\- BE-019: Implement import staging.

\- BE-020: Implement duplicate detection.

\- BE-021: Implement import approval.

\- BE-022: Implement publication validation.

\- BE-023: Implement public API.

\- BE-024: Implement admin API.

\- BE-025: Add Zod validation.

\- BE-026: Add rate limiting.

\- BE-027: Write unit tests.

\- BE-028: Write integration tests.

\- BE-029: Document API contracts.



Stop after Phase 2 and wait for approval.



\### PHASE 3 — INTEGRATION



Tasks:



\- IN-001: Create typed API client.

\- IN-002: Replace mock services with real APIs.

\- IN-003: Connect recipe search.

\- IN-004: Connect filters and pagination.

\- IN-005: Connect recipe detail.

\- IN-006: Connect serving calculations.

\- IN-007: Connect nutrition data.

\- IN-008: Connect verified videos.

\- IN-009: Connect admin authentication.

\- IN-010: Connect recipe CRUD.

\- IN-011: Connect ingredient and price management.

\- IN-012: Connect import review.

\- IN-013: Implement real error handling.

\- IN-014: Test stale/missing prices.

\- IN-015: Test import failures.

\- IN-016: Write Playwright E2E tests.

\- IN-017: Run accessibility checks.

\- IN-018: Run production build.

\- IN-019: Configure environment variables.

\- IN-020: Configure production database.

\- IN-021: Deploy application.

\- IN-022: Verify production.

\- IN-023: Create final documentation.



\---



\## 11. ACCEPTANCE CRITERIA



\### AC-001 — Budget Search



Given budget Rp20.000 and one serving, only recipes whose calculated shopping cost is at most Rp20.000 are recommended.



\### AC-002 — Insufficient Budget



If no recipe fits, show a clear empty state with alternative actions.



\### AC-003 — Portion Scaling



Changing the number of servings recalculates ingredient quantities and estimated shopping cost.



\### AC-004 — Missing Prices



Recipes with missing required prices cannot be falsely marked within budget.



\### AC-005 — Nutrition



Nutrition data is displayed per serving with source attribution.



\### AC-006 — Video



Only verified tutorial videos are displayed.



\### AC-007 — Import Review



Imported recipes must be reviewed before publication.



\### AC-008 — Authentication



Unauthorized users cannot access protected admin endpoints.



\### AC-009 — Duplicate Import



Repeated imports cannot accidentally create duplicate published recipes.



\### AC-010 — Responsive Design



Primary pages must function on mobile, tablet, and desktop.



\---



\## 12. INSTALLED SKILLS UTILIZATION



Use the relevant installed skills according to the current phase.



\### Planning



\- context7-mcp.

\- context7-cli when needed.

\- design-system.



\### Frontend



\- ui-ux-pro-max.

\- ui-styling.

\- design-system.

\- brand.

\- playwright-cli.

\- context7-mcp.



\### Backend



\- context7-mcp.

\- find-security-vulnerabilities-in-code.



\### Integration and Testing



\- playwright-cli.

\- api-security-testing.

\- web-app-penetration-testing.

\- application-security-testing when appropriate.

\- fix-security-vulnerabilities-with-strix when findings require remediation.



\### Skill Rules



1\. Read relevant skill instructions before using them.

2\. Do not activate all skills simultaneously.

3\. Prefer the most relevant skill for each task.

4\. Verify current framework documentation with Context7.

5\. Use Playwright to inspect the running application.

6\. Test navigation, forms, responsiveness, and browser console errors.

7\. Never claim a skill was used unless it actually ran.

8\. Report unavailable dependencies or tools.

9\. Perform security testing only on authorized environments.

10\. Include skill usage in phase completion reports.



\---



\## 13. CODING AGENT RULES



1\. Read the entire PRD before coding.

2\. Create an implementation plan first.

3\. Create a detailed task checklist.

4\. Follow the mandatory phase order.

5\. Do not skip planning.

6\. Do not implement backend during frontend phase.

7\. Do not silently add major dependencies.

8\. Use modular architecture.

9\. Use TypeScript strict mode.

10\. Use reusable components.

11\. Validate inputs on the server.

12\. Write tests for critical functionality.

13\. Do not invent production prices, nutrition facts, or tutorial links.

14\. Update task progress after completing work.

15\. Report modified files and test results.

16\. Stop after each phase.

17\. Wait for explicit approval before proceeding.



\---



\## 14. DEFINITION OF DONE



A task is complete when:



\- Requirements are implemented.

\- TypeScript checks pass.

\- Lint checks pass.

\- Relevant tests pass.

\- Error handling is implemented.

\- Accessibility is reviewed.

\- Documentation is updated.

\- No critical defects remain.

\- No secrets are exposed.



\---



\## 15. FINAL DELIVERABLE



A responsive, modern, secure, and maintainable full-stack website that recommends recipes based on the user's budget.



The website must support:



\- Recipe recommendations.

\- Budget calculations.

\- Ingredient and equipment lists.

\- Step-by-step cooking instructions.

\- Nutrition information.

\- Verified tutorial videos.

\- Admin recipe management.

\- Hybrid recipe imports.

\- PostgreSQL + Drizzle ORM.

\- Production deployment.



\*\*IMPORTANT: Begin with PHASE 0 — PLANNING ONLY. Do not start frontend development until the implementation plan has been reviewed and approved.\*\*

