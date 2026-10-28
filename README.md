# 🍳 DapurCuan

> **Platform Rekomendasi Resep Hemat & Cerdas Berbasis Anggaran Belanja Nyata**

DapurCuan adalah aplikasi web modern yang membantu keluarga, anak kos, dan pengelola anggaran rumah tangga dalam merencanakan menu masakan harian yang lezat, bernutrisi, dan ramah kantong. Berbeda dengan aplikasi resep biasa, DapurCuan membedakan secara tegas antara **Biaya Belanja (Shopping Cost)** berdasarkan ukuran kemasan pasar dengan **Biaya Konsumsi (Consumption Cost)** berdasarkan takaran bahan terpakai.

---

## ✨ Fitur Unggulan (Phase 1 Frontend)

### 1. 🔍 Pencarian & Rekomendasi Berbasis Budget
- **Filter Fleksibel:** Cari resep berdasarkan batas anggaran (Rp 1.000 s/d Rp 10.000.000), kategori masakan, estimasi waktu memasak, dan tingkat kesulitan.
- **Validasi Ketat:** Validasi input real-time menggunakan Zod untuk memastikan batas porsi (1–50) dan parameter pencarian valid.
- **Empty State Informatif:** Rekomendasi alternatif jika filter tidak menemukan hasil yang cocok sesuai standar PRD.

### 2. ⚖️ Kalkulator Porsi & Simulasi Biaya Dinamis
- **Dual Cost Engine:**
  - **Biaya Belanja (Kemasan Pasar):** Menghitung pembelian kelipatan paket bahan di pasar (misal: kelipatan 1 butir telur atau 1 pack garam).
  - **Biaya Konsumsi:** Menghitung nilai bahan yang benar-benar terserap per porsi yang disajikan.
- **Skalasi Porsi Interaktif:** Pengatur jumlah porsi responsif yang secara instan menghitung ulang seluruh takaran bahan, biaya belanja, dan biaya per porsi.

### 3. 🍳 Pengalaman Memasak Interaktif
- **Ingredient Checklist:** Ceklis bahan masakan interaktif yang tersimpan dalam state sesi.
- **Panduan Memasak Terstruktur:** Langkah memasak berurutan dengan checkpoint penyelesaian dan progress bar persentase memasak.
- **Panel Nutrisi:** Informasi makronutrisi lengkap (kalori, protein, karbohidrat, lemak) per porsi.

### 4. 📺 Integrasi Video Masakan Terverifikasi
- **Kurasi Video Riil:** Menghapus seluruh video fiktif; hanya menampilkan video YouTube asli dari kreator terpercaya (misal: Chef Devina Hermawan).
- **Embed Aman & Privasi:** Menggunakan domain `youtube-nocookie.com` khusus untuk video yang mengizinkan embed.
- **Fallback Ramah Pengguna:** Tombol tautan langsung "Tonton di YouTube" dan fallback visual jika video belum tersedia.

### 5. 🛡️ Dashboard & Manajemen Admin Terpadu
- **Katalog Resep (`/admin/resep`):** Manajemen resep dengan validasi multi-langkah sebelum publikasi (draft/published/archived).
- **Bahan & Harga Stale (`/admin/bahan`):** Pemantauan harga bahan pangan lokal dengan penanda kedaluwarsa otomatis (>30 hari) serta **Recipe Impact Simulator** untuk memprediksi kenaikan biaya resep jika harga bahan berubah.
- **Antrean Impor & Kurasi (`/admin/impor`):** Tinjauan kandidat resep/bahan dari sumber terbuka dengan modal komparasi side-by-side, deteksi kemiripan/duplikasi otomatis, dan verifikasi lisensi data (CC-BY, ODC-By, CC0).

---

## 🛠️ Tech Stack & Arsitektur

- **Framework:** Next.js 15 (App Router, Server & Client Components)
- **Bahasa:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS & Desain Sistem Modular (WCAG 2.1 AA Compliant)
- **Komponen UI:** Radix UI Primitives, Lucide Icons, class-variance-authority
- **Form & Validasi:** React Hook Form & Zod Schema Validation
- **Unit & Component Testing:** Vitest, React Testing Library, jsdom
- **End-to-End & A11y Testing:** Playwright (Headless Microsoft Edge)
- **Arsitektur Phase 1:** Modular Monolith dengan *Typed Mock Service Layer* (`src/lib/services/`) yang mencerminkan kontrak API masa depan.

---

## 🚀 Memulai Proyek Secara Lokal

### Prasyarat
- Node.js versi 18.18+ atau 20+
- npm versi 9+

### Instalasi

1. Clone repositori:
```bash
git clone https://github.com/username/dapurcuan.git
cd dapurcuan
```

2. Instal dependensi:
```bash
npm install
```

3. Jalankan server pengembangan:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🧪 Pengujian & Kualitas Kode

Proyek ini menerapkan jaminan kualitas yang ketat sebelum kode dianggap siap rilis:

```bash
# Menjalankan static type checking TypeScript
npm run typecheck

# Menjalankan linter ESLint
npm run lint

# Menjalankan Unit & Component Tests (Vitest)
npm run test -- --run

# Menjalankan Responsive & Accessibility Tests (Playwright)
npm run test:e2e

# Membangun bundle produksi
npm run build
```

### Ringkasan Hasil Pengujian:
- **Unit & Component Tests:** 53 pengujian **PASS** (100%) di 6 modul pengujian.
- **Responsive & Accessibility Tests:** 24 pengujian **PASS** di 3 viewport (Mobile 375px, Tablet 768px, Desktop 1440px) pada 7 rute utama.
- **Static Analysis:** 0 error tipe TypeScript, 0 peringatan linting.

---

## 📁 Struktur Direktori

```text
dapurcuan/
├── app/                          # Next.js App Router (Layouts & Pages)
│   ├── (public)/                 # Rute publik (Beranda, Rekomendasi, Detail Resep)
│   │   ├── rekomendasi/
│   │   └── resep/[slug]/
│   ├── admin/                    # Prototipe rute admin (Dashboard, Resep, Bahan, Impor)
│   │   ├── bahan/
│   │   ├── impor/
│   │   └── resep/
│   ├── layout.tsx
│   └── page.tsx
├── docs/                         # Dokumentasi Arsitektur, PRD & Task Tracking
│   ├── DESIGN_SYSTEM.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PRD.md
│   └── TASKS.md
├── src/
│   ├── __tests__/                # Vitest Unit & Component test suites
│   ├── components/               # Komponen UI Reusable
│   │   ├── admin/                # Komponen modul admin
│   │   ├── layout/               # AppShell, Navbar, Footer
│   │   ├── recipe/               # Recipe Card, Detail, Servings, Video
│   │   └── ui/                   # Primitive design system components
│   ├── lib/
│   │   ├── services/             # Typed mock services & fixtures
│   │   └── utils.ts
│   └── types/                    # Domain TypeScript Interfaces
├── tests/                        # Playwright Responsive & A11y Specs
├── playwright.config.ts          # Konfigurasi Playwright E2E
├── vitest.config.ts              # Konfigurasi Vitest & JSDOM
└── package.json
```

---

## 🔒 Catatan Keamanan & Batasan Phase 1

1. **Strict Phase 1 Frontend:** Proyek ini saat ini beroperasi pada tahap Frontend UI/UX. Seluruh mutasi data pada modul admin bersifat simulasi dalam memori lokal browser (*session state*) dan tidak terhubung ke basis data permanen.
2. **Kesiapan Phase 2 Backend:** Pada pengembangan tahap kedua, sistem akan dilengkapi dengan basis data PostgreSQL, Drizzle ORM, Route Handlers terproteksi, serta autentikasi berbasis peran (*Role-Based Access Control*) menggunakan Auth.js untuk mengunci akses `/admin/*`.
3. **Pemisahan Kredensial:** Seluruh file kredensial sensitif (`.env*`, `.pem`, `.key`) dikecualikan secara ketat oleh `.gitignore`.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
