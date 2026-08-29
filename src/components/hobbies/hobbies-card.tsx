import { BookOpen, Crown, ExternalLink, Sparkles } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { chess, footballClubs, interests } from "@/data/hobbies";
import type { Interest } from "@/types";
import { Tag } from "@/components/ui/tag";
import { ClubCrest } from "./club-crest";
import { ChessRating } from "./chess-rating";

const interestIcons = {
  sparkles: Sparkles,
  book: BookOpen,
} as const satisfies Record<Interest["icon"], ComponentType<{ size?: number }>>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-line-soft border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-ink-faint mb-3 text-[10px] tracking-[0.12em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Everything outside of work. Server-rendered apart from the live rating. */
export function HobbiesCard() {
  return (
    <aside className="border-line-soft bg-surface-raised flex h-full flex-col gap-5 rounded-xl border p-5">
      <h2 className="text-ink-faint text-[12px] italic">
        {"// when I'm not shipping code"}
      </h2>

      <Section title="on the board">
        <a
          href={chess.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-ink-muted group-hover:text-ink flex items-center gap-2 text-[12px] transition-colors">
            <Crown size={15} aria-hidden="true" className="text-amber" />
            Chess.com · @{chess.username}
            <ExternalLink
              size={12}
              aria-hidden="true"
              className="text-ink-faint group-hover:text-mint transition-colors"
            />
          </p>
          <ChessRating />
        </a>
      </Section>

      <Section title="on the pitch">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {footballClubs.map((club) => (
            <li key={club.id}>
              {/* The accent is per-club, so it has to be an inline custom
                  property rather than a utility class. */}
              <div
                className="border-line-soft bg-surface-base flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-(--club-accent)"
                style={{ "--club-accent": club.accent } as React.CSSProperties}
              >
                <ClubCrest club={club} size={34} />
                <span className="min-w-0 leading-tight">
                  <span className="text-ink block truncate text-[12.5px]">
                    {club.name}
                  </span>
                  <span className="text-ink-faint block text-[10px]">
                    est. {club.founded}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="also into">
        <ul className="flex flex-wrap gap-1.5">
          {interests.map((interest) => {
            const Icon = interestIcons[interest.icon];
            return (
              <li key={interest.label}>
                <Tag>
                  <Icon size={11} />
                  {interest.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      </Section>
    </aside>
  );
}
