-- WARNING: This schema is for context only and is not meant to be run blindly.
-- Table order and constraints may not be valid for direct execution in all environments.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.ledgers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  entity_name text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type = ANY (ARRAY['CUSTOMER'::text, 'VENDOR'::text])),
  product text NOT NULL,
  total_value numeric NOT NULL,
  amount_paid numeric NOT NULL,
  remaining_due numeric NOT NULL,
  last_payment_date date,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ledgers_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.production_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  raw_material_kg numeric NOT NULL,
  working_fee_rs numeric NOT NULL,
  pindi_produced_kg numeric NOT NULL,
  pindi_sold_kg numeric NOT NULL,
  pindi_rate_rs numeric NOT NULL,
  total_daily_revenue numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  payment_method text,
  price numeric,
  pindi_total_rs numeric,
  power_kwh numeric,
  power_cost numeric,
  CONSTRAINT production_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  username text,
  role text CHECK (role = ANY (ARRAY['ADMIN'::text, 'OPERATOR'::text, 'SUPER_ADMIN'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.shop_inventory (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_name text NOT NULL,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total_investment numeric NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT shop_inventory_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['INCOME'::text, 'EXPENSE'::text])),
  category text NOT NULL,
  payment_method text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.utility_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  kvah_old numeric NOT NULL,
  kvah_new numeric NOT NULL,
  units_consumed numeric NOT NULL,
  calculated_cost numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT utility_logs_pkey PRIMARY KEY (id)
);

-- Note: Policies, triggers and RLS setup are intentionally omitted from this context-only file.
-- Use db/schema.sql (idempotent migration) to apply policies and triggers safely.
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text,
  role text check (role in ('ADMIN', 'OPERATOR')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Production Logs
create table if not exists public.production_logs (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  raw_material_kg numeric not null,
  working_fee_rs numeric not null,
  pindi_produced_kg numeric not null,
  pindi_sold_kg numeric not null,
  pindi_rate_rs numeric not null,
  total_daily_revenue numeric not null,
  payment_method text,
  price numeric,
  pindi_total_rs numeric,
  power_kwh numeric,
  power_cost numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shop Inventory
create table if not exists public.shop_inventory (
  id uuid default uuid_generate_v4() primary key,
  product_name text not null,
  quantity numeric not null,
  unit_price numeric not null,
  total_investment numeric not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  amount numeric not null,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  category text not null,
  payment_method text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ledgers
create table if not exists public.ledgers (
  id uuid default uuid_generate_v4() primary key,
  entity_name text not null,
  entity_type text not null check (entity_type in ('CUSTOMER', 'VENDOR')),
  product text not null,
  total_value numeric not null,
  amount_paid numeric not null,
  remaining_due numeric not null,
  last_payment_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Utility Logs
create table if not exists public.utility_logs (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  kvah_old numeric not null,
  kvah_new numeric not null,
  units_consumed numeric not null,
  calculated_cost numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table if exists public.profiles enable row level security;
alter table if exists public.production_logs enable row level security;
alter table if exists public.shop_inventory enable row level security;
alter table if exists public.transactions enable row level security;
alter table if exists public.ledgers enable row level security;
alter table if exists public.utility_logs enable row level security;

-- Policies
-- Admin has full access
create policy "Admin has full access to profiles" on profiles for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin has full access to production_logs" on production_logs for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin has full access to shop_inventory" on shop_inventory for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin has full access to transactions" on transactions for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin has full access to ledgers" on ledgers for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));
create policy "Admin has full access to utility_logs" on utility_logs for all using (auth.uid() in (select id from profiles where role = 'ADMIN'));

-- Authenticated users can read
create policy "Authenticated users can read all profiles" on profiles for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read all logs" on production_logs for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read all inventory" on shop_inventory for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read all transactions" on transactions for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read all ledgers" on ledgers for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read all utility_logs" on utility_logs for select using (auth.role() = 'authenticated');

-- Allow insert for authenticated users (can be restricted later)
create policy "Enable insert for authenticated users: production_logs" on production_logs for insert with check (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users: shop_inventory" on shop_inventory for insert with check (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users: transactions" on transactions for insert with check (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users: ledgers" on ledgers for insert with check (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users: utility_logs" on utility_logs for insert with check (auth.role() = 'authenticated');

-- Handle Profile creation trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (new.id, new.email, 'OPERATOR'); -- Default to OPERATOR
  return new;
end;
$$ language plpgsql security definer;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end$$;

-- Verify columns (example query you can run manually):
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'production_logs';
