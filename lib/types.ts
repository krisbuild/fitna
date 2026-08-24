export type Season = "lean" | "build" | "balance" | "forge";

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DietPattern =
  | "none"
  | "vegetarian"
  | "pescatarian"
  | "vegan"
  | "halal"
  | "no_pork"
  | "no_beef";

export interface DietPatternInfo {
  id: DietPattern;
  label: string;
}

export const DIET_PATTERNS: DietPatternInfo[] = [
  { id: "none", label: "No restrictions" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "vegan", label: "Vegan" },
  { id: "halal", label: "Halal" },
  { id: "no_pork", label: "No pork" },
  { id: "no_beef", label: "No beef" },
];

export type BudgetStyle = "conservative" | "balanced" | "splurge";

export interface BudgetStyleInfo {
  id: BudgetStyle;
  label: string;
  description: string;
}

export const BUDGET_STYLES: BudgetStyleInfo[] = [
  {
    id: "conservative",
    label: "Cost-conscious",
    description: "Keep meals simple and affordable — practical over fancy.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Mostly practical, with room for the occasional splurge.",
  },
  {
    id: "splurge",
    label: "I like to splurge",
    description: "Variety and quality first — cost isn't the main constraint.",
  },
];

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
  forge: {
    id: "forge",
    name: "Forge Season",
    tagline: "Building muscle, high protein",
    description:
      "Calories held near maintenance with protein pushed high, so training turns into muscle instead of just fatigue.",
    color: "#833522",
    colorSoft: "#DB8362",
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

  // Lifestyle
  worksOut: boolean;
  workoutDaysPerWeek: number | null;

  // Food preferences
  dietPattern: DietPattern;
  excludedFoods: string[];
  favoriteFoodIds: string[];

  // Feeding budget
  budgetStyle: BudgetStyle;
  weeklyFoodBudgetNaira: number | null;
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
