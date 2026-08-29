import type { Metadata } from "next";
import { AboutPane } from "@/components/panes/about-pane";
import { getFile } from "@/data/workspace";

const file = getFile("about");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPane />;
}
