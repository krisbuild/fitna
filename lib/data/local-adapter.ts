import { searchFoods as searchFoodsData } from "@/data/foods";
import { RECIPES, getRecipeBySlug as getRecipeBySlugData } from "@/data/recipes";
import {
  CoachMessage,
  FoodItem,
  FoodLogEntry,
  MealScript,
  Profile,
  Recipe,
  WeightLogEntry,
} from "@/lib/types";
import { DataAdapter } from "./adapter";

const STORAGE_KEY = "zuri:v1";

interface LocalStore {
  profile: Profile | null;
  foodLogs: FoodLogEntry[];
  weightLogs: WeightLogEntry[];
  mealScripts: MealScript[];
  coachMessages: CoachMessage[];
}

function emptyStore(): LocalStore {
  return {
    profile: null,
    foodLogs: [],
    weightLogs: [],
    mealScripts: [],
    coachMessages: [],
  };
}

function readStore(): LocalStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export class LocalAdapter implements DataAdapter {
  readonly mode = "local" as const;

  async getProfile(): Promise<Profile | null> {
    return readStore().profile;
  }

  async saveProfile(profile: Profile): Promise<void> {
    const store = readStore();
    store.profile = profile;
    writeStore(store);
  }

  async searchFoods(query: string): Promise<FoodItem[]> {
    return searchFoodsData(query);
  }

  async getRecipes(): Promise<Recipe[]> {
    return RECIPES;
  }

  async getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
    return getRecipeBySlugData(slug);
  }

  async addFoodLog(
    entry: Omit<FoodLogEntry, "id" | "loggedAt">
  ): Promise<FoodLogEntry> {
    const store = readStore();
    const full: FoodLogEntry = {
      ...entry,
      id: uid(),
      loggedAt: new Date().toISOString(),
    };
    store.foodLogs.push(full);
    writeStore(store);
    return full;
  }

  async getFoodLogsForDate(date: string): Promise<FoodLogEntry[]> {
    return readStore().foodLogs.filter((f) => f.plateDate === date);
  }

  async deleteFoodLog(id: string): Promise<void> {
    const store = readStore();
    store.foodLogs = store.foodLogs.filter((f) => f.id !== id);
    writeStore(store);
  }

  async addWeightLog(weightKg: number): Promise<WeightLogEntry> {
    const store = readStore();
    const entry: WeightLogEntry = {
      id: uid(),
      weightKg,
      loggedAt: new Date().toISOString(),
    };
    store.weightLogs.push(entry);
    writeStore(store);
    return entry;
  }

  async getWeightLogs(): Promise<WeightLogEntry[]> {
    return readStore().weightLogs.sort((a, b) =>
      a.loggedAt.localeCompare(b.loggedAt)
    );
  }

  async saveMealScript(
    script: Omit<MealScript, "id" | "createdAt">
  ): Promise<MealScript> {
    const store = readStore();
    const full: MealScript = {
      ...script,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    store.mealScripts = store.mealScripts.filter(
      (s) => s.date !== script.date
    );
    store.mealScripts.push(full);
    writeStore(store);
    return full;
  }

  async getMealScriptForDate(date: string): Promise<MealScript | null> {
    const store = readStore();
    return store.mealScripts.find((s) => s.date === date) ?? null;
  }

  async addCoachMessage(
    message: Omit<CoachMessage, "id" | "createdAt">
  ): Promise<CoachMessage> {
    const store = readStore();
    const full: CoachMessage = {
      ...message,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    store.coachMessages.push(full);
    writeStore(store);
    return full;
  }

  async getCoachMessages(): Promise<CoachMessage[]> {
    return readStore().coachMessages;
  }

  async resetAll(): Promise<void> {
    writeStore(emptyStore());
  }
}
