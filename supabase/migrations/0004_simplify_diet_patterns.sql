-- Drops Halal and Pescatarian as dietary-pattern options — they need
-- context most users don't have on a fast onboarding tap-through, and
-- neither maps cleanly onto a simple "what won't you eat" model. Anyone
-- previously on one of these falls back to "none"; the exclusions field
-- remains the place for anything specific (e.g. "pork", "shellfish").
--
-- Safe to run even if 0001/0002/0003 were already applied to a live
-- project with real data.

update profiles set diet_pattern = 'none' where diet_pattern in ('halal', 'pescatarian');

alter table profiles drop constraint if exists profiles_diet_pattern_check;
alter table profiles add constraint profiles_diet_pattern_check
  check (diet_pattern in ('none', 'vegetarian', 'vegan', 'no_pork', 'no_beef'));
