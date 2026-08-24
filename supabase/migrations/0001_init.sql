-- Zuri initial schema
-- Run this in your Supabase project's SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- One row per authenticated user, keyed to auth.users.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  sex text not null check (sex in ('male', 'female')),
  age int not null check (age between 13 and 100),
  height_cm numeric not null,
  weight_kg numeric not null,
  target_weight_kg numeric,
  activity_level text not null check (
    activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')
  ),
  season text not null check (season in ('lean', 'build', 'balance')),
  fuel_target int not null,
  protein_target_g int not null,
  carbs_target_g int not null,
  fat_target_g int not null,
  locale text not null default 'NG',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Shared, region-taggable food reference database. Not user-scoped.
-- Designed so additional cuisine/region packs can be inserted later
-- without any schema change.
create table if not exists foods (
  id text primary key,
  name text not null,
  name_local text,
  category text not null,
  region text not null default 'Nationwide',
  serving_label text not null,
  serving_grams numeric not null,
  calories numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  fiber_g numeric,
  tags text[] default '{}',
  is_verified boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists foods_name_search_idx on foods using gin (to_tsvector('simple', name || ' ' || coalesce(name_local, '')));

-- A user's daily food log entries ("The Plate").
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id text references foods (id),
  name text not null,
  serving_label text not null,
  quantity numeric not null default 1,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  calories numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  plate_date date not null default current_date,
  logged_at timestamptz not null default now()
);

create index if not exists food_logs_user_date_idx on food_logs (user_id, plate_date);

create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric not null,
  logged_at timestamptz not null default now()
);

create index if not exists weight_logs_user_idx on weight_logs (user_id, logged_at);

-- The Kitchen: cookbook recipes, shared and season-tagged.
create table if not exists recipes (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  seasons text[] not null,
  region text not null default 'Nationwide',
  emoji text not null default '🍲',
  prep_minutes int not null,
  cook_minutes int not null,
  servings int not null,
  calories_per_serving numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  ingredients jsonb not null,
  steps jsonb not null,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

-- AI-generated (or rule-based) daily Meal Scripts.
create table if not exists meal_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  script_date date not null default current_date,
  season text not null check (season in ('lean', 'build', 'balance')),
  meals jsonb not null,
  source text not null default 'ai' check (source in ('ai', 'rule')),
  created_at timestamptz not null default now(),
  unique (user_id, script_date)
);

create table if not exists coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'coach')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists coach_messages_user_idx on coach_messages (user_id, created_at);

-- Row Level Security: users may only ever touch their own rows.
alter table profiles enable row level security;
alter table food_logs enable row level security;
alter table weight_logs enable row level security;
alter table meal_scripts enable row level security;
alter table coach_messages enable row level security;
alter table foods enable row level security;
alter table recipes enable row level security;

create policy "profiles: read own" on profiles for select using (auth.uid() = id);
create policy "profiles: write own" on profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

create policy "food_logs: read own" on food_logs for select using (auth.uid() = user_id);
create policy "food_logs: write own" on food_logs for insert with check (auth.uid() = user_id);
create policy "food_logs: delete own" on food_logs for delete using (auth.uid() = user_id);

create policy "weight_logs: read own" on weight_logs for select using (auth.uid() = user_id);
create policy "weight_logs: write own" on weight_logs for insert with check (auth.uid() = user_id);

create policy "meal_scripts: read own" on meal_scripts for select using (auth.uid() = user_id);
create policy "meal_scripts: write own" on meal_scripts for insert with check (auth.uid() = user_id);
create policy "meal_scripts: update own" on meal_scripts for update using (auth.uid() = user_id);

create policy "coach_messages: read own" on coach_messages for select using (auth.uid() = user_id);
create policy "coach_messages: write own" on coach_messages for insert with check (auth.uid() = user_id);

-- foods and recipes are shared reference data: readable by any signed-in user.
create policy "foods: read all" on foods for select using (auth.role() = 'authenticated');
create policy "recipes: read all" on recipes for select using (auth.role() = 'authenticated');
