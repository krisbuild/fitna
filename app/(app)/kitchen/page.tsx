"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useZuri } from "@/lib/data/context";
import { Profile, Recipe, Season, SEASONS } from "@/lib/types";
import { IconArrowRight, IconChevronDown, IconClock } from "@/components/icons";

const MODE_ORDER: Season[] = ["shred", "build", "glow"];
const PER_MODE = 5;

function RecipeCard({
  recipe,
  expanded,
  onToggle,
}: {
  recipe: Recipe;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      {recipe.image ? (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            {recipe.seasons.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: `${SEASONS[s].color}33`,
                  color: SEASONS[s].color,
                }}
              >
                {SEASONS[s].name.replace(" Mode", "")}
              </span>
            ))}
          </div>
          <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-semibold text-cream leading-snug">
            {recipe.title}
          </h3>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3 p-5 pb-0">
          <div>
            <span className="text-2xl">{recipe.emoji}</span>
            <h3 className="font-display text-lg font-semibold text-cream mt-2">
              {recipe.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            {recipe.seasons.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${SEASONS[s].color}1A`,
                  color: SEASONS[s].color,
                }}
              >
                {SEASONS[s].name.replace(" Mode", "")}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-5">
        <p className="text-sm text-cream-soft leading-relaxed line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center gap-4 mt-4 text-xs text-cream-soft">
          <span className="flex items-center gap-1">
            <IconClock className="h-3.5 w-3.5" />
            {recipe.prepMinutes + recipe.cookMinutes} min
          </span>
          <span>{recipe.caloriesPerServing} kcal / serving</span>
          <span>{recipe.proteinG}g protein</span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm font-semibold text-clay-300 mt-4"
        >
          {expanded ? "Hide the recipe" : "How to make it"}
          <IconChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-4">
            <div>
              <p className="label-caps mb-2">Ingredients</p>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex gap-3 text-sm text-cream-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay-500 mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-caps mb-2">Method</p>
              <ol className="space-y-2">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-cream-soft">
                    <span className="font-display font-semibold text-clay-500 shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KitchenPage() {
  const { adapter } = useZuri();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!adapter) return;
    adapter.getRecipes().then(setRecipes);
    adapter.getProfile().then(setProfile);
  }, [adapter]);

  const byMode = useMemo(() => {
    const result: Record<Season, Recipe[]> = { shred: [], build: [], glow: [] };
    for (const mode of MODE_ORDER) {
      const tagged = recipes.filter((r) => r.seasons.includes(mode));
      const withPhoto = tagged.filter((r) => r.image);
      const withoutPhoto = tagged.filter((r) => !r.image);
      result[mode] = [...withPhoto, ...withoutPhoto].slice(0, PER_MODE);
    }
    return result;
  }, [recipes]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">
          Meal Inspo
        </h1>
        <p className="text-cream-soft text-sm mt-1">
          A Nigerian cookbook, built for whichever Mode you're in — same
          food, better versions.
        </p>
      </div>

      <Link
        href="/meal-inspo"
        className="card p-5 flex items-center justify-between hover:shadow-lift transition-shadow"
      >
        <div>
          <p className="label-caps mb-1">Got ingredients, not a plan?</p>
          <p className="text-sm text-cream-soft">
            Tell the Kitchen what's on hand — get a real dish back.
          </p>
        </div>
        <IconArrowRight className="h-5 w-5 text-cream-soft shrink-0" />
      </Link>

      {MODE_ORDER.map((mode) => (
        <div key={mode} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-cream">
              {SEASONS[mode].emoji} {SEASONS[mode].name}
            </h2>
            {profile?.season === mode && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${SEASONS[mode].color}1A`,
                  color: SEASONS[mode].color,
                }}
              >
                you
              </span>
            )}
          </div>

          {byMode[mode].length === 0 ? (
            <div className="card p-6 text-center text-sm text-cream-soft">
              We're still cooking up recipes for this Mode — check back soon.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {byMode[mode].map((r) => {
                const key = `${mode}-${r.id}`;
                return (
                  <RecipeCard
                    key={key}
                    recipe={r}
                    expanded={expandedKey === key}
                    onToggle={() =>
                      setExpandedKey((prev) => (prev === key ? null : key))
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="btn-ghost w-full sm:w-auto"
        >
          {showAll
            ? "Hide the full cookbook"
            : `Browse the full cookbook (${recipes.length} recipes)`}
        </button>

        {showAll && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {recipes.map((r) => {
              const key = `all-${r.id}`;
              return (
                <RecipeCard
                  key={key}
                  recipe={r}
                  expanded={expandedKey === key}
                  onToggle={() =>
                    setExpandedKey((prev) => (prev === key ? null : key))
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
