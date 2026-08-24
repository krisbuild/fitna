"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useZuri } from "@/lib/data/context";
import { Profile, WeightLogEntry, SEASONS } from "@/lib/types";
import { IconScale } from "@/components/icons";

export default function JourneyPage() {
  const { adapter } = useZuri();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<WeightLogEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!adapter) return;
    const [p, l] = await Promise.all([
      adapter.getProfile(),
      adapter.getWeightLogs(),
    ]);
    setProfile(p);
    setLogs(l);
  }, [adapter]);

  useEffect(() => {
    load();
  }, [load]);

  async function addWeight() {
    if (!adapter || !newWeight) return;
    setSaving(true);
    await adapter.addWeightLog(Number(newWeight));
    setNewWeight("");
    setSaving(false);
    load();
  }

  if (!profile) return null;

  const seasonInfo = SEASONS[profile.season];
  const chartData = [
    {
      loggedAt: profile.createdAt,
      weight: profile.weightKg,
      label: "Start",
    },
    ...logs.map((l) => ({
      loggedAt: l.loggedAt,
      weight: l.weightKg,
      label: new Date(l.loggedAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      }),
    })),
  ];
  const currentWeight = logs.length
    ? logs[logs.length - 1].weightKg
    : profile.weightKg;
  const delta = currentWeight - profile.weightKg;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Your Journey
        </h1>
        <p className="text-ink-soft text-sm mt-1">
          Tracking through {seasonInfo.name.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted">Start</p>
          <p className="font-display text-xl font-semibold mt-1">
            {profile.weightKg}kg
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted">Current</p>
          <p className="font-display text-xl font-semibold mt-1">
            {currentWeight}kg
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-ink-muted">Change</p>
          <p
            className="font-display text-xl font-semibold mt-1"
            style={{ color: seasonInfo.color }}
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}kg
          </p>
        </div>
      </div>

      <div className="card p-5">
        <p className="label-caps mb-4">Weight trend</p>
        {chartData.length < 2 ? (
          <p className="text-sm text-ink-muted py-10 text-center">
            Log a weight entry to start seeing your trend.
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#8A7C70" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fontSize: 11, fill: "#8A7C70" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}kg`, "Weight"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(32,26,22,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke={seasonInfo.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card p-5">
        <p className="label-caps mb-3 flex items-center gap-2">
          <IconScale className="h-4 w-4" /> Log today's weight
        </p>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.1"
            className="input-field"
            placeholder="Weight in kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
          <button
            className="btn-primary shrink-0"
            onClick={addWeight}
            disabled={saving || !newWeight}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
