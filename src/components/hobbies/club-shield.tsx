import { useId } from "react";
import type { FootballClub } from "@/types";

/** A club crest, drawn as SVG so it stays crisp at any size. */
export function ClubShield({ club, size = 34 }: { club: FootballClub; size?: number }) {
  // useId keeps the gradient id unique even if the same crest renders twice.
  const gradientId = useId();
  const { colors, code } = club;

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 40 46"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
      </defs>

      <path
        d="M20 2 L36 8 V21 C36 31.5 29.2 39.6 20 44 C10.8 39.6 4 31.5 4 21 V8 Z"
        fill={`url(#${gradientId})`}
        stroke={colors.trim}
        strokeWidth="1.4"
      />
      <path
        d="M20 6 L32 10.5 V21 C32 29.3 26.6 35.9 20 39.7 C13.4 35.9 8 29.3 8 21 V10.5 Z"
        fill="none"
        stroke={colors.trim}
        strokeWidth="0.6"
        opacity="0.5"
      />
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="12.5"
        fill={colors.text}
      >
        {code}
      </text>
    </svg>
  );
}
