"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { ACTIVITY_LABELS, calculateFuelTargets } from "@/lib/nutrition";
import {
  ActivityLevel,
  BUDGET_STYLES,
  BudgetStyle,
  DIET_PATTERNS,
  DietPattern,
  Profile,
  Season,
  SEASONS,
} from "@/lib/types";
import { IconPlus } from "@/components/icons";
import { BmiCard } from "@/components/ui/BmiCard";

export default function SettingsPage() {
  const { adapter, mode, signOut } = useZuriSafe();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [excludeInput, setExcludeInput] = useState("");

  const load = useCallback(async () => {
    if (!adapter) return;
    setProfile(await adapter.getProfile());
  }, [adapter]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!adapter || !profile) return;
    setSaving(true);
    const targets = calculateFuelTargets(
      profile.sex,
      profile.weightKg,
      profile.heightCm,
      profile.age,
      profile.activityLevel,
      profile.season
    );
    const updated: Profile = { ...profile, ...targets };
    await adapter.saveProfile(updated);
    setProfile(updated);
    setSaving(false);
    setSavedAt(Date.now());
  }

  async function resetDemo() {
    if (!adapter) return;
    await adapter.resetAll();
    router.push("/onboarding");
  }

  function addExclusion() {
    if (!profile) return;
    const value = excludeInput.trim();
    if (!value || profile.excludedFoods.includes(value)) {
      setExcludeInput("");
      return;
    }
    setProfile({ ...profile, excludedFoods: [...profile.excludedFoods, value] });
    setExcludeInput("");
  }

  function removeExclusion(value: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      excludedFoods: profile.excludedFoods.filter((v) => v !== value),
    });
  }

  if (!profile) return null;

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="font-display text-2xl font-semibold text-cream">
        Settings
      </h1>

      <div className="card p-5 space-y-4">
        <p className="label-caps">Profile</p>
        <div>
          <label className="label-caps block mb-2">Name</label>
          <input
            className="input-field"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-caps block mb-2">Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              value={profile.weightKg}
              onChange={(e) =>
                setProfile({ ...profile, weightKg: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="label-caps block mb-2">Height (cm)</label>
            <input
              type="number"
              className="input-field"
              value={profile.heightCm}
              onChange={(e) =>
                setProfile({ ...profile, heightCm: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      <BmiCard heightCm={profile.heightCm} weightKg={profile.weightKg} />

      <div className="card p-5 space-y-3">
        <p className="label-caps">Activity level</p>
        {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setProfile({ ...profile, activityLevel: lvl })}
            className={clsx(
              "w-full text-left rounded-xl2 border px-4 py-3 text-sm transition-colors",
              profile.activityLevel === lvl
                ? "border-clay-500 bg-clay-500/[0.15]"
                : "border-white/[0.12]"
            )}
          >
            {ACTIVITY_LABELS[lvl]}
          </button>
        ))}

        <div className="pt-2">
          <label className="label-caps block mb-2">
            Do you currently work out?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() =>
                  setProfile({
                    ...profile,
                    worksOut: val,
                    workoutDaysPerWeek: val
                      ? profile.workoutDaysPerWeek ?? 3
                      : null,
                  })
                }
                className={clsx(
                  "rounded-xl2 border px-4 py-3 text-sm font-medium transition-colors",
                  profile.worksOut === val
                    ? "border-clay-500 bg-clay-500/[0.15] text-clay-100"
                    : "border-white/[0.12] text-cream-soft"
                )}
              >
                {val ? "Yes, I train" : "Not right now"}
              </button>
            ))}
          </div>
          {profile.worksOut && (
            <div className="mt-3">
              <label className="label-caps block mb-2">
                How many days a week?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-ghost !px-3 !py-2"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      workoutDaysPerWeek: Math.max(
                        1,
                        (profile.workoutDaysPerWeek ?? 3) - 1
                      ),
                    })
                  }
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">
                  {profile.workoutDaysPerWeek ?? 3}
                </span>
                <button
                  type="button"
                  className="btn-ghost !px-3 !py-2"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      workoutDaysPerWeek: Math.min(
                        7,
                        (profile.workoutDaysPerWeek ?? 3) + 1
                      ),
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <p className="label-caps">Mode</p>
        {Object.values(SEASONS).map((s) => (
          <button
            key={s.id}
            onClick={() => setProfile({ ...profile, season: s.id as Season })}
            className={clsx(
              "w-full text-left rounded-xl2 border px-4 py-3 transition-colors flex items-center gap-3",
              profile.season === s.id ? "border-2" : "border-white/[0.12]"
            )}
            style={
              profile.season === s.id
                ? { borderColor: s.color, backgroundColor: `${s.color}0D` }
                : undefined
            }
          >
            <span className="text-2xl leading-none">{s.emoji}</span>
            <div>
              <p className="font-medium text-cream">{s.name}</p>
              <p className="text-xs mt-0.5" style={{ color: s.color }}>
                {s.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="card p-5 space-y-4">
        <p className="label-caps">Food preferences</p>
        <div>
          <label className="label-caps block mb-2">Dietary pattern</label>
          <div className="space-y-2.5">
            {DIET_PATTERNS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  setProfile({ ...profile, dietPattern: d.id as DietPattern })
                }
                className={clsx(
                  "w-full text-left rounded-xl2 border px-4 py-3 transition-colors",
                  profile.dietPattern === d.id
                    ? "border-clay-500 bg-clay-500/[0.15]"
                    : "border-white/[0.12]"
                )}
              >
                <p className="font-medium text-cream text-sm">{d.label}</p>
                <p className="text-xs text-cream-soft mt-0.5">
                  {d.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps block mb-2">
            Anything to avoid — allergies, dislikes?
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
          {profile.excludedFoods.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.excludedFoods.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => removeExclusion(v)}
                  className="rounded-full bg-clay-500/[0.15] text-clay-100 px-3 py-1.5 text-xs font-medium"
                >
                  {v} ✕
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <p className="label-caps">Feeding budget</p>
        <div className="space-y-2.5">
          {BUDGET_STYLES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() =>
                setProfile({ ...profile, budgetStyle: b.id as BudgetStyle })
              }
              className={clsx(
                "w-full text-left rounded-xl2 border px-4 py-3 transition-colors",
                profile.budgetStyle === b.id
                  ? "border-clay-500 bg-clay-500/[0.15]"
                  : "border-white/[0.12]"
              )}
            >
              <p className="font-medium text-cream text-sm">{b.label}</p>
              <p className="text-xs text-cream-soft mt-0.5">{b.description}</p>
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
            value={profile.weeklyFoodBudgetNaira ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                weeklyFoodBudgetNaira:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        {savedAt && (
          <span className="text-sm text-mint">Saved ✓</span>
        )}
      </div>

      <div className="pt-6 border-t border-white/[0.08] space-y-3">
        {mode === "supabase" ? (
          <button className="btn-ghost" onClick={signOut}>
            Sign out
          </button>
        ) : (
          <button
            className="text-sm text-clay-300 font-medium"
            onClick={resetDemo}
          >
            Reset demo data
          </button>
        )}
      </div>
    </div>
  );
}

function useZuriSafe() {
  const ctx = useZuri();
  return { ...ctx, mode: ctx.adapter?.mode ?? "local" };
}
