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

export function bmiCategoryColor(bmi: number): string {
  if (bmi < 18.5) return "#D8A13A";
  if (bmi < 25) return "#5FCB8C";
  if (bmi < 30) return "#FFC65C";
  return "#FF7A55";
}

// Reads the BMI against the chosen Mode and says, in plain terms, whether
// they're pointed the same direction — including flagging the mismatch
// cases a nutritionist would actually raise (e.g. Shred Mode on a BMI
// that's already underweight).
export function bmiModeNote(season: Season, bmi: number): string {
  if (season === "shred") {
    if (bmi >= 25) {
      return "This lines up with Shred Mode's goal — the deficit is built to bring it down at a sustainable, muscle-sparing pace.";
    }
    if (bmi < 18.5) {
      return "Your BMI already reads underweight — worth a second look at whether Shred Mode is really what your body needs right now.";
    }
    return "You're already in the healthy range. Shred Mode will still work, but expect the change to be modest — this isn't a body that needs a large deficit.";
  }
  if (season === "build") {
    if (bmi < 18.5) {
      return "This lines up with Build Mode's goal — the surplus is built to move this up steadily, without rushing it.";
    }
    if (bmi >= 25) {
      return "You're above the typical healthy range. Build Mode's surplus is deliberately modest, but keep an eye on how your body responds over the first few weeks.";
    }
    return "You're already in the healthy range. Build Mode will steer the extra calories toward muscle rather than just moving the number.";
  }
  // glow
  if (bmi < 18.5 || bmi >= 25) {
    return "Glow Mode holds you at maintenance while this settles — a steadier pace than a dedicated Shred or Build push.";
  }
  return "You're right in the healthy range. Glow Mode is built to keep you here, sustainably, without extremes.";
}

export function todayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
