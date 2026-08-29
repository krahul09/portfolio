import type { BootStep } from "@/types";

/**
 * The intro plays as an install: resolve the person, pull the dependencies,
 * build the workspace, launch it.
 *
 * Total runtime is roughly 6.5s at the timings in `boot-screen.tsx`, and it is
 * skippable at any point. Steps are ordered top to bottom exactly as they
 * appear on screen.
 */
export const bootSequence: readonly BootStep[] = [
  { kind: "command", text: "whoami" },
  { kind: "output", text: "rahul_kumar" },
  { kind: "spacer" },

  { kind: "command", text: "cat role.txt" },
  {
    kind: "output",
    text: "Frontend Software Engineer · Founding Engineer @ RegisterKaro",
    tone: "muted",
  },
  { kind: "spacer" },

  { kind: "command", text: "npm i @rahul/portfolio" },
  { kind: "output", text: "resolving dependencies…", tone: "dim" },
  {
    kind: "packages",
    items: ["next@16.3.3", "react@19.2.8", "typescript@6.0.3", "tailwindcss@4.3.3"],
  },
  { kind: "output", text: "added 4 packages in 1.2s", tone: "muted" },
  { kind: "spacer" },

  { kind: "command", text: "npm run build" },
  { kind: "progress", label: "compiling experience.ts" },
  { kind: "progress", label: "loading skills.json" },
  { kind: "progress", label: "bundling projects.tsx" },
  { kind: "output", text: "compiled successfully", tone: "success" },
  { kind: "spacer" },

  { kind: "command", text: "./launch.sh" },
  { kind: "output", text: "booting workspace ⚡", tone: "accent" },
];
