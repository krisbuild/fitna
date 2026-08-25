import { RECIPES } from "@/data/recipes";
import {
  DIET_PATTERNS,
  DietPattern,
  MealIdea,
  Recipe,
  Season,
  SEASONS,
} from "@/lib/types";

// Common Nigerian kitchen staples for the Kitchen ingredient picker.
// Not exhaustive — free text covers anything not listed here.
export const PANTRY_STAPLES = [
  "Yam",
  "Rice",
  "Beans",
  "Garri",
  "Plantain",
  "Onion",
  "Tomato",
  "Scotch Bonnet (Ata Rodo)",
  "Bell Pepper",
  "Crayfish",
  "Palm Oil",
  "Vegetable Oil",
  "Egg",
  "Chicken",
  "Beef",
  "Fish",
  "Goat Meat",
  "Gizzard",
  "Ogbono Seeds",
  "Egusi Seeds",
  "Ugu (Fluted Pumpkin Leaves)",
  "Spinach",
  "Groundnuts",
  "Ginger & Garlic",
  "Locust Beans (Iru)",
  "Seasoning Cube",
] as const;

export interface PantryRequest {
  name: string;
  season: Season;
  fuelTarget: number;
  proteinTargetG: number;
  dietPattern: DietPattern;
  excludedFoods: string[];
  ingredients: string[];
}

function recipeToMealIdea(r: Recipe): MealIdea {
  return {
    title: r.title,
    description: r.description,
    emoji: r.emoji,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    servings: r.servings,
    caloriesPerServing: r.caloriesPerServing,
    proteinG: r.proteinG,
    carbsG: r.carbsG,
    fatG: r.fatG,
    ingredients: r.ingredients,
    steps: r.steps,
  };
}

// No AI key (or the AI call failed): score Meal Inspo's recipe dataset by
// how many named ingredients each recipe actually uses, so the feature
// never comes back empty-handed even offline.
export function generateRuleBasedMealIdeas(
  req: Pick<PantryRequest, "season" | "ingredients">
): MealIdea[] {
  const needles = req.ingredients
    .map((i) => i.toLowerCase().trim())
    .filter(Boolean);
  if (needles.length === 0) return [];

  const scored = RECIPES.map((r) => {
    const haystack = r.ingredients.join(" ").toLowerCase();
    const score = needles.filter((n) => haystack.includes(n)).length;
    return { recipe: r, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored.slice(0, 3).map((s) => recipeToMealIdea(s.recipe));
  }

  // Nothing overlapped at all — fall back to something in their Mode
  // rather than a dead end.
  return RECIPES.filter((r) => r.seasons.includes(req.season))
    .slice(0, 2)
    .map(recipeToMealIdea);
}

export function buildPantrySystemPrompt(): string {
  return `You are the "Kitchen" engine inside Zuri, an AI nutrition coach app built first for Nigerians and Africans. Given a short list of ingredients someone actually has on hand, suggest real Nigerian/West African dishes they can make with it. Mode names are casual (Shred, Build, Glow) but the nutrition should hold up to scrutiny from a qualified nutritionist.

Rules:
- Prioritize dishes where the named ingredients are the star, not a garnish.
- You may assume common pantry basics even if unlisted: salt, water, cooking oil, onion, pepper, seasoning cubes. Don't invent anything beyond that plus what's named.
- If honestly nothing solid can be made from just what's listed, say so in one suggestion's description and name the smallest addition that would unlock a real dish, rather than forcing a bad match.
- Respect the user's dietary pattern and any foods they avoid — never suggest a dish that violates either.
- Size each suggestion to a realistic single-meal portion, roughly 30-40% of their daily Fuel Target, unless the ingredients genuinely only support a smaller snack-sized dish.
- Always return STRICT JSON only, matching this TypeScript type, with no prose before or after:
  { "ideas": [ { "title": string, "description": string (1-2 sentences), "emoji": string (single emoji), "prepMinutes": number, "cookMinutes": number, "servings": number, "caloriesPerServing": number, "proteinG": number, "carbsG": number, "fatG": number, "ingredients": string[], "steps": string[] } ] }
- Return between 1 and 3 ideas.`;
}

export function buildPantryUserPrompt(req: PantryRequest): string {
  const dietLabel =
    DIET_PATTERNS.find((d) => d.id === req.dietPattern)?.label ??
    "No restrictions";
  return `User: ${req.name}
Mode: ${SEASONS[req.season].name}
Fuel Target: ${req.fuelTarget} kcal/day
Protein Target: ${req.proteinTargetG} g/day
Dietary pattern: ${dietLabel}
${req.excludedFoods.length ? `Avoids: ${req.excludedFoods.join(", ")}` : ""}

Ingredients they have: ${req.ingredients.join(", ")}

Suggest real Nigerian dishes as strict JSON per the schema.`;
}

export function parsePantryResponse(text: string): MealIdea[] | null {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return null;
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    if (!Array.isArray(parsed.ideas)) return null;
    const ideas: MealIdea[] = parsed.ideas
      .filter((i: any) => i && typeof i.title === "string")
      .map((i: any) => ({
        title: String(i.title),
        description: String(i.description ?? ""),
        emoji: String(i.emoji ?? "🍲"),
        prepMinutes: Number(i.prepMinutes) || 10,
        cookMinutes: Number(i.cookMinutes) || 20,
        servings: Number(i.servings) || 1,
        caloriesPerServing: Number(i.caloriesPerServing) || 0,
        proteinG: Number(i.proteinG) || 0,
        carbsG: Number(i.carbsG) || 0,
        fatG: Number(i.fatG) || 0,
        ingredients: Array.isArray(i.ingredients)
          ? i.ingredients.map((x: any) => String(x))
          : [],
        steps: Array.isArray(i.steps) ? i.steps.map((x: any) => String(x)) : [],
      }));
    return ideas.length > 0 ? ideas.slice(0, 3) : null;
  } catch {
    return null;
  }
}
