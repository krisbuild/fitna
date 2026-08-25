"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { PANTRY_STAPLES } from "@/lib/ai/pantry";
import { MealIdea, Profile, SavedMeal, SEASONS } from "@/lib/types";
import { todayDateString } from "@/lib/nutrition";
import { IconCheck, IconPlus, IconTrash } from "@/components/icons";
import { MealTeaserCarousel } from "@/components/ui/MealTeaserCarousel";

function MealIdeaCard({
  idea,
  onSave,
  onLog,
  saved,
  saving,
}: {
  idea: MealIdea;
  onSave: () => void;
  onLog: () => void;
  saved: boolean;
  saving: boolean;
}) {
  const [logged, setLogged] = useState(false);
  return (
    <div className="card p-5 space-y-4">
      <div>
        <span className="text-3xl leading-none">{idea.emoji}</span>
        <h3 className="font-display text-lg font-semibold text-cream mt-2">
          {idea.title}
        </h3>
        <p className="text-sm text-cream-soft mt-1 leading-relaxed">
          {idea.description}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 text-center pt-3 border-t border-white/[0.08]">
        <div>
          <div className="text-xs text-cream-soft">Kcal</div>
          <div className="font-semibold">{Math.round(idea.caloriesPerServing)}</div>
        </div>
        <div>
          <div className="text-xs text-cream-soft">Protein</div>
          <div className="font-semibold">{Math.round(idea.proteinG)}g</div>
        </div>
        <div>
          <div className="text-xs text-cream-soft">Carbs</div>
          <div className="font-semibold">{Math.round(idea.carbsG)}g</div>
        </div>
        <div>
          <div className="text-xs text-cream-soft">Fat</div>
          <div className="font-semibold">{Math.round(idea.fatG)}g</div>
        </div>
      </div>

      <div>
        <p className="label-caps mb-2">Ingredients</p>
        <ul className="space-y-1.5">
          {idea.ingredients.map((ing, i) => (
            <li key={i} className="flex gap-3 text-sm text-cream-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-clay-500 mt-2 shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label-caps mb-2">Method</p>
        <ol className="space-y-2">
          {idea.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-cream-soft">
              <span className="font-display font-semibold text-clay-500 shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          className={clsx(
            "btn-ghost !py-2 !px-4 text-sm",
            saved && "!border-mint !text-mint"
          )}
          onClick={onSave}
          disabled={saved || saving}
        >
          {saved ? (
            <span className="flex items-center gap-1.5">
              <IconCheck className="h-3.5 w-3.5" /> Saved
            </span>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save this meal"
          )}
        </button>
        <button
          className={clsx(
            "text-sm font-medium",
            logged ? "text-mint" : "text-clay-300"
          )}
          onClick={() => {
            onLog();
            setLogged(true);
          }}
          disabled={logged}
        >
          {logged ? "Logged ✓" : "Log to today's Plate"}
        </button>
      </div>
    </div>
  );
}

export default function MealInspoPage() {
  const { adapter } = useZuri();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);

  const [selectedStaples, setSelectedStaples] = useState<Set<string>>(new Set());
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const [ideas, setIdeas] = useState<MealIdea[] | null>(null);
  const [ideaSource, setIdeaSource] = useState<"ai" | "rule" | null>(null);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!adapter) return;
    const [p, saved] = await Promise.all([
      adapter.getProfile(),
      adapter.getSavedMeals(),
    ]);
    setProfile(p);
    setSavedMeals(saved);
  }, [adapter]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleStaple(item: string) {
    setSelectedStaples((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  function addCustomIngredient() {
    const value = customInput.trim();
    if (!value || customIngredients.includes(value)) {
      setCustomInput("");
      return;
    }
    setCustomIngredients((prev) => [...prev, value]);
    setCustomInput("");
  }

  function removeCustomIngredient(value: string) {
    setCustomIngredients((prev) => prev.filter((v) => v !== value));
  }

  const allIngredients = [...selectedStaples, ...customIngredients];

  async function generate() {
    if (!adapter || !profile || allIngredients.length === 0) return;
    setGenerating(true);
    setError(null);
    setIdeas(null);
    setSavedIndices(new Set());
    try {
      const res = await fetch("/api/meal-inspo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          season: profile.season,
          fuelTarget: profile.fuelTarget,
          proteinTargetG: profile.proteinTargetG,
          dietPattern: profile.dietPattern,
          excludedFoods: profile.excludedFoods,
          ingredients: allIngredients,
        }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.ideas) || data.ideas.length === 0) {
        setError("Couldn't find a meal for that combo — try adding one more ingredient.");
        return;
      }
      setIdeas(data.ideas);
      setIdeaSource(data.source);
    } catch {
      setError("Couldn't reach the Kitchen right now — try again in a moment.");
    } finally {
      setGenerating(false);
    }
  }

  async function saveIdea(idea: MealIdea, index: number) {
    if (!adapter || !profile) return;
    setSavingIndex(index);
    try {
      const saved = await adapter.saveSavedMeal({
        ...idea,
        season: profile.season,
        usedIngredients: allIngredients,
        source: ideaSource ?? "rule",
      });
      setSavedMeals((prev) => [saved, ...prev]);
      setSavedIndices((prev) => new Set(prev).add(index));
    } finally {
      setSavingIndex(null);
    }
  }

  async function logIdea(idea: MealIdea) {
    if (!adapter) return;
    const h = new Date().getHours();
    const mealType = h < 11 ? "breakfast" : h < 16 ? "lunch" : h < 21 ? "dinner" : "snack";
    await adapter.addFoodLog({
      foodId: null,
      name: idea.title,
      servingLabel: "1 serving",
      quantity: 1,
      mealType,
      calories: idea.caloriesPerServing,
      proteinG: idea.proteinG,
      carbsG: idea.carbsG,
      fatG: idea.fatG,
      plateDate: todayDateString(),
    });
  }

  async function deleteSaved(id: string) {
    if (!adapter) return;
    await adapter.deleteSavedMeal(id);
    setSavedMeals((prev) => prev.filter((m) => m.id !== id));
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">
          Kitchen
        </h1>
        <p className="text-cream-soft text-sm mt-1">
          Tell us what's in your kitchen — we'll build a real Nigerian meal
          around it, portioned for {SEASONS[profile.season].name}.
        </p>
      </div>

      <MealTeaserCarousel />

      <div className="card p-4 space-y-3">
        <div>
          <label className="label-caps block mb-1.5">What do you have?</label>
          <div className="flex flex-wrap gap-1.5">
            {PANTRY_STAPLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleStaple(item)}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  selectedStaples.has(item)
                    ? "border-mint bg-mint/[0.15] text-mint"
                    : "border-white/[0.15] text-cream-soft"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps block mb-1.5">
            Anything else? (type it in)
          </label>
          <div className="flex gap-2">
            <input
              className="input-field !py-2 !text-sm"
              placeholder="e.g. leftover ugu, smoked fish"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomIngredient();
                }
              }}
            />
            <button
              type="button"
              className="btn-ghost !px-3 !py-2 shrink-0"
              onClick={addCustomIngredient}
              aria-label="Add"
            >
              <IconPlus className="h-4 w-4" />
            </button>
          </div>
          {customIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {customIngredients.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => removeCustomIngredient(v)}
                  className="rounded-full bg-mint/[0.15] text-mint px-2.5 py-1 text-xs font-medium"
                >
                  {v} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn-primary w-full !py-2.5 !text-sm"
          onClick={generate}
          disabled={generating || allIngredients.length === 0}
        >
          {generating ? "Finding something to cook…" : "Find something to cook"}
        </button>
        {error && <p className="text-sm text-clay-300">{error}</p>}
      </div>

      {ideas && ideas.length > 0 && (
        <div className="space-y-4">
          {ideaSource === "rule" && (
            <p className="text-xs text-cream-soft">
              Matched from Meal Inspo (offline) — connect an AI key for
              fully custom suggestions.
            </p>
          )}
          {ideas.map((idea, i) => (
            <MealIdeaCard
              key={i}
              idea={idea}
              onSave={() => saveIdea(idea, i)}
              onLog={() => logIdea(idea)}
              saved={savedIndices.has(i)}
              saving={savingIndex === i}
            />
          ))}
        </div>
      )}

      {savedMeals.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-cream">
            Your saved meals
          </h2>
          {savedMeals.map((meal) => (
            <div key={meal.id} className="card p-4 flex items-center gap-3">
              <span className="text-2xl leading-none">{meal.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-cream truncate">{meal.title}</p>
                <p className="text-xs text-cream-soft mt-0.5">
                  {Math.round(meal.caloriesPerServing)} kcal ·{" "}
                  {Math.round(meal.proteinG)}g protein · from{" "}
                  {meal.usedIngredients.slice(0, 3).join(", ")}
                  {meal.usedIngredients.length > 3 ? "…" : ""}
                </p>
              </div>
              <button
                onClick={() => deleteSaved(meal.id)}
                className="shrink-0 text-cream-soft hover:text-clay-300 transition-colors"
                aria-label="Delete saved meal"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
