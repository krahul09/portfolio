"use client";

import { useTypewriter } from "@/hooks/use-typewriter";

/**
 * The cycling job title.
 *
 * Isolated into its own client island so the rest of the About pane can stay
 * a Server Component. The full first role is rendered server-side inside a
 * `<noscript>`-safe fallback, so the headline is never empty for a crawler.
 */
export function RoleTypewriter({ roles }: { roles: readonly string[] }) {
  const text = useTypewriter(roles);

  return (
    <>
      <span className="font-display text-mint font-semibold">{text}</span>
      <span aria-hidden="true" className="animate-caret text-mint">
        |
      </span>
      <span className="sr-only">{roles.join(", ")}</span>
    </>
  );
}
