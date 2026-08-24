import { ActivityLevel, Season, Sex } from "./types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Mostly sitting (desk job, little exercise)",
  light: "Light activity (1-3 workouts/week)",
  moderate: "Moderately active (3-5 workouts/week)",
  active: "Active (6-7 workouts/week)",
  very_active: "Very active (physical job or 2x/day training)",
};

export function calculateBMR(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

const SEASON_ADJUSTMENT: Record<Season, number> = {
  shred: -0.2,
  build: 0.1,
  glow: 0,
};

const PROTEIN_PER_KG: Record<Season, number> = {
  shred: 2.0,
  build: 2.1,
  glow: 1.6,
};

export interface FuelTargets {
  fuelTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

export function calculateFuelTargets(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  season: Season
): FuelTargets {
  const bmr = calculateBMR(sex, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const fuelTarget = Math.round(tdee * (1 + SEASON_ADJUSTMENT[season]));

  // Protein: highest in Build (muscle growth), also elevated in Shred (satiety)
  const proteinTargetG = Math.round(PROTEIN_PER_KG[season] * weightKg);
  const proteinCalories = proteinTargetG * 4;

  // Fat: ~25% of total calories
  const fatCalories = fuelTarget * 0.25;
  const fatTargetG = Math.round(fatCalories / 9);

  // Remainder to carbs
  const carbCalories = Math.max(fuelTarget - proteinCalories - fatCalories, 0);
  const carbsTargetG = Math.round(carbCalories / 4);

  return { fuelTarget, proteinTargetG, carbsTargetG, fatTargetG };
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Above healthy range";
  return "Well above healthy range";
}

export function todayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
