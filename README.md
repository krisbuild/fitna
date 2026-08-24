# Zuri

An AI nutrition and fitness app built first for Nigerians and Africans —
a personal nutrition coach and Nigerian healthy cookbook in one, with an
architecture designed to expand globally.

## The idea

Zuri doesn't use "phases" or "diets" — it uses **Seasons**:

- **Lean Season** — a gentle calorie deficit, high protein and fibre, for weight loss.
- **Build Season** — a calorie surplus with dense, protein-rich meals, for healthy weight gain.
- **Balance Season** — steady maintenance eating for healthy living, no extremes.
- **Forge Season** — calories near maintenance with protein pushed high, for muscle building.

Onboarding is a short, friendly log (not a form) that collects what actually
personalizes the app: body stats (with BMI shown back to the user), activity
level and gym habits, a Season/goal, food preferences (dietary pattern,
favourites, exclusions — all skippable, mostly tap-not-type), and a feeding
budget style. All of it lives on the `Profile` and is editable later from
Settings. It intentionally doesn't yet feed into Meal Script/Coach
recommendations — that personalization layer is a deliberate next step.

Everything in the app reshapes around the user's Season:

- **The Plate** — daily food log, built on a Nigerian/West African food database (jollof, egusi, moi moi, suya, amala, etc.) with real local portions, plus custom food entry.
- **Meal Script** — an AI-generated daily meal plan built from the user's Season and Fuel Target (calorie target), with a deterministic rule-based fallback so it works even without an AI key.
- **The Kitchen** — a cookbook of healthier takes on classic Nigerian dishes (grilled instead of fried, portioned instead of guessed), tagged by Season.
- **Journey** — weight trend and progress tracking.
- **Coach** — an AI chat coach grounded in Nigerian food and the user's own targets, with a rule-based fallback for offline/no-API-key use.

## Architecture

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, mobile-first/PWA — installs like an app on phones, no app-store gate.
- **Pluggable data layer** (`lib/data/adapter.ts`): the whole app talks to a single `DataAdapter` interface, with two implementations:
  - `LocalAdapter` — stores everything in `localStorage`. Zero config, works immediately, no backend required. This is what you get out of the box.
  - `SupabaseAdapter` — real accounts and Postgres persistence via Supabase, RLS-scoped per user. Swaps in automatically the moment Supabase env vars are set (see below).
- **Cuisine-pack shaped data** (`data/foods.ts`, `data/recipes.ts`, `supabase/migrations/0001_init.sql`): food and recipe records carry a `region` field and aren't hardcoded to Nigeria structurally, so additional regional packs (Ghana, Kenya, etc.) or a non-African pack can be added later without schema changes.
- **AI layer** (`lib/ai/`): builds prompts for Claude (Meal Script generation + Coach chat) and includes a deterministic rule-based fallback for both, so the product is fully functional with or without an `ANTHROPIC_API_KEY`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the app works immediately in **local demo mode**:
onboarding creates a profile in your browser's `localStorage`, no account needed.
This is the fastest way to try it.

## Going to production (real backend + AI)

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

- **Supabase (accounts + persistence across devices)**
  1. Create a project at supabase.com.
  2. Run `supabase/migrations/0001_init.sql` in the SQL editor (sets up tables + row-level security).
  3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  4. Seed the shared foods/recipes reference tables:
     ```bash
     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
     ```
  5. The app now uses real auth (`/login`, `/signup`) and Postgres instead of `localStorage`.

- **Claude (AI Meal Scripts + Coach)**
  - Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`, default `claude-sonnet-5`).
  - Without it, Meal Script generation and Coach replies use the built-in rule-based generator instead — the app still works end to end.

## Project structure

```
app/                 Next.js routes (App Router)
  (app)/              Authenticated app shell: dashboard, plate, kitchen, journey, coach, settings
  api/                 API routes: meal-script generation, coach chat
  onboarding/          Onboarding wizard
  login/, signup/      Supabase auth (only active once Supabase is configured)
components/          Shared UI: nav shell, icons, progress ring, macro bars
data/                Nigerian/West African food + recipe reference datasets
lib/
  ai/                  Prompt building + rule-based fallbacks for Meal Script and Coach
  data/                DataAdapter interface + local/Supabase implementations
  nutrition.ts         BMR/TDEE/macro target calculations (Mifflin-St Jeor)
  types.ts             Domain types + the Season system
supabase/migrations/  SQL schema + row-level security policies
scripts/              Seed script for the shared foods/recipes tables
```

## Known follow-ups

- `npm audit` flags several Next.js advisories that are only fixed in the
  Next.js 16 major line; upgrading is a deliberate breaking-change migration
  (React 19, App Router changes) intentionally left for a dedicated follow-up
  rather than bundled into this build.
- Supabase auth pages (`/login`, `/signup`) are implemented but only
  exercised once a real Supabase project is connected — local demo mode is
  the primary tested path in this environment.
- The rich onboarding data (diet pattern, exclusions, favourites, budget
  style, gym habits) is collected and persisted but not yet used by Meal
  Script generation or Coach chat — the recommendation logic that reads
  from it is a planned next step.
- The Kitchen's recipe seed data doesn't yet tag anything for Forge
  Season, so its filter can come up empty there until the real cookbook
  content is dropped in.
