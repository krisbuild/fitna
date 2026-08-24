import { Season, SEASONS } from "@/lib/types";
import clsx from "clsx";

export function SeasonBadge({
  season,
  size = "md",
}: {
  season: Season;
  size?: "sm" | "md";
}) {
  const info = SEASONS[season];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      )}
      style={{ backgroundColor: `${info.color}1A`, color: info.color }}
    >
      <span aria-hidden>{info.emoji}</span>
      {info.name}
    </span>
  );
}
