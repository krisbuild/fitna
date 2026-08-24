-- Zuri "Modes" rename: Lean/Build/Balance/Forge Seasons become
-- Shred/Build/Glow Modes (Forge merges into Build).
--
-- Remaps any existing rows before tightening the check constraints, so
-- this is safe to run even if 0001/0002 were already applied to a live
-- project with real data.

update profiles set season = 'shred' where season = 'lean';
update profiles set season = 'build' where season = 'forge';
update profiles set season = 'glow' where season = 'balance';

update meal_scripts set season = 'shred' where season = 'lean';
update meal_scripts set season = 'build' where season = 'forge';
update meal_scripts set season = 'glow' where season = 'balance';

-- Remap and de-duplicate in one pass (forge and build could otherwise
-- collide into two 'build' entries on the same row).
update recipes
set seasons = (
  select array_agg(distinct mapped)
  from unnest(seasons) as original
  cross join lateral (
    select case original
      when 'lean' then 'shred'
      when 'forge' then 'build'
      when 'balance' then 'glow'
      else original
    end as mapped
  ) m
);

alter table profiles drop constraint if exists profiles_season_check;
alter table profiles add constraint profiles_season_check
  check (season in ('shred', 'build', 'glow'));

alter table meal_scripts drop constraint if exists meal_scripts_season_check;
alter table meal_scripts add constraint meal_scripts_season_check
  check (season in ('shred', 'build', 'glow'));
