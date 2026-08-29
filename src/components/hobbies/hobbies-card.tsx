import { BookOpen, Crown, ExternalLink, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import { chess, footballClubs, interests } from "@/data/hobbies";
import type { Interest } from "@/types";
import { Tag } from "@/components/ui/tag";
import { ClubShield } from "./club-shield";
import { ChessRating } from "./chess-rating";

const interestIcons = {
  sparkles: Sparkles,
  book: BookOpen,
} as const satisfies Record<Interest["icon"], ComponentType<{ size?: number }>>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="text-ink-faint mb-2 text-[10px] tracking-[0.1em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Everything outside of work. Server-rendered apart from the live rating. */
export function HobbiesCard() {
  return (
    <aside className="border-line-soft bg-surface-raised rounded-lg border p-4">
      <h2 className="text-ink-faint text-[12px] italic">
        {"// when I'm not shipping code"}
      </h2>

      <Section title="on the board">
        <a
          href={chess.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-md transition-opacity hover:opacity-90"
        >
          <p className="text-ink-muted flex items-center gap-2 text-[12px]">
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
        <ul className="flex flex-wrap gap-2">
          {footballClubs.map((club) => (
            <li
              key={club.code}
              className="border-line-soft bg-surface-base flex items-center gap-2.5 rounded-md border px-3 py-2"
            >
              <ClubShield club={club} />
              <span className="leading-tight">
                <span className="text-ink block text-[12px]">{club.name}</span>
                <span className="text-ink-faint block text-[10px]">
                  est. {club.founded}
                </span>
              </span>
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
