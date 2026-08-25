import { NextRequest, NextResponse } from "next/server";
import {
  buildPantrySystemPrompt,
  buildPantryUserPrompt,
  generateRuleBasedMealIdeas,
  PantryRequest,
  parsePantryResponse,
} from "@/lib/ai/pantry";
import { MealIdea, Season } from "@/lib/types";

const VALID_SEASONS: Season[] = ["shred", "build", "glow"];

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!VALID_SEASONS.includes(body?.season)) {
    return NextResponse.json({ error: "Invalid season" }, { status: 400 });
  }

  const ingredients: string[] = Array.isArray(body?.ingredients)
    ? body.ingredients.map((s: unknown) => String(s).trim()).filter(Boolean)
    : [];
  if (ingredients.length === 0) {
    return NextResponse.json(
      { error: "No ingredients provided" },
      { status: 400 }
    );
  }

  const request: PantryRequest = {
    name: String(body.name ?? "there"),
    season: body.season,
    fuelTarget: Number(body.fuelTarget) || 2000,
    proteinTargetG: Number(body.proteinTargetG) || 100,
    dietPattern: body.dietPattern ?? "none",
    excludedFoods: Array.isArray(body.excludedFoods) ? body.excludedFoods : [],
    ingredients,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const ideas = await callClaude(apiKey, request);
      if (ideas && ideas.length > 0) {
        return NextResponse.json({ ideas, source: "ai" });
      }
    } catch {
      // fall through to rule-based generator
    }
  }

  const ideas = generateRuleBasedMealIdeas(request);
  return NextResponse.json({ ideas, source: "rule" });
}

async function callClaude(
  apiKey: string,
  request: PantryRequest
): Promise<MealIdea[] | null> {
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1536,
      system: buildPantrySystemPrompt(),
      messages: [{ role: "user", content: buildPantryUserPrompt(request) }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") return null;
  return parsePantryResponse(text);
}
