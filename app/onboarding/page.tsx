"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { FOODS } from "@/data/foods";
import {
  ACTIVITY_LABELS,
  calculateBMI,
  calculateFuelTargets,
  bmiCategory,
} from "@/lib/nutrition";
import {
  ActivityLevel,
  BUDGET_STYLES,
  BudgetStyle,
  DIET_PATTERNS,
  DietPattern,
  Profile,
  Season,
  Sex,
  SEASONS,
} from "@/lib/types";
import { IconArrowRight, IconCheck, IconPlus } from "@/components/icons";

const STEPS = [
  "About you",
  "Activity",
  "Your Season",
  "Food",
  "Budget",
  "Review",
] as const;

const FAVORITE_FOOD_CHOICES = [
  "jollof-rice",
  "egusi-soup",
  "eba",
  "amala",
  "pounded-yam",
  "moi-moi",
  "akara",
  "suya",
  "grilled-chicken",
  "beans-porridge",
  "fried-rice",
  "asaro",
]
  .map((id) => FOODS.find((f) => f.id === id))
  .filter((f): f is (typeof FOODS)[number] => Boolean(f));

export default function OnboardingPage() {
  const { adapter, authState } = useZuri();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState(26);
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(65);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("light");
  const [worksOut, setWorksOut] = useState(false);
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState(3);
  const [season, setSeason] = useState<Season>("balance");
  const [targetWeightKg, setTargetWeightKg] = useState<number | "">("");

  const [dietPattern, setDietPattern] = useState<DietPattern>("none");
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>([]);
  const [excludedFoods, setExcludedFoods] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState("");

  const [budgetStyle, setBudgetStyle] = useState<BudgetStyle>("balanced");
  const [weeklyBudget, setWeeklyBudget] = useState<number | "">("");

  useEffect(() => {
    if (authState === "unauthenticated") router.replace("/signup");
  }, [authState, router]);

  const targets = calculateFuelTargets(
    sex,
    weightKg,
    heightCm,
    age,
    activityLevel,
    season
  );
  const bmi = calculateBMI(weightKg, heightCm);

  function toggleFavorite(id: string) {
    setFavoriteFoodIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function addExclusion() {
    const value = excludeInput.trim();
    if (!value || excludedFoods.includes(value)) {
      setExcludeInput("");
      return;
    }
    setExcludedFoods((prev) => [...prev, value]);
    setExcludeInput("");
  }

  function removeExclusion(value: string) {
    setExcludedFoods((prev) => prev.filter((v) => v !== value));
  }

  async function handleFinish() {
    if (!adapter) return;
    setSaving(true);
    const profile: Profile = {
      id: "me",
      name: name.trim() || "Friend",
      sex,
      age,
      heightCm,
      weightKg,
      targetWeightKg: targetWeightKg === "" ? null : targetWeightKg,
      activityLevel,
      season,
      fuelTarget: targets.fuelTarget,
      proteinTargetG: targets.proteinTargetG,
      carbsTargetG: targets.carbsTargetG,
      fatTargetG: targets.fatTargetG,
      locale: "NG",
      createdAt: new Date().toISOString(),
      worksOut,
      workoutDaysPerWeek: worksOut ? workoutDaysPerWeek : null,
      dietPattern,
      excludedFoods,
      favoriteFoodIds,
      budgetStyle,
      weeklyFoodBudgetNaira: weeklyBudget === "" ? null : weeklyBudget,
    };
    await adapter.saveProfile(profile);
    router.push("/dashboard");
  }

  const canAdvance =
    step === 0
      ? name.trim().length > 0 && heightCm > 0 && weightKg > 0 && age > 0
      : true;

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <div className="max-w-xl w-full mx-auto px-6 pt-10 pb-24 flex-1">
        <span className="font-display text-xl font-semibold text-forest-600">
          Zuri
        </span>

        <div className="flex items-center gap-2 mt-6 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={clsx(
                  "h-1.5 rounded-full",
                  i <= step ? "bg-clay-500" : "bg-black/[0.08]"
                )}
              />
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Let's set your table
            </h1>
            <p className="text-ink-soft text-sm">
              A few details so your targets are actually built for your
              body, not a generic average. Takes about a minute.
            </p>

            <div>
              <label className="label-caps block mb-2">What should we call you?</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="label-caps block mb-2">Sex</label>
              <div className="grid grid-cols-2 gap-3">
                {(["female", "male"] as Sex[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={clsx(
                      "rounded-xl2 border px-4 py-3 text-sm font-medium capitalize transition-colors",
                      sex === s
                        ? "border-clay-500 bg-clay-50 text-clay-700"
                        : "border-ink/[0.12] text-ink-soft"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label-caps block mb-2">Age</label>
                <input
                  type="number"
                  className="input-field"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Height (cm)</label>
                <input
                  type="number"
                  className="input-field"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Weight (kg)</label>
                <input
                  type="number"
                  className="input-field"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-semibold text-ink">
              How active is your day?
            </h1>
            <p className="text-ink-soft text-sm">
              Be honest, not aspirational — this decides your Fuel Target.
            </p>
            <div className="space-y-2.5">
              {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setActivityLevel(lvl)}
                  className={clsx(
                    "w-full text-left rounded-xl2 border px-4 py-3.5 text-sm transition-colors",
                    activityLevel === lvl
                      ? "border-clay-500 bg-clay-50"
                      : "border-ink/[0.12]"
                  )}
                >
                  {ACTIVITY_LABELS[lvl]}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="label-caps block mb-2">
                Do you currently work out?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setWorksOut(val)}
                    className={clsx(
                      "rounded-xl2 border px-4 py-3 text-sm font-medium transition-colors",
                      worksOut === val
                        ? "border-clay-500 bg-clay-50 text-clay-700"
                        : "border-ink/[0.12] text-ink-soft"
                    )}
                  >
                    {val ? "Yes, I train" : "Not right now"}
                  </button>
                ))}
              </div>
              {worksOut && (
                <div className="mt-3">
                  <label className="label-caps block mb-2">
                    How many days a week?
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="btn-ghost !px-3 !py-2"
                      onClick={() =>
                        setWorkoutDaysPerWeek((d) => Math.max(1, d - 1))
                      }
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-medium">
                      {workoutDaysPerWeek}
                    </span>
                    <button
                      type="button"
                      className="btn-ghost !px-3 !py-2"
                      onClick={() =>
                        setWorkoutDaysPerWeek((d) => Math.min(7, d + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Which Season are you in?
            </h1>
            <p className="text-ink-soft text-sm">
              You can switch Seasons any time from Settings as your goal
              changes.
            </p>
            <div className="space-y-3">
              {Object.values(SEASONS).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeason(s.id)}
                  className={clsx(
                    "w-full text-left rounded-xl2 border px-4 py-4 transition-colors",
                    season === s.id ? "border-2" : "border-ink/[0.12]"
                  )}
                  style={
                    season === s.id
                      ? { borderColor: s.color, backgroundColor: `${s.color}0D` }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-ink">
                      {s.name}
                    </span>
                    {season === s.id && (
                      <IconCheck
                        className="h-4 w-4"
                        style={{ color: s.color }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-ink-soft mt-1">{s.description}</p>
                </button>
              ))}
            </div>

            {season !== "balance" && (
              <div>
                <label className="label-caps block mb-2">
                  Target weight (kg) — optional
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={targetWeightKg}
                  onChange={(e) =>
                    setTargetWeightKg(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 60"
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                What do you eat?
              </h1>
              <p className="text-ink-soft text-sm mt-1">
                Optional, but it helps your Meal Scripts feel like your food,
                not a stranger's. Tap what applies — no typing required.
              </p>
            </div>

            <div>
              <label className="label-caps block mb-2">Any dietary pattern?</label>
              <div className="flex flex-wrap gap-2">
                {DIET_PATTERNS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietPattern(d.id)}
                    className={clsx(
                      "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                      dietPattern === d.id
                        ? "border-clay-500 bg-clay-50 text-clay-700"
                        : "border-ink/[0.15] text-ink-soft"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-caps block mb-2">
                A few favourites (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {FAVORITE_FOOD_CHOICES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFavorite(f.id)}
                    className={clsx(
                      "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                      favoriteFoodIds.includes(f.id)
                        ? "border-forest-500 bg-forest-50 text-forest-700"
                        : "border-ink/[0.15] text-ink-soft"
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-caps block mb-2">
                Anything to avoid — allergies, dislikes? (optional)
              </label>
              <div className="flex gap-2">
                <input
                  className="input-field"
                  placeholder="e.g. peanuts, seafood"
                  value={excludeInput}
                  onChange={(e) => setExcludeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExclusion();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-ghost !px-4 shrink-0"
                  onClick={addExclusion}
                  aria-label="Add"
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>
              {excludedFoods.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {excludedFoods.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => removeExclusion(v)}
                      className="rounded-full bg-clay-50 text-clay-700 px-3 py-1.5 text-xs font-medium"
                    >
                      {v} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                What's your feeding budget like?
              </h1>
              <p className="text-ink-soft text-sm mt-1">
                This just shapes how Zuri suggests meals — practical picks
                versus more variety. Optional.
              </p>
            </div>

            <div className="space-y-2.5">
              {BUDGET_STYLES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudgetStyle(b.id)}
                  className={clsx(
                    "w-full text-left rounded-xl2 border px-4 py-3.5 transition-colors",
                    budgetStyle === b.id
                      ? "border-clay-500 bg-clay-50"
                      : "border-ink/[0.12]"
                  )}
                >
                  <p className="font-medium text-ink text-sm">{b.label}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {b.description}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className="label-caps block mb-2">
                Weekly food budget in ₦ — optional
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 15000"
                value={weeklyBudget}
                onChange={(e) =>
                  setWeeklyBudget(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Your starting point
            </h1>
            <p className="text-ink-soft text-sm">
              Built from your numbers for {SEASONS[season].name}. You can
              fine-tune anything anytime from Settings.
            </p>
            <div className="card p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-ink-soft">Fuel Target</span>
                <span className="font-display text-3xl font-semibold text-ink">
                  {targets.fuelTarget}
                  <span className="text-base font-sans text-ink-muted"> kcal</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-black/[0.06]">
                <div>
                  <div className="text-xs text-ink-muted">Protein</div>
                  <div className="font-semibold">{targets.proteinTargetG}g</div>
                </div>
                <div>
                  <div className="text-xs text-ink-muted">Carbs</div>
                  <div className="font-semibold">{targets.carbsTargetG}g</div>
                </div>
                <div>
                  <div className="text-xs text-ink-muted">Fat</div>
                  <div className="font-semibold">{targets.fatTargetG}g</div>
                </div>
              </div>
            </div>

            <div className="card p-6 flex items-center justify-between">
              <div>
                <p className="label-caps mb-1">Body Mass Index</p>
                <p className="text-xs text-ink-soft">{bmiCategory(bmi)}</p>
              </div>
              <span className="font-display text-2xl font-semibold text-ink">
                {bmi.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-10">
          {step > 0 && (
            <button
              className="btn-ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={saving}
            >
              Back
            </button>
          )}
          {(step === 3 || step === 4) && (
            <button
              className="text-sm text-ink-muted font-medium"
              onClick={() => setStep((s) => s + 1)}
              disabled={saving}
            >
              Skip
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary flex-1"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
            >
              Continue
              <IconArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              className="btn-primary flex-1"
              onClick={handleFinish}
              disabled={saving || !adapter}
            >
              {saving ? "Setting up your Zuri…" : "Start my Season"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
