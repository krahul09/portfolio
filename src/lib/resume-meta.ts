import "server-only";

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { resumePath } from "@/data/profile";

export interface ResumeMeta {
  /** Rounded file size in kilobytes. */
  readonly sizeKb: number;
  readonly pages: number;
}

/**
 * Reads the resume's size and page count off disk at build time.
 *
 * Derived rather than hardcoded: the label used to read "1 page · 44 KB" as a
 * string literal, which silently went stale the moment the PDF was replaced.
 * `/resume` is fully static, so this runs during the build and never on a
 * visitor's request.
 */
export function getResumeMeta(): ResumeMeta {
  const file = join(process.cwd(), "public", resumePath.replace(/^\//, ""));

  try {
    const sizeKb = Math.round(statSync(file).size / 1024);

    // Count page objects. `[^s]` excludes the `/Type /Pages` tree node, which
    // would otherwise be counted alongside the real pages.
    const pages =
      readFileSync(file)
        .toString("latin1")
        .match(/\/Type\s*\/Page[^s]/g)?.length ?? 1;

    return { sizeKb, pages: Math.max(pages, 1) };
  } catch {
    // Never fail a build over a label.
    return { sizeKb: 0, pages: 1 };
  }
}
