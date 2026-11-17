# An-Nahl Travel Admin

Dashboard administrasi perjalanan umrah berbasis Next.js. Antarmuka ini dibuat sebagai implementasi original dari pola visual referensi, bukan salinan identik produk pihak lain.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Aplikasi selalu menampilkan halaman login terlebih dahulu. Tanpa konfigurasi Supabase, pilih salah satu akun demo yang tersedia, lalu tekan **Masuk**; sesi dan perubahan data demo disimpan di local storage browser. Akun demo adalah data lokal contoh, bukan akun Supabase.

## Mengaktifkan Supabase

1. Buat project Supabase dan salin `.env.example` menjadi `.env.local`.
2. Isi `NEXT_PUBLIC_SUPABASE_URL` serta `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari pengaturan project.
3. Jalankan `database/schema.sql` pada SQL Editor Supabase.
4. Buat akun staf melalui Supabase Authentication. Aplikasi menggunakan email/password dan hanya mengizinkan pengguna yang sudah masuk mengakses tabel.
5. Jalankan ulang server pengembangan.

Jangan gunakan `service_role` key di browser. Kebijakan RLS membatasi akses tabel `travel_records` untuk pengguna terautentikasi.

## Fitur yang tersedia

- Ringkasan dashboard, statistik operasional, dan daftar pesanan terbaru.
- Grafik pendapatan dan penjualan interaktif dengan rincian statistik saat diarahkan atau difokuskan.
- Navigasi pesanan, jamaah, pembayaran, cicilan, komisi, paket, hotel, agen, cabang, keberangkatan, transportasi, dan perlengkapan.
- Tambah, ubah, hapus, cari, filter status, serta ekspor CSV untuk data di setiap kategori.
- Akun demo lokal siap pilih, login Supabase ketika konfigurasi tersedia, dan tata letak responsif untuk layar kecil.

```bash
npm run typecheck
npm run build
```
