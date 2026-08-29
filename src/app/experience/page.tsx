import type { Metadata } from "next";
import { ExperiencePane } from "@/components/panes/experience-pane";
import { getFile } from "@/data/workspace";

const file = getFile("experience");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperiencePane />;
}
