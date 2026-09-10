# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Nama Produk:** FlashKasir (Web-based Thermal POS) - Edisi Toko Kain
**Platform:** Mobile Web Browser (Android Chrome) & Desktop Web Browser
**Konektivitas:** Online & Offline (Progressive Web App - PWA)
**Penulis Dokumen:** Pranada Al Fath Refandra

## 1. Ringkasan Eksekutif
FlashKasir adalah aplikasi kasir *front-end only* berbasis web yang dirancang untuk kecepatan dan kemudahan pencetakan nota fisik untuk penjualan kain. Aplikasi ini beroperasi tanpa *backend* atau *database*, memanfaatkan *Service Worker* untuk fungsionalitas *offline* (PWA), dan Web Bluetooth API untuk mencetak struk ke printer thermal. UI dibangun dengan pendekatan *Mobile-First* namun tetap responsif (*support* penuh) untuk digunakan di laptop/desktop.

## 2. Profil Pengguna
*   **Pengguna Utama:** Om Toher (Kasir/Penjual Kain).
*   **Kebutuhan:** Memasukkan data transaksi secara cepat dan mencetak nota fisik sesuai format tradisional dengan kalkulasi total dan tanggal *real-time*.
*   **Masalah yang Diselesaikan:** 
    *   Pencatatan nota manual yang lambat.
    *   Menghilangkan *pairing* manual Bluetooth yang berulang.
    *   Memastikan UI tetap nyaman digunakan baik saat kasir menggunakan HP maupun saat membuka toko menggunakan laptop.

## 3. Arsitektur & Spesifikasi Teknologi
*   **Front-End Framework:** React.
*   **Form Management:** `react-hook-form` (dengan alias `login` untuk `register`).
*   **Styling:** *Mobile-First Responsive Layout* (seperti Tailwind CSS).
*   **Konektivitas Printer:** Web Bluetooth API (`requestDevice` dan `getDevices`).
*   **Protokol Cetak:** ESC/POS.

## 4. Fitur Utama

**A. Progressive Web App (PWA) & Responsive UI**
*   **Offline Mode:** Berjalan 100% tanpa internet setelah *load* pertama.
*   **Mobile-First Responsive:** Di HP tampilan berbentuk susunan vertikal (form di atas, keranjang di bawah). Di laptop, tampilan membelah layar (kiri untuk form input, kanan untuk rincian keranjang/preview struk).

**B. Manajemen Nota Kain (State-Only)**
*   Mendukung input Nama Pelanggan (Tuan/Toko).
*   **Kalkulasi Real-Time:** Menghitung otomatis "Jumlah" (Meter x Harga Satuan) per barang, dan "Grand Total Harga" di bagian bawah.
*   Data di-reset otomatis setiap berhasil mencetak struk (kecuali form nama pelanggan yang opsional dipertahankan).

**C. Integrasi Bluetooth & Auto-Reconnect**
*   **Penyambungan Pertama:** Tombol "Cari Printer Baru".
*   **Auto-Reconnect:** Sistem mengecek printer yang sudah pernah di-pairing saat aplikasi dibuka dan menyediakan tombol "Sambungkan Ulang" tanpa pop-up persetujuan browser.

**D. Format Cetak ESC/POS & Real-Time Data**
*   Struk mengadopsi struktur 32-karakter per baris (untuk kertas 58mm).
*   Tanggal struk (Tgl.) wajib ditarik secara **real-time** saat tombol cetak ditekan.
*   "Jumlah Rp." (Grand Total) dihitung secara akurat dan dicetak dengan posisi rata kanan atau sejajar di akhir struk.

## 5. Cuplikan Implementasi

**1. Format ESC/POS (Real-Time Date & Total)**
```text
Tgl. [REAL-TIME CURRENT DATE] // Contoh: 10/09/2026
Kepada Yth.
Tuan/Toko: TOKO MAJU
--------------------------------
NAMA BARANG     MTR  HRG   JML
--------------------------------
Katun Jepang    2.5   35k  87.5k
Sutra Halus     1.0   75k  75k
--------------------------------
Jumlah Rp.                162500
```
