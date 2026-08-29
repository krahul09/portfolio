import type { Metadata } from "next";
import { AboutPane } from "@/components/panes/about-pane";
import { getFile } from "@/data/workspace";

const file = getFile("about");

/**
 * No `title` here on purpose.
 *
 * `title.template` in the root layout does not apply to metadata in the same
 * route segment, so setting one would render a bare "About". Omitting it falls
 * back to the layout's `title.default` - the full name and headline, which is
 * what should rank for a search of this person's name.
 */
export const metadata: Metadata = {
  description: file?.description,
  alternates: { canonical: "/" },
};

export default function AboutPage() {
  return <AboutPane />;
}
