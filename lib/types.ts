export const categories = [
  "bookings",
  "pilgrims",
  "payments",
  "packages",
  "hotels",
  "agents",
  "branches",
  "departures",
  "transport",
  "commissions",
  "equipment",
  "installments",
  "documents",
  "manifest",
  "deposits",
  "airlines",
  "vendors",
] as const;

export type Category = (typeof categories)[number];

export type TravelRecord = {
  id: string;
  category: Category;
  title: string;
  reference: string;
  status: string;
  amount: number;
  branch: string;
  role_target: string;
  channel: string;
  details: Record<string, string>;
  created_at: string;
  updated_at?: string;
};

export type RecordDraft = Omit<TravelRecord, "id" | "created_at" | "updated_at">;

export const categoryLabels: Record<Category, string> = {
  bookings: "Pesanan",
  pilgrims: "Jamaah",
  payments: "Pembayaran",
  packages: "Paket Umrah",
  hotels: "Hotel",
  agents: "Agen / Reseller",
  branches: "Staf Cabang",
  departures: "Jadwal Manasik",
  transport: "Transportasi",
  commissions: "Komisi Agen",
  equipment: "Perlengkapan",
  installments: "Cicilan",
  documents: "Dokumen Jamaah",
  manifest: "Manifest & Rooming",
  deposits: "Deposit Travel",
  airlines: "Penerbangan",
  vendors: "Mitra / Vendor",
};

export type StaffRole = "admin" | "branch_admin" | "operasional" | "keuangan";

export type StaffAccount = {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: StaffRole;
  roleLabel: string;
  avatar: string;
  description: string;
};

export const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: "admin",
    name: "Admin Demo",
    email: "admin@annahl.com",
    branch: "Head office",
    role: "admin",
    roleLabel: "Admin Travel",
    avatar: "A",
    description: "Akun Demo Administrator Travel. Akses penuh seluruh 84 data, semua cabang (Malang, Sidoarjo, Surabaya), omzet global, dan master data.",
  },
  {
    id: "cabang",
    name: "Siti Rahma",
    email: "cabang@annahl.com",
    branch: "Cabang Sidoarjo",
    role: "branch_admin",
    roleLabel: "Admin Cabang Sidoarjo",
    avatar: "S",
    description: "Admin Cabang Sidoarjo. Data terisolasi khusus jamaah & transaksi Cabang Sidoarjo (pesanan Sidoarjo, manasik Sidoarjo, omzet cabang).",
  },
  {
    id: "operasional",
    name: "Fajar Pratama",
    email: "operasional@annahl.com",
    branch: "Head office",
    role: "operasional",
    roleLabel: "Tim Operasional",
    avatar: "F",
    description: "Operasional Lapangan. Fokus paspor & dokumen jamaah, manasik, manifest hotel Makkah/Madinah, bus bandara, dan perlengkapan.",
  },
  {
    id: "keuangan",
    name: "Dewi Sartika",
    email: "keuangan@annahl.com",
    branch: "Head office",
    role: "keuangan",
    roleLabel: "Tim Keuangan",
    avatar: "D",
    description: "Keuangan & Kas. Fokus verifikasi pembayaran transfer bank, cicilan jamaah, pencairan komisi agen, deposit tiket & visa.",
  },
];

export type TravelProfile = {
  travel: string;
  email: string;
  phone: string;
  address: string;
};

export type BankAccount = {
  bank: string;
  number: string;
  owner: string;
};
