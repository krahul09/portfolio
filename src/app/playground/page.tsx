import type { Metadata } from "next";
import { PlaygroundPane } from "@/components/panes/playground-pane";
import { playgroundFile } from "@/data/workspace";

export const metadata: Metadata = {
  title: playgroundFile.title,
  description: playgroundFile.description,
  alternates: { canonical: "/playground" },
  // Fun, but not what should rank for this person's name.
  robots: { index: false, follow: true },
};

export default function PlaygroundPage() {
  return <PlaygroundPane />;
}
