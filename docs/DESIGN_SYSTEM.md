# DapurCuan — Design System Foundation

## Arah visual

Hangat, praktis, dan mudah dipercaya. Warna oranye memberi energi aktivitas memasak; hijau memberi sinyal hemat, segar, dan berhasil. Copy memakai Bahasa Indonesia ringkas dan suportif.

## Token tiga lapis

`app/globals.css` menjadi source visual token. Primitive menyimpan warna dasar (`--orange-*`, `--green-*`, `--stone-*`). Semantic memetakan tujuan (`--primary`, `--success`, `--background`, `--foreground`). Component mengunci kontrak komponen (`--button-primary-bg`, `--surface-raised`, `--focus-outline`). Komponen dilarang memakai warna hex mentah.

## Aturan UX

Mobile-first. Kontainer memakai padding 16px pada mobile, 24px tablet, 32px desktop. Target interaksi minimal 44×44px. Semua form kelak punya label terlihat dan error inline. Focus outline 3px selalu terlihat. Kontras teks memakai token semantic. Animasi opsional dan dimatikan saat `prefers-reduced-motion: reduce`.

## Navigasi

Navbar public: Beranda, Rekomendasi, Tentang. Navbar admin: Dashboard, Resep, Bahan & Harga, Impor. Menu mobile memakai elemen `details` agar berfungsi tanpa JavaScript dan dapat ditutup dengan kontrol native.
