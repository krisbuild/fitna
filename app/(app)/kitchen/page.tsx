"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useZuri } from "@/lib/data/context";
import { Profile, Recipe, Season, SEASONS } from "@/lib/types";
import { IconClock } from "@/components/icons";

const FILTERS: { id: Season | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shred", label: "Shred" },
  { id: "build", label: "Build" },
  { id: "glow", label: "Glow" },
];

export default function KitchenPage() {
  const { adapter } = useZuri();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [filter, setFilter] = useState<Season | "all">("all");

  useEffect(() => {
    if (!adapter) return;
    adapter.getRecipes().then(setRecipes);
    adapter.getProfile().then((p) => {
      setProfile(p);
      if (p) setFilter(p.season);
    });
  }, [adapter]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? recipes
        : recipes.filter((r) => r.seasons.includes(filter)),
    [recipes, filter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">
          The Kitchen
        </h1>
        <p className="text-cream-soft text-sm mt-1">
          A Nigerian cookbook, built for whichever Mode you're in — same
          food, better versions.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={clsx(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors",
              filter === f.id
                ? "bg-cream text-night border-cream"
                : "border-white/[0.15] text-cream-soft"
            )}
          >
            {f.label}
            {f.id !== "all" && profile?.season === f.id && " · you"}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-cream font-medium">
            No {filter !== "all" ? SEASONS[filter as Season].name : ""}{" "}
            recipes yet
          </p>
          <p className="text-cream-soft text-sm mt-1">
            We're still cooking up recipes for this Mode — check back
            soon, or browse everything below.
          </p>
          <button
            onClick={() => setFilter("all")}
            className="btn-ghost !py-2 !px-4 text-sm mt-4"
          >
            Browse all recipes
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {visible.map((r) => (
          <Link
            key={r.id}
            href={`/kitchen/${r.slug}`}
            className="card overflow-hidden p-0 hover:shadow-lift transition-shadow"
          >
            {r.image ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  {r.seasons.map((s) => (
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
                  {r.title}
                </h3>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3 p-5 pb-0">
                <div>
                  <span className="text-2xl">{r.emoji}</span>
                  <h3 className="font-display text-lg font-semibold text-cream mt-2">
                    {r.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {r.seasons.map((s) => (
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
                {r.description}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-cream-soft">
                <span className="flex items-center gap-1">
                  <IconClock className="h-3.5 w-3.5" />
                  {r.prepMinutes + r.cookMinutes} min
                </span>
                <span>{r.caloriesPerServing} kcal / serving</span>
                <span>{r.proteinG}g protein</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
