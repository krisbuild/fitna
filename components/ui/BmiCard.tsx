"use client";

import { useState } from "react";
import { calculateBMI, bmiCategory, bmiCategoryColor } from "@/lib/nutrition";
import { IconChevronDown } from "@/components/icons";

export function BmiCard({
  heightCm,
  weightKg,
}: {
  heightCm: number;
  weightKg: number;
}) {
  const [open, setOpen] = useState(false);
  const bmi = calculateBMI(weightKg, heightCm);
  const color = bmiCategoryColor(bmi);
  const heightM = heightCm / 100;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps mb-1">Body Mass Index</p>
          <p className="text-sm font-medium" style={{ color }}>
            {bmiCategory(bmi)}
          </p>
        </div>
        <span
          className="font-display text-3xl font-semibold"
          style={{ color }}
        >
          {bmi > 0 ? bmi.toFixed(1) : "—"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-clay-300"
      >
        {open ? "Hide how this is calculated" : "How is this calculated?"}
        <IconChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-3 pt-3 border-t border-white/[0.08] text-xs text-cream-soft leading-relaxed">
          <p>
            <span className="font-semibold text-cream">Formula: </span>
            weight in kilograms, divided by height in metres, squared —
            BMI = kg ÷ m². At {heightCm}cm ({heightM.toFixed(2)}m) and{" "}
            {weightKg}kg, that's {weightKg} ÷ {heightM.toFixed(2)}²
            {" = "}
            {bmi > 0 ? bmi.toFixed(1) : "—"}.
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Below 18.5</span>
              <span className="text-cream">Underweight</span>
            </div>
            <div className="flex justify-between">
              <span>18.5 – 24.9</span>
              <span className="text-cream">Healthy range</span>
            </div>
            <div className="flex justify-between">
              <span>25 – 29.9</span>
              <span className="text-cream">Above healthy range</span>
            </div>
            <div className="flex justify-between">
              <span>30 and above</span>
              <span className="text-cream">Well above healthy range</span>
            </div>
          </div>
          <p className="text-cream-soft/70">
            Worth knowing: BMI doesn't distinguish muscle from fat, so it
            can read "high" on very muscular bodies or "healthy" on someone
            with low muscle and high fat. Zuri treats it as one reference
            point alongside your Mode and goals — not a diagnosis.
          </p>
        </div>
      )}
    </div>
  );
}
