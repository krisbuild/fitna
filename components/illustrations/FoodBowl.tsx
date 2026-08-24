// A warm, flat-illustrated top-down plate — jollof rice, grilled chicken,
// plantain — used in place of photography we don't have rights to embed.
// Deliberately stylized rather than attempting photorealism in SVG.

export function FoodBowl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id="rice-grad" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#E27A4C" />
          <stop offset="55%" stopColor="#C1502E" />
          <stop offset="100%" stopColor="#96391E" />
        </radialGradient>
        <radialGradient id="plate-grad" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#3A2A1B" />
          <stop offset="100%" stopColor="#241A11" />
        </radialGradient>
        <linearGradient id="chicken-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C98A4B" />
          <stop offset="100%" stopColor="#8F5B2C" />
        </linearGradient>
        <linearGradient id="plantain-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2C25C" />
          <stop offset="100%" stopColor="#D89B32" />
        </linearGradient>
      </defs>

      {/* plate */}
      <circle cx="200" cy="206" r="176" fill="url(#plate-grad)" />
      <circle
        cx="200"
        cy="206"
        r="176"
        fill="none"
        stroke="#F6EFE4"
        strokeOpacity="0.08"
        strokeWidth="2"
      />

      {/* rice mound */}
      <ellipse cx="188" cy="212" rx="132" ry="118" fill="url(#rice-grad)" />
      {/* rice/pepper texture flecks */}
      {[
        [140, 150, "#F2C25C"],
        [210, 140, "#8F2A18"],
        [235, 175, "#F2C25C"],
        [150, 195, "#8F2A18"],
        [175, 235, "#F2C25C"],
        [220, 250, "#8F2A18"],
        [255, 220, "#F2C25C"],
        [120, 220, "#F2C25C"],
        [190, 175, "#F6EFE4"],
        [160, 260, "#F6EFE4"],
      ].map(([cx, cy, fill], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={4.5} fill={fill as string} opacity={0.85} />
      ))}

      {/* grilled chicken pieces */}
      <g transform="translate(258 258) rotate(18)">
        <path
          d="M0 0c22-6 40 8 42 26 2 16-10 30-28 30-16 0-30-12-30-28C-16 12 -6 4 0 0Z"
          fill="url(#chicken-grad)"
        />
        <path d="M4 4c10 6 16 16 14 28" stroke="#5E3A18" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
      <g transform="translate(278 205) rotate(-10)">
        <ellipse cx="0" cy="0" rx="26" ry="19" fill="url(#chicken-grad)" />
        <path d="M-14 -4c8 2 18 2 26 0" stroke="#5E3A18" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* plantain fan */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={108 - i * 6}
          cy={280 + i * 2}
          rx="26"
          ry="14"
          fill="url(#plantain-grad)"
          stroke="#8A5A1E"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          transform={`rotate(${-18 + i * 14} ${108 - i * 6} ${280 + i * 2})`}
        />
      ))}

      {/* herb garnish */}
      <g transform="translate(150 118)">
        <path d="M0 10C4 0 14-4 22 2c-6 2-10 8-10 8s10-2 14 4c-8 6-18 4-24-2-2-4-2-8-2-12Z" fill="#4F7A52" />
        <path d="M20 6C26-2 36-4 44 2c-6 1-11 7-11 7s10-1 13 5c-8 5-17 2-22-4-2-3-3-6-4-4Z" fill="#3E6650" />
      </g>

      {/* steam */}
      <g stroke="#F6EFE4" strokeLinecap="round" fill="none">
        <path d="M150 60c-10 14 10 18 0 32" strokeWidth="4" opacity="0.25" />
        <path d="M185 48c-10 14 10 18 0 32" strokeWidth="4" opacity="0.35" />
        <path d="M220 60c-10 14 10 18 0 32" strokeWidth="4" opacity="0.25" />
      </g>
    </svg>
  );
}
