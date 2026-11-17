-- ========================================================
-- AN-NAHL TRAVEL UMROH - SUPABASE DATABASE SCHEMA
-- ========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Travel Records Table
CREATE TABLE IF NOT EXISTS public.travel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  reference TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Aktif',
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  branch TEXT NOT NULL DEFAULT 'Head office',
  role_target TEXT NOT NULL DEFAULT 'all',
  channel TEXT NOT NULL DEFAULT 'Marketplace',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraint for categories
ALTER TABLE public.travel_records
  DROP CONSTRAINT IF EXISTS travel_records_category_check;

ALTER TABLE public.travel_records
  ADD CONSTRAINT travel_records_category_check CHECK (category IN (
    'bookings', 'pilgrims', 'payments', 'packages', 'hotels',
    'agents', 'branches', 'departures', 'transport', 'commissions',
    'equipment', 'installments', 'documents', 'manifest', 'deposits',
    'airlines', 'vendors'
  ));

CREATE INDEX IF NOT EXISTS travel_records_category_created_idx
  ON public.travel_records (category, created_at DESC);

CREATE INDEX IF NOT EXISTS travel_records_branch_idx
  ON public.travel_records (branch);

CREATE INDEX IF NOT EXISTS travel_records_status_idx
  ON public.travel_records (status);

-- 2. App Settings Table (Travel Profile, Bank Accounts, etc.)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Row Level Security Policies
ALTER TABLE public.travel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access on travel_records" ON public.travel_records;
CREATE POLICY "Public access on travel_records"
  ON public.travel_records
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on app_settings" ON public.app_settings;
CREATE POLICY "Public access on app_settings"
  ON public.app_settings
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Enable Supabase Realtime Publication
ALTER TABLE public.travel_records REPLICA IDENTITY FULL;
ALTER TABLE public.app_settings REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'travel_records'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.travel_records;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'app_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;
  END IF;
END $$;
