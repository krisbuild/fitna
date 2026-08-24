-- Zuri profile enrichment: goal type expansion + lifestyle/food-preference/
-- budget fields collected during onboarding.

-- Season gains a 4th value: 'forge' (muscle-building / high-protein).
alter table profiles drop constraint if exists profiles_season_check;
alter table profiles add constraint profiles_season_check
  check (season in ('lean', 'build', 'balance', 'forge'));

alter table profiles add column if not exists works_out boolean not null default false;
alter table profiles add column if not exists workout_days_per_week int;
alter table profiles add constraint profiles_workout_days_check
  check (workout_days_per_week is null or workout_days_per_week between 0 and 7);

alter table profiles add column if not exists diet_pattern text not null default 'none';
alter table profiles add constraint profiles_diet_pattern_check
  check (diet_pattern in ('none', 'vegetarian', 'pescatarian', 'vegan', 'halal', 'no_pork', 'no_beef'));

alter table profiles add column if not exists excluded_foods text[] not null default '{}';
alter table profiles add column if not exists favorite_food_ids text[] not null default '{}';

alter table profiles add column if not exists budget_style text not null default 'balanced';
alter table profiles add constraint profiles_budget_style_check
  check (budget_style in ('conservative', 'balanced', 'splurge'));

alter table profiles add column if not exists weekly_food_budget_naira numeric;

-- meal_scripts.season needs the same 4th value.
alter table meal_scripts drop constraint if exists meal_scripts_season_check;
alter table meal_scripts add constraint meal_scripts_season_check
  check (season in ('lean', 'build', 'balance', 'forge'));
