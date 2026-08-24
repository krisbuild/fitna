"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { FoodItem, MealType } from "@/lib/types";
import { todayDateString } from "@/lib/nutrition";
import { IconArrowRight } from "@/components/icons";

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

function defaultMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 16) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}

export default function LogFoodPage() {
  const { adapter } = useZuri();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<MealType>(defaultMealType());
  const [saving, setSaving] = useState(false);

  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCalories, setCustomCalories] = useState(0);
  const [customProtein, setCustomProtein] = useState(0);
  const [customCarbs, setCustomCarbs] = useState(0);
  const [customFat, setCustomFat] = useState(0);

  useEffect(() => {
    if (!adapter) return;
    adapter.searchFoods(query).then(setResults);
  }, [adapter, query]);

  async function addSelected() {
    if (!adapter || !selected) return;
    setSaving(true);
    await adapter.addFoodLog({
      foodId: selected.id,
      name: selected.name,
      servingLabel: selected.servingLabel,
      quantity,
      mealType,
      calories: selected.calories * quantity,
      proteinG: selected.proteinG * quantity,
      carbsG: selected.carbsG * quantity,
      fatG: selected.fatG * quantity,
      plateDate: todayDateString(),
    });
    router.push("/dashboard");
  }

  async function addCustom() {
    if (!adapter || !customName.trim()) return;
    setSaving(true);
    await adapter.addFoodLog({
      foodId: null,
      name: customName.trim(),
      servingLabel: "1 serving",
      quantity: 1,
      mealType,
      calories: customCalories,
      proteinG: customProtein,
      carbsG: customCarbs,
      fatG: customFat,
      plateDate: todayDateString(),
    });
    router.push("/dashboard");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-semibold text-cream">
        Log food
      </h1>

      <div>
        <label className="label-caps block mb-2">Meal</label>
        <div className="grid grid-cols-4 gap-2">
          {MEAL_TYPES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMealType(m.id)}
              className={clsx(
                "rounded-xl2 border px-2 py-2.5 text-xs font-medium transition-colors",
                mealType === m.id
                  ? "border-clay-500 bg-clay-500/[0.15] text-clay-100"
                  : "border-white/[0.12] text-cream-soft"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {!customMode ? (
        <>
          <div>
            <label className="label-caps block mb-2">
              Search Nigerian &amp; African foods
            </label>
            <input
              className="input-field"
              placeholder="Try 'jollof', 'moi moi', 'suya'…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              autoFocus
            />
          </div>

          {!selected ? (
            <div className="space-y-2">
              {results.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelected(f);
                    setQuantity(1);
                  }}
                  className="w-full text-left card px-4 py-3 flex items-center justify-between hover:shadow-lift transition-shadow"
                >
                  <div>
                    <p className="font-medium text-sm text-cream">{f.name}</p>
                    <p className="text-xs text-cream-soft">
                      {f.servingLabel} · {f.calories} kcal
                    </p>
                  </div>
                  <IconArrowRight className="h-4 w-4 text-cream-soft" />
                </button>
              ))}
              {results.length === 0 && (
                <p className="text-sm text-cream-soft py-4 text-center">
                  No matches. Try another name, or log a custom food.
                </p>
              )}
              <button
                className="text-sm text-clay-300 font-medium pt-2"
                onClick={() => setCustomMode(true)}
              >
                Can't find it? Log a custom food →
              </button>
            </div>
          ) : (
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-cream">
                    {selected.name}
                  </p>
                  <p className="text-xs text-cream-soft">
                    {selected.servingLabel} per serving
                  </p>
                </div>
                <button
                  className="text-sm text-cream-soft"
                  onClick={() => setSelected(null)}
                >
                  Change
                </button>
              </div>

              <div>
                <label className="label-caps block mb-2">Servings</label>
                <div className="flex items-center gap-3">
                  <button
                    className="btn-ghost !px-3 !py-2"
                    onClick={() => setQuantity((q) => Math.max(0.5, q - 0.5))}
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    className="btn-ghost !px-3 !py-2"
                    onClick={() => setQuantity((q) => q + 0.5)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-2 border-t border-white/[0.08] text-center">
                <div>
                  <div className="text-xs text-cream-soft">Kcal</div>
                  <div className="font-semibold">
                    {Math.round(selected.calories * quantity)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cream-soft">Protein</div>
                  <div className="font-semibold">
                    {Math.round(selected.proteinG * quantity)}g
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cream-soft">Carbs</div>
                  <div className="font-semibold">
                    {Math.round(selected.carbsG * quantity)}g
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cream-soft">Fat</div>
                  <div className="font-semibold">
                    {Math.round(selected.fatG * quantity)}g
                  </div>
                </div>
              </div>

              <button
                className="btn-primary w-full"
                onClick={addSelected}
                disabled={saving}
              >
                {saving ? "Adding…" : "Add to Plate"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-cream">
              Custom food
            </p>
            <button
              className="text-sm text-cream-soft"
              onClick={() => setCustomMode(false)}
            >
              Back to search
            </button>
          </div>
          <input
            className="input-field"
            placeholder="Food name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="label-caps block mb-1">Kcal</label>
              <input
                type="number"
                className="input-field !px-2 !py-2 text-sm"
                value={customCalories}
                onChange={(e) => setCustomCalories(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-caps block mb-1">Protein</label>
              <input
                type="number"
                className="input-field !px-2 !py-2 text-sm"
                value={customProtein}
                onChange={(e) => setCustomProtein(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-caps block mb-1">Carbs</label>
              <input
                type="number"
                className="input-field !px-2 !py-2 text-sm"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-caps block mb-1">Fat</label>
              <input
                type="number"
                className="input-field !px-2 !py-2 text-sm"
                value={customFat}
                onChange={(e) => setCustomFat(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            className="btn-primary w-full"
            onClick={addCustom}
            disabled={saving || !customName.trim()}
          >
            {saving ? "Adding…" : "Add to Plate"}
          </button>
        </div>
      )}
    </div>
  );
}
