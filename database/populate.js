const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://shgbbwevvislnfqswutc.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2N36Ha-nVSxHXxBMWAfOPA_3pWiO4NC';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws }
});

const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

const records = [
  // ==========================================
  // 1. BOOKINGS (PESANAN UMRAH)
  // ==========================================
  {
    category: 'bookings',
    title: 'Ahmad Fauzi & Keluarga (2 Pax)',
    reference: 'MP-261116RPD301',
    status: 'Dikonfirmasi',
    amount: 70000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Marketplace',
    details: { info: 'UMROH PLUS AN-NAHL · Kamar Double · Paspor Lengkap', pilgrims_count: '2', notes: 'Hotel Fairmont & Mövenpick' },
    created_at: daysAgo(1)
  },
  {
    category: 'bookings',
    title: 'H. Bambang Irawan',
    reference: 'MP-261115U58601',
    status: 'Menunggu',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'UMROH PLUS AN-NAHL · Menunggu bukti transfer pelunasan', pilgrims_count: '1', notes: 'DP Rp 15.000.000 masuk' },
    created_at: daysAgo(2)
  },
  {
    category: 'bookings',
    title: 'Hj. Siti Aminah, S.Pd.',
    reference: 'MP-261114YTDY01',
    status: 'Dikonfirmasi',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Website',
    details: { info: 'UMROH PLUS AN-NAHL · Skema Cicilan 3x', pilgrims_count: '1', notes: 'Cicilan 1 & 2 terbayar' },
    created_at: daysAgo(3)
  },
  {
    category: 'bookings',
    title: 'Drs. H. Mulyadi',
    reference: 'MP-261112KTY901',
    status: 'Lunas',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Website',
    details: { info: 'UMROH PLUS AN-NAHL · Lunas via Virtual Account BSI', pilgrims_count: '1', notes: 'Siap manasik' },
    created_at: daysAgo(5)
  },
  {
    category: 'bookings',
    title: 'Rizki Ramadhan & Istri (2 Pax)',
    reference: 'MP-261115XAXZ01',
    status: 'Lunas',
    amount: 76000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'UMROH PLUS JANUARI SIDOARJO · Lunas via BSI Cabang Sidoarjo', pilgrims_count: '2', notes: 'Mahram suami-istri' },
    created_at: daysAgo(2)
  },
  {
    category: 'bookings',
    title: 'Nur Aisyah Ramadhan',
    reference: 'MP-261113J7GF01',
    status: 'Menunggu',
    amount: 25000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Marketplace',
    details: { info: 'UMROH REGULER · Menunggu rekam biometrik Saudi Visa Bio', pilgrims_count: '1', notes: 'KTP & KK terverifikasi' },
    created_at: daysAgo(4)
  },
  {
    category: 'bookings',
    title: 'Keluarga Bpk. Sunarto (3 Pax)',
    reference: 'OF-261111D8KS01',
    status: 'Diproses',
    amount: 105000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Umrah Reguler Akhir Tahun · Cabang Sidoarjo', pilgrims_count: '3', notes: 'DP Rp 45.000.000 telah diterima' },
    created_at: daysAgo(6)
  },
  {
    category: 'bookings',
    title: 'Dewi Anggraini',
    reference: 'MP-261110DA01',
    status: 'Dikonfirmasi',
    amount: 38000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Website',
    details: { info: 'UMROH PLUS JANUARI · Cicilan 1 terbayar', pilgrims_count: '1', notes: 'Paspor aktif s/d 2031' },
    created_at: daysAgo(7)
  },
  {
    category: 'bookings',
    title: 'H. Sudirman & Ibu (2 Pax)',
    reference: 'MP-261108SD02',
    status: 'Lunas',
    amount: 70000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Marketplace',
    details: { info: 'UMROH PLUS AN-NAHL · Lunas Escrow Tokopedia', pilgrims_count: '2', notes: 'Standby kursi roda di bandara' },
    created_at: daysAgo(9)
  },
  {
    category: 'bookings',
    title: 'dr. H. Rahmat Hidayat & Istri',
    reference: 'MP-261113RH01',
    status: 'Lunas',
    amount: 76000000,
    branch: 'Cabang Surabaya',
    role_target: 'all',
    channel: 'Website',
    details: { info: 'UMROH PLUS JANUARI · Transfer Bank Mandiri Surabaya', pilgrims_count: '2', notes: 'Paket VIP Double' },
    created_at: daysAgo(4)
  },
  {
    category: 'bookings',
    title: 'Farhan Maulana',
    reference: 'MP-261109FM01',
    status: 'Dikonfirmasi',
    amount: 25000000,
    branch: 'Cabang Surabaya',
    role_target: 'all',
    channel: 'Marketplace',
    details: { info: 'UMROH REGULER · DP Rp 15.000.000 terbayar', pilgrims_count: '1', notes: 'Koper telah diserahkan' },
    created_at: daysAgo(8)
  },

  // ==========================================
  // 2. PILGRIMS (JAMAAH)
  // ==========================================
  {
    category: 'pilgrims',
    title: 'Ahmad Fauzi',
    reference: '3301021205800001',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: '081234000333 · Paspor: B1234567 · Vaksin Meningitis OK · Kamar Double 412', paspor: 'B1234567', room: 'Double 412' },
    created_at: daysAgo(1)
  },
  {
    category: 'pilgrims',
    title: 'Siti Aminah Fauzi',
    reference: '3301025508820002',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: '081234000334 · Paspor: B1234568 · Vaksin Meningitis OK · Mahram suami', paspor: 'B1234568', room: 'Double 412' },
    created_at: daysAgo(1)
  },
  {
    category: 'pilgrims',
    title: 'H. Bambang Irawan',
    reference: '3301021003750003',
    status: 'Menunggu',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '081231123344 · Paspor dalam perpanjangan Imigrasi Malang', paspor: 'Menunggu', room: 'Quad 714' },
    created_at: daysAgo(2)
  },
  {
    category: 'pilgrims',
    title: 'Drs. H. Mulyadi',
    reference: '3301021804680004',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: '081333445566 · Paspor: B7890123 · Dokumen Lengkap · Koper Terambil', paspor: 'B7890123', room: 'Triple 820' },
    created_at: daysAgo(5)
  },
  {
    category: 'pilgrims',
    title: 'Rizki Ramadhan',
    reference: '3515082204910001',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '081231222133 · Paspor: C3344556 · Dokumen Lengkap · Bus Sidoarjo 01', paspor: 'C3344556', room: 'Double 508' },
    created_at: daysAgo(2)
  },
  {
    category: 'pilgrims',
    title: 'Nur Aisyah Ramadhan',
    reference: '3515084405930002',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '081231222134 · Paspor: C3344557 · Mahram Suami · Perlengkapan Lengkap', paspor: 'C3344557', room: 'Double 508' },
    created_at: daysAgo(2)
  },
  {
    category: 'pilgrims',
    title: 'Dewi Anggraini',
    reference: '3515085509900003',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: '081231456780 · Paspor: C9988771 · Siap Manasik Cabang Sidoarjo', paspor: 'C9988771', room: 'Triple 302' },
    created_at: daysAgo(7)
  },
  {
    category: 'pilgrims',
    title: 'H. Sudirman',
    reference: '3515081102600004',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: '081122334455 · Paspor: C1122334 · Lansia (Permohonan Kursi Roda)', paspor: 'C1122334', room: 'Double 102' },
    created_at: daysAgo(9)
  },
  {
    category: 'pilgrims',
    title: 'dr. H. Rahmat Hidayat',
    reference: '3578011508750001',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Surabaya',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: '081234889901 · Paspor: S8877665 · Dokter Kloter Surabaya', paspor: 'S8877665', room: 'VIP Double' },
    created_at: daysAgo(4)
  },
  {
    category: 'pilgrims',
    title: 'Farhan Maulana',
    reference: '3578012011980002',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Surabaya',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: '081234889902 · Paspor: S1122998 · Vaksin Polio & Meningitis Valid', paspor: 'S1122998', room: 'Quad 405' },
    created_at: daysAgo(8)
  },

  // ==========================================
  // 3. PAYMENTS (PEMBAYARAN)
  // ==========================================
  {
    category: 'payments',
    title: 'Ahmad Fauzi & Keluarga',
    reference: 'PAY-261116CFGP',
    status: 'Terbayar',
    amount: 70000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Marketplace',
    details: { info: 'Pelunasan Paket Umrah Plus 2 Pax · Virtual Account BSI', method: 'BSI Virtual Account', verified_by: 'Dewi Sartika' },
    created_at: daysAgo(1)
  },
  {
    category: 'payments',
    title: 'H. Bambang Irawan',
    reference: 'PAY-261115BMB',
    status: 'Pending',
    amount: 15000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Setoran DP Umrah Plus · Transfer Bank Mandiri · Menunggu cek mutasi', method: 'Transfer Mandiri', verified_by: '-' },
    created_at: daysAgo(2)
  },
  {
    category: 'payments',
    title: 'Hj. Siti Aminah, S.Pd.',
    reference: 'PAY-261114N25Z',
    status: 'Terbayar',
    amount: 14000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Pembayaran Cicilan 2 · Transfer BSI', method: 'BSI Transfer', verified_by: 'Dewi Sartika' },
    created_at: daysAgo(3)
  },
  {
    category: 'payments',
    title: 'Drs. H. Mulyadi',
    reference: 'PAY-261112MLY',
    status: 'Terbayar',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Pelunasan Paket Umrah Plus · BCA Transfer', method: 'BCA Transfer', verified_by: 'Dewi Sartika' },
    created_at: daysAgo(5)
  },
  {
    category: 'payments',
    title: 'Rizki Ramadhan & Istri',
    reference: 'PAY-261115C4K6',
    status: 'Terbayar',
    amount: 76000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Pelunasan 2 Pax Umrah Plus Januari · Teller BSI Sidoarjo', method: 'BSI Sidoarjo', verified_by: 'Siti Rahma' },
    created_at: daysAgo(2)
  },
  {
    category: 'payments',
    title: 'Dewi Anggraini',
    reference: 'PAY-261110DA01',
    status: 'Terbayar',
    amount: 15000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Setoran DP Umrah Plus Januari · Mandiri Livin', method: 'Mandiri Livin', verified_by: 'Siti Rahma' },
    created_at: daysAgo(7)
  },
  {
    category: 'payments',
    title: 'H. Sudirman & Ibu',
    reference: 'PAY-261108SDR',
    status: 'Terbayar',
    amount: 70000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'keuangan',
    channel: 'Marketplace',
    details: { info: 'Pelunasan 2 Pax · Tokopedia Travel Escrow Cair', method: 'Marketplace Escrow', verified_by: 'Dewi Sartika' },
    created_at: daysAgo(9)
  },
  {
    category: 'payments',
    title: 'dr. H. Rahmat Hidayat',
    reference: 'PAY-261113RH01',
    status: 'Terbayar',
    amount: 76000000,
    branch: 'Cabang Surabaya',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Pelunasan 2 Pax Paket VIP · Bank Mandiri Surabaya', method: 'Mandiri Corporate', verified_by: 'Dewi Sartika' },
    created_at: daysAgo(4)
  },

  // ==========================================
  // 4. PACKAGES (PAKET UMRAH)
  // ==========================================
  {
    category: 'packages',
    title: 'UMROH PLUS TURKI & CAPPADOCIA 12 HARI',
    reference: 'PAK-001',
    status: 'Aktif',
    amount: 38500000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Website',
    details: { info: '34 / 40 kuota · Turkish Airlines · Hotel Bintang 5 Makkah/Madinah', duration: '12 Hari', departure: '15 Jan 2027' },
    created_at: daysAgo(10)
  },
  {
    category: 'packages',
    title: 'UMROH PLUS AN-NAHL DESEMBER (AKHIR TAHUN)',
    reference: 'PAK-002',
    status: 'Aktif',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Marketplace',
    details: { info: '31 / 35 kuota · Saudia Airlines Direct Madinah · Hotel Bintang 5', duration: '9 Hari', departure: '24 Des 2026' },
    created_at: daysAgo(15)
  },
  {
    category: 'packages',
    title: 'UMROH REGULER AWAL TAHUN 1448 H',
    reference: 'PAK-003',
    status: 'Aktif',
    amount: 26500000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Direct',
    details: { info: '42 / 45 kuota · Lion Air Premium Charter · Al Kiswah Towers', duration: '9 Hari', departure: '10 Feb 2027' },
    created_at: daysAgo(20)
  },
  {
    category: 'packages',
    title: 'UMROH PLUS JANUARI SIDOARJO SPECIAL',
    reference: 'PAK-004',
    status: 'Aktif',
    amount: 38000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Direct',
    details: { info: '27 / 30 kuota · Keberangkatan T2 Bandara Juanda Surabaya', duration: '10 Hari', departure: '18 Jan 2027' },
    created_at: daysAgo(12)
  },
  {
    category: 'packages',
    title: 'UMROH RAMADHAN ITIKAF 15 HARI',
    reference: 'PAK-005',
    status: 'Aktif',
    amount: 45000000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Website',
    details: { info: '19 / 30 kuota · Program 10 Malam Terakhir Ramadhan di Haramain', duration: '15 Hari', departure: '20 Mar 2027' },
    created_at: daysAgo(8)
  },

  // ==========================================
  // 5. HOTELS (HOTEL MAKKAH & MADINAH)
  // ==========================================
  {
    category: 'hotels',
    title: 'Fairmont Makkah Clock Royal Tower',
    reference: 'Makkah · Bintang 5',
    status: 'Aktif',
    amount: 5,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'King Abdul Aziz Endowment · Depan Pelataran Masjidil Haram · City & Kaaba View' },
    created_at: daysAgo(30)
  },
  {
    category: 'hotels',
    title: 'Pullman Zamzam Makkah',
    reference: 'Makkah · Bintang 5',
    status: 'Aktif',
    amount: 5,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Abraj Al Bait Complex · Akses langsung ke Shopping Mall & Masjidil Haram' },
    created_at: daysAgo(25)
  },
  {
    category: 'hotels',
    title: 'Al Kiswah Towers Hotel Makkah',
    reference: 'Makkah · Bintang 4',
    status: 'Aktif',
    amount: 4,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Al Taysir District · Shuttle Bus Ber-AC 24 Jam Non-Stop ke Haram' },
    created_at: daysAgo(30)
  },
  {
    category: 'hotels',
    title: 'Anwar Al Madinah Mövenpick Hotel',
    reference: 'Madinah · Bintang 5',
    status: 'Aktif',
    amount: 5,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Central Area Madinah · 50 Meter dari Gerbang Utama Masjid Nabawi' },
    created_at: daysAgo(30)
  },
  {
    category: 'hotels',
    title: 'Dar Al Taqwa Hotel Madinah',
    reference: 'Madinah · Bintang 5',
    status: 'Aktif',
    amount: 5,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'North Central Area Madinah · Menghadap langsung ke Pintu Masuk Putri' },
    created_at: daysAgo(28)
  },

  // ==========================================
  // 6. AIRLINES (PENERBANGAN)
  // ==========================================
  {
    category: 'airlines',
    title: 'Saudia Airlines (SV-817 / SV-818)',
    reference: 'SUB-MED / JED-SUB Direct',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Surabaya Juanda (SUB) direct Madinah (MED) · Boeing 777-300ER · Bagasi 2x 23kg + Air Zamzam' },
    created_at: daysAgo(20)
  },
  {
    category: 'airlines',
    title: 'Garuda Indonesia (GA-980 / GA-981)',
    reference: 'CGK-JED / JED-CGK Direct',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Jakarta Soekarno-Hatta (CGK) direct Jeddah (JED) · Airbus A330-900neo · Full Service' },
    created_at: daysAgo(18)
  },
  {
    category: 'airlines',
    title: 'Qatar Airways (QR-957 / QR-958)',
    reference: 'SUB-DOH-JED Transit',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Surabaya Juanda transit Doha Hamad Intl · Boeing 787 Dreamliner · In-Flight Entertainment' },
    created_at: daysAgo(15)
  },

  // ==========================================
  // 7. TRANSPORT (TRANSPORTASI / BUS VIP)
  // ==========================================
  {
    category: 'transport',
    title: 'Bus SAPTCO Executive VIP 2026 (Bus 01)',
    reference: 'BUS-SAPTCO-01',
    status: 'Aktif',
    amount: 45,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '45 Seat Mercedes-Benz · Rute Bandara - Madinah - Makkah - Bandara · Toilet & Reclining Seat' },
    created_at: daysAgo(20)
  },
  {
    category: 'transport',
    title: 'Bus Dallah Al-Barakah Executive (Bus 02)',
    reference: 'BUS-DAL-02',
    status: 'Aktif',
    amount: 45,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '45 Seat · Rute City Tour & Ziarah Makkah-Madinah · Audio Guide & Sound System Manasik' },
    created_at: daysAgo(18)
  },
  {
    category: 'transport',
    title: 'Toyota HiAce Premio Luxury VIP',
    reference: 'VAN-HIACE-VIP',
    status: 'Aktif',
    amount: 10,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: '10 Seat Kapten · Khusus Penjemputan Jamaah VIP & Lansia Bandara' },
    created_at: daysAgo(15)
  },

  // ==========================================
  // 8. DEPARTURES (MANASIK & KEBERANGKATAN)
  // ==========================================
  {
    category: 'departures',
    title: 'Manasik Akbar & Pemantapan Doa Bersama',
    reference: '22 Nov 2026 · 08:30',
    status: 'Terjadwal',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Aula Utama Kantor Pusat Malang · Pembimbing: KH. Ahmad Dahlan · 50 Jamaah' },
    created_at: daysAgo(5)
  },
  {
    category: 'departures',
    title: 'Praktik Tawaf & Bimbingan Umrah Sidoarjo',
    reference: '24 Nov 2026 · 09:00',
    status: 'Terjadwal',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Masjid Agung Sidoarjo · Praktik simulasi thawaf dan sa\'i · 30 Jamaah' },
    created_at: daysAgo(4)
  },
  {
    category: 'departures',
    title: 'Keberangkatan Kloter 1 Bandara Juanda',
    reference: '24 Des 2026 · 05:30',
    status: 'Terjadwal',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Kumpul Terminal 2 Internasional Juanda SUB · Penerbangan Saudia SV-817' },
    created_at: daysAgo(10)
  },
  {
    category: 'departures',
    title: 'Kajian Fiqih Ibadah Umrah Khusus Muslimah',
    reference: '28 Nov 2026 · 13:30',
    status: 'Terjadwal',
    amount: 0,
    branch: 'Cabang Surabaya',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Kantor Cabang Surabaya · Ustadzah Hj. Maryam, Lc. · Fiqih Haid & Tawaf Wada' },
    created_at: daysAgo(3)
  },

  // ==========================================
  // 9. DOCUMENTS (DOKUMEN JAMAAH)
  // ==========================================
  {
    category: 'documents',
    title: 'Ahmad Fauzi & Keluarga (2 Pax)',
    reference: 'DOC-MP-261116',
    status: 'Lengkap',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: 'Paspor Asli B1234567 (Exp 2032) · Buku Nikah · KTP · Sertifikat Vaksin Meningitis Valid' },
    created_at: daysAgo(1)
  },
  {
    category: 'documents',
    title: 'H. Bambang Irawan',
    reference: 'DOC-MP-261115',
    status: 'Belum Lengkap',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Paspor dalam proses perpanjangan di Kantor Imigrasi Kelas I Malang · KTP & KK lengkap' },
    created_at: daysAgo(2)
  },
  {
    category: 'documents',
    title: 'Hj. Siti Aminah, S.Pd.',
    reference: 'DOC-MP-261114',
    status: 'Lengkap',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: 'Paspor Asli B4567890 · Rekam Biometrik Saudi Visa Bio Sukses · Surat Mahram Lengkap' },
    created_at: daysAgo(3)
  },
  {
    category: 'documents',
    title: 'Rizki Ramadhan & Istri (2 Pax)',
    reference: 'DOC-MP-261115SDJ',
    status: 'Lengkap',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Paspor C3344556 & C3344557 · Akta Nikah Legalisir KUA · Vaksin Meningitis Biofarma Valid' },
    created_at: daysAgo(2)
  },
  {
    category: 'documents',
    title: 'Nur Aisyah Ramadhan',
    reference: 'DOC-MP-261113SDJ',
    status: 'Belum Lengkap',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: 'KTP & KK OK · Menunggu jadwal rekam sidik jari aplikasi Saudi Visa Bio' },
    created_at: daysAgo(4)
  },
  {
    category: 'documents',
    title: 'Dewi Anggraini',
    reference: 'DOC-MP-261110SDJ',
    status: 'Lengkap',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: 'Paspor C9988771 · Sertifikat Vaksin Meningitis & Polio Lengkap di SatuSehat' },
    created_at: daysAgo(7)
  },

  // ==========================================
  // 10. MANIFEST (MANIFEST & ROOMING HOTEL/BUS)
  // ==========================================
  {
    category: 'manifest',
    title: 'Rombongan Ahmad Fauzi & Istri',
    reference: 'PAK-002 · Kamar 412 Double',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Marketplace',
    details: { info: 'Fairmont Makkah (Kamar 412) · Anwar Mövenpick Madinah (Kamar 608) · Penempatan Kursi Bus VIP 01 (Seat 1A-1B)' },
    created_at: daysAgo(1)
  },
  {
    category: 'manifest',
    title: 'Rombongan Rizki Ramadhan & Istri',
    reference: 'PAK-004 · Kamar 508 Double',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Al Kiswah Towers (Kamar 508) · Dar Al Taqwa Madinah (Kamar 302) · Bus Sidoarjo 01 (Seat 3A-3B)' },
    created_at: daysAgo(2)
  },
  {
    category: 'manifest',
    title: 'Rombongan Drs. H. Mulyadi',
    reference: 'PAK-002 · Kamar 820 Triple',
    status: 'Dikonfirmasi',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Website',
    details: { info: 'Fairmont Makkah (Kamar 820 Triple) · Bus VIP 01 (Seat 4A)' },
    created_at: daysAgo(5)
  },
  {
    category: 'manifest',
    title: 'H. Bambang Irawan & Rekan',
    reference: 'PAK-001 · Kamar 714 Quad',
    status: 'Menunggu',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Kamar Quad Pria · Bus VIP 02 · Menunggu konfirmasi teman sekamar' },
    created_at: daysAgo(2)
  },

  // ==========================================
  // 11. EQUIPMENT (PERLENGKAPAN JAMAAH)
  // ==========================================
  {
    category: 'equipment',
    title: 'Koper Fiber Hardcase 24" Navy Gold An-Nahl',
    reference: 'EQ-KPR-01',
    status: 'Tersedia',
    amount: 350000,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 85 pcs di Gudang Pusat Malang · 4 Roda Putar 360° · Kunci TSA Lock' },
    created_at: daysAgo(20)
  },
  {
    category: 'equipment',
    title: 'Kain Ihram Pria Premium + Sabuk Haji',
    reference: 'EQ-IHR-01',
    status: 'Tersedia',
    amount: 180000,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 60 set · Bahan katun combed tebal & menyerap keringat tanpa jahitan' },
    created_at: daysAgo(20)
  },
  {
    category: 'equipment',
    title: 'Mukena Bordir Sutra Eksklusif An-Nahl',
    reference: 'EQ-MKN-01',
    status: 'Tersedia',
    amount: 220000,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 45 pcs · Katun silk lembut bordir logo An-Nahl + Tas mukena mini' },
    created_at: daysAgo(20)
  },
  {
    category: 'equipment',
    title: 'Batik Seragam Resmi Jamaah Umrah An-Nahl',
    reference: 'EQ-BTK-01',
    status: 'Tersedia',
    amount: 150000,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 120 potong bahan · Motif khas travel An-Nahl berlisensi' },
    created_at: daysAgo(20)
  },
  {
    category: 'equipment',
    title: 'Tas Paspor & ID Card Lanyard Waterproof',
    reference: 'EQ-TSP-01',
    status: 'Tersedia',
    amount: 75000,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 90 pcs · Dompet kalung dokumen paspor, tiket & boarding pass' },
    created_at: daysAgo(20)
  },
  {
    category: 'equipment',
    title: 'Paket Perlengkapan Cabang Sidoarjo (1 Set)',
    reference: 'EQ-SDJ-01',
    status: 'Tersedia',
    amount: 550000,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Stok: 30 paket lengkap di Cabang Sidoarjo (Koper, Batik, Tas, Ihram/Mukena)' },
    created_at: daysAgo(15)
  },

  // ==========================================
  // 12. INSTALLMENTS (CICILAN JAMAAH)
  // ==========================================
  {
    category: 'installments',
    title: 'Hj. Siti Aminah, S.Pd.',
    reference: 'MP-261114YTDY01',
    status: 'Belum Lunas',
    amount: 35000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Total: Rp 35.000.000 · Terbayar: Rp 21.000.000 · Sisa: Rp 14.000.000 (Jatuh tempo 1 Des 2026)' },
    created_at: daysAgo(3)
  },
  {
    category: 'installments',
    title: 'Dewi Anggraini (Cabang Sidoarjo)',
    reference: 'MP-261110DA01',
    status: 'Belum Lunas',
    amount: 38000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Total: Rp 38.000.000 · Terbayar: Rp 15.000.000 · Sisa: Rp 23.000.000 (Jatuh tempo 5 Des 2026)' },
    created_at: daysAgo(7)
  },
  {
    category: 'installments',
    title: 'Farhan Maulana (Cabang Surabaya)',
    reference: 'MP-261109FM01',
    status: 'Belum Lunas',
    amount: 25000000,
    branch: 'Cabang Surabaya',
    role_target: 'keuangan',
    channel: 'Marketplace',
    details: { info: 'Total: Rp 25.000.000 · Terbayar: Rp 15.000.000 · Sisa: Rp 10.000.000 (Jatuh tempo 28 Nov 2026)' },
    created_at: daysAgo(8)
  },

  // ==========================================
  // 13. COMMISSIONS (KOMISI AGEN)
  // ==========================================
  {
    category: 'commissions',
    title: 'Ustadz Mansyur (Agen Sidoarjo 01)',
    reference: 'KOM-261115XAX',
    status: 'Pending',
    amount: 2000000,
    branch: 'Cabang Sidoarjo',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Komisi Booking 2 Pax Rizki Ramadhan · Rek BSI 7123456789 a.n. Mansyur' },
    created_at: daysAgo(2)
  },
  {
    category: 'commissions',
    title: 'Ibu Hj. Faridah (Agen Malang Pusat)',
    reference: 'KOM-261112MLY',
    status: 'Terbayar',
    amount: 1000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Komisi Booking Drs. H. Mulyadi · Transfer BSI Berhasil (Ref: BSI-991283)' },
    created_at: daysAgo(5)
  },
  {
    category: 'commissions',
    title: 'KBIH Amanah Surabaya',
    reference: 'KOM-261113RH',
    status: 'Terbayar',
    amount: 2000000,
    branch: 'Cabang Surabaya',
    role_target: 'keuangan',
    channel: 'Website',
    details: { info: 'Komisi Booking 2 Pax dr. Rahmat Hidayat · Transfer Bank Mandiri' },
    created_at: daysAgo(4)
  },

  // ==========================================
  // 14. DEPOSITS (DEPOSIT TRAVEL)
  // ==========================================
  {
    category: 'deposits',
    title: 'Deposit Provider Visa Muassasah Dallah KSA',
    reference: 'DEP-VISA-2611',
    status: 'Terbayar',
    amount: 85000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Saldo deposit muassasah untuk penerbitan e-Visa Umrah 50 pax jamaah' },
    created_at: daysAgo(6)
  },
  {
    category: 'deposits',
    title: 'Deposit Block Seat Saudia Airlines Musim 1448 H',
    reference: 'DEP-AIR-SV26',
    status: 'Terbayar',
    amount: 150000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Jaminan blokir 45 kursi penerbangan SV-817 Juanda-Jeddah' },
    created_at: daysAgo(14)
  },
  {
    category: 'deposits',
    title: 'Deposit Hotel Fairmont Makkah & Anwar Mövenpick',
    reference: 'DEP-HTL-FM26',
    status: 'Terbayar',
    amount: 65000000,
    branch: 'Head office',
    role_target: 'keuangan',
    channel: 'Direct',
    details: { info: 'Down payment kontrak 20 kamar musim liburan akhir tahun' },
    created_at: daysAgo(16)
  },

  // ==========================================
  // 15. VENDORS (MITRA / VENDOR REKANAN)
  // ==========================================
  {
    category: 'vendors',
    title: 'PT Dallah Muassasah Visa Arab Saudi',
    reference: 'VEN-DALLAH-KSA',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Provider Resmi Visa Umrah Muassasah KSA · Layanan Tasreh Raudhah & Asuransi Tawuniya' },
    created_at: daysAgo(30)
  },
  {
    category: 'vendors',
    title: 'Global Catering Makkah & Madinah',
    reference: 'VEN-CAT-HARAM',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Penyedia Katering Masakan Cita Rasa Nusantara 3x Sehari (Prasmanan & Box Meal)' },
    created_at: daysAgo(28)
  },
  {
    category: 'vendors',
    title: 'PT Sarana Handling Bandara Juanda (SUB T2)',
    reference: 'VEN-HND-SUB',
    status: 'Aktif',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Layanan Pengantaran & Pelepasan Jamaah di Terminal 2 Internasional Juanda' },
    created_at: daysAgo(25)
  },
  {
    category: 'vendors',
    title: 'Al-Wessam Muthawwif & Guide Bersertifikat KSA',
    reference: 'VEN-MTW-KSA',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'operasional',
    channel: 'Direct',
    details: { info: 'Asosiasi Pembimbing Ibadah Alumni UIM (Universitas Islam Madinah)' },
    created_at: daysAgo(20)
  },

  // ==========================================
  // 16. BRANCHES (STAF CABANG)
  // ==========================================
  {
    category: 'branches',
    title: 'Kantor Pusat An-Nahl (Head Office)',
    reference: 'Malang · Jawa Timur',
    status: 'Aktif',
    amount: 0,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Jl. Raya Tlogomas No. 88, Lowokwaru, Malang · Telp: 085731725563 · Penanggung Jawab: Budiono' },
    created_at: daysAgo(40)
  },
  {
    category: 'branches',
    title: 'Kantor Cabang Sidoarjo',
    reference: 'Sidoarjo · Jawa Timur',
    status: 'Aktif',
    amount: 0,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Ruko Taman Pinang Indah B-12 Sidoarjo · Telp: 081122887117 · Kepala Cabang: Siti Rahma' },
    created_at: daysAgo(35)
  },
  {
    category: 'branches',
    title: 'Kantor Cabang Surabaya',
    reference: 'Surabaya · Jawa Timur',
    status: 'Aktif',
    amount: 0,
    branch: 'Cabang Surabaya',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Jl. Ahmad Yani No. 120, Wonokromo, Surabaya · Telp: 081234889900 · PIC: Ustadz H. Irfan' },
    created_at: daysAgo(30)
  },

  // ==========================================
  // 17. AGENTS (AGEN / RESELLER)
  // ==========================================
  {
    category: 'agents',
    title: 'KBIH An-Nur Sidoarjo (Agen Resmi)',
    reference: 'AGENT-SDJ-001',
    status: 'Aktif',
    amount: 1500000,
    branch: 'Cabang Sidoarjo',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Penanggung Jawab: Ustadz Mansyur · 22 Jamaah Aktif Terdaftar Musim Ini' },
    created_at: daysAgo(30)
  },
  {
    category: 'agents',
    title: 'Mitra Barokah Umrah Malang',
    reference: 'AGENT-MLG-002',
    status: 'Aktif',
    amount: 1500000,
    branch: 'Head office',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Penanggung Jawab: Ibu Hj. Faridah · 16 Jamaah Aktif Terdaftar' },
    created_at: daysAgo(25)
  },
  {
    category: 'agents',
    title: 'Amanah Tour & Travel Surabaya',
    reference: 'AGENT-SBY-003',
    status: 'Aktif',
    amount: 1500000,
    branch: 'Cabang Surabaya',
    role_target: 'all',
    channel: 'Direct',
    details: { info: 'Penanggung Jawab: Ustadz Syahril · 14 Jamaah Aktif Terdaftar' },
    created_at: daysAgo(20)
  }
];

async function populate() {
  console.log(`Starting population of ${records.length} production-grade real-time records...`);

  // Wipe old records to ensure clean, consistent real-time dataset
  const { error: delError } = await supabase.from('travel_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.warn('Note on delete:', delError.message);
  }

  // Insert in batches of 20
  for (let i = 0; i < records.length; i += 20) {
    const batch = records.slice(i, i + 20);
    const { data, error } = await supabase.from('travel_records').insert(batch).select();
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      console.log(`Inserted batch ${i} - ${i + batch.length} (${data?.length} records)`);
    }
  }

  // Verify total count
  const { count, error: countErr } = await supabase.from('travel_records').select('*', { count: 'exact', head: true });
  console.log(`Population completed! Total records in Supabase: ${count} (Error: ${countErr?.message || 'none'})`);
}

populate().catch(console.error);
