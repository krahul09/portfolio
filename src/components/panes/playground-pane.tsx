import Link from "next/link";
import { ArrowRight, FileCode2 } from "lucide-react";
import { PongGame } from "@/components/game/pong-game";
import { HobbiesCard } from "@/components/hobbies/hobbies-card";
import { profile } from "@/data/profile";
import { CodeLine, Token } from "@/components/ui/syntax";
import { LiveDot } from "@/components/ui/live-dot";

/**
 * The landing pane.
 *
 * Deliberately not the resume: the intro card carries the name and role for
 * anyone (or anything) reading the page, then points at about.tsx. Everything
 * substantive still lives one click away, and on its own indexable route.
 */
export function PlaygroundPane() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header className="border-line-soft bg-surface-raised rounded-xl border p-5 sm:p-6">
        <CodeLine>
          <Token kind="comment">
            {"// you're in the workspace — pick a file, or rally below"}
          </Token>
        </CodeLine>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-mint mb-2 inline-flex items-center gap-2 text-[11px]">
              <LiveDot />
              {profile.availability}
            </p>
            <h1 className="font-display text-ink text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.name}
            </h1>
            <p className="text-ink-muted mt-1 text-[13px]">{profile.headline}</p>
          </div>

          <Link
            href="/about"
            className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 group inline-flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-medium transition-colors"
          >
            <FileCode2 size={15} aria-hidden="true" />
            open about.tsx
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      {/*
        `items-stretch` is the default, and it is what makes both cards share
        the taller card's height — the previous layout let them size
        independently, which left a ragged bottom edge.
      */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <PongGame />
        <HobbiesCard />
      </div>
    </div>
  );
}
