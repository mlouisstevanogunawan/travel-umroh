const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.shgbbwevvislnfqswutc:sayangnia1122@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

async function seed() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  // Run schema creation
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

    CREATE TABLE IF NOT EXISTS public.app_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE public.travel_records ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public access on travel_records" ON public.travel_records;
    CREATE POLICY "Public access on travel_records" ON public.travel_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access on app_settings" ON public.app_settings;
    CREATE POLICY "Public access on app_settings" ON public.app_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

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
  `);

  console.log('Database tables and realtime publication configured successfully.');
  await client.end();
}

seed().catch(console.error);
