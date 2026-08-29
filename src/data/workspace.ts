import type { FileKind, PaneId, WorkspaceFile } from "@/types";

/**
 * The landing route.
 *
 * A deliberate choice: visitors rarely close tabs, so a playground reachable
 * only by emptying the tab bar was effectively undiscoverable. Opening here
 * puts it in front of everyone, and the pane itself points at about.tsx for
 * anyone who wants the resume.
 */
export const playgroundFile: WorkspaceFile = {
  id: "playground",
  label: "rally.tsx",
  kind: "tsx",
  href: "/",
  title: "Rahul Kumar — Frontend Software Engineer",
  description:
    "The workspace of Rahul Kumar, Frontend Software Engineer and Founding Engineer. Play a rally, then open about.tsx.",
};

/**
 * The workspace file tree. This single array drives:
 *  - the explorer sidebar
 *  - the tab bar
 *  - per-route metadata
 *  - the sitemap
 *
 * Adding a pane means adding one entry here plus one `page.tsx`.
 */
export const files: readonly WorkspaceFile[] = [
  playgroundFile,
  {
    id: "about",
    label: "about.tsx",
    kind: "tsx",
    href: "/about",
    title: "About",
    description:
      "Frontend Software Engineer and Founding Engineer building large-scale production web platforms, AI features and real-time systems.",
  },
  {
    id: "experience",
    label: "experience.ts",
    kind: "ts",
    href: "/experience",
    title: "Experience",
    description:
      "Founding Engineer at RegisterKaro, plus frontend roles at TalentMonk, Machine Learning Inc. and HELPY.MOTO.",
  },
  {
    id: "skills",
    label: "skills.json",
    kind: "json",
    href: "/skills",
    title: "Skills",
    description:
      "React, Next.js, TypeScript, Node.js, LLM orchestration, performance architecture and web security.",
  },
  {
    id: "projects",
    label: "projects.tsx",
    kind: "tsx",
    href: "/projects",
    title: "Projects",
    description:
      "Careerly, SafeDocs and GymBro — AI-powered products built end to end.",
  },
  {
    id: "resume",
    label: "resume.pdf",
    kind: "pdf",
    href: "/resume",
    title: "Resume",
    description:
      "View or download Rahul Kumar's resume — Frontend Software Engineer and Founding Engineer.",
  },
  {
    id: "contact",
    label: "contact.md",
    kind: "md",
    href: "/contact",
    title: "Contact",
    description: "Get in touch with Rahul Kumar — email, phone, LinkedIn and GitHub.",
  },
];

const fileIndex: ReadonlyMap<PaneId, WorkspaceFile> = new Map(
  files.map((file) => [file.id, file]),
);

export function getFile(id: PaneId): WorkspaceFile | undefined {
  return fileIndex.get(id);
}

/** Status-bar language label, keyed off the file extension. */
export const languageByKind: Record<FileKind, string> = {
  tsx: "TypeScript React",
  ts: "TypeScript",
  json: "JSON",
  md: "Markdown",
  pdf: "PDF",
};
