"use client";

import { useCallback, useEffect, useState } from "react";
import { useZuri } from "@/lib/data/context";
import { MealScript, Profile, SEASONS } from "@/lib/types";
import { todayDateString } from "@/lib/nutrition";
import { IconCheck, IconFlame } from "@/components/icons";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default function MealScriptPage() {
  const { adapter } = useZuri();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [script, setScript] = useState<MealScript | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loggedMeals, setLoggedMeals] = useState<Set<number>>(new Set());
  const date = todayDateString();

  const load = useCallback(async () => {
    if (!adapter) return;
    const [p, s] = await Promise.all([
      adapter.getProfile(),
      adapter.getMealScriptForDate(date),
    ]);
    setProfile(p);
    setScript(s);
  }, [adapter, date]);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    if (!adapter || !profile) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/meal-script", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          season: profile.season,
          fuelTarget: profile.fuelTarget,
          proteinTargetG: profile.proteinTargetG,
          carbsTargetG: profile.carbsTargetG,
          fatTargetG: profile.fatTargetG,
        }),
      });
      const data = await res.json();
      const saved = await adapter.saveMealScript({
        date,
        season: profile.season,
        meals: data.meals,
        source: data.source,
      });
      setScript(saved);
      setLoggedMeals(new Set());
    } finally {
      setGenerating(false);
    }
  }

  async function logMeal(index: number) {
    if (!adapter || !script) return;
    const meal = script.meals[index];
    await adapter.addFoodLog({
      foodId: null,
      name: meal.title,
      servingLabel: "1 serving",
      quantity: 1,
      mealType: meal.mealType,
      calories: meal.calories,
      proteinG: meal.proteinG,
      carbsG: meal.carbsG,
      fatG: meal.fatG,
      plateDate: date,
    });
    setLoggedMeals((prev) => new Set(prev).add(index));
  }

  if (!profile) return null;
  const seasonInfo = SEASONS[profile.season];
  const totalCalories =
    script?.meals.reduce((sum, m) => sum + m.calories, 0) ?? 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="label-caps" style={{ color: seasonInfo.color }}>
          {seasonInfo.name}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">
          Today's Meal Script
        </h1>
        <p className="text-cream-soft text-sm mt-1">
          Built for your {profile.fuelTarget} kcal Fuel Target.
        </p>
      </div>

      {!script ? (
        <div className="card p-8 text-center space-y-4">
          <p className="text-cream-soft text-sm">
            No Meal Script yet for today. Generate one built around your
            Season and targets.
          </p>
          <button
            className="btn-primary"
            onClick={generate}
            disabled={generating}
          >
            {generating ? "Writing your Meal Script…" : "Generate Meal Script"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between card px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-cream-soft">
              <IconFlame className="h-4 w-4 text-clay-500" />
              {Math.round(totalCalories)} kcal across {script.meals.length}{" "}
              meals
              {script.source === "rule" && (
                <span className="text-xs text-cream-soft">(offline script)</span>
              )}
            </div>
            <button
              className="text-sm font-medium text-clay-300"
              onClick={generate}
              disabled={generating}
            >
              {generating ? "Regenerating…" : "Regenerate"}
            </button>
          </div>

          <div className="space-y-4">
            {script.meals.map((meal, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="label-caps mb-1">
                      {MEAL_LABELS[meal.mealType] ?? meal.mealType}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-cream">
                      {meal.title}
                    </h3>
                    <p className="text-sm text-cream-soft mt-1">
                      {meal.description}
                    </p>
                  </div>
                  <button
                    onClick={() => logMeal(i)}
                    disabled={loggedMeals.has(i)}
                    className={
                      loggedMeals.has(i)
                        ? "shrink-0 inline-flex items-center gap-1.5 rounded-full bg-mint/[0.15] text-mint px-3 py-2 text-xs font-medium"
                        : "shrink-0 btn-ghost !py-2 !px-3 text-xs"
                    }
                  >
                    {loggedMeals.has(i) ? (
                      <>
                        <IconCheck className="h-3.5 w-3.5" /> Logged
                      </>
                    ) : (
                      "Log it"
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/[0.08] text-center">
                  <div>
                    <div className="text-xs text-cream-soft">Kcal</div>
                    <div className="font-semibold">
                      {Math.round(meal.calories)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-cream-soft">Protein</div>
                    <div className="font-semibold">
                      {Math.round(meal.proteinG)}g
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-cream-soft">Carbs</div>
                    <div className="font-semibold">
                      {Math.round(meal.carbsG)}g
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-cream-soft">Fat</div>
                    <div className="font-semibold">
                      {Math.round(meal.fatG)}g
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
