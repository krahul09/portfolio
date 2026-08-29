import type { Metadata } from "next";
import { ProjectsPane } from "@/components/panes/projects-pane";
import { getFile } from "@/data/workspace";

const file = getFile("projects");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsPane />;
}
