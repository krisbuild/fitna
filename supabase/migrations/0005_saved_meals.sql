-- Meal Inspo: lets a user save a suggested meal (AI-generated or matched
-- from the Kitchen dataset via ingredients they had on hand) so they can
-- cook it again without re-entering the same ingredients.

create table if not exists saved_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null,
  emoji text not null default '🍲',
  season text not null check (season in ('shred', 'build', 'glow')),
  used_ingredients text[] not null default '{}',
  prep_minutes int not null,
  cook_minutes int not null,
  servings int not null,
  calories_per_serving numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  ingredients jsonb not null,
  steps jsonb not null,
  source text not null default 'ai' check (source in ('ai', 'rule')),
  created_at timestamptz not null default now()
);

create index if not exists saved_meals_user_idx on saved_meals (user_id, created_at);

alter table saved_meals enable row level security;

create policy "saved_meals: read own" on saved_meals for select using (auth.uid() = user_id);
create policy "saved_meals: write own" on saved_meals for insert with check (auth.uid() = user_id);
create policy "saved_meals: delete own" on saved_meals for delete using (auth.uid() = user_id);
