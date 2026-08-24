export function MacroBar({
  label,
  value,
  target,
  color,
  unit = "g",
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  unit?: string;
}) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        <span className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{Math.round(value)}</span>
          {" / "}
          {Math.round(target)}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
