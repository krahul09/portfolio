import type { Metadata } from "next";
import { ResumePane } from "@/components/panes/resume-pane";
import { getFile } from "@/data/workspace";

const file = getFile("resume");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return <ResumePane />;
}
