-- Unified, idempotent schema for Aadya Meenakshi Oil Mill
-- Safe to run multiple times; policies and triggers are wrapped to avoid duplicates.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username text,
  role text CHECK (role IN ('ADMIN','OPERATOR','SUPER_ADMIN')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Production Logs
CREATE TABLE IF NOT EXISTS public.production_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date date NOT NULL,
  raw_material_kg numeric NOT NULL,
  working_fee_rs numeric NOT NULL,
  pindi_produced_kg numeric NOT NULL,
  pindi_sold_kg numeric NOT NULL,
  pindi_rate_rs numeric NOT NULL,
  total_daily_revenue numeric NOT NULL,
  payment_method text,
  price numeric,
  pindi_total_rs numeric,
  power_kwh numeric,
  power_cost numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shop Inventory
CREATE TABLE IF NOT EXISTS public.shop_inventory (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_name text NOT NULL,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total_investment numeric NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date date NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('INCOME','EXPENSE')),
  category text NOT NULL,
  payment_method text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ledgers
CREATE TABLE IF NOT EXISTS public.ledgers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_name text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('CUSTOMER','VENDOR')),
  product text NOT NULL,
  total_value numeric NOT NULL,
  amount_paid numeric NOT NULL,
  remaining_due numeric NOT NULL,
  last_payment_date date,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Utility Logs
CREATE TABLE IF NOT EXISTS public.utility_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date date NOT NULL,
  kvah_old numeric NOT NULL,
  kvah_new numeric NOT NULL,
  units_consumed numeric NOT NULL,
  calculated_cost numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.production_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shop_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.utility_logs ENABLE ROW LEVEL SECURITY;

-- Policies (wrapped to be idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to profiles') THEN
    CREATE POLICY "Admin has full access to profiles" ON public.profiles FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to production_logs') THEN
    CREATE POLICY "Admin has full access to production_logs" ON public.production_logs FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to shop_inventory') THEN
    CREATE POLICY "Admin has full access to shop_inventory" ON public.shop_inventory FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to transactions') THEN
    CREATE POLICY "Admin has full access to transactions" ON public.transactions FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to ledgers') THEN
    CREATE POLICY "Admin has full access to ledgers" ON public.ledgers FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin has full access to utility_logs') THEN
    CREATE POLICY "Admin has full access to utility_logs" ON public.utility_logs FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ADMIN'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all profiles') THEN
    CREATE POLICY "Authenticated users can read all profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all logs') THEN
    CREATE POLICY "Authenticated users can read all logs" ON public.production_logs FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all inventory') THEN
    CREATE POLICY "Authenticated users can read all inventory" ON public.shop_inventory FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all transactions') THEN
    CREATE POLICY "Authenticated users can read all transactions" ON public.transactions FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all ledgers') THEN
    CREATE POLICY "Authenticated users can read all ledgers" ON public.ledgers FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read all utility_logs') THEN
    CREATE POLICY "Authenticated users can read all utility_logs" ON public.utility_logs FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users: production_logs') THEN
    CREATE POLICY "Enable insert for authenticated users: production_logs" ON public.production_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users: shop_inventory') THEN
    CREATE POLICY "Enable insert for authenticated users: shop_inventory" ON public.shop_inventory FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users: transactions') THEN
    CREATE POLICY "Enable insert for authenticated users: transactions" ON public.transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users: ledgers') THEN
    CREATE POLICY "Enable insert for authenticated users: ledgers" ON public.ledgers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users: utility_logs') THEN
    CREATE POLICY "Enable insert for authenticated users: utility_logs" ON public.utility_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

-- Handle Profile creation trigger (idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (NEW.id, NEW.email, 'OPERATOR')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END$$;

-- Example verification query (run manually if desired):
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'production_logs';
