"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useZuri } from "@/lib/data/context";
import { FoodLogEntry, MealScript, Profile, SEASONS } from "@/lib/types";
import { todayDateString } from "@/lib/nutrition";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { MacroBar } from "@/components/ui/MacroBar";
import { IconArrowRight, IconPlus, IconTrash } from "@/components/icons";

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { adapter } = useZuri();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);
  const [script, setScript] = useState<MealScript | null>(null);
  const date = todayDateString();

  const load = useCallback(async () => {
    if (!adapter) return;
    const [p, l, s] = await Promise.all([
      adapter.getProfile(),
      adapter.getFoodLogsForDate(date),
      adapter.getMealScriptForDate(date),
    ]);
    setProfile(p);
    setLogs(l);
    setScript(s);
  }, [adapter, date]);

  useEffect(() => {
    load();
  }, [load]);

  async function removeLog(id: string) {
    if (!adapter) return;
    await adapter.deleteFoodLog(id);
    load();
  }

  if (!profile) return null;

  const seasonInfo = SEASONS[profile.season];
  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      proteinG: acc.proteinG + l.proteinG,
      carbsG: acc.carbsG + l.carbsG,
      fatG: acc.fatG + l.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
  const remaining = Math.max(profile.fuelTarget - totals.calories, 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-cream-soft text-sm">{greeting()}</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">
          {profile.name}
        </h1>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ProgressRing
            value={totals.calories}
            max={profile.fuelTarget}
            color={seasonInfo.color}
            size={168}
          >
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-cream">
                {remaining}
              </div>
              <div className="text-xs text-cream-soft mt-0.5">kcal left</div>
            </div>
          </ProgressRing>
          <div className="flex-1 w-full space-y-4">
            <MacroBar
              label="Protein"
              value={totals.proteinG}
              target={profile.proteinTargetG}
              color="#FF7A55"
            />
            <MacroBar
              label="Carbs"
              value={totals.carbsG}
              target={profile.carbsTargetG}
              color="#FFC65C"
            />
            <MacroBar
              label="Fat"
              value={totals.fatG}
              target={profile.fatTargetG}
              color="#5FCB8C"
            />
          </div>
        </div>
      </div>

      <Link
        href="/meal-script"
        className="card p-5 flex items-center justify-between hover:shadow-lift transition-shadow"
      >
        <div>
          <p className="label-caps mb-1" style={{ color: seasonInfo.color }}>
            Today's Meal Script
          </p>
          {script ? (
            <p className="text-sm text-cream-soft">
              {script.meals.length} meals planned for {seasonInfo.name}
            </p>
          ) : (
            <p className="text-sm text-cream-soft">
              Get AI-built meal ideas for {seasonInfo.name}
            </p>
          )}
        </div>
        <IconArrowRight className="h-5 w-5 text-cream-soft shrink-0" />
      </Link>

      <Link
        href="/meal-inspo"
        className="card p-5 flex items-center justify-between hover:shadow-lift transition-shadow"
      >
        <div>
          <p className="label-caps mb-1">Kitchen</p>
          <p className="text-sm text-cream-soft">
            Got a few ingredients? We'll build a meal around them.
          </p>
        </div>
        <IconArrowRight className="h-5 w-5 text-cream-soft shrink-0" />
      </Link>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-cream">
            Today's Plate
          </h2>
          <Link href="/plate/log" className="btn-primary !py-2 !px-4 text-sm">
            <IconPlus className="h-4 w-4 mr-1.5" />
            Log food
          </Link>
        </div>

        {logs.length === 0 ? (
          <div className="card p-8 text-center text-cream-soft text-sm">
            Nothing on your Plate yet today. Log your first meal to start
            tracking toward your Fuel Target.
          </div>
        ) : (
          <div className="space-y-5">
            {MEAL_ORDER.filter((m) =>
              logs.some((l) => l.mealType === m)
            ).map((mealType) => (
              <div key={mealType}>
                <p className="label-caps mb-2">{MEAL_LABELS[mealType]}</p>
                <div className="card divide-y divide-white/[0.08]">
                  {logs
                    .filter((l) => l.mealType === mealType)
                    .map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between px-4 py-3.5"
                      >
                        <div>
                          <p className="font-medium text-cream text-sm">
                            {l.name}
                          </p>
                          <p className="text-xs text-cream-soft">
                            {l.quantity}× {l.servingLabel} ·{" "}
                            {Math.round(l.calories)} kcal
                          </p>
                        </div>
                        <button
                          onClick={() => removeLog(l.id)}
                          className="text-cream-soft hover:text-clay-300 p-2 -mr-2"
                          aria-label="Remove entry"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
