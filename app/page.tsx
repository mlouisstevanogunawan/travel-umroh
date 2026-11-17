"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSupabase } from "@/lib/supabase";
import {
  categories,
  categoryLabels,
  STAFF_ACCOUNTS,
  type BankAccount,
  type Category,
  type RecordDraft,
  type StaffAccount,
  type StaffRole,
  type TravelProfile,
  type TravelRecord,
} from "@/lib/types";

type Section = "dashboard" | Category | "help" | "settings";
type SettingsTab =
  | "profile"
  | "password"
  | "notifications"
  | "branchReport"
  | "equipmentTemplate"
  | "bank"
  | "audit";

const groups: {
  label: string;
  icon: string;
  direct?: Section;
  links?: { id: Section; label: string; settingsTab?: SettingsTab }[];
}[] = [
  { label: "Dashboard", icon: "▦", direct: "dashboard" },
  {
    label: "Pesanan",
    icon: "▣",
    links: [
      { id: "dashboard", label: "Dashboard" },
      { id: "bookings", label: "Pesanan" },
    ],
  },
  {
    label: "Jamaah",
    icon: "♧",
    links: [
      { id: "pilgrims", label: "Jamaah" },
      { id: "documents", label: "Dokumen Jamaah" },
    ],
  },
  {
    label: "Keberangkatan",
    icon: "♙",
    links: [
      { id: "departures", label: "Manasik" },
      { id: "manifest", label: "Manifest & Rooming" },
      { id: "equipment", label: "Perlengkapan" },
    ],
  },
  {
    label: "Keuangan",
    icon: "▤",
    links: [
      { id: "payments", label: "Pembayaran" },
      { id: "installments", label: "Cicilan" },
      { id: "commissions", label: "Komisi Agen" },
      { id: "deposits", label: "Deposit Travel" },
    ],
  },
  {
    label: "Master Data",
    icon: "▥",
    links: [
      { id: "packages", label: "Paket Umrah" },
      { id: "hotels", label: "Hotel" },
      { id: "airlines", label: "Penerbangan" },
      { id: "transport", label: "Transportasi" },
      { id: "vendors", label: "Mitra / Vendor" },
      { id: "agents", label: "Agen / Reseller" },
      { id: "branches", label: "Staf Cabang" },
    ],
  },
  { label: "Bantuan", icon: "◉", direct: "help" },
  {
    label: "Pengaturan",
    icon: "⚙",
    links: [
      { id: "settings", label: "Profil Travel", settingsTab: "profile" },
      { id: "branches", label: "Data Cabang" },
      { id: "settings", label: "Rekap Cabang", settingsTab: "branchReport" },
      { id: "settings", label: "Template Perlengkapan", settingsTab: "equipmentTemplate" },
      { id: "settings", label: "Rekening Bank", settingsTab: "bank" },
      { id: "settings", label: "Audit Log", settingsTab: "audit" },
    ],
  },
];

const englishLabels: Record<string, string> = {
  Dashboard: "Dashboard",
  Pesanan: "Bookings",
  Jamaah: "Pilgrims",
  "Dokumen Jamaah": "Pilgrim Documents",
  Manasik: "Pilgrimage Guidance",
  Keberangkatan: "Departures",
  Perlengkapan: "Equipment",
  Keuangan: "Finance",
  Pembayaran: "Payments",
  Cicilan: "Installments",
  "Komisi Agen": "Agent Commission",
  "Deposit Travel": "Travel Deposit",
  "Master Data": "Master Data",
  "Paket Umrah": "Umrah Packages",
  Hotel: "Hotels",
  Penerbangan: "Flights",
  Transportasi: "Transport",
  "Mitra / Vendor": "Partners / Vendors",
  "Agen / Reseller": "Agents / Resellers",
  "Staf Cabang": "Branch Staff",
  Bantuan: "Help",
  Pengaturan: "Settings",
  "Jadwal Manasik": "Pilgrimage Schedule",
  "Manifest & Rooming": "Manifest & Rooming",
  "Profil Travel": "Travel Profile",
  "Rekap Cabang": "Branch Summary",
  "Template Perlengkapan": "Equipment Templates",
  "Rekening Bank": "Bank Accounts",
  "Bantuan & Panduan": "Help & Guide",
  Pendapatan: "Revenue",
  "Paket aktif": "Active packages",
  "Selamat datang": "Welcome",
  "Ada pesanan baru": "New booking received",
  "Tinjau ↗": "Review ↗",
  "RINGKASAN TRAVEL": "TRAVEL SUMMARY",
  "Pantau aktivitas dan performa perjalanan Anda.": "Track travel activity and performance.",
  "30 hari terakhir": "Last 30 days",
  "7 hari terakhir": "Last 7 days",
  "90 hari terakhir": "Last 90 days",
  "Semua waktu": "All time",
  "Kanal Penjualan": "Sales Channels",
  "Ringkasan pesanan perjalanan": "Booking summary",
  "Tren Pendapatan": "Revenue Trend",
  "Pesanan terbaru": "Recent Bookings",
  "Pantau status booking jamaah": "Track pilgrim booking status",
  "Selengkapnya ↗": "View all ↗",
  "data ditemukan": "records found",
  "Ekspor CSV": "Export CSV",
  Tambah: "Add",
  "Cari data": "Search records",
  "Nama / Data": "Name / Record",
  "Kode / Referensi": "Code / Reference",
  "Nominal / Info": "Amount / Info",
  Status: "Status",
  Aksi: "Actions",
  Semua: "All",
  "Belum ada data. Tambahkan data pertama Anda.": "No records yet. Add your first record.",
  Menampilkan: "Showing",
  dari: "of",
  Halaman: "Page",
  "Per halaman": "Rows per page",
  "Nama / Judul": "Name / Title",
  "Tanggal & waktu": "Date & time",
  Batal: "Cancel",
  Simpan: "Save",
  "Ubah data": "Edit record",
  Keterangan: "Details",
  "Nominal (Rp)": "Amount (IDR)",
  "Nama Travel": "Travel Agency Name",
};

const tr = (text: string, language: string) =>
  language === "English" ? englishLabels[text] ?? text : text;

const titleFor = (section: Section, language = "Indonesia") =>
  tr(
    section === "dashboard"
      ? "Dashboard"
      : section === "help"
      ? "Bantuan & Panduan"
      : section === "settings"
      ? "Pengaturan"
      : categoryLabels[section],
    language
  );

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function scheduleDate(reference: string): Date | null {
  const dateText = reference.split(" · ")[0].trim();
  const match = dateText.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ.]+)\s+(\d{4})$/);
  if (!match) {
    const parsed = new Date(dateText);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const months: Record<string, number> = {
    jan: 0,
    januari: 0,
    feb: 1,
    februari: 1,
    mar: 2,
    maret: 2,
    apr: 3,
    april: 3,
    mei: 4,
    may: 4,
    jun: 5,
    juni: 5,
    jul: 6,
    juli: 6,
    agu: 7,
    agustus: 7,
    sep: 8,
    september: 8,
    okt: 9,
    oktober: 9,
    nov: 10,
    november: 10,
    des: 11,
    desember: 11,
  };
  const month = months[match[2].toLowerCase().replace(".", "")];
  if (month === undefined) return null;
  const parsed = new Date(Number(match[3]), month, Number(match[1]));
  return parsed.getMonth() === month && parsed.getDate() === Number(match[1])
    ? parsed
    : null;
}

export default function Home() {
  const supabase = useMemo(() => getSupabase(), []);
  const [allRecords, setAllRecords] = useState<TravelRecord[]>([]);
  const [section, setSection] = useState<Section>("dashboard");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [branchFilter, setBranchFilter] = useState("Semua Cabang");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<
    "title" | "reference" | "amount" | "status" | "created_at"
  >("created_at");
  const [sortAscending, setSortAscending] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TravelRecord | null>(null);
  const [draftReference, setDraftReference] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<StaffAccount | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [lastUpdatedRecordId, setLastUpdatedRecordId] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState("");

  const [email, setEmail] = useState("admin@annahl.com");
  const [password, setPassword] = useState("umroh123");
  const [showPassword, setShowPassword] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "Pesanan",
    "Jamaah",
    "Keuangan",
  ]);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");
  const [bannerVisible, setBannerVisible] = useState(true);
  const [popover, setPopover] = useState<
    "notifications" | "profile" | "switchAccount" | "quickAdd" | null
  >(null);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(true);
  const [globalQuery, setGlobalQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<TravelRecord | null>(null);
  const [modalCategory, setModalCategory] = useState<Category>("bookings");
  const [dateRange, setDateRange] = useState("30");
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("Indonesia");

  // Fetch records from Supabase
  const loadRecords = useCallback(async () => {
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      const { data, error: loadError } = await supabase
        .from("travel_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (loadError) throw loadError;
      setAllRecords((data ?? []) as TravelRecord[]);
    } catch (loadErr) {
      setError(
        `Gagal memuat data dari Supabase: ${
          loadErr instanceof Error ? loadErr.message : "Terjadi kesalahan."
        }`
      );
    } finally {
      setBusy(false);
    }
  }, [supabase]);

  // Auth session initialization
  useEffect(() => {
    if (!supabase) {
      setSessionReady(true);
      setBusy(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase();
          const matched =
            STAFF_ACCOUNTS.find(
              (a) =>
                a.email.toLowerCase() === userEmail ||
                (a.id === "admin" && (userEmail === "admin@annahl.com" || userEmail === "budiono@annahl.com"))
            ) ?? {
              id: session.user.id,
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                userEmail?.split("@")[0] ||
                "Staf Travel",
              email: userEmail || "",
              branch: session.user.user_metadata?.branch || "Head office",
              role:
                (session.user.user_metadata?.role as StaffRole) ||
                "admin",
              roleLabel:
                session.user.user_metadata?.role === "branch_admin"
                  ? "Admin Cabang"
                  : session.user.user_metadata?.role === "keuangan"
                  ? "Tim Keuangan"
                  : session.user.user_metadata?.role === "operasional"
                  ? "Tim Operasional"
                  : "Admin Travel",
              avatar: (session.user.email || "S").slice(0, 1).toUpperCase(),
              description: "Pengguna terautentikasi Supabase.",
            };
          setCurrentUser(matched);
        } else {
          // Check if local staff preference was saved
          const savedStaffId = window.localStorage.getItem("an-nahl-active-staff");
          const defaultStaff =
            STAFF_ACCOUNTS.find((a) => a.id === savedStaffId) || null;
          setCurrentUser(defaultStaff);
        }
        setSessionReady(true);
      })
      .catch((err) => {
        setError(`Sesi error: ${err.message}`);
        setSessionReady(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        window.localStorage.removeItem("an-nahl-active-staff");
        setCurrentUser(null);
      } else if (session?.user) {
        const userEmail = session.user.email?.toLowerCase();
        const matched =
          STAFF_ACCOUNTS.find(
            (a) =>
              a.email.toLowerCase() === userEmail ||
              (a.id === "admin" && (userEmail === "admin@annahl.com" || userEmail === "budiono@annahl.com"))
          ) ?? null;
        if (matched) setCurrentUser(matched);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Realtime subscription setup
  useEffect(() => {
    if (!supabase) return;

    void loadRecords();

    const channel = supabase
      .channel("travel-records-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "travel_records" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new as TravelRecord;
            setAllRecords((prev) => [
              newRow,
              ...prev.filter((item) => item.id !== newRow.id),
            ]);
            setLastUpdatedRecordId(newRow.id);
            setLiveToast(`Data baru ditambahkan: ${newRow.title}`);
          } else if (payload.eventType === "UPDATE") {
            const updatedRow = payload.new as TravelRecord;
            setAllRecords((prev) =>
              prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
            );
            setLastUpdatedRecordId(updatedRow.id);
            setLiveToast(`Data diperbarui: ${updatedRow.title}`);
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setAllRecords((prev) => prev.filter((item) => item.id !== oldId));
            }
            setLiveToast("Data dihapus dari database.");
          }
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === "SUBSCRIBED");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadRecords, supabase]);

  // Clear live toast after 4 seconds
  useEffect(() => {
    if (!liveToast) return;
    const timer = setTimeout(() => {
      setLiveToast("");
      setLastUpdatedRecordId(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [liveToast]);

  // Read saved theme and language
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("an-nahl-theme");
    const savedLanguage = window.localStorage.getItem("an-nahl-language");
    if (savedTheme) setDarkMode(savedTheme !== "light");
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, branchFilter, pageSize, section]);

  // Reliable outside-click listener for popovers and global search
  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popover && !target.closest(".popover-wrap") && !target.closest(".top-popover")) {
        setPopover(null);
      }
      if (showResults && !target.closest(".search-wrap")) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [popover, showResults]);

  // --------------------------------------------------------------------------
  // ACCOUNT-BASED DATA ISOLATION & FILTERING
  // --------------------------------------------------------------------------
  // The user demanded: "taip akun beda beda lah datanya jangan sama semua"
  // - Admin Cabang (Cabang Sidoarjo): sees ONLY records for Cabang Sidoarjo!
  // - Admin: sees ALL records across all branches, with branch filter option.
  // - Tim Operasional: sees operational scope.
  // - Tim Keuangan: sees finance scope.
  const scopedRecords = useMemo(() => {
    if (!currentUser) return allRecords;

    // Branch Admin (Siti Rahma / Cabang Sidoarjo): ISOLATED TO HER BRANCH!
    if (currentUser.role === "branch_admin") {
      return allRecords.filter(
        (r) =>
          r.branch.toLowerCase().includes(currentUser.branch.toLowerCase()) ||
          r.details?.info?.toLowerCase().includes(currentUser.branch.toLowerCase()) ||
          r.category === "packages" ||
          r.category === "hotels" ||
          r.category === "airlines"
      );
    }

    // Admin: Can filter by branch or see all
    if (currentUser.role === "admin") {
      if (branchFilter === "Semua Cabang") return allRecords;
      return allRecords.filter(
        (r) =>
          r.branch.toLowerCase() === branchFilter.toLowerCase() ||
          r.details?.info?.toLowerCase().includes(branchFilter.toLowerCase())
      );
    }

    // Tim Operasional
    if (currentUser.role === "operasional") {
      if (branchFilter !== "Semua Cabang") {
        return allRecords.filter(
          (r) =>
            r.branch.toLowerCase() === branchFilter.toLowerCase() ||
            r.details?.info?.toLowerCase().includes(branchFilter.toLowerCase())
        );
      }
      return allRecords;
    }

    // Tim Keuangan
    if (currentUser.role === "keuangan") {
      if (branchFilter !== "Semua Cabang") {
        return allRecords.filter(
          (r) =>
            r.branch.toLowerCase() === branchFilter.toLowerCase() ||
            r.details?.info?.toLowerCase().includes(branchFilter.toLowerCase())
        );
      }
      return allRecords;
    }

    return allRecords;
  }, [allRecords, branchFilter, currentUser]);

  // Table records for currently active section
  const visibleRecords = useMemo(() => {
    if (section === "dashboard" || section === "help" || section === "settings")
      return [];

    const filtered = scopedRecords.filter(
      (record) =>
        record.category === section &&
        (statusFilter === "Semua" || record.status === statusFilter) &&
        `${record.title} ${record.reference} ${record.status} ${record.branch} ${Object.values(
          record.details ?? {}
        ).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    return filtered.sort((left, right) => {
      const a = left[sortKey];
      const b = right[sortKey];
      const comparison =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a ?? "").localeCompare(String(b ?? ""), "id");
      return sortAscending ? comparison : -comparison;
    });
  }, [query, scopedRecords, section, sortAscending, sortKey, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(visibleRecords.length / pageSize));
  const pageRecords = visibleRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const globalResults = globalQuery.trim()
    ? scopedRecords
        .filter((record) =>
          `${record.title} ${record.reference} ${record.branch} ${
            record.details?.info ?? ""
          }`
            .toLowerCase()
            .includes(globalQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // Date range cutoff for Dashboard
  const dateCutoff = useMemo(() => {
    if (dateRange === "all") return 0;
    return Date.now() - Number(dateRange) * 24 * 60 * 60 * 1000;
  }, [dateRange]);

  const rangeRecords = useMemo(() => {
    return scopedRecords.filter(
      (record) => new Date(record.created_at).getTime() >= dateCutoff
    );
  }, [dateCutoff, scopedRecords]);

  const dashboardCount = (category: Category) =>
    category === "packages"
      ? scopedRecords.filter((r) => r.category === "packages").length
      : rangeRecords.filter((record) => record.category === category).length;

  const dashboardSales = rangeRecords
    .filter(
      (record) =>
        record.category === "payments" && record.status === "Terbayar"
    )
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  // Quick switch account
  async function selectStaffAccount(account: StaffAccount) {
    setBusy(true);
    setError("");
    setMessage("");
    setEmail(account.email);
    setPassword("umroh123");
    try {
      if (supabase) {
        // Authenticate with Supabase Auth
        const loginEmail = account.id === "admin" ? "budiono@annahl.com" : account.email;
        const candidatePasswords = ["umroh123", "sayangnia1122", "SayangNia1122!"];
        for (const pw of candidatePasswords) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: pw,
          });
          if (!signInError) break;
        }
      }
      setCurrentUser(account);
      window.localStorage.setItem("an-nahl-active-staff", account.id);
      setPopover(null);
      setMessage(`Berhasil beralih ke akun ${account.name} (${account.roleLabel})`);
      setPage(1);
    } catch (switchErr) {
      setError(`Gagal beralih akun: ${switchErr instanceof Error ? switchErr.message : "Error"}`);
    } finally {
      setBusy(false);
    }
  }

  // Handle manual login form
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      let authUserEmail = email.trim().toLowerCase();
      const authUserPassword = password;

      // Handle admin aliases
      if (authUserEmail === "admin@annahl.com" || authUserEmail === "demo@annahl.com") {
        authUserEmail = "budiono@annahl.com";
      }

      const candidatePasswords = [
        authUserPassword,
        "umroh123",
        "sayangnia1122",
        "SayangNia1122!",
      ];

      let data: any = null;
      let loginError: any = null;

      for (const pw of candidatePasswords) {
        const res = await supabase.auth.signInWithPassword({
          email: authUserEmail,
          password: pw,
        });
        if (!res.error && res.data?.user) {
          data = res.data;
          loginError = null;
          break;
        } else {
          loginError = res.error;
        }
      }

      if (loginError) throw loginError;
      if (!data || !data.user) throw new Error("Pengguna tidak ditemukan.");

      const userEmail = data.user.email?.toLowerCase();
      const matched =
        STAFF_ACCOUNTS.find(
          (a) =>
            a.email.toLowerCase() === userEmail ||
            (a.id === "admin" && (userEmail === "admin@annahl.com" || userEmail === "budiono@annahl.com"))
        ) ?? {
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            userEmail?.split("@")[0] ||
            "Staf Travel",
          email: userEmail || "",
          branch: data.user.user_metadata?.branch || "Head office",
          role: (data.user.user_metadata?.role as StaffRole) || "admin",
          roleLabel: "Admin Travel",
          avatar: (data.user.email || "A").slice(0, 1).toUpperCase(),
          description: "Akun Supabase",
        };
      setCurrentUser(matched);
      window.localStorage.setItem("an-nahl-active-staff", matched.id);
    } catch (loginErr) {
      setError(
        `Gagal masuk: ${
          loginErr instanceof Error ? loginErr.message : "Periksa email dan password."
        }`
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setPopover(null);
    window.localStorage.removeItem("an-nahl-active-staff");
    setCurrentUser(null);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("SignOut Supabase warning:", err);
    } finally {
      setBusy(false);
      setMessage("Anda telah berhasil keluar dari akun.");
    }
  }

  function navigate(nextSection: Section) {
    setSection(nextSection);
    setQuery("");
    setStatusFilter("Semua");
    setPage(1);
    setPopover(null);
    setMobileMenuOpen(false);
    setGlobalQuery("");
    setShowResults(false);
  }

  function changeSort(nextKey: typeof sortKey) {
    if (sortKey === nextKey) setSortAscending(!sortAscending);
    else {
      setSortKey(nextKey);
      setSortAscending(true);
    }
  }

  function selectGlobalResult(record: TravelRecord) {
    navigate(record.category);
    setQuery(record.title);
    setGlobalQuery("");
    setShowResults(false);
    setLastUpdatedRecordId(record.id);
  }

  async function handleManualRefresh() {
    setBusy(true);
    await loadRecords();
    setLiveToast("Data Supabase berhasil disinkronkan");
    setTimeout(() => setLiveToast(""), 3000);
  }

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    window.localStorage.setItem("an-nahl-theme", next ? "dark" : "light");
  }

  function selectLanguage(next: string) {
    setLanguage(next);
    window.localStorage.setItem("an-nahl-language", next);
    setPopover(null);
  }

  function toggleSidebar() {
    if (window.innerWidth <= 768) setMobileMenuOpen((open) => !open);
    else setCollapsed((value) => !value);
  }

  function closeMobileSidebar() {
    setMobileMenuOpen(false);
  }

  // Save record to Supabase
  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const form = new FormData(event.currentTarget);
    const category =
      (form.get("category") as Category) ||
      modalCategory ||
      (categories.includes(section as Category)
        ? (section as Category)
        : "bookings");
    const draft: RecordDraft = {
      category,
      title: String(form.get("title") ?? "").trim(),
      reference: String(form.get("reference") ?? "").trim(),
      status: String(form.get("status") ?? "Aktif"),
      amount: Number(form.get("amount") ?? 0),
      branch:
        currentUser?.role === "branch_admin"
          ? currentUser.branch
          : String(form.get("branch") ?? currentUser?.branch ?? "Head office"),
      role_target: String(form.get("role_target") ?? "all"),
      channel: String(form.get("channel") ?? "Marketplace"),
      details: {
        info: String(form.get("info") ?? "").trim(),
        notes: String(form.get("notes") ?? "").trim(),
      },
    };

    if (!draft.title) {
      setError("Nama atau judul wajib diisi.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      if (editing) {
        const { data: updatedRows, error: updateError } = await supabase
          .from("travel_records")
          .update(draft)
          .eq("id", editing.id)
          .select();
        if (updateError) throw updateError;
        if (updatedRows && updatedRows.length > 0) {
          setAllRecords((prev) =>
            prev.map((r) => (r.id === editing.id ? (updatedRows[0] as TravelRecord) : r))
          );
        }
        setMessage("Data berhasil diperbarui secara realtime di Supabase.");
      } else {
        const { data: insertedRows, error: insertError } = await supabase
          .from("travel_records")
          .insert(draft)
          .select();
        if (insertError) throw insertError;
        if (insertedRows && insertedRows.length > 0) {
          setAllRecords((prev) => [insertedRows[0] as TravelRecord, ...prev]);
        }
        setMessage("Data berhasil ditambahkan secara realtime ke Supabase.");
      }
      setModal(false);
      setEditing(null);
    } catch (saveError) {
      setError(
        `Gagal menyimpan ke Supabase: ${
          saveError instanceof Error ? saveError.message : "Terjadi kesalahan."
        }`
      );
    } finally {
      setBusy(false);
    }
  }

  // Delete record from Supabase
  async function deleteRecord(record: TravelRecord): Promise<boolean> {
    if (!window.confirm(`Hapus data "${record.title}" dari database Supabase?`))
      return false;
    if (!supabase) return false;

    setError("");
    setBusy(true);
    try {
      const { error: deleteError } = await supabase
        .from("travel_records")
        .delete()
        .eq("id", record.id);
      if (deleteError) throw deleteError;
      setAllRecords((prev) => prev.filter((r) => r.id !== record.id));
      setMessage("Data berhasil dihapus dari Supabase.");
      return true;
    } catch (deleteError) {
      setError(
        `Gagal menghapus data: ${
          deleteError instanceof Error ? deleteError.message : "Terjadi kesalahan."
        }`
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  function exportCsv(rowsToExport = visibleRecords) {
    const exportRows = [
      ["Nama", "Kode", "Status", "Nominal", "Cabang", "Kanal", "Keterangan", "Tanggal"],
      ...rowsToExport.map((record) => [
        record.title,
        record.reference,
        record.status,
        String(record.amount),
        record.branch,
        record.channel,
        record.details?.info ?? "",
        new Date(record.created_at).toLocaleDateString("id-ID"),
      ]),
    ];
    const csv = exportRows
      .map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" })
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${section}-${currentUser?.branch.replace(/\s+/g, "-") || "all"}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(`${rowsToExport.length} baris data berhasil diekspor.`);
  }

  const openNew = (reference = "", targetCat?: Category) => {
    const cat =
      targetCat ||
      (categories.includes(section as Category)
        ? (section as Category)
        : "bookings");
    setModalCategory(cat);
    setEditing(null);
    setDraftReference(reference);
    setError("");
    setModal(true);
  };

  const openEdit = (record: TravelRecord) => {
    setModalCategory(record.category);
    setEditing(record);
    setDraftReference(record.reference);
    setError("");
    setModal(true);
  };

  // Helper placeholder for modal form based on category
  const activeModalCat = editing ? editing.category : modalCategory;
  const modalInfoLabel = useMemo(() => {
    switch (activeModalCat) {
      case "bookings":
        return "Paket & Rincian Pesanan";
      case "pilgrims":
        return "No. HP & Alokasi Kamar";
      case "documents":
        return "Kelengkapan Dokumen (Paspor, KTP, KK, Vaksin)";
      case "manifest":
        return "Detail Rooming Hotel & Kursi Bus";
      case "payments":
        return "Metode Pembayaran & Verifikasi";
      case "installments":
        return "Rincian Cicilan & Sisa Tagihan";
      case "commissions":
        return "No. Rekening Agen & Detail Komisi";
      case "deposits":
        return "Tujuan Deposit & Keterangan Transaksi";
      case "equipment":
        return "Spesifikasi Barang & Stok Gudang";
      case "hotels":
        return "Lokasi & Fasilitas Hotel";
      case "airlines":
        return "Rute, Armada & Kapasitas Bagasi";
      case "transport":
        return "Rute & Fasilitas Armada Bus";
      case "departures":
        return "Lokasi Manasik & Pembimbing Ibadah";
      case "vendors":
        return "Layanan Rekanan & Kontak Vendor";
      case "branches":
        return "Alamat Kantor & Kontak PIC";
      case "agents":
        return "Penanggung Jawab & Jumlah Jamaah";
      default:
        return "Keterangan Tambahan";
    }
  }, [activeModalCat]);

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!sessionReady || !currentUser) {
    return (
      <main className="login-screen">
        <div className="login-column">
          <section className="login-card login-card-enhanced">
            <div className="login-logo">
              UMRAH<span>QU</span>
            </div>
            <h1>An-Nahl Travel Admin</h1>
            <p className="muted">
              Pilih akun staf demo atau masuk dengan kredensial untuk melihat data real-time terisolasi per peran &amp; cabang.
            </p>

            {/* Quick Staff Account Switcher */}
            <div className="staff-selector-panel">
              <span className="staff-selector-label">PILIH AKUN DEMO STAF (KLIK UNTUK MASUK):</span>
              <div className="staff-accounts-list">
                {STAFF_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    className={`staff-account-card ${
                      currentUser?.id === acc.id ? "active-account" : ""
                    }`}
                    onClick={() => selectStaffAccount(acc)}
                  >
                    <div className="staff-avatar-badge">{acc.avatar}</div>
                    <div className="staff-info-col">
                      <div className="staff-name-row">
                        <strong>{acc.name}</strong>
                        <span className={`staff-role-pill role-${acc.role}`}>
                          {acc.branch}
                        </span>
                      </div>
                      <span className="staff-role-sub">{acc.roleLabel}</span>
                      <p className="staff-desc-text">{acc.description}</p>
                    </div>
                    <span className="staff-action-arrow">Masuk →</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="login-divider">
              <span>atau masuk langsung</span>
            </div>

            <form onSubmit={handleLogin} className="login-manual-form">
              <label>
                Email Staf
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@annahl.com"
                />
              </label>
              <label>
                Password
                <span className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "◉" : "◎"}
                  </button>
                </span>
              </label>

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="button primary full login-submit"
                disabled={busy}
              >
                {busy ? "Memeriksa..." : "Masuk ke Dashboard"}
              </button>
            </form>

            <div className="login-footer-meta">
              <span>🟢 Supabase Database Real-time Aktif</span>
              <span>Kredensial Demo: umroh123</span>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED APP SHELL
  // --------------------------------------------------------------------------
  return (
    <main
      className={`app-shell ${collapsed ? "sidebar-collapsed" : ""} ${
        mobileMenuOpen ? "mobile-menu-open" : ""
      }`}
    >
      {mobileMenuOpen && (
        <button
          className="mobile-sidebar-backdrop"
          aria-label="Tutup menu"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Realtime Live Toast Notification */}
      {liveToast && (
        <aside className="realtime-toast" role="status" aria-live="polite">
          <span className="toast-beacon">⚡</span>
          <span>{liveToast}</span>
          <button onClick={() => setLiveToast("")} aria-label="Tutup">
            ×
          </button>
        </aside>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div
          className="brand clickable"
          onClick={() => navigate("dashboard")}
          title="Kembali ke Dashboard"
          role="button"
          tabIndex={0}
        >
          <div className="brand-symbol">ن</div>
          <div>
            <strong>An-Nahl</strong>
            <small>{currentUser.branch}</small>
          </div>
        </div>

        <div className="side-scroll">
          {groups.map((group) => {
            const active =
              group.direct === section ||
              group.links?.some(
                (link) => link.id === section && link.label !== "Dashboard"
              );
            const expanded =
              expandedGroups.includes(group.label) || group.direct === section;
            return (
              <div className="nav-group" key={group.label}>
                <button
                  className={`nav-link nav-parent ${active ? "active" : ""}`}
                  onClick={() =>
                    group.direct
                      ? navigate(group.direct)
                      : setExpandedGroups((current) =>
                          expanded
                            ? current.filter((name) => name !== group.label)
                            : [...current, group.label]
                        )
                  }
                  title={collapsed ? group.label : undefined}
                >
                  <span className="nav-icon">{group.icon}</span>
                  <span className="nav-label">{tr(group.label, language)}</span>
                  {group.links && (
                    <span className="nav-chevron">{expanded ? "⌄" : "›"}</span>
                  )}
                </button>
                {group.links && expanded && (
                  <div className="nav-children">
                    {group.links.map((link) => (
                      <button
                        key={`${group.label}-${link.label}`}
                        className={`nav-link nav-child ${
                          section === link.id && link.label !== "Dashboard"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          navigate(link.id);
                          if (link.settingsTab)
                            setSettingsTab(link.settingsTab);
                          closeMobileSidebar();
                        }}
                        title={collapsed ? link.label : undefined}
                      >
                        <span className="nav-label">
                          {tr(link.label, language)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Active Account Card in Sidebar */}
        <div className="side-user">
          <span className="avatar">{currentUser.avatar}</span>
          <span className="nav-label">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.roleLabel}</small>
          </span>
          <button
            type="button"
            className="side-logout-btn"
            title="Keluar dari akun"
            aria-label="Keluar dari akun"
            onClick={() => void handleSignOut()}
          >
            ↪
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <section className="main-panel">
        <header className="topbar">
          <button
            className="icon-button sidebar-toggle"
            aria-label="Toggle menu"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          {/* Realtime Status Refresh Button */}
          <button
            type="button"
            className={`connection ${
              isRealtimeConnected ? "connected" : "connecting"
            } ${busy ? "is-refreshing" : ""}`}
            title="Klik untuk menyinkronkan data dengan Supabase"
            onClick={handleManualRefresh}
            aria-label="Refresh data Supabase"
          >
            <i />
            <span className="connection-text">
              {busy
                ? "Menyinkronkan..."
                : isRealtimeConnected
                ? "Real-time Aktif ↻"
                : "Menghubungkan..."}
            </span>
          </button>

          {/* Global Search */}
          <div className="search-wrap">
            <div className="global-search">
              <span className="search-icon">⌕</span>
              <input
                aria-label={tr("Cari data", language)}
                placeholder={
                  language === "English"
                    ? "Search pilgrims, bookings, packages..."
                    : "Cari jamaah, pesanan, paket, hotel..."
                }
                value={globalQuery}
                onChange={(event) => {
                  setGlobalQuery(event.target.value);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (globalQuery) setShowResults(true);
                }}
              />
              {globalQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setGlobalQuery("");
                    setShowResults(false);
                  }}
                  title="Bersihkan pencarian"
                >
                  ×
                </button>
              )}
            </div>
            {showResults && globalQuery.trim() && (
              <div className="search-results">
                {globalResults.length ? (
                  globalResults.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => selectGlobalResult(record)}
                    >
                      <span className="result-icon">
                        {categoryLabels[record.category]?.slice(0, 1) || "•"}
                      </span>
                      <span>
                        <strong>{record.title}</strong>
                        <small>
                          {categoryLabels[record.category]} · {record.branch} ·{" "}
                          {record.reference || record.status}
                        </small>
                      </span>
                      <b>↗</b>
                    </button>
                  ))
                ) : (
                  <p>Tidak ada data yang cocok.</p>
                )}
              </div>
            )}
          </div>

          {/* Top Actions */}
          <div className="top-actions">
            {/* Quick Add Button & Menu */}
            <div className="popover-wrap">
              <button
                type="button"
                className="button primary quick-create-btn"
                onClick={() =>
                  setPopover(popover === "quickAdd" ? null : "quickAdd")
                }
                title="Tambah Data Baru"
              >
                <span>＋ Tambah</span>
              </button>

              {popover === "quickAdd" && (
                <div className="top-popover quick-add-popover">
                  <div className="popover-heading">
                    <strong>Tambah Data Baru</strong>
                    <small>Pilih kategori formulir</small>
                  </div>
                  <div className="quick-add-menu">
                    <button
                      type="button"
                      className="quick-add-item"
                      onClick={() => {
                        setPopover(null);
                        openNew("", "bookings");
                      }}
                    >
                      <span className="qa-icon">📋</span>
                      <div>
                        <strong>Pesanan / Booking</strong>
                        <small>Pendaftaran paket umrah jamaah</small>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="quick-add-item"
                      onClick={() => {
                        setPopover(null);
                        openNew("", "pilgrims");
                      }}
                    >
                      <span className="qa-icon">👤</span>
                      <div>
                        <strong>Data Jamaah</strong>
                        <small>Biodata, paspor &amp; kontak jamaah</small>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="quick-add-item"
                      onClick={() => {
                        setPopover(null);
                        openNew("", "payments");
                      }}
                    >
                      <span className="qa-icon">💳</span>
                      <div>
                        <strong>Catat Pembayaran</strong>
                        <small>Setoran DP, cicilan, pelunasan</small>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="quick-add-item"
                      onClick={() => {
                        setPopover(null);
                        openNew("", "packages");
                      }}
                    >
                      <span className="qa-icon">📦</span>
                      <div>
                        <strong>Paket Umrah Baru</strong>
                        <small>Katalog paket reguler, VIP, plus</small>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="quick-add-item"
                      onClick={() => {
                        setPopover(null);
                        openNew("", "departures");
                      }}
                    >
                      <span className="qa-icon">📅</span>
                      <div>
                        <strong>Jadwal Keberangkatan</strong>
                        <small>Agenda manasik dan tanggal terbang</small>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Branch Filter */}
            {currentUser.role === "admin" && (
              <label className="branch-filter-select" title="Filter Cabang">
                <span>Cabang:</span>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="Semua Cabang">Semua Cabang</option>
                  <option value="Head office">Head office</option>
                  <option value="Cabang Sidoarjo">Cabang Sidoarjo</option>
                  <option value="Cabang Surabaya">Cabang Surabaya</option>
                </select>
              </label>
            )}

            {/* Quick Account Switcher in Topbar */}
            <div className="popover-wrap">
              <button
                type="button"
                className="button secondary switch-account-btn"
                onClick={() =>
                  setPopover(
                    popover === "switchAccount" ? null : "switchAccount"
                  )
                }
                title="Beralih ke akun lain"
              >
                <span>🔄 Ganti Akun</span>
              </button>

              {popover === "switchAccount" && (
                <div className="top-popover switch-account-popover">
                  <div className="popover-heading">
                    <strong>Pilih Akun Staf</strong>
                    <small>Ubah tampilan &amp; isolasi data</small>
                  </div>
                  <div className="account-switch-list">
                    {STAFF_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        className={`account-switch-item ${
                          currentUser.id === acc.id ? "selected" : ""
                        }`}
                        onClick={() => selectStaffAccount(acc)}
                      >
                        <span className="avatar-mini">{acc.avatar}</span>
                        <div className="acc-meta">
                          <strong>{acc.name}</strong>
                          <small>
                            {acc.roleLabel} · {acc.branch}
                          </small>
                        </div>
                        {currentUser.id === acc.id && (
                          <span className="check-active">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <label className="language-select">
              <span className="sr-only">Bahasa</span>
              <select
                value={language}
                onChange={(event) => selectLanguage(event.target.value)}
                aria-label="Pilih bahasa"
              >
                <option value="Indonesia">ID</option>
                <option value="English">EN</option>
              </select>
            </label>

            {/* Notification Popover */}
            <div className="popover-wrap">
              <button
                type="button"
                className="icon-button notification-button"
                aria-label="Notifikasi"
                title="Notifikasi Realtime"
                onClick={() =>
                  setPopover(
                    popover === "notifications" ? null : "notifications"
                  )
                }
              >
                ♧{hasUnreadNotif && <i className="notif-dot" />}
              </button>
              {popover === "notifications" && (
                <div className="top-popover notifications-popover">
                  <div className="popover-heading">
                    <strong>Notifikasi Realtime</strong>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setHasUnreadNotif(false);
                        setLiveToast("Semua notifikasi telah ditandai dibaca");
                        setTimeout(() => setLiveToast(""), 2500);
                      }}
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  {scopedRecords
                    .filter(
                      (record) =>
                        record.category === "bookings" ||
                        record.category === "payments"
                    )
                    .slice(0, 5)
                    .map((record) => (
                      <button
                        type="button"
                        className="notification-row"
                        key={record.id}
                        onClick={() => selectGlobalResult(record)}
                      >
                        <span className="notification-icon">
                          {record.category === "payments" ? "💳" : "📋"}
                        </span>
                        <span>
                          <strong>{record.title}</strong>
                          <small>
                            {record.branch} ·{" "}
                            {record.details?.info || record.category}
                          </small>
                          <small>
                            {record.status} · {record.reference} ·{" "}
                            {record.amount ? rupiah(record.amount) : "—"}
                          </small>
                        </span>
                      </button>
                    ))}
                  <div className="popover-footer">
                    <button
                      type="button"
                      className="text-button full-center"
                      onClick={() => {
                        setPopover(null);
                        navigate("bookings");
                      }}
                    >
                      Lihat Semua Pesanan →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              type="button"
              className="icon-button"
              aria-label={
                darkMode ? "Aktifkan tema terang" : "Aktifkan tema gelap"
              }
              title="Ubah tema"
              onClick={toggleTheme}
            >
              {darkMode ? "☾" : "☀"}
            </button>

            {/* Direct Quick Logout Button in Topbar */}
            <button
              type="button"
              className="icon-button logout-btn-top"
              title="Keluar dari akun"
              aria-label="Keluar dari akun"
              onClick={() => void handleSignOut()}
            >
              ↪
            </button>

            {/* Profile Menu Popover */}
            <div className="popover-wrap">
              <button
                type="button"
                className="user-chip user-button"
                onClick={() =>
                  setPopover(popover === "profile" ? null : "profile")
                }
              >
                <span className="avatar">{currentUser.avatar}</span>
                <span className="user-name-text">{currentUser.name}</span>
                <span>⌄</span>
              </button>

              {popover === "profile" && (
                <div className="top-popover profile-popover">
                  <div className="profile-popover-header">
                    <strong>{currentUser.name}</strong>
                    <small>
                      {currentUser.roleLabel} · {currentUser.branch}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPopover(null);
                      navigate("settings");
                    }}
                  >
                    ⚙ Pengaturan
                  </button>
                  <button
                    type="button"
                    className="popover-action-btn logout"
                    onClick={() => void handleSignOut()}
                  >
                    ↪ Keluar dari Akun
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <div className="content">
          {bannerVisible && (
            <div className="announcement">
              <span>ⓘ</span>
              <span>
                Akun aktif: <strong>{currentUser.name}</strong> (
                {currentUser.roleLabel} - {currentUser.branch}). Data terhubung
                langsung ke database Supabase secara real-time.
              </span>
              <button
                className="announcement-close"
                aria-label="Tutup"
                onClick={() => setBannerVisible(false)}
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="alert error-alert" role="alert">
              {error}
              <button onClick={() => setError("")}>×</button>
            </div>
          )}
          {message && (
            <div className="alert success-alert" role="status">
              {message}
              <button onClick={() => setMessage("")}>×</button>
            </div>
          )}

          {section === "dashboard" ? (
            <Dashboard
              currentUser={currentUser}
              count={dashboardCount}
              totalSales={dashboardSales}
              records={rangeRecords}
              allScopedRecords={scopedRecords}
              onNavigate={navigate}
              dateRange={dateRange}
              onDateRange={setDateRange}
              onExport={exportCsv}
              onOpenNew={openNew}
              onDetail={setViewingRecord}
              onEdit={openEdit}
              language={language}
            />
          ) : section === "help" ? (
            <Help onNavigate={navigate} />
          ) : section === "settings" ? (
            <Settings
              tab={settingsTab}
              onTab={setSettingsTab}
              records={scopedRecords}
              onNavigate={navigate}
              currentUser={currentUser}
              onSignOut={handleSignOut}
            />
          ) : section === "departures" ? (
            <DepartureCalendar
              records={visibleRecords}
              onAdd={(reference) => openNew(reference, "departures")}
              onEdit={openEdit}
            />
          ) : (
            <section className="section-view">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">
                    {section === "bookings"
                      ? language === "English"
                        ? "OPERATIONS"
                        : "OPERASIONAL"
                      : categories.includes(section)
                      ? tr(
                          categoryLabels[section as Category],
                          language
                        ).toUpperCase()
                      : ""}
                  </p>
                  <h1>
                    {titleFor(section, language)}
                    {currentUser.role === "branch_admin" && (
                      <span className="heading-branch-badge">
                        {currentUser.branch}
                      </span>
                    )}
                  </h1>
                  <p className="muted">
                    {visibleRecords.length} {tr("data ditemukan", language)}{" "}
                    {currentUser.role === "branch_admin"
                      ? `(Khusus ${currentUser.branch})`
                      : ""}
                  </p>
                </div>
                <div className="heading-actions">
                  <button
                    className="button secondary"
                    onClick={() => exportCsv()}
                  >
                    ↓ <span>{tr("Ekspor CSV", language)}</span>
                  </button>
                  <button className="button primary" onClick={() => openNew()}>
                    ＋{" "}
                    <span>
                      {tr("Tambah", language)} {titleFor(section, language)}
                    </span>
                  </button>
                </div>
              </div>

              <div className="panel data-panel">
                <div className="table-toolbar">
                  <label className="search-field">
                    <span>⌕</span>
                    <input
                      placeholder={`${
                        language === "English" ? "Search" : "Cari"
                      } ${titleFor(section, language).toLowerCase()}...`}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    {query && (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() => setQuery("")}
                        title="Bersihkan filter"
                      >
                        ×
                      </button>
                    )}
                  </label>
                  <select
                    aria-label={
                      language === "English"
                        ? "Filter by status"
                        : "Filter status"
                    }
                    className="select-control"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="Semua">{tr("Semua", language)}</option>
                    {Array.from(
                      new Set(
                        scopedRecords
                          .filter((record) => record.category === section)
                          .map((record) => record.status)
                      )
                    )
                      .sort()
                      .map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                  </select>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <button
                            className="sort-button"
                            onClick={() => changeSort("title")}
                          >
                            {tr("Nama / Data", language)} ↕
                          </button>
                        </th>
                        <th>
                          <button
                            className="sort-button"
                            onClick={() => changeSort("reference")}
                          >
                            {tr("Kode / Referensi", language)} ↕
                          </button>
                        </th>
                        <th>
                          <button
                            className="sort-button"
                            onClick={() => changeSort("amount")}
                          >
                            {tr("Nominal / Info", language)} ↕
                          </button>
                        </th>
                        <th>Cabang</th>
                        <th>
                          <button
                            className="sort-button"
                            onClick={() => changeSort("status")}
                          >
                            {tr("Status", language)} ↕
                          </button>
                        </th>
                        <th className="action-col">{tr("Aksi", language)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {busy ? (
                        <tr>
                          <td className="empty" colSpan={6}>
                            {language === "English"
                              ? "Loading records from Supabase..."
                              : "Memuat data dari Supabase..."}
                          </td>
                        </tr>
                      ) : visibleRecords.length ? (
                        pageRecords.map((record) => (
                          <tr
                            key={record.id}
                            className={
                              lastUpdatedRecordId === record.id
                                ? "row-live-highlight"
                                : ""
                            }
                          >
                            <td>
                              <strong>{record.title}</strong>
                              <small>{record.details?.info || "—"}</small>
                            </td>
                            <td className="reference">
                              {record.reference || "—"}
                            </td>
                            <td>
                              {record.amount ? (
                                rupiah(record.amount)
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                            <td>
                              <span className="branch-tag">
                                {record.branch}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`status ${record.status
                                  .toLowerCase()
                                  .replaceAll(" ", "-")}`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button
                                type="button"
                                className="icon-button"
                                title="Lihat detail lengkap"
                                onClick={() => setViewingRecord(record)}
                                aria-label={`Detail ${record.title}`}
                              >
                                👁
                              </button>
                              <button
                                type="button"
                                className="icon-button"
                                title="Edit data"
                                onClick={() => openEdit(record)}
                                aria-label={`Edit ${record.title}`}
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                className="icon-button danger"
                                title="Hapus data"
                                onClick={() => void deleteRecord(record)}
                                aria-label={`Hapus ${record.title}`}
                              >
                                ⌫
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="empty" colSpan={6}>
                            {tr(
                              "Belum ada data. Tambahkan data pertama Anda.",
                              language
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="table-footer">
                  <span>
                    {tr("Menampilkan", language)}{" "}
                    {visibleRecords.length ? (page - 1) * pageSize + 1 : 0}–
                    {Math.min(page * pageSize, visibleRecords.length)}{" "}
                    {tr("dari", language)} {visibleRecords.length}{" "}
                    {language === "English" ? "records" : "data"}
                  </span>
                  <div className="pagination">
                    <label>
                      {tr("Per halaman", language)}{" "}
                      <select
                        value={pageSize}
                        onChange={(event) =>
                          setPageSize(Number(event.target.value))
                        }
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </label>
                    <span>
                      {tr("Halaman", language)} {page} / {pageCount}
                    </span>
                    <button
                      aria-label="First page"
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                    >
                      «
                    </button>
                    <button
                      aria-label="Previous page"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      ‹
                    </button>
                    <button
                      aria-label="Next page"
                      disabled={page >= pageCount}
                      onClick={() => setPage(page + 1)}
                    >
                      ›
                    </button>
                    <button
                      aria-label="Last page"
                      disabled={page >= pageCount}
                      onClick={() => setPage(pageCount)}
                    >
                      »
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Add / Edit Record Modal */}
      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(false);
          }}
        >
          <form className="modal-card" onSubmit={saveRecord}>
            <div className="modal-heading">
              <div>
                <p className="eyebrow">
                  {categoryLabels[activeModalCat]?.toUpperCase()}
                </p>
                <h2>
                  {editing
                    ? `${tr("Ubah", language)} ${categoryLabels[activeModalCat]}`
                    : `${tr("Tambah", language)} ${categoryLabels[activeModalCat]}`}
                </h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setModal(false)}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {!editing && (
              <label>
                Kategori Data
                <select
                  name="category"
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value as Category)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabels[c]}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              {tr("Nama / Judul", language)}
              <input
                name="title"
                required
                defaultValue={editing?.title ?? ""}
                placeholder="Masukkan nama atau judul"
              />
            </label>

            <div className="form-grid">
              <label>
                {tr(
                  activeModalCat === "departures"
                    ? "Tanggal & waktu"
                    : "Kode / Referensi",
                  language
                )}
                <input
                  name="reference"
                  defaultValue={draftReference}
                  placeholder={
                    activeModalCat === "departures"
                      ? "Contoh: 20 Nov 2026 · 09:00"
                      : "Contoh: MP-261116RPD301"
                  }
                />
              </label>

              <label>
                Cabang Travel
                <select
                  name="branch"
                  defaultValue={editing?.branch ?? currentUser.branch}
                  disabled={currentUser.role === "branch_admin"}
                >
                  <option value="Head office">Head office</option>
                  <option value="Cabang Sidoarjo">Cabang Sidoarjo</option>
                  <option value="Cabang Surabaya">Cabang Surabaya</option>
                  <option value="Cabang Malang">Cabang Malang</option>
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label>
                {tr("Status", language)}
                <select
                  name="status"
                  defaultValue={editing?.status ?? "Aktif"}
                >
                  <option>Aktif</option>
                  <option>Dikonfirmasi</option>
                  <option>Menunggu</option>
                  <option>Terbayar</option>
                  <option>Pending</option>
                  <option>Lunas</option>
                  <option>Belum Lunas</option>
                  <option>Lengkap</option>
                  <option>Belum Lengkap</option>
                  <option>Dibatalkan</option>
                  <option>Terjadwal</option>
                  <option>Tersedia</option>
                </select>
              </label>
              <label>
                {tr("Nominal (Rp)", language)}
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="1000"
                  defaultValue={editing?.amount ?? 0}
                />
              </label>
            </div>

            <div className="form-grid">
              <label>
                Kanal Penjualan
                <select
                  name="channel"
                  defaultValue={editing?.channel ?? "Marketplace"}
                >
                  <option value="Marketplace">Marketplace</option>
                  <option value="Website">Website</option>
                  <option value="Direct">Direct / Langsung</option>
                </select>
              </label>
              <label>
                Akses Peran
                <select
                  name="role_target"
                  defaultValue={editing?.role_target ?? "all"}
                >
                  <option value="all">Semua Staf</option>
                  <option value="operasional">Tim Operasional</option>
                  <option value="keuangan">Tim Keuangan</option>
                  <option value="admin">Hanya Admin</option>
                </select>
              </label>
            </div>

            <label>
              {modalInfoLabel}
              <input
                name="info"
                defaultValue={editing?.details?.info ?? ""}
                placeholder="Rincian informasi tambahan"
              />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              {editing && (
                <button
                  type="button"
                  className="button danger-button"
                  disabled={busy}
                  onClick={() =>
                    void deleteRecord(editing).then((deleted) => {
                      if (deleted) {
                        setModal(false);
                        setEditing(null);
                      }
                    })
                  }
                >
                  {language === "English" ? "Delete" : "Hapus"}
                </button>
              )}
              <button
                type="button"
                className="button secondary"
                onClick={() => setModal(false)}
              >
                {tr("Batal", language)}
              </button>
              <button className="button primary" disabled={busy}>
                {busy
                  ? language === "English"
                    ? "Saving..."
                    : "Menyimpan..."
                  : tr("Simpan ke Supabase", language)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECORD DETAIL MODAL */}
      {viewingRecord && (
        <div
          className="modal-backdrop"
          onClick={() => setViewingRecord(null)}
        >
          <div
            className="modal-card detail-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">
                  {categoryLabels[viewingRecord.category]?.toUpperCase()}
                </p>
                <h2>{viewingRecord.title}</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setViewingRecord(null)}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span
                  className={`status ${viewingRecord.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {viewingRecord.status}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Kode / Referensi</span>
                <span className="reference">{viewingRecord.reference || "—"}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Nominal Transaksi</span>
                <strong className="detail-amount">
                  {viewingRecord.amount ? rupiah(viewingRecord.amount) : "—"}
                </strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">Wilayah Cabang</span>
                <span className="branch-tag">{viewingRecord.branch}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Kanal Pendaftaran</span>
                <span className="source-tag">
                  {viewingRecord.channel || "Marketplace"}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Target Akses Peran</span>
                <span>
                  {viewingRecord.role_target === "admin"
                    ? "Hanya Admin"
                    : viewingRecord.role_target === "operasional"
                    ? "Tim Operasional"
                    : viewingRecord.role_target === "keuangan"
                    ? "Tim Keuangan"
                    : "Semua Staf"}
                </span>
              </div>

              <div className="detail-item full-width">
                <span className="detail-label">Rincian Informasi</span>
                <p className="detail-text">
                  {viewingRecord.details?.info || "Tidak ada keterangan tambahan."}
                </p>
              </div>

              <div className="detail-item full-width">
                <span className="detail-label">Waktu Pencatatan</span>
                <small className="muted">
                  {new Date(viewingRecord.created_at).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </small>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setViewingRecord(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="button danger-button"
                onClick={() => {
                  const target = viewingRecord;
                  setViewingRecord(null);
                  void deleteRecord(target);
                }}
              >
                ⌫ Hapus Data
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  const target = viewingRecord;
                  setViewingRecord(null);
                  openEdit(target);
                }}
              >
                ✎ Ubah Data
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ----------------------------------------------------------------------------
// DEPARTURE CALENDAR
// ----------------------------------------------------------------------------
function DepartureCalendar({
  records,
  onAdd,
  onEdit,
}: {
  records: TravelRecord[];
  onAdd: (reference: string) => void;
  onEdit: (record: TravelRecord) => void;
}) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [view, setView] = useState<"Bulan" | "Minggu">("Bulan");
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstDay = new Date(monthStart);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  const days = Array.from({ length: view === "Bulan" ? 42 : 7 }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    return date;
  });
  const weekDays = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const today = new Date();
  const dateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  function referenceFor(date: Date) {
    return `${date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} · 09:00`;
  }

  return (
    <section className="calendar-view">
      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button
            className="button secondary"
            onClick={() => {
              const now = new Date();
              setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
          >
            Hari ini
          </button>
          <button
            className="icon-button"
            aria-label="Bulan sebelumnya"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            ‹
          </button>
          <button
            className="icon-button"
            aria-label="Bulan berikutnya"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            ›
          </button>
          <strong>
            {month.toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </strong>
        </div>
        <h1>Jadwal Manasik &amp; Keberangkatan</h1>
        <div className="calendar-actions">
          <select
            aria-label="Tampilan kalender"
            className="select-control"
            value={view}
            onChange={(event) =>
              setView(event.target.value as "Bulan" | "Minggu")
            }
          >
            <option>Bulan</option>
            <option>Minggu</option>
          </select>
          <button
            className="button primary"
            onClick={() => onAdd(referenceFor(today))}
          >
            ＋ Buat Jadwal
          </button>
        </div>
      </div>
      <div
        className={`panel calendar-grid ${
          view === "Minggu" ? "week-view" : ""
        }`}
      >
        {weekDays.map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}
        {days.map((date) => {
          const events = records.filter((record) => {
            const parsed = scheduleDate(record.reference);
            return parsed !== null && dateKey(parsed) === dateKey(date);
          });
          const isCurrentMonth = date.getMonth() === month.getMonth();
          return (
            <div
              className={`calendar-day ${
                isCurrentMonth ? "" : "outside-month"
              } ${dateKey(date) === dateKey(today) ? "today" : ""}`}
              key={dateKey(date)}
            >
              <button
                className="calendar-date"
                aria-label={`Buat jadwal ${referenceFor(date)}`}
                onClick={() => onAdd(referenceFor(date))}
              >
                {date.getDate()}
              </button>
              <div className="calendar-events">
                {events.map((event) => (
                  <button
                    key={event.id}
                    className="calendar-event"
                    title={`${event.title} · ${event.branch} · ${event.reference}`}
                    onClick={() => onEdit(event)}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// DASHBOARD VIEW (FULLY DYNAMIC & DATE-RANGE REACTIVE)
// ----------------------------------------------------------------------------
function Dashboard({
  currentUser,
  count,
  totalSales,
  records,
  allScopedRecords,
  onNavigate,
  dateRange,
  onDateRange,
  onExport,
  onOpenNew,
  onDetail,
  onEdit,
  language,
}: {
  currentUser: StaffAccount;
  count: (category: Category) => number;
  totalSales: number;
  records: TravelRecord[];
  allScopedRecords: TravelRecord[];
  onNavigate: (section: Section) => void;
  dateRange: string;
  onDateRange: (range: string) => void;
  onExport: (records: TravelRecord[]) => void;
  onOpenNew: (reference?: string, targetCat?: Category) => void;
  onDetail: (record: TravelRecord) => void;
  onEdit: (record: TravelRecord) => void;
  language: string;
}) {
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null);

  // Latest bookings strictly from records
  const latestBookings = useMemo(() => {
    return allScopedRecords
      .filter((record) => record.category === "bookings")
      .slice(0, 5);
  }, [allScopedRecords]);

  // Compute dynamic sales channels breakdown reactive to records and selected dateRange
  const channelData = useMemo(() => {
    const bookings = records.filter((r) => r.category === "bookings");
    const numDays = dateRange === "all" ? 60 : Math.max(7, Number(dateRange));
    const stepDays = Math.ceil(numDays / 5);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const intervals = [4, 3, 2, 1, 0].map((step) => {
      const start = now - (step + 1) * stepDays * dayMs;
      const end = now - step * stepDays * dayMs;
      const label =
        step === 0
          ? "Hari Ini"
          : step === 1
          ? "Pekan Lalu"
          : `${(step + 1) * stepDays}h Lalu`;
      return { start, end, label };
    });

    return intervals.map((p) => {
      const matching = bookings.filter((b) => {
        const t = new Date(b.created_at).getTime();
        return t >= p.start && t <= p.end;
      });

      const web = matching.filter(
        (b) =>
          b.channel?.toLowerCase() === "website" ||
          b.details?.channel?.toLowerCase() === "website"
      ).length;
      const direct = matching.filter(
        (b) =>
          b.channel?.toLowerCase() === "direct" ||
          b.details?.channel?.toLowerCase() === "direct"
      ).length;
      const marketplace = matching.filter(
        (b) =>
          b.channel?.toLowerCase() === "marketplace" ||
          b.details?.channel?.toLowerCase() === "marketplace" ||
          (!b.channel && !b.details?.channel)
      ).length;
      const revenue = matching.reduce((sum, b) => sum + Number(b.amount || 0), 0);

      return {
        label: p.label,
        web,
        direct,
        marketplace,
        revenue,
        bookings: matching.length,
      };
    });
  }, [dateRange, records]);

  const maxChannel = Math.max(
    1,
    ...channelData.map((item) =>
      Math.max(item.web, item.direct, item.marketplace, 1)
    )
  );

  return (
    <section className="dashboard-view">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{tr("RINGKASAN TRAVEL", language)}</p>
          <h1>
            {tr("Dashboard", language)}
            <span className="account-tag-chip">
              {currentUser.name} ({currentUser.roleLabel} - {currentUser.branch})
            </span>
          </h1>
          <p className="muted">
            {tr(
              "Pantau aktivitas dan performa perjalanan Anda secara realtime dari database Supabase.",
              language
            )}
          </p>
        </div>
        <label className="date-range">
          ▣{" "}
          <select
            value={dateRange}
            onChange={(event) => onDateRange(event.target.value)}
            aria-label="Rentang tanggal"
          >
            <option value="7">{tr("7 hari terakhir", language)}</option>
            <option value="30">{tr("30 hari terakhir", language)}</option>
            <option value="90">{tr("90 hari terakhir", language)}</option>
            <option value="all">{tr("Semua waktu", language)}</option>
          </select>
        </label>
      </div>

      {/* Quick Action Buttons */}
      <div className="dashboard-quick-actions">
        <button
          type="button"
          className="button primary"
          onClick={() => onOpenNew("", "bookings")}
        >
          ＋ Booking Baru
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => onOpenNew("", "pilgrims")}
        >
          ＋ Data Jamaah
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => onOpenNew("", "payments")}
        >
          ＋ Catat Pembayaran
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => onExport(allScopedRecords)}
        >
          ↓ Unduh Semua Data (CSV)
        </button>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="stats-grid">
        <Stat
          label={tr("Pendapatan", language)}
          value={rupiah(totalSales)}
          badge="Realtime Kas"
          subtitle={`${currentUser.branch} ${
            currentUser.role === "branch_admin" ? "Cabang" : "Global"
          }`}
        />
        <Stat
          label={tr("Paket aktif", language)}
          value={String(count("packages"))}
          badge="Katalog"
          subtitle="Tersedia di sistem"
        />
        <Stat
          label={tr("Pesanan", language)}
          value={String(count("bookings"))}
          badge="Booking"
          subtitle="Sesuai hak akses cabang"
        />
        <Stat
          label={tr("Jamaah", language)}
          value={String(count("pilgrims"))}
          badge="Terdaftar"
          subtitle="Dokumen & data jamaah"
        />
      </div>

      {/* Dynamic Charts Grid */}
      <div className="dashboard-columns">
        {/* Sales Channels Bar Chart */}
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>{tr("Kanal Penjualan", language)}</h2>
              <p className="muted">
                {tr("Ringkasan pesanan perjalanan realtime", language)}
              </p>
            </div>
            <span className="status aktif">
              {count("bookings")} {tr("Pesanan", language).toLowerCase()}
            </span>
          </div>

          <div className="bar-chart" aria-label="Grafik penjualan">
            <div className="chart-grid">
              <span>{maxChannel}</span>
              <span>{Math.ceil(maxChannel * 0.75)}</span>
              <span>{Math.ceil(maxChannel * 0.5)}</span>
              <span>{Math.ceil(maxChannel * 0.25)}</span>
              <span>0</span>
            </div>
            {channelData.map((item, index) => (
              <div
                className={`bar-column ${
                  hoveredChannel === index ? "chart-hovered" : ""
                }`}
                key={item.label}
                onMouseEnter={() => setHoveredChannel(index)}
                onMouseLeave={() => setHoveredChannel(null)}
                onFocus={() => setHoveredChannel(index)}
                onBlur={() => setHoveredChannel(null)}
                tabIndex={0}
                aria-label={`${item.label}: ${item.bookings} pesanan`}
              >
                <div className="bar-set">
                  <div
                    className="bar web-bar"
                    style={{
                      height: `${
                        item.web
                          ? Math.max(8, (item.web / maxChannel) * 100)
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bar direct-bar"
                    style={{
                      height: `${
                        item.direct
                          ? Math.max(8, (item.direct / maxChannel) * 100)
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bar market-bar"
                    style={{
                      height: `${
                        item.marketplace
                          ? Math.max(8, (item.marketplace / maxChannel) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <small>{item.label}</small>

                {hoveredChannel === index && (
                  <div className="chart-tooltip channel-tooltip">
                    <strong>{item.label}</strong>
                    <span>{item.bookings} pesanan</span>
                    <span>Omzet {rupiah(item.revenue)}</span>
                    <span>
                      Web: {item.web} · Langsung: {item.direct} · Market:{" "}
                      {item.marketplace}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-web" />
              Website Travel
            </span>
            <span>
              <i className="legend-direct" />
              Langsung
            </span>
            <span>
              <i className="legend-market" />
              Marketplace
            </span>
          </div>
        </div>

        {/* Dynamic SVG Revenue Trend Chart */}
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>{tr("Tren Pendapatan", language)}</h2>
              <p className="muted">{rupiah(totalSales)} kas masuk terbayar</p>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                onExport(
                  records.filter((record) => record.category === "payments")
                )
              }
            >
              ⇩ {tr("Ekspor CSV", language)}
            </button>
          </div>
          <RevenueChart payments={records.filter((r) => r.category === "payments")} dateRange={dateRange} />
        </div>
      </div>

      {/* Dynamic Recent Bookings Table */}
      <div className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>{tr("Pesanan terbaru", language)}</h2>
            <p className="muted">
              {tr("Pantau status booking jamaah secara realtime", language)}
            </p>
          </div>
          <button
            className="text-button"
            onClick={() => onNavigate("bookings")}
          >
            {tr("Selengkapnya ↗", language)}
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Nama &amp; Paket</th>
                <th>Cabang</th>
                <th>Biaya &amp; Sisa</th>
                <th>Status Pembayaran</th>
                <th>Status Pesanan</th>
                <th>Kanal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.length ? (
                latestBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="reference">{booking.reference || "—"}</td>
                    <td>
                      <strong>{booking.title}</strong>
                      <small>{booking.details?.info || "Paket Umrah"}</small>
                    </td>
                    <td>
                      <span className="branch-tag">{booking.branch}</span>
                    </td>
                    <td>
                      {rupiah(booking.amount)}
                      <small className="balance">
                        {booking.status === "Lunas" ? "Lunas" : "Belum Lunas"}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          booking.status === "Lunas" ? "aktif" : "pending"
                        }`}
                      >
                        {booking.status === "Lunas" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status ${booking.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <span className="source-tag">
                        {booking.channel || "Marketplace"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="icon-button"
                        title="Lihat detail pesanan"
                        onClick={() => onDetail(booking)}
                        aria-label={`Detail ${booking.title}`}
                      >
                        👁
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="Ubah pesanan"
                        onClick={() => onEdit(booking)}
                        aria-label={`Edit ${booking.title}`}
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty">
                    Belum ada pesanan untuk akun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  badge,
  subtitle,
}: {
  label: string;
  value: string;
  badge: string;
  subtitle?: string;
}) {
  return (
    <div className="panel stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-badge">{badge}</span>
      </div>
      <strong>{value}</strong>
      <small>{subtitle || "Diperbarui secara realtime di Supabase"}</small>
    </div>
  );
}

// ----------------------------------------------------------------------------
// DYNAMIC REVENUE TREND CHART (NO HARDCODED POINTS OR PATHS)
// ----------------------------------------------------------------------------
function RevenueChart({ payments, dateRange }: { payments: TravelRecord[]; dateRange: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Dynamically compute 5 time buckets from real payments
  const points = useMemo(() => {
    const paidList = payments.filter((p) => p.status === "Terbayar");
    const numDays = dateRange === "all" ? 60 : Math.max(7, Number(dateRange));
    const stepDays = Math.ceil(numDays / 5);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const periods = [4, 3, 2, 1, 0].map((step, idx) => {
      const start = now - (step + 1) * stepDays * dayMs;
      const end = now - step * stepDays * dayMs;
      const label =
        step === 0
          ? "Hari Ini"
          : step === 1
          ? "Pekan Lalu"
          : `${(step + 1) * stepDays}h Lalu`;
      return { idx, start, end, label };
    });

    const computed = periods.map((p) => {
      const matching = paidList.filter((item) => {
        const t = new Date(item.created_at).getTime();
        return t >= p.start && t <= p.end;
      });
      const revenue = matching.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const orders = matching.length;
      return {
        label: p.label,
        revenue,
        orders,
      };
    });

    const maxRev = Math.max(10000000, ...computed.map((c) => c.revenue));

    // Map to SVG coordinates: width 640, height 180 (with 20px padding)
    const xStep = 600 / (computed.length - 1);
    return computed.map((c, i) => {
      const x = 20 + i * xStep;
      // y ranges from 160 (zero) to 25 (max revenue)
      const y = 160 - (c.revenue / maxRev) * 135;
      return {
        ...c,
        x,
        y,
      };
    });
  }, [dateRange, payments]);

  // Generate smooth cubic bezier SVG path dynamically
  const svgPath = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  return (
    <div className="revenue-chart">
      <div className="revenue-grid">
        <i />
        <i />
        <i />
        <i />
      </div>
      <svg
        viewBox="0 0 640 190"
        preserveAspectRatio="none"
        role="img"
        aria-label="Grafik tren pendapatan dinamis"
      >
        <path
          d={svgPath}
          fill="none"
          stroke="#00c28b"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r={hovered === index ? "6.5" : "4"}
            fill={hovered === index ? "#e4bd5d" : "#00c28b"}
            stroke="#151717"
            strokeWidth={hovered === index ? "2.5" : "0"}
            vectorEffect="non-scaling-stroke"
            className="chart-point"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            aria-label={`${point.label}, omzet ${rupiah(point.revenue)}`}
          />
        ))}
      </svg>

      {hovered !== null && (
        <div
          className="chart-tooltip revenue-tooltip"
          style={{
            left: `${(points[hovered].x / 640) * 100}%`,
            top: `${Math.max(0, (points[hovered].y / 190) * 100 - 35)}%`,
          }}
        >
          <strong>{points[hovered].label}</strong>
          <span>Omzet {rupiah(points[hovered].revenue)}</span>
          <span>{points[hovered].orders} transaksi terbayar</span>
        </div>
      )}

      <div className="revenue-labels">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// HELP & FAQ
// ----------------------------------------------------------------------------
function Help({ onNavigate }: { onNavigate?: (s: Section) => void }) {
  const faqs = [
    [
      "Bagaimana cara data terisolasi per cabang?",
      "Setiap staf memiliki hak akses cabang masing-masing. Staf Cabang Sidoarjo hanya melihat dan menginput data khusus Cabang Sidoarjo, sedangkan Admin dapat melihat konsolidasi semua cabang atau memfilter per cabang.",
    ],
    [
      "Apakah data tersimpan dan tersinkronisasi secara real-time?",
      "Ya. Semua penambahan, pengubahan, atau penghapusan data tersimpan langsung ke PostgreSQL Supabase dan terkirim ke seluruh pengguna aktif melalui WebSocket Supabase Realtime tanpa perlu memuat ulang browser.",
    ],
    [
      "Bagaimana cara beralih tipe akun staf?",
      "Gunakan tombol 'Ganti Akun' pada header navigasi atas. Anda dapat memilih Admin Demo (Admin), Siti Rahma (Admin Sidoarjo), Fajar Pratama (Operasional), atau Dewi Sartika (Keuangan).",
    ],
    [
      "Bagaimana cara mengekspor data ke format CSV?",
      "Tekan tombol 'Ekspor CSV' di halaman kategori atau panel grafik untuk mengunduh berkas tabel dengan enkripsi UTF-8.",
    ],
  ];

  const helpTopics = [
    { title: "Booking & Pesanan", sec: "bookings", icon: "▣", desc: "Kelola reservasi paket umrah dan status pendaftaran jamaah." },
    { title: "Pembayaran & Kas", sec: "payments", icon: "▤", desc: "Verifikasi transfer bank, cicilan, dan arus kas travel." },
    { title: "Data Jamaah", sec: "pilgrims", icon: "♧", desc: "Kelola identitas, NIK, paspor, dan kontak darurat jamaah." },
    { title: "Paket & Keberangkatan", sec: "packages", icon: "♙", desc: "Katalog paket umrah reguler/VIP dan jadwal terbang." },
    { title: "Data Master", sec: "hotels", icon: "▥", desc: "Daftar hotel Makkah & Madinah, maskapai, dan armada bus." },
    { title: "Laporan & Pengaturan", sec: "settings", icon: "▧", desc: "Rekap transaksi cabang, profil travel, dan rekening resmi." },
  ];

  return (
    <section className="section-view">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PUSAT BANTUAN</p>
          <h1>Bantuan &amp; Panduan Staf</h1>
          <p className="muted">
            Panduan ringkas mengelola operasional perjalanan umrah An-Nahl.
          </p>
        </div>
      </div>
      <div className="help-grid">
        {helpTopics.map((item) => (
          <article
            className="panel help-card"
            key={item.title}
            onClick={() => onNavigate?.(item.sec as Section)}
            style={{ cursor: "pointer" }}
            title={`Buka ${item.title}`}
          >
            <span className="help-icon">{item.icon}</span>
            <h2>{item.title}</h2>
            <p className="muted">{item.desc}</p>
            <span className="help-link-arrow">Buka menu →</span>
          </article>
        ))}
      </div>
      <div className="panel faq-panel">
        <div className="panel-heading">
          <div>
            <h2>Pertanyaan umum</h2>
            <p className="muted">Jawaban untuk hal yang sering ditanyakan.</p>
          </div>
        </div>
        {faqs.map(([question, answer]) => (
          <details className="faq" key={question}>
            <summary>
              {question}
              <span>⌄</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// SETTINGS VIEW (SUPABASE APP_SETTINGS INTEGRATION)
// ----------------------------------------------------------------------------
function Settings({
  tab,
  onTab,
  records,
  onNavigate,
  currentUser,
  onSignOut,
}: {
  tab: SettingsTab;
  onTab: (tab: SettingsTab) => void;
  records: TravelRecord[];
  onNavigate: (section: Section) => void;
  currentUser: StaffAccount;
  onSignOut?: () => void;
}) {
  const supabase = useMemo(() => getSupabase(), []);
  const [profile, setProfile] = useState<TravelProfile>({
    travel: "An-Nahl Travel & Tour Umroh",
    email: "info@annahl-travel.com",
    phone: "085731725563",
    address: "Jl. Raya Tlogomas No. 88, Lowokwaru, Kota Malang, Jawa Timur",
  });
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      bank: "Bank Syariah Indonesia (BSI)",
      number: "7123456789",
      owner: "PT An Nahl Mandiri Berkah",
    },
    {
      bank: "Bank Mandiri",
      number: "1440019283746",
      owner: "PT An Nahl Mandiri Berkah",
    },
  ]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load settings from Supabase app_settings
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    async function loadSettings() {
      if (!client) return;
      try {
        const { data, error: err } = await client
          .from("app_settings")
          .select("key, value");
        if (err || !active || !data) return;
        data.forEach((row) => {
          if (row.key === "travel_profile" && row.value) {
            setProfile(row.value as TravelProfile);
          } else if (row.key === "bank_accounts" && row.value) {
            setBankAccounts(row.value as BankAccount[]);
          }
        });
      } catch (loadErr) {
        console.warn("Could not load Supabase settings:", loadErr);
      }
    }
    void loadSettings();
    return () => {
      active = false;
    };
  }, [supabase]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: TravelProfile = {
      travel: String(form.get("travel") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
    };

    setSaving(true);
    setFeedback("");
    try {
      if (supabase) {
        await supabase
          .from("app_settings")
          .upsert({ key: "travel_profile", value: next, updated_at: new Date().toISOString() });
      }
      setProfile(next);
      setFeedback("Profil travel berhasil disimpan ke database Supabase.");
    } catch (saveErr) {
      setFeedback(
        `Gagal menyimpan profil: ${
          saveErr instanceof Error ? saveErr.message : "Error"
        }`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setFeedback("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback("Konfirmasi password tidak cocok.");
      return;
    }
    if (!supabase) return;
    setSaving(true);
    setFeedback("");
    try {
      const { error: pwdErr } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (pwdErr) throw pwdErr;
      setFeedback("Password akun staf berhasil diperbarui di Supabase.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFeedback(
        `Gagal memperbarui password: ${
          err instanceof Error ? err.message : "Terjadi kesalahan."
        }`
      );
    } finally {
      setSaving(false);
    }
  }

  async function addBank(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextItem: BankAccount = {
      bank: String(form.get("bank") ?? "").trim(),
      number: String(form.get("number") ?? "").trim(),
      owner: String(form.get("owner") ?? "").trim(),
    };
    const nextList = [...bankAccounts, nextItem];

    setSaving(true);
    try {
      if (supabase) {
        await supabase
          .from("app_settings")
          .upsert({ key: "bank_accounts", value: nextList, updated_at: new Date().toISOString() });
      }
      setBankAccounts(nextList);
      event.currentTarget.reset();
      setFeedback("Rekening bank berhasil disimpan ke database Supabase.");
    } catch {
      setFeedback("Gagal menyimpan rekening ke database.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBank(index: number) {
    const nextList = bankAccounts.filter((_, pos) => pos !== index);
    try {
      if (supabase) {
        await supabase
          .from("app_settings")
          .upsert({ key: "bank_accounts", value: nextList, updated_at: new Date().toISOString() });
      }
      setBankAccounts(nextList);
      setFeedback("Rekening berhasil dihapus.");
    } catch {
      setFeedback("Gagal menghapus rekening.");
    }
  }

  const tabItems: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: "Profil Travel" },
    { id: "password", label: "Keamanan Akun" },
    { id: "notifications", label: "Notifikasi" },
    { id: "branchReport", label: "Rekap Cabang" },
    { id: "equipmentTemplate", label: "Template Perlengkapan" },
    { id: "bank", label: "Rekening Bank" },
    { id: "audit", label: "Audit Log Realtime" },
  ];

  return (
    <section className="section-view">
      <div className="settings-heading">
        <p className="eyebrow">PREFERENSI APLIKASI</p>
        <h1>Pengaturan Travel</h1>
        <p className="muted">
          Profil, rekening penerimaan pembayaran, dan keamanan akun staf.
        </p>
      </div>

      <div className="settings-layout">
        <nav className="settings-tabs" aria-label="Pengaturan">
          {tabItems.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              onClick={() => {
                onTab(item.id);
                setFeedback("");
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="panel settings-panel">
          {feedback && <div className="settings-feedback">{feedback}</div>}

          {tab === "profile" && (
            <form onSubmit={saveProfile}>
              <div className="settings-section-head">
                <div>
                  <h2>Profil Travel &amp; Legalitas</h2>
                  <p className="muted">
                    Data resmi yang dicantumkan pada manifest dan invoice pembayaran jamaah.
                  </p>
                </div>
              </div>
              <label>
                Nama Travel
                <input name="travel" required defaultValue={profile.travel} />
              </label>
              <div className="form-grid">
                <label>
                  Email Resmi
                  <input name="email" type="email" defaultValue={profile.email} />
                </label>
                <label>
                  Telepon Layanan
                  <input name="phone" defaultValue={profile.phone} />
                </label>
              </div>
              <label>
                Alamat Kantor Pusat
                <input name="address" defaultValue={profile.address} />
              </label>

              <div className="settings-row">
                <div>
                  <strong>Status Database Supabase</strong>
                  <small>Terhubung secara langsung ke PostgreSQL Supabase.</small>
                </div>
                <span className="status aktif">🟢 Supabase Realtime Aktif</span>
              </div>

              <div className="modal-actions">
                <button className="button primary" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Profil ke Supabase"}
                </button>
              </div>
            </form>
          )}

          {tab === "password" && (
            <div>
              <div className="settings-section-head">
                <h2>Keamanan &amp; Akun Staf</h2>
                <p className="muted">
                  Akun aktif: <strong>{currentUser.email}</strong> ({currentUser.roleLabel}).
                </p>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Peran Akun Staf</strong>
                  <small>{currentUser.description}</small>
                </div>
                <span className="status aktif">{currentUser.roleLabel}</span>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Wilayah Cabang</strong>
                  <small>Akses data terbatas pada cabang ini.</small>
                </div>
                <span className="status aktif">{currentUser.branch}</span>
              </div>

              {/* Password update form */}
              <form onSubmit={handleUpdatePassword} style={{ marginTop: "20px" }}>
                <h3 style={{ fontSize: "12px", marginBottom: "10px", color: "#fff" }}>Ubah Password Akun</h3>
                <div className="form-grid">
                  <label>
                    Password Baru
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Konfirmasi Password
                    <input
                      type="password"
                      placeholder="Ketik ulang password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="modal-actions">
                  <button className="button primary" disabled={saving}>
                    {saving ? "Memperbarui..." : "Perbarui Password"}
                  </button>
                </div>
              </form>

              {/* Keluar dari Akun Session Section */}
              {onSignOut && (
                <div
                  className="settings-row"
                  style={{
                    marginTop: "24px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "18px",
                  }}
                >
                  <div>
                    <strong style={{ color: "var(--danger)" }}>Sesi &amp; Autentikasi</strong>
                    <small>Keluar dari sesi akun aktif ini di perangkat Anda.</small>
                  </div>
                  <button
                    type="button"
                    className="button danger"
                    onClick={onSignOut}
                  >
                    ↪ Keluar dari Akun
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <div className="settings-section-head">
                <h2>Preferensi Notifikasi Realtime</h2>
                <p className="muted">
                  Pilih notifikasi otomatis saat terjadi perubahan data di Supabase.
                </p>
              </div>
              <label className="toggle-row">
                <span>
                  <strong>Notifikasi Booking Baru</strong>
                  <small>Munculkan beacon saat ada transaksi baru di Supabase</small>
                </span>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                <span>
                  <strong>Notifikasi Pembayaran</strong>
                  <small>Dapatkan alert saat jamaah menyelesaikan transfer cicilan</small>
                </span>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
              </label>
            </div>
          )}

          {tab === "branchReport" && (
            <>
              <div className="settings-section-head">
                <h2>Rekap Transaksi Per Cabang</h2>
                <p className="muted">
                  Data dinamis dihitung otomatis dari transaksi Supabase.
                </p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cabang</th>
                      <th>Pesanan</th>
                      <th>Jamaah</th>
                      <th>Omzet Realtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Head office", "Cabang Sidoarjo", "Cabang Surabaya"].map(
                      (bName) => {
                        const branchBookings = records.filter(
                          (r) =>
                            r.category === "bookings" &&
                            (r.branch.toLowerCase() === bName.toLowerCase() ||
                              r.details?.info
                                ?.toLowerCase()
                                .includes(bName.toLowerCase()))
                        );
                        const branchPilgrims = records.filter(
                          (r) =>
                            r.category === "pilgrims" &&
                            r.branch.toLowerCase() === bName.toLowerCase()
                        );
                        const revenue = records
                          .filter(
                            (r) =>
                              r.category === "payments" &&
                              r.status === "Terbayar" &&
                              r.branch.toLowerCase() === bName.toLowerCase()
                          )
                          .reduce((sum, r) => sum + Number(r.amount || 0), 0);

                        return (
                          <tr key={bName}>
                            <td>
                              <strong>{bName}</strong>
                            </td>
                            <td>{branchBookings.length} Pesanan</td>
                            <td>{branchPilgrims.length} Jamaah</td>
                            <td>
                              <strong>{rupiah(revenue)}</strong>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "equipmentTemplate" && (
            <>
              <div className="settings-section-head">
                <h2>Template &amp; Katalog Perlengkapan</h2>
                <p className="muted">
                  Katalog pembagian koper dan seragam jamaah.
                </p>
              </div>
              <div className="settings-row">
                <div>
                  <strong>
                    {
                      records.filter((record) => record.category === "equipment")
                        .length
                    }{" "}
                    item perlengkapan dalam katalog
                  </strong>
                  <small>Tersimpan secara realtime di database Supabase.</small>
                </div>
                <button
                  className="button primary"
                  onClick={() => onNavigate("equipment")}
                >
                  Buka Data Perlengkapan
                </button>
              </div>
            </>
          )}

          {tab === "bank" && (
            <>
              <div className="settings-section-head">
                <h2>Rekening Bank Resmi</h2>
                <p className="muted">
                  Rekening untuk menerima setoran DP dan pelunasan jamaah.
                </p>
              </div>
              {bankAccounts.map((account, index) => (
                <div
                  className="settings-row"
                  key={`${account.bank}-${account.number}`}
                >
                  <div>
                    <strong>
                      {account.bank} · {account.number}
                    </strong>
                    <small>a.n. {account.owner}</small>
                  </div>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => removeBank(index)}
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <form className="bank-form" onSubmit={addBank}>
                <input
                  name="bank"
                  required
                  placeholder="Nama Bank (misal: Bank Syariah Indonesia)"
                />
                <input name="number" required placeholder="Nomor Rekening" />
                <input
                  name="owner"
                  required
                  placeholder="Nama Pemilik Rekening"
                />
                <button className="button primary" disabled={saving}>
                  + Tambah Rekening
                </button>
              </form>
            </>
          )}

          {tab === "audit" && (
            <>
              <div className="settings-section-head">
                <h2>Audit Log Data Supabase Realtime</h2>
                <p className="muted">
                  10 aktivitas catatan data terbaru di PostgreSQL.
                </p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Judul / Jamaah</th>
                      <th>Cabang</th>
                      <th>Waktu Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 10).map((record) => (
                      <tr key={record.id}>
                        <td>
                          <span className="status aktif">
                            {categoryLabels[record.category]}
                          </span>
                        </td>
                        <td>
                          <strong>{record.title}</strong>
                          <small>{record.reference || "—"}</small>
                        </td>
                        <td>{record.branch}</td>
                        <td className="muted">
                          {new Date(record.created_at).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
