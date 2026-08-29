import type { Route } from "next";

/**
 * Domain types for the portfolio content.
 *
 * Data modules in `src/data` are typed against these, so a typo in a route id
 * or a missing field fails `npm run typecheck` instead of rendering blank.
 */

/** Every workspace "file" is also a route. Ids are the single source of truth. */
export type PaneId =
  "about" | "experience" | "skills" | "projects" | "resume" | "contact" | "playground";

/** Drives both the file-icon colour and the status bar language indicator. */
export type FileKind = "tsx" | "ts" | "json" | "md" | "pdf";

export interface WorkspaceFile {
  readonly id: PaneId;
  /** Filename shown in the explorer and tab bar. */
  readonly label: string;
  readonly kind: FileKind;
  /** App Router path this file opens. Validated against real routes. */
  readonly href: Route;
  /** Used for per-route <title> and meta description. */
  readonly title: string;
  readonly description: string;
}

export interface Stat {
  readonly id: string;
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export interface SkillGroup {
  readonly key: string;
  readonly label: string;
  readonly items: readonly string[];
}

export interface Job {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly location: string;
  readonly dates: string;
  /** Machine-readable bounds for JSON-LD and <time> elements. */
  readonly startDate: string;
  readonly endDate: string | null;
  readonly current?: boolean;
  readonly bullets: readonly string[];
  readonly tags: readonly string[];
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly domain: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: "mail" | "phone" | "github" | "linkedin" | "resume";
  readonly external?: boolean;
}

export interface FootballClub {
  readonly id: string;
  readonly name: string;
  readonly founded: number;
  /** Path to the club's official crest under `public/`. */
  readonly crest: string;
  /** Accent colour used for the card's hover state. */
  readonly accent: string;
}

export interface Interest {
  readonly label: string;
  readonly icon: "sparkles" | "book";
}

/** Colour role for a line of terminal output. */
export type BootTone = "default" | "muted" | "dim" | "success" | "accent";

/**
 * One instruction in the boot sequence.
 *
 * The animation is a data script rather than hard-coded steps, so the pacing
 * and the copy can both be tuned without touching the runner.
 */
export type BootStep =
  | { readonly kind: "command"; readonly text: string }
  | { readonly kind: "output"; readonly text: string; readonly tone?: BootTone }
  | { readonly kind: "packages"; readonly items: readonly string[] }
  | { readonly kind: "progress"; readonly label: string }
  | { readonly kind: "spacer" };
