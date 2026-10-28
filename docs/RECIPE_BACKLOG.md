# DapurCuan — Backlog Target 150 Resep Terkurasi

Dokumen ini mencatat rencana kurasi dan pemenuhan 150 resep untuk fase pengisian database (Phase 2: Database Seeding & Import Pipeline).

---

## 1. Ringkasan Target

DapurCuan menargetkan minimal **150 resep terkurasi** dengan variasi budget belanja pasar **Rp 5.000 – Rp 100.000** yang terdistribusi ke dalam 3 kategori utama:

| Kategori | Target Jumlah | Proporsi | Rentang Budget Acuan |
| :--- | :---: | :---: | :--- |
| **Makanan** | **80 resep** | 53.3% | Rp 10.000 – Rp 90.000 |
| **Minuman** | **35 resep** | 23.3% | Rp 5.000 – Rp 40.000 |
| **Camilan** | **35 resep** | 23.3% | Rp 10.000 – Rp 50.000 |
| **Total** | **150 resep** | **100%** | **Rp 5.000 – Rp 90.000** |

---

## 2. Status Saat Ini (Phase 1 — Frontend Prototype)

- **Jumlah Resep Mock Aktif:** **20 resep valid** (8 makanan, 6 minuman, 6 camilan).
- **Aturan Pengembangan:** Pada Phase 1 (Frontend), **tidak dibuat 150 resep dummy/tiruan kosong** hanya untuk memenuhi kuota jumlah. Seluruh 20 resep yang ada diimplementasikan dengan data takaran, bahan, alat, langkah memasak, dan kalkulasi shopping cost yang lengkap dan realistis.
- **Status Data:** Seluruh harga bahan dan estimasi nutrisi pada Phase 1 berstatus **Data Simulasi** (`cost_status: "simulasi"`, `is_simulated: true`). Tidak ada klaim data harga atau gizi telah diverifikasi laboratorium/pasar sampai data riil diintegrasikan di Phase 2/3.

---

## 3. Matriks Distribusi Backlog 150 Resep

### 3.1 Kategori Makanan (Target: 80 Resep)

| Sub-Kategori | Target | Contoh Menu | Rentang Budget |
| :--- | :---: | :--- | :--- |
| **Olahan Telur & Tahu Tempe** | 20 | Nasi Telur Pontianak, Orek Tempe, Tahu Gejrot, Omelet Sayur, Telur Balado | Rp 10.000 – Rp 25.000 |
| **Nasi & Mie Goreng/Kuah** | 15 | Nasi Goreng Kampung, Mie Nyemek Jawa, Kwetiau Goreng, Nasi Gila | Rp 18.000 – Rp 35.000 |
| **Olahan Ayam & Unggas** | 20 | Ayam Teriyaki, Ayam Geprek Sambal Bawang, Garang Asem Ayam, Opor Ayam | Rp 35.000 – Rp 65.000 |
| **Soto & Sup Rumahan** | 15 | Soto Lamongan, Sup Daging Sayur, Sayur Bening Bayam Jagung, Sayur Asem | Rp 20.000 – Rp 75.000 |
| **Olahan Ikan & Seafood Hemat** | 10 | Ikan Kembung Bakar, Lele Goreng Kremes, Tongkol Suwir Balado | Rp 30.000 – Rp 55.000 |

### 3.2 Kategori Minuman (Target: 35 Resep)

| Sub-Kategori | Target | Contoh Menu | Rentang Budget |
| :--- | :---: | :--- | :--- |
| **Teh & Kopi Nusantara** | 10 | Es Teh Manis Melati, Es Kopi Susu Aren, Teh Tarik Dingin, Kopi Tubruk Rempah | Rp 5.000 – Rp 28.000 |
| **Jeruk & Buah Segar** | 10 | Es Jeruk Peras, Es Kuwut Bali, Es Timun Serut, Jus Alpukat | Rp 12.000 – Rp 25.000 |
| **Wedang & Minuman Hangat** | 8 | Wedang Jahe Serai, Wedang Ronde, Bandrek, STMJ Rumahan | Rp 12.000 – Rp 25.000 |
| **Cincau, Cendol & Olahan Susu** | 7 | Es Cincau Kedelai, Smoothie Mangga, Es Doger Rumahan, Matcha Latte | Rp 20.000 – Rp 40.000 |

### 3.3 Kategori Camilan (Target: 35 Resep)

| Sub-Kategori | Target | Contoh Menu | Rentang Budget |
| :--- | :---: | :--- | :--- |
| **Gorengan Tradisional** | 12 | Pisang Goreng Crispy, Bakwan Sayur, Tempe Mendoan, Tahu Isi Pedas | Rp 12.000 – Rp 22.000 |
| **Olahan Aci & Gurih** | 10 | Cireng Rujak, Cilok Saus Kacang, Batagor Tahu Kulit, Sempol Ayam | Rp 12.000 – Rp 25.000 |
| **Jajanan Manis & Kue Teflon** | 8 | Pancake Pisang Cokelat, Martabak Manis Mini Teflon, Dadar Gulung | Rp 20.000 – Rp 35.000 |
| **Kukusan & Dimsum** | 5 | Dimsum Ayam Jamur, Tahu Bakso Kukus, Jasuke Manis Creamy | Rp 25.000 – Rp 48.000 |

---

## 4. Standar Kualitas Data Resep (Acceptance Criteria Phase 2)

Setiap resep yang diinput ke dalam database atau diterima melalui pipeline impor harus memenuhi kriteria berikut:
1. **Identitas Resep:** Judul masakan spesifik, slug unik, deskripsi menarik, kategori jelas (`makanan`, `minuman`, `camilan`), porsi acuan (`base_servings`), durasi prep & cook realistis, dan tingkat kesulitan (`mudah`, `sedang`, `sulit`).
2. **Detail Bahan:** Takaran gramasi/mililiter/satuan dapur standar, estimasi harga bahan acuan pasar, dan informasi ukuran kemasan pasar untuk kalkulasi shopping cost.
3. **Alat Memasak:** Minimal 2 alat dapur esensial yang umum dimiliki pengguna rumah tangga/anak kos.
4. **Langkah Memasak:** Minimal 3 langkah instruksi yang terurut logis dari persiapan, penumisan/pemasakan, hingga penyajian.
5. **Transparansi Biaya & Nutrisi:**
   - Menghitung **Shopping Cost** (dibulatkan ke kemasan pasar) dan **Consumption Cost** (nilai bahan murni terpakai).
   - Nilai nutrisi per porsi penyajian merujuk pada standar komposisi pangan resmi (Kemenkes / TKPI / USDA).
   - Sumber referensi dan tanggal pembaruan harga wajib tercatat. Jika data masih berstatus estimasi, wajib mencantumkan label **Data Simulasi**.
6. **Video Tutorial:** Hanya menyematkan video dari platform terpercaya (YouTube/Instagram) yang relevan dengan metode memasak menu tersebut.
