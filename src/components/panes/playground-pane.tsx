import Link from "next/link";
import { ArrowRight, FileCode2 } from "lucide-react";
import { PongGame } from "@/components/game/pong-game";
import { HobbiesCard } from "@/components/hobbies/hobbies-card";
import { profile } from "@/data/profile";
import { LiveDot } from "@/components/ui/live-dot";

/**
 * The landing pane.
 *
 * Deliberately not the resume: the intro carries the name and role for anyone
 * (or anything) reading the page, then points at about.tsx. Everything
 * substantive is one click away, on its own indexable route.
 *
 * Sized to fit a laptop viewport without scrolling — the whole point of
 * landing here is that the game and the cards are visible at a glance, which
 * a scrollbar undermines.
 */
export function PlaygroundPane() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      {/* One compact row rather than a stacked block: the standalone comment
          line and the separate availability row cost ~90px of vertical space
          between them and said little the status bar does not already say. */}
      <header className="border-line-soft bg-surface-raised flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-ink text-xl font-bold tracking-tight sm:text-2xl">
              {profile.name}
            </h1>
            <p className="text-mint inline-flex items-center gap-1.5 text-[11px]">
              <LiveDot />
              {profile.availability}
            </p>
          </div>
          <p className="text-ink-muted mt-0.5 text-[13px]">{profile.headline}</p>
        </div>

        <Link
          href="/about"
          className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 group inline-flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors"
        >
          <FileCode2 size={15} aria-hidden="true" />
          open about.tsx
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <PongGame />
        <HobbiesCard />
      </div>
    </div>
  );
}
