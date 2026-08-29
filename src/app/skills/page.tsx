import type { Metadata } from "next";
import { SkillsPane } from "@/components/panes/skills-pane";
import { getFile } from "@/data/workspace";

const file = getFile("skills");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return <SkillsPane />;
}
