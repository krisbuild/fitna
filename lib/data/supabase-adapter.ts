import { SupabaseClient } from "@supabase/supabase-js";
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

function profileFromRow(row: any): Profile {
  return {
    id: row.id,
    name: row.name,
    sex: row.sex,
    age: row.age,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    targetWeightKg: row.target_weight_kg,
    activityLevel: row.activity_level,
    season: row.season,
    fuelTarget: row.fuel_target,
    proteinTargetG: row.protein_target_g,
    carbsTargetG: row.carbs_target_g,
    fatTargetG: row.fat_target_g,
    locale: row.locale,
    createdAt: row.created_at,
    worksOut: row.works_out ?? false,
    workoutDaysPerWeek: row.workout_days_per_week ?? null,
    dietPattern: row.diet_pattern ?? "none",
    excludedFoods: row.excluded_foods ?? [],
    favoriteFoodIds: row.favorite_food_ids ?? [],
    budgetStyle: row.budget_style ?? "balanced",
    weeklyFoodBudgetNaira: row.weekly_food_budget_naira ?? null,
  };
}

function foodFromRow(row: any): FoodItem {
  return {
    id: row.id,
    name: row.name,
    nameLocal: row.name_local ?? undefined,
    category: row.category,
    region: row.region,
    servingLabel: row.serving_label,
    servingGrams: row.serving_grams,
    calories: row.calories,
    proteinG: row.protein_g,
    carbsG: row.carbs_g,
    fatG: row.fat_g,
    fiberG: row.fiber_g ?? undefined,
    tags: row.tags ?? undefined,
  };
}

function recipeFromRow(row: any): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    seasons: row.seasons,
    region: row.region,
    emoji: row.emoji,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    servings: row.servings,
    caloriesPerServing: row.calories_per_serving,
    proteinG: row.protein_g,
    carbsG: row.carbs_g,
    fatG: row.fat_g,
    ingredients: row.ingredients,
    steps: row.steps,
    tags: row.tags ?? [],
  };
}

function foodLogFromRow(row: any): FoodLogEntry {
  return {
    id: row.id,
    foodId: row.food_id,
    name: row.name,
    servingLabel: row.serving_label,
    quantity: row.quantity,
    mealType: row.meal_type,
    calories: row.calories,
    proteinG: row.protein_g,
    carbsG: row.carbs_g,
    fatG: row.fat_g,
    loggedAt: row.logged_at,
    plateDate: row.plate_date,
  };
}

function mealScriptFromRow(row: any): MealScript {
  return {
    id: row.id,
    date: row.script_date,
    season: row.season,
    meals: row.meals,
    source: row.source,
    createdAt: row.created_at,
  };
}

export class SupabaseAdapter implements DataAdapter {
  readonly mode = "supabase" as const;

  constructor(private client: SupabaseClient, private userId: string) {}

  async getProfile(): Promise<Profile | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", this.userId)
      .maybeSingle();
    if (error) throw error;
    return data ? profileFromRow(data) : null;
  }

  async saveProfile(profile: Profile): Promise<void> {
    const { error } = await this.client.from("profiles").upsert({
      id: this.userId,
      name: profile.name,
      sex: profile.sex,
      age: profile.age,
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      target_weight_kg: profile.targetWeightKg,
      activity_level: profile.activityLevel,
      season: profile.season,
      fuel_target: profile.fuelTarget,
      protein_target_g: profile.proteinTargetG,
      carbs_target_g: profile.carbsTargetG,
      fat_target_g: profile.fatTargetG,
      locale: profile.locale,
      works_out: profile.worksOut,
      workout_days_per_week: profile.workoutDaysPerWeek,
      diet_pattern: profile.dietPattern,
      excluded_foods: profile.excludedFoods,
      favorite_food_ids: profile.favoriteFoodIds,
      budget_style: profile.budgetStyle,
      weekly_food_budget_naira: profile.weeklyFoodBudgetNaira,
    });
    if (error) throw error;
  }

  async searchFoods(query: string): Promise<FoodItem[]> {
    let req = this.client.from("foods").select("*").limit(20);
    if (query.trim()) {
      req = req.or(
        `name.ilike.%${query}%,name_local.ilike.%${query}%,category.ilike.%${query}%`
      );
    }
    const { data, error } = await req;
    if (error) throw error;
    return (data ?? []).map(foodFromRow);
  }

  async getRecipes(): Promise<Recipe[]> {
    const { data, error } = await this.client.from("recipes").select("*");
    if (error) throw error;
    return (data ?? []).map(recipeFromRow);
  }

  async getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
    const { data, error } = await this.client
      .from("recipes")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? recipeFromRow(data) : undefined;
  }

  async addFoodLog(
    entry: Omit<FoodLogEntry, "id" | "loggedAt">
  ): Promise<FoodLogEntry> {
    const { data, error } = await this.client
      .from("food_logs")
      .insert({
        user_id: this.userId,
        food_id: entry.foodId,
        name: entry.name,
        serving_label: entry.servingLabel,
        quantity: entry.quantity,
        meal_type: entry.mealType,
        calories: entry.calories,
        protein_g: entry.proteinG,
        carbs_g: entry.carbsG,
        fat_g: entry.fatG,
        plate_date: entry.plateDate,
      })
      .select()
      .single();
    if (error) throw error;
    return foodLogFromRow(data);
  }

  async getFoodLogsForDate(date: string): Promise<FoodLogEntry[]> {
    const { data, error } = await this.client
      .from("food_logs")
      .select("*")
      .eq("user_id", this.userId)
      .eq("plate_date", date)
      .order("logged_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(foodLogFromRow);
  }

  async deleteFoodLog(id: string): Promise<void> {
    const { error } = await this.client
      .from("food_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);
    if (error) throw error;
  }

  async addWeightLog(weightKg: number): Promise<WeightLogEntry> {
    const { data, error } = await this.client
      .from("weight_logs")
      .insert({ user_id: this.userId, weight_kg: weightKg })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      weightKg: data.weight_kg,
      loggedAt: data.logged_at,
    };
  }

  async getWeightLogs(): Promise<WeightLogEntry[]> {
    const { data, error } = await this.client
      .from("weight_logs")
      .select("*")
      .eq("user_id", this.userId)
      .order("logged_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      id: row.id,
      weightKg: row.weight_kg,
      loggedAt: row.logged_at,
    }));
  }

  async saveMealScript(
    script: Omit<MealScript, "id" | "createdAt">
  ): Promise<MealScript> {
    const { data, error } = await this.client
      .from("meal_scripts")
      .upsert(
        {
          user_id: this.userId,
          script_date: script.date,
          season: script.season,
          meals: script.meals,
          source: script.source,
        },
        { onConflict: "user_id,script_date" }
      )
      .select()
      .single();
    if (error) throw error;
    return mealScriptFromRow(data);
  }

  async getMealScriptForDate(date: string): Promise<MealScript | null> {
    const { data, error } = await this.client
      .from("meal_scripts")
      .select("*")
      .eq("user_id", this.userId)
      .eq("script_date", date)
      .maybeSingle();
    if (error) throw error;
    return data ? mealScriptFromRow(data) : null;
  }

  async addCoachMessage(
    message: Omit<CoachMessage, "id" | "createdAt">
  ): Promise<CoachMessage> {
    const { data, error } = await this.client
      .from("coach_messages")
      .insert({
        user_id: this.userId,
        role: message.role,
        content: message.content,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      role: data.role,
      content: data.content,
      createdAt: data.created_at,
    };
  }

  async getCoachMessages(): Promise<CoachMessage[]> {
    const { data, error } = await this.client
      .from("coach_messages")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at,
    }));
  }

  async resetAll(): Promise<void> {
    // Intentionally a no-op for the Supabase adapter: destructive account
    // resets should go through an explicit, confirmed settings action,
    // not a shared interface method.
  }
}
