export type Season = "shred" | "build" | "glow";

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
  | "vegan"
  | "no_pork"
  | "no_beef";

export interface DietPatternInfo {
  id: DietPattern;
  label: string;
  description: string;
}

export const DIET_PATTERNS: DietPatternInfo[] = [
  {
    id: "none",
    label: "No restrictions",
    description: "Eats everything — plant and animal foods alike.",
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    description: "No meat, poultry, or fish. Dairy and eggs are usually fine.",
  },
  {
    id: "vegan",
    label: "Vegan",
    description: "No animal products at all — no meat, dairy, eggs, or honey.",
  },
  {
    id: "no_pork",
    label: "No pork",
    description: "Everything else is fine — just no pork or pork products.",
  },
  {
    id: "no_beef",
    label: "No beef",
    description: "Everything else is fine — just no beef or beef products.",
  },
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
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  colorSoft: string;
}

export const SEASONS: Record<Season, SeasonInfo> = {
  shred: {
    id: "shred",
    name: "Shred Mode",
    emoji: "🔥",
    tagline: "Cutting fat without losing your mind",
    description:
      "A structured ~20% calorie deficit with protein held high — around 2g per kg of bodyweight — to protect lean mass and keep hunger in check. Built around real Nigerian meals, not bland diet food.",
    color: "#FF7A55",
    colorSoft: "rgba(255, 122, 85, 0.15)",
  },
  build: {
    id: "build",
    name: "Build Mode",
    emoji: "💪",
    tagline: "Adding size and strength, on purpose",
    description:
      "A moderate ~10% calorie surplus paired with a high protein target — around 2.1g per kg of bodyweight — so the extra calories go toward muscle, not just the scale. Covers weight gain and muscle-building alike.",
    color: "#FFC65C",
    colorSoft: "rgba(255, 198, 92, 0.15)",
  },
  glow: {
    id: "glow",
    name: "Glow Mode",
    emoji: "✨",
    tagline: "Steady, sustainable, feeling good",
    description:
      "Maintenance calories with balanced macros — about 1.6g protein per kg — built for consistency and energy, not restriction. The long-run default for staying healthy without extremes.",
    color: "#5FCB8C",
    colorSoft: "rgba(95, 203, 140, 0.15)",
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
  image?: string;
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

// A single suggestion from Meal Inspo — not yet saved, not tied to a user.
export interface MealIdea {
  title: string;
  description: string;
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
}

// A Meal Inspo suggestion the user chose to keep, so they can cook it
// again without re-entering the same ingredients.
export interface SavedMeal extends MealIdea {
  id: string;
  season: Season;
  usedIngredients: string[];
  source: "ai" | "rule";
  createdAt: string;
}

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
}
