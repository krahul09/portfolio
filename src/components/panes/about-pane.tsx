import { MapPin } from "lucide-react";
import { profile, stats } from "@/data/profile";
import { CodeFrame } from "@/components/ui/code-frame";
import { Counter } from "@/components/ui/counter";
import { LiveDot } from "@/components/ui/live-dot";
import { Reveal } from "@/components/ui/reveal";
import { Token } from "@/components/ui/syntax";
import { RoleTypewriter } from "./role-typewriter";

/**
 * The landing pane.
 *
 * A Server Component: the name, summary and every stat are in the initial
 * HTML. Only the cycling job title and the count-up animation are client
 * islands, and both degrade to plain text without JavaScript.
 */
export function AboutPane() {
  return (
    <CodeFrame name="About">
      <div className="max-w-3xl">
        <p className="border-mint/25 bg-mint/5 text-mint mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]">
          <LiveDot />
          {profile.availability}
        </p>

        <h1 className="font-display text-ink text-4xl font-bold tracking-tight sm:text-6xl">
          {profile.name}
        </h1>

        <p className="mt-3 text-lg sm:text-2xl">
          <Token kind="string">&quot;</Token>
          <RoleTypewriter roles={profile.roles} />
          <Token kind="string">&quot;</Token>
        </p>

        <p className="text-ink-muted mt-6 max-w-2xl text-sm leading-7">
          {profile.summary}
        </p>

        <p className="text-ink-faint mt-5 flex items-center gap-1.5 text-xs">
          <MapPin size={13} aria-hidden="true" />
          {profile.location}
        </p>

        <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.id}
              index={index}
              stagger={80}
              className="border-line-soft bg-surface-raised hover:border-mint/30 rounded-lg border p-4 transition-colors"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-mint block text-2xl font-bold tabular-nums sm:text-3xl">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-ink-faint mt-1.5 block text-[11px] leading-tight">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </CodeFrame>
  );
}
