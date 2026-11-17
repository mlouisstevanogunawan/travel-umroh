import { categories, type Category, type TravelRecord } from "@/lib/types";

const today = new Date().toISOString();

function row(
  id: string,
  category: Category,
  title: string,
  reference: string,
  status: string,
  amount: number,
  info = "",
  branch = "Head office",
  role_target = "all",
  channel = "Marketplace",
): TravelRecord {
  return {
    id,
    category,
    title,
    reference,
    status,
    amount,
    branch,
    role_target,
    channel,
    details: info ? { info } : {},
    created_at: today,
  };
}

export const demoRecords: TravelRecord[] = [
  row("b1", "bookings", "Ahmad Fauzi", "MP-261112RPD301", "Dikonfirmasi", 35000000, "UMROH PLUS AN-NAHL · Head office"),
  row("b2", "bookings", "Bambang Irawan", "MP-261112U58601", "Menunggu", 35000000, "UMROH PLUS AN-NAHL · Head office"),
  row("b3", "bookings", "Siti Aminah", "MP-261111YTDY01", "Dikonfirmasi", 21000000, "UMROH PLUS AN-NAHL · Cicilan"),
  row("b4", "bookings", "Rizki Ramadhan", "MP-261110XAXZ01", "Lunas", 38000000, "UMROH PLUS JANUARI · Cabang Sidoarjo"),
  row("b5", "bookings", "Nur Aisyah", "MP-261104J7GF01", "Dibatalkan", 25000000, "UMROH REGULER · Cabang Sidoarjo"),
  row("b6", "bookings", "Nur Aisyah", "MP-261102PY701", "Dikonfirmasi", 35000000, "UMROH PLUS AN-NAHL · Head office"),
  row("b7", "bookings", "Siti Aminah", "MP-261104P34V01", "Menunggu", 38000000, "UMROH PLUS JANUARI · Cabang Sidoarjo"),
  row("b8", "bookings", "Rizki Ramadhan", "MP-261104EPG901", "Dibatalkan", 25000000, "UMROH REGULER · Cabang Sidoarjo"),
  row("b9", "bookings", "Ahmad Fauzi", "MP-261104J7GF01", "Menunggu", 25000000, "UMROH REGULER · Cabang Sidoarjo"),
  row("b10", "bookings", "Bambang Irawan", "MP-261022XGJK01", "Dibatalkan", 35000000, "UMROH PLUS AN-NAHL · Cabang Sidoarjo"),
  row("b11", "bookings", "Siti Aminah", "MP-261019FQW101", "Dikonfirmasi", 35000000, "UMROH PLUS AN-NAHL · Head office"),
  row("b12", "bookings", "Ahmad Fauzi", "MP-261017KLM201", "Dikonfirmasi", 35000000, "UMROH PLUS AN-NAHL · Head office"),
  row("b13", "bookings", "Rizki Ramadhan", "OF-261104D8KS01", "Diproses", 35000000, "Umrah Reguler 24 Desember · Cabang Sidoarjo"),
  row("p1", "pilgrims", "Ahmad Fauzi", "3301021205800001", "Dikonfirmasi", 0, "081234000333 · Paspor belum lengkap"),
  row("p2", "pilgrims", "Bambang Irawan", "3301021003750003", "Dikonfirmasi", 0, "081231123344 · Dokumen lengkap"),
  row("p3", "pilgrims", "Siti Aminah", "3301025508820002", "Menunggu", 0, "082129887766 · Menunggu konfirmasi"),
  row("p4", "pilgrims", "Rizki Ramadhan", "3301023304910001", "Dikonfirmasi", 0, "081231222133 · Dokumen lengkap"),
  row("p5", "pilgrims", "Nur Aisyah", "3301024405750002", "Dikonfirmasi", 0, "081231456789 · Dokumen lengkap"),
  row("p6", "pilgrims", "Hj. Siti Aminah, S.Pd.", "3301025508820003", "Dikonfirmasi", 0, "082123400222 · Dokumen lengkap"),
  row("p7", "pilgrims", "Bambang Irawan", "3301021003750004", "Dikonfirmasi", 0, "081231123345 · Dokumen lengkap"),
  row("p8", "pilgrims", "Rizki Ramadhan", "3301023304910002", "Dikonfirmasi", 0, "081231222134 · Dokumen lengkap"),
  row("p9", "pilgrims", "Ahmad Fauzi", "3301021205800002", "Dikonfirmasi", 0, "081234000334 · Dokumen lengkap"),
  row("p10", "pilgrims", "Nur Aisyah", "3301024405750003", "Dikonfirmasi", 0, "081231456780 · Dokumen lengkap"),
  row("p11", "pilgrims", "Hj. Siti Aminah, S.Pd.", "3301025508820004", "Dikonfirmasi", 0, "082123400223 · Dokumen lengkap"),
  row("p12", "pilgrims", "Bambang Irawan", "3301021003750005", "Dikonfirmasi", 0, "081231123346 · Dokumen lengkap"),
  row("p13", "pilgrims", "Rizki Ramadhan", "3301023304910003", "Dikonfirmasi", 0, "081231222135 · Dokumen lengkap"),
  row("pay1", "payments", "Ahmad Fauzi", "PAY-261112CFGP", "Pending", 14000000, "Transfer bank"),
  row("pay2", "payments", "Siti Aminah", "PAY-261111N25Z", "Terbayar", 21000000, "Pembayaran cicilan"),
  row("pay3", "payments", "Rizki Ramadhan", "PAY-261110C4K6", "Terbayar", 38000000, "Pelunasan"),
  row("pay4", "payments", "Siti Aminah", "PAY-261110D5CW", "Terbayar", 35000000, "Pelunasan"),
  row("pay5", "payments", "Bambang Irawan", "PAY-261109E377", "Terbayar", 35000000, "Pelunasan"),
  row("pay6", "payments", "Ahmad Fauzi", "PAY-2611054GVFY", "Terbayar", 15200000, "Pembayaran cicilan"),
  row("pay7", "payments", "Nur Aisyah", "PAY-261104BYFD", "Ditolak", 10000000, "Transfer bank"),
  row("pay8", "payments", "Siti Aminah", "PAY-261104W5WW", "Terbayar", 10000000, "Pembayaran cicilan"),
  row("pay9", "payments", "Bambang Irawan", "PAY-261103X7VY", "Pending", 14000000, "Transfer bank"),
  row("pay10", "payments", "Ahmad Fauzi", "PAY-261102T7RP", "Terbayar", 14041667, "Pelunasan"),
  row("pay11", "payments", "Agen An-Nahl 1", "PAY-261101R4MX", "Terbayar", 48000000, "Pembayaran paket jamaah"),
  row("pkg1", "packages", "UMROH PLUS AN-NAHL", "PAK-001", "Aktif", 35000000, "29 / 35 kuota · Plus"),
  row("pkg2", "packages", "UMROH PLUS JANUARI", "PAK-002", "Aktif", 38000000, "31 / 32 kuota · Plus"),
  row("pkg3", "packages", "UMROH REGULER AN-NAHL", "PAK-003", "Aktif", 25000000, "49 / 50 kuota · Reguler"),
  row("pkg4", "packages", "Umrah Reguler 24 Desember", "PAK-004", "Aktif", 35000000, "49 / 50 kuota · Reguler"),
  row("pkg5", "packages", "UMROH PLUS AN-NAHL", "PAK-005", "Aktif", 35000000, "30 / 30 kuota · Plus"),
  row("pkg6", "packages", "UMROH PLUS AN-NAHL", "PAK-006", "Aktif", 35000000, "39 / 40 kuota · Plus"),
  row("hotel1", "hotels", "Al Kiswah Towers", "Makkah", "Aktif", 5, "Al Taysir District"),
  row("hotel2", "hotels", "Al Mukhtara Al Gharbi Hotel", "Madinah", "Aktif", 3, "Salman Al Farsi Street"),
  row("hotel3", "hotels", "Al Safah", "Makkah", "Aktif", 4, "Jalan Ibrahim Al Khalil"),
  row("hotel4", "hotels", "Anwar Al Madinah Mövenpick", "Madinah", "Aktif", 5, "Central Area"),
  row("hotel5", "hotels", "Arkan Al Manar Hotel", "Madinah", "Aktif", 4, "Central Area"),
  row("hotel6", "hotels", "Dar Al Taqwa Hotel", "Madinah", "Aktif", 5, "North Central Area"),
  row("hotel7", "hotels", "Darussalam", "Madinah", "Aktif", 4, "Madinah"),
  row("hotel8", "hotels", "Fairmont Makkah Clock Royal Tower", "Makkah", "Aktif", 5, "King Abdul Aziz Endowment"),
  row("agent1", "agents", "Agen An-Nahl 1", "AGENT-NAHL-01", "Aktif", 500000, "Head office"),
  row("agent2", "agents", "Agen An-Nahl 2", "AGENT-NAHL-02", "Aktif", 500000, "Cabang Sidoarjo"),
  row("branch1", "branches", "Head office", "Malang", "Aktif", 0, "6285731725563 · Cabang utama"),
  row("branch2", "branches", "Cabang Sidoarjo", "Sidoarjo", "Aktif", 0, "081122887117"),
  row("dep1", "departures", "Manasik & doa bersama", "13 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("tr1", "transport", "Bus Jaya Transport", "A-1", "Aktif", 40, "Bandara – Madinah"),
  row("com1", "commissions", "Agen An-Nahl 1", "MP-261110XAXZ01", "Pending", 500000, "Komisi booking"),
  row("eq1", "equipment", "Koper besar", "Perlengkapan", "Tersedia", 0, "Ukuran L"),
  row("ins1", "installments", "Siti Aminah", "MP-261111YTDY01", "Belum Lunas", 21000000, "Sisa tagihan Rp 14.000.000"),
  row("doc1", "documents", "Ahmad Fauzi", "MP-261112RPD301", "Belum Lengkap", 0, "KTP · KK · Paspor · Vaksin"),
  row("doc2", "documents", "Bambang Irawan", "MP-261112U58601", "Lengkap", 0, "KTP · KK · Paspor · Vaksin"),
  row("man1", "manifest", "Ahmad Fauzi", "PAK-001 · Kamar 111", "Belum ditempatkan", 0, "Rooming · Bus belum ditentukan"),
  row("dep2", "departures", "Manasik & doa bersama", "13 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl · UMROH PLUS AN-NAHL"),
  row("dep3", "departures", "Keberangkatan Umrah", "20 Nov 2026 · 08:30", "Terjadwal", 0, "Bandara Juanda · UMROH PLUS AN-NAHL"),
  row("dep4", "departures", "Kajian Fiqih Ibadah Umrah", "10 Des 2026 · 08:30", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep5", "departures", "Manasik dan praktik tawaf", "15 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep6", "departures", "Jadwal Manasik November", "18 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep7", "departures", "Jadwal Manasik Desember", "25 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep8", "departures", "Jadwal Manasik Desember", "10 Des 2026 · 08:30", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep9", "departures", "Manasik & doa bersama", "20 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("dep10", "departures", "Manasik & doa bersama", "23 Nov 2026 · 09:00", "Terjadwal", 0, "Aula An-Nahl"),
  row("deposit1", "deposits", "Isi Saldo Deposit", "DEP-673456cb35544d2", "Terbayar", 50000000, "Top-up saldo deposit via transfer"),
  row("air1", "airlines", "Saudia Airlines", "SV-817", "Aktif", 0, "Jakarta – Jeddah"),
  row("vendor1", "vendors", "PT Jaya Transport", "Mitra Transport", "Aktif", 0, "Bandara – Madinah"),
];

export function readDemoRecords(): TravelRecord[] {
  if (typeof window === "undefined") return demoRecords;
  try {
    const stored = window.localStorage.getItem("an-nahl-demo-records");
    if (!stored) return demoRecords;
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const saved = parsed.filter(isTravelRecord);
      const savedIds = new Set(saved.map((record) => record.id));
      return [...saved, ...demoRecords.filter((record) => !savedIds.has(record.id))];
    }
    return demoRecords;
  } catch (error) {
    console.error("Could not read saved demo records.", error);
    return demoRecords;
  }
}

function isTravelRecord(value: unknown): value is TravelRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<TravelRecord>;
  return typeof record.id === "string" &&
    typeof record.category === "string" &&
    categories.includes(record.category as Category) &&
    typeof record.title === "string" &&
    typeof record.reference === "string" &&
    typeof record.status === "string" &&
    typeof record.amount === "number" &&
    Boolean(record.details && typeof record.details === "object") &&
    typeof record.created_at === "string";
}

export function writeDemoRecords(records: TravelRecord[]): void {
  window.localStorage.setItem("an-nahl-demo-records", JSON.stringify(records));
}
