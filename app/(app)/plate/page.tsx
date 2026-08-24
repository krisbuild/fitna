"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useZuri } from "@/lib/data/context";
import { FoodLogEntry } from "@/lib/types";
import { IconPlus, IconTrash } from "@/components/icons";

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

function toDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLabel(dateStr: string) {
  const today = toDateString(new Date());
  const yesterday = toDateString(new Date(Date.now() - 86400000));
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function PlateHistoryPage() {
  const { adapter } = useZuri();
  const [date, setDate] = useState(() => toDateString(new Date()));
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);

  const load = useCallback(async () => {
    if (!adapter) return;
    setLogs(await adapter.getFoodLogsForDate(date));
  }, [adapter, date]);

  useEffect(() => {
    load();
  }, [load]);

  async function removeLog(id: string) {
    if (!adapter) return;
    await adapter.deleteFoodLog(id);
    load();
  }

  function shiftDate(deltaDays: number) {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + deltaDays);
    setDate(toDateString(d));
  }

  const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Your Plate
        </h1>
        <Link href="/plate/log" className="btn-primary !py-2 !px-4 text-sm">
          <IconPlus className="h-4 w-4 mr-1.5" />
          Log food
        </Link>
      </div>

      <div className="flex items-center justify-between card px-4 py-3">
        <button
          onClick={() => shiftDate(-1)}
          className="text-ink-soft px-2 py-1 hover:text-ink"
          aria-label="Previous day"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-medium text-ink">{formatLabel(date)}</p>
          <p className="text-xs text-ink-muted">
            {Math.round(totalCalories)} kcal logged
          </p>
        </div>
        <button
          onClick={() => shiftDate(1)}
          className="text-ink-soft px-2 py-1 hover:text-ink"
          aria-label="Next day"
          disabled={date >= toDateString(new Date())}
        >
          →
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted text-sm">
          No entries logged for this day.
        </div>
      ) : (
        <div className="space-y-5">
          {MEAL_ORDER.filter((m) => logs.some((l) => l.mealType === m)).map(
            (mealType) => (
              <div key={mealType}>
                <p className="label-caps mb-2">{MEAL_LABELS[mealType]}</p>
                <div className="card divide-y divide-black/[0.05]">
                  {logs
                    .filter((l) => l.mealType === mealType)
                    .map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between px-4 py-3.5"
                      >
                        <div>
                          <p className="font-medium text-ink text-sm">
                            {l.name}
                          </p>
                          <p className="text-xs text-ink-muted">
                            {l.quantity}× {l.servingLabel} ·{" "}
                            {Math.round(l.calories)} kcal
                          </p>
                        </div>
                        <button
                          onClick={() => removeLog(l.id)}
                          className="text-ink-muted hover:text-clay-600 p-2 -mr-2"
                          aria-label="Remove entry"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
