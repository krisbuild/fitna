import { NextRequest, NextResponse } from "next/server";
import {
  buildMealScriptSystemPrompt,
  buildMealScriptUserPrompt,
  generateRuleBasedMealScript,
  MealScriptRequest,
  parseMealScriptResponse,
} from "@/lib/ai/meal-script";
import { MealScriptItem, Season } from "@/lib/types";

const VALID_SEASONS: Season[] = ["lean", "build", "balance", "forge"];

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!VALID_SEASONS.includes(body?.season)) {
    return NextResponse.json({ error: "Invalid season" }, { status: 400 });
  }

  const request: MealScriptRequest = {
    name: String(body.name ?? "there"),
    season: body.season,
    fuelTarget: Number(body.fuelTarget) || 2000,
    proteinTargetG: Number(body.proteinTargetG) || 100,
    carbsTargetG: Number(body.carbsTargetG) || 200,
    fatTargetG: Number(body.fatTargetG) || 60,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const meals = await callClaude(apiKey, request);
      if (meals) {
        return NextResponse.json({ meals, source: "ai" });
      }
    } catch {
      // fall through to rule-based generator
    }
  }

  const meals = generateRuleBasedMealScript(request);
  return NextResponse.json({ meals, source: "rule" });
}

async function callClaude(
  apiKey: string,
  request: MealScriptRequest
): Promise<MealScriptItem[] | null> {
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
      max_tokens: 1024,
      system: buildMealScriptSystemPrompt(),
      messages: [
        { role: "user", content: buildMealScriptUserPrompt(request) },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") return null;
  return parseMealScriptResponse(text);
}
