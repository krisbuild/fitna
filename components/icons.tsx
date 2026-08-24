// A small, hand-drawn icon set for Zuri — kept geometric and consistent
// rather than pulling in a generic icon library, so the product has its
// own visual fingerprint.

type IconProps = { className?: string; style?: React.CSSProperties };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconHome({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconPlate({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function IconBook({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M5 4.5c3-1 6-1 7 0v15c-1-1-4-1-7 0Z" />
      <path d="M19 4.5c-3-1-6-1-7 0v15c1-1 4-1 7 0Z" />
    </svg>
  );
}

export function IconChart({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M4 20V10" />
      <path d="M11 20V4" />
      <path d="M18 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function IconChat({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M4 5.5h16v10H10l-4 3.5v-3.5H4Z" />
    </svg>
  );
}

export function IconGear({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6" />
    </svg>
  );
}

export function IconPlus({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconArrowRight({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconFlame({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M12 3c1 3-3 4-3 7.5A3.5 3.5 0 0 0 12 14a2.5 2.5 0 0 0 2.5-2.5c1.5 1.5 2 3 2 4.5a4.5 4.5 0 0 1-9 0C7.5 12.5 11 10.5 12 3Z" />
    </svg>
  );
}

export function IconCheck({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M4.5 12.5 9 17l10.5-11" />
    </svg>
  );
}

export function IconLeaf({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z" />
      <path d="M5 19c2-5 5-8 10-10" />
    </svg>
  );
}

export function IconScale({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 15c0-2.5 1.8-4 4-4s4 1.5 4 4" />
    </svg>
  );
}

export function IconTrash({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m2 0-.8 12.1A2 2 0 0 1 14.2 21H9.8a2 2 0 0 1-2-1.9L7 7" />
    </svg>
  );
}

export function IconClock({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
