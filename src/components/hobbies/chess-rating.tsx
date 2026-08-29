"use client";

import { Flame, Trophy } from "lucide-react";
import { chess } from "@/data/hobbies";
import { useGetRapidRatingQuery } from "@/store/chess-api";
import { cn } from "@/lib/cn";

interface StatProps {
  value: string;
  label: React.ReactNode;
  className?: string;
}

function Stat({ value, label, className }: StatProps) {
  return (
    <div className="flex-1">
      <p
        className={cn(
          "font-display text-ink text-xl font-bold tabular-nums",
          className,
        )}
      >
        {value}
      </p>
      <p className="text-ink-faint mt-0.5 flex items-center gap-1 text-[10px]">
        {label}
      </p>
    </div>
  );
}

/**
 * Live rapid rating from chess.com.
 *
 * RTK Query polls every 45s and pauses automatically when this component
 * unmounts. The fallback rating renders immediately, so the card is never
 * blank or layout-shifting while the request is in flight.
 */
export function ChessRating() {
  const { data, isSuccess, isError } = useGetRapidRatingQuery(chess.apiUsername, {
    pollingInterval: 45_000,
    refetchOnFocus: true,
  });

  const rating = isSuccess && data !== null ? data : chess.fallbackRapid;
  const isLive = isSuccess && data !== null;

  return (
    <div className="border-line-soft bg-surface-base mt-3 flex gap-4 rounded-md border p-3">
      <Stat
        value={String(rating)}
        className={isLive ? "text-mint" : undefined}
        label={
          <>
            <span
              aria-hidden="true"
              className={cn(
                "inline-block size-1.5 rounded-full",
                isLive ? "animate-pulse-soft bg-mint" : "bg-ink-faint",
              )}
            />
            rapid {isLive ? "· live" : isError ? "· cached" : ""}
          </>
        }
      />
      <Stat
        value={`${chess.streak}d`}
        label={
          <>
            <Flame size={10} aria-hidden="true" /> streak
          </>
        }
      />
      <Stat
        value={`#${chess.leagueRank}`}
        label={
          <>
            <Trophy size={10} aria-hidden="true" /> {chess.league}
          </>
        }
      />
    </div>
  );
}
