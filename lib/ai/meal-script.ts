import { FOODS } from "@/data/foods";
import { RECIPES } from "@/data/recipes";
import { MealScriptItem, Season } from "@/lib/types";

export interface MealScriptRequest {
  name: string;
  season: Season;
  fuelTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

const BREAKFAST_BY_SEASON: Record<Season, string> = {
  lean: "pap",
  build: "bread-egg",
  balance: "oatmeal",
  forge: "boiled-eggs",
};

const SNACK_BY_SEASON: Record<Season, string> = {
  lean: "watermelon",
  build: "groundnuts",
  balance: "banana",
  forge: "groundnuts",
};

export function generateRuleBasedMealScript(
  req: Pick<MealScriptRequest, "season">
): MealScriptItem[] {
  const { season } = req;
  const items: MealScriptItem[] = [];

  const breakfast = FOODS.find((f) => f.id === BREAKFAST_BY_SEASON[season]);
  if (breakfast) {
    items.push({
      mealType: "breakfast",
      title: breakfast.name,
      description: `${breakfast.servingLabel}, a straightforward start for ${season} season.`,
      calories: breakfast.calories,
      proteinG: breakfast.proteinG,
      carbsG: breakfast.carbsG,
      fatG: breakfast.fatG,
    });
  }

  const seasonRecipes = RECIPES.filter((r) => r.seasons.includes(season));
  const lunch = seasonRecipes[0];
  const dinner = seasonRecipes.find((r) => r.id !== lunch?.id) ?? seasonRecipes[0];

  if (lunch) {
    items.push({
      mealType: "lunch",
      title: lunch.title,
      description: lunch.description,
      calories: lunch.caloriesPerServing,
      proteinG: lunch.proteinG,
      carbsG: lunch.carbsG,
      fatG: lunch.fatG,
      recipeSlug: lunch.slug,
    });
  }

  if (dinner) {
    items.push({
      mealType: "dinner",
      title: dinner.title,
      description: dinner.description,
      calories: dinner.caloriesPerServing,
      proteinG: dinner.proteinG,
      carbsG: dinner.carbsG,
      fatG: dinner.fatG,
      recipeSlug: dinner.slug,
    });
  }

  const snack = FOODS.find((f) => f.id === SNACK_BY_SEASON[season]);
  if (snack) {
    items.push({
      mealType: "snack",
      title: snack.name,
      description: `${snack.servingLabel} to bridge the gap.`,
      calories: snack.calories,
      proteinG: snack.proteinG,
      carbsG: snack.carbsG,
      fatG: snack.fatG,
    });
  }

  return items;
}

const SEASON_VOICE: Record<Season, string> = {
  lean: "a gentle calorie deficit, high protein and high fibre to stay full",
  build: "a calorie surplus with dense, protein-rich meals for quality mass gain",
  balance: "steady maintenance eating with no extremes",
  forge: "calories near maintenance with protein pushed high, for muscle growth",
};

export function buildMealScriptSystemPrompt(): string {
  return `You are the meal-planning engine inside Zuri, an AI nutrition coach app built first for Nigerians and Africans. You write a "Meal Script" — a one-day meal plan of real Nigerian/West African dishes (jollof rice, egusi, moi moi, suya, amala, beans, plantain, pepper soup, etc.) that fits the user's Season and daily targets.

Rules:
- Use authentic Nigerian/West African dishes and realistic home portions.
- Always return STRICT JSON only, matching this TypeScript type, with no prose before or after:
  { "meals": [ { "mealType": "breakfast"|"lunch"|"dinner"|"snack", "title": string, "description": string (1 sentence), "calories": number, "proteinG": number, "carbsG": number, "fatG": number } ] }
- Include exactly 4 meals: breakfast, lunch, dinner, snack.
- The sum of calories across meals should land within about 10% of the user's Fuel Target.
- Keep descriptions warm and specific, never generic diet-app language like "low-cal treat".`;
}

export function buildMealScriptUserPrompt(req: MealScriptRequest): string {
  return `User: ${req.name}
Season: ${req.season} (${SEASON_VOICE[req.season]})
Fuel Target: ${req.fuelTarget} kcal
Protein Target: ${req.proteinTargetG} g
Carbs Target: ${req.carbsTargetG} g
Fat Target: ${req.fatTargetG} g

Write today's Meal Script as strict JSON per the schema.`;
}

export function parseMealScriptResponse(text: string): MealScriptItem[] | null {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return null;
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    if (!Array.isArray(parsed.meals)) return null;
    const validTypes = new Set(["breakfast", "lunch", "dinner", "snack"]);
    const meals: MealScriptItem[] = parsed.meals
      .filter((m: any) => validTypes.has(m.mealType))
      .map((m: any) => ({
        mealType: m.mealType,
        title: String(m.title ?? "Untitled meal"),
        description: String(m.description ?? ""),
        calories: Number(m.calories) || 0,
        proteinG: Number(m.proteinG) || 0,
        carbsG: Number(m.carbsG) || 0,
        fatG: Number(m.fatG) || 0,
      }));
    return meals.length > 0 ? meals : null;
  } catch {
    return null;
  }
}
