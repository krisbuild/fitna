export type Season = "lean" | "build" | "balance";

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface SeasonInfo {
  id: Season;
  name: string;
  tagline: string;
  description: string;
  color: string;
  colorSoft: string;
}

export const SEASONS: Record<Season, SeasonInfo> = {
  lean: {
    id: "lean",
    name: "Lean Season",
    tagline: "Shedding weight, steady and sustainable",
    description:
      "A gentle calorie deficit built around filling, high-protein Nigerian meals — so you lose weight without losing your favourite food.",
    color: "#A8432B",
    colorSoft: "#F2C6B4",
  },
  build: {
    id: "build",
    name: "Build Season",
    tagline: "Gaining weight and strength, deliberately",
    description:
      "A calorie surplus focused on quality mass — more fuel, more protein, meal scripts built to help you grow.",
    color: "#BE8825",
    colorSoft: "#EEC97B",
  },
  balance: {
    id: "balance",
    name: "Balance Season",
    tagline: "Healthy living, no extremes",
    description:
      "Maintenance eating that keeps your energy steady and your relationship with food easy — for the long run.",
    color: "#1F3A2E",
    colorSoft: "#9BB6A6",
  },
};

export interface Profile {
  id: string;
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number | null;
  activityLevel: ActivityLevel;
  season: Season;
  fuelTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  locale: string;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  region: string;
  servingLabel: string;
  servingGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  tags?: string[];
}

export interface FoodLogEntry {
  id: string;
  foodId: string | null;
  name: string;
  servingLabel: string;
  quantity: number;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
  plateDate: string;
}

export interface WeightLogEntry {
  id: string;
  weightKg: number;
  loggedAt: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  seasons: Season[];
  region: string;
  emoji: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
}

export interface MealScriptItem {
  mealType: MealType;
  title: string;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  recipeSlug?: string;
}

export interface MealScript {
  id: string;
  date: string;
  season: Season;
  meals: MealScriptItem[];
  source: "ai" | "rule";
  createdAt: string;
}

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
}
