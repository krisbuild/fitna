"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { ACTIVITY_LABELS, calculateFuelTargets } from "@/lib/nutrition";
import { ActivityLevel, Profile, Season, SEASONS } from "@/lib/types";

export default function SettingsPage() {
  const { adapter, mode, signOut } = useZuriSafe();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

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

  if (!profile) return null;

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
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

      <div className="card p-5 space-y-3">
        <p className="label-caps">Activity level</p>
        {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setProfile({ ...profile, activityLevel: lvl })}
            className={clsx(
              "w-full text-left rounded-xl2 border px-4 py-3 text-sm transition-colors",
              profile.activityLevel === lvl
                ? "border-clay-500 bg-clay-50"
                : "border-ink/[0.12]"
            )}
          >
            {ACTIVITY_LABELS[lvl]}
          </button>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <p className="label-caps">Season</p>
        {Object.values(SEASONS).map((s) => (
          <button
            key={s.id}
            onClick={() => setProfile({ ...profile, season: s.id as Season })}
            className={clsx(
              "w-full text-left rounded-xl2 border px-4 py-3 transition-colors",
              profile.season === s.id ? "border-2" : "border-ink/[0.12]"
            )}
            style={
              profile.season === s.id
                ? { borderColor: s.color, backgroundColor: `${s.color}0D` }
                : undefined
            }
          >
            <p className="font-medium text-ink">{s.name}</p>
            <p className="text-xs text-ink-soft mt-0.5">{s.tagline}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        {savedAt && (
          <span className="text-sm text-forest-600">Saved ✓</span>
        )}
      </div>

      <div className="pt-6 border-t border-black/[0.06] space-y-3">
        {mode === "supabase" ? (
          <button className="btn-ghost" onClick={signOut}>
            Sign out
          </button>
        ) : (
          <button
            className="text-sm text-clay-600 font-medium"
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
