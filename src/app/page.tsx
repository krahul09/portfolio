import type { Metadata } from "next";
import { PlaygroundPane } from "@/components/panes/playground-pane";
import { profile } from "@/data/profile";

/**
 * No `title` here on purpose.
 *
 * `title.template` in the root layout does not apply to metadata in the same
 * route segment, so setting one would render a bare "Playground". Omitting it
 * falls back to the layout's `title.default` — the full name and headline,
 * which is what should rank for a search of this person's name.
 */
export const metadata: Metadata = {
  description: profile.summary,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <PlaygroundPane />;
}
