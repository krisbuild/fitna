import { Profile, SEASONS } from "@/lib/types";

export function buildCoachSystemPrompt(profile: Profile): string {
  const seasonInfo = SEASONS[profile.season];
  return `You are the Zuri Coach — the personal nutrition and fitness coach inside Zuri, an app built first for Nigerians and Africans. You are warm, direct, and practical, never clinical or preachy. You know Nigerian and West African food deeply (jollof, egusi, amala, moi moi, suya, akara, pepper soup, etc.) and give advice grounded in real, findable food, not imported diet-culture defaults.

The person you're coaching:
- Name: ${profile.name}
- Mode: ${seasonInfo.name} — ${seasonInfo.description}
- Daily Fuel Target: ${profile.fuelTarget} kcal
- Protein / Carbs / Fat targets: ${profile.proteinTargetG}g / ${profile.carbsTargetG}g / ${profile.fatTargetG}g

Guidelines:
- Keep replies short — 2-4 sentences unless the user asks for a full plan.
- Use the app's own vocabulary naturally: "Mode", "Fuel Target", "Plate", "Meal Script" — don't over-explain them once used.
- The Mode names are casual (Shred, Build, Glow) but the advice behind them should be as sound as what a real nutritionist would say — real numbers, no gimmicks.
- Give specific Nigerian/African food suggestions and real portions, not vague advice.
- Never shame the user's food choices; help them fit their goal instead.
- If asked something outside nutrition/fitness/wellbeing, gently redirect.`;
}

const FALLBACK_RESPONSES: { match: RegExp; reply: (p: Profile) => string }[] = [
  {
    match: /amala|eba|fufu|swallow|pounded ?yam/i,
    reply: (p) =>
      `Swallow is fine in your ${SEASONS[p.season].name.toLowerCase()} — the trick is portion and what's on the side. One wrap-sized serving with a protein-heavy soup (egusi, okra, or efo riro with extra fish) keeps it well within your ${p.fuelTarget} kcal target.`,
  },
  {
    match: /protein/i,
    reply: (p) =>
      `You're aiming for about ${p.proteinTargetG}g of protein today. Moi moi, grilled chicken, suya, boiled eggs, and fish stew are your easiest wins — they're all Nigerian staples that pack protein without a lot of extra oil.`,
  },
  {
    match: /workout|exercise|gym|train/i,
    reply: (p) =>
      p.season === "build"
        ? "Since you're in Build Mode, eat a carb-and-protein meal 1-2 hours before training — think beans and plantain, or rice and grilled chicken — and don't skip the post-workout meal either."
        : "A light meal with some carbs 60-90 minutes before training works well — pap, oats, or a slice of boiled plantain. Keep the post-workout meal protein-forward.",
  },
  {
    match: /jollof|rice/i,
    reply: () =>
      "Jollof is completely fine to keep eating — a levelled cup (about 200g) with grilled protein and a vegetable side is a solid, balanced plate in any Mode.",
  },
];

export function getFallbackCoachReply(profile: Profile, message: string): string {
  for (const { match, reply } of FALLBACK_RESPONSES) {
    if (match.test(message)) return reply(profile);
  }
  return `Good question. Right now you're in ${SEASONS[profile.season].name} with a ${profile.fuelTarget} kcal Fuel Target — stay close to that, keep protein steady, and lean on real Nigerian meals from The Kitchen rather than cutting foods out entirely. What specifically are you trying to figure out?`;
}
