import {
  CoachMessage,
  FoodItem,
  FoodLogEntry,
  MealScript,
  Profile,
  Recipe,
  WeightLogEntry,
} from "@/lib/types";

export interface DataAdapter {
  readonly mode: "local" | "supabase";

  getProfile(): Promise<Profile | null>;
  saveProfile(profile: Profile): Promise<void>;

  searchFoods(query: string): Promise<FoodItem[]>;

  getRecipes(): Promise<Recipe[]>;
  getRecipeBySlug(slug: string): Promise<Recipe | undefined>;

  addFoodLog(entry: Omit<FoodLogEntry, "id" | "loggedAt">): Promise<FoodLogEntry>;
  getFoodLogsForDate(date: string): Promise<FoodLogEntry[]>;
  deleteFoodLog(id: string): Promise<void>;

  addWeightLog(weightKg: number): Promise<WeightLogEntry>;
  getWeightLogs(): Promise<WeightLogEntry[]>;

  saveMealScript(
    script: Omit<MealScript, "id" | "createdAt">
  ): Promise<MealScript>;
  getMealScriptForDate(date: string): Promise<MealScript | null>;

  addCoachMessage(
    message: Omit<CoachMessage, "id" | "createdAt">
  ): Promise<CoachMessage>;
  getCoachMessages(): Promise<CoachMessage[]>;

  resetAll(): Promise<void>;
}
