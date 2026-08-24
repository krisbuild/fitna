"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useZuri } from "@/lib/data/context";
import { Recipe, SEASONS } from "@/lib/types";
import { todayDateString } from "@/lib/nutrition";
import { IconClock } from "@/components/icons";

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { adapter } = useZuri();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null | "loading">("loading");
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (!adapter) return;
    adapter.getRecipeBySlug(slug).then((r) => setRecipe(r ?? null));
  }, [adapter, slug]);

  async function logThisMeal() {
    if (!adapter || recipe === "loading" || !recipe) return;
    setLogging(true);
    const h = new Date().getHours();
    const mealType = h < 11 ? "breakfast" : h < 16 ? "lunch" : h < 21 ? "dinner" : "snack";
    await adapter.addFoodLog({
      foodId: null,
      name: recipe.title,
      servingLabel: "1 serving",
      quantity: 1,
      mealType,
      calories: recipe.caloriesPerServing,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      plateDate: todayDateString(),
    });
    router.push("/dashboard");
  }

  if (recipe === "loading") return null;
  if (!recipe)
    return <p className="text-ink-muted">Recipe not found.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.seasons.map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${SEASONS[s].color}1A`,
                color: SEASONS[s].color,
              }}
            >
              {SEASONS[s].name}
            </span>
          ))}
        </div>
        <span className="text-4xl">{recipe.emoji}</span>
        <h1 className="font-display text-3xl font-semibold text-ink mt-3">
          {recipe.title}
        </h1>
        <p className="text-ink-soft mt-2 leading-relaxed">
          {recipe.description}
        </p>
      </div>

      <div className="card p-5 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div>
          <div className="text-xs text-ink-muted flex items-center justify-center gap-1">
            <IconClock className="h-3.5 w-3.5" /> Time
          </div>
          <div className="font-semibold mt-1">
            {recipe.prepMinutes + recipe.cookMinutes}m
          </div>
        </div>
        <div>
          <div className="text-xs text-ink-muted">Serves</div>
          <div className="font-semibold mt-1">{recipe.servings}</div>
        </div>
        <div>
          <div className="text-xs text-ink-muted">Kcal</div>
          <div className="font-semibold mt-1">{recipe.caloriesPerServing}</div>
        </div>
        <div>
          <div className="text-xs text-ink-muted">Protein</div>
          <div className="font-semibold mt-1">{recipe.proteinG}g</div>
        </div>
        <div className="hidden sm:block">
          <div className="text-xs text-ink-muted">Carbs / Fat</div>
          <div className="font-semibold mt-1">
            {recipe.carbsG}g / {recipe.fatG}g
          </div>
        </div>
      </div>

      <button
        className="btn-primary w-full sm:w-auto"
        onClick={logThisMeal}
        disabled={logging}
      >
        {logging ? "Adding to Plate…" : "Log this meal to today's Plate"}
      </button>

      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-3">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-clay-500 mt-2 shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-3">
          Method
        </h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-soft">
              <span className="font-display font-semibold text-clay-500 shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
