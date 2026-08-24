// Seeds the shared `foods` and `recipes` reference tables in Supabase
// from the TypeScript datasets in /data, so the app has content the
// moment a real backend is connected.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
//
// Requires the service role key (not the anon key) because it bypasses
// RLS to write to the shared reference tables.

import { createClient } from "@supabase/supabase-js";
import { FOODS } from "../data/foods";
import { RECIPES } from "../data/recipes";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const foodRows = FOODS.map((f) => ({
    id: f.id,
    name: f.name,
    name_local: f.nameLocal ?? null,
    category: f.category,
    region: f.region,
    serving_label: f.servingLabel,
    serving_grams: f.servingGrams,
    calories: f.calories,
    protein_g: f.proteinG,
    carbs_g: f.carbsG,
    fat_g: f.fatG,
    fiber_g: f.fiberG ?? null,
    tags: f.tags ?? [],
  }));

  const { error: foodsError } = await supabase
    .from("foods")
    .upsert(foodRows, { onConflict: "id" });
  if (foodsError) throw new Error(`Seeding foods failed: ${foodsError.message}`);
  console.log(`Seeded ${foodRows.length} foods.`);

  const recipeRows = RECIPES.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    seasons: r.seasons,
    region: r.region,
    emoji: r.emoji,
    prep_minutes: r.prepMinutes,
    cook_minutes: r.cookMinutes,
    servings: r.servings,
    calories_per_serving: r.caloriesPerServing,
    protein_g: r.proteinG,
    carbs_g: r.carbsG,
    fat_g: r.fatG,
    ingredients: r.ingredients,
    steps: r.steps,
    tags: r.tags,
  }));

  const { error: recipesError } = await supabase
    .from("recipes")
    .upsert(recipeRows, { onConflict: "id" });
  if (recipesError)
    throw new Error(`Seeding recipes failed: ${recipesError.message}`);
  console.log(`Seeded ${recipeRows.length} recipes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
