import type { PaneId, WorkspaceFile } from "@/types";
import { files, playgroundFile } from "@/data/workspace";

/**
 * Pure tab-bar logic, deliberately free of React and the router so the rules
 * can be reasoned about (and tested) on their own.
 */

const allFiles: readonly WorkspaceFile[] = [...files, playgroundFile];

/** Resolve a pathname such as `/projects` to the file it opens. */
export function findFileByPath(pathname: string): WorkspaceFile | undefined {
  const normalized =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return allFiles.find((file) => file.href === normalized);
}

export function findFileById(id: PaneId): WorkspaceFile | undefined {
  return allFiles.find((file) => file.id === id);
}

/** Append `id` if it isn't open yet, preserving the existing tab order. */
export function openTab(openIds: readonly PaneId[], id: PaneId): PaneId[] {
  return openIds.includes(id) ? [...openIds] : [...openIds, id];
}

export interface CloseTabResult {
  openIds: PaneId[];
  /** The tab that should become active, or null when nothing is left open. */
  nextActiveId: PaneId | null;
}

/**
 * Close a tab and work out what to focus next.
 *
 * Closing an inactive tab must not move focus; closing the active one falls
 * back to its right-hand neighbour, then its left-hand one. The original
 * implementation did this inside a `setState` updater, which React invokes
 * twice in Strict Mode - so the navigation fired twice. Computing it as a pure
 * function makes the result predictable.
 */
export function closeTab(
  openIds: readonly PaneId[],
  id: PaneId,
  activeId: PaneId | null,
): CloseTabResult {
  const index = openIds.indexOf(id);
  const remaining = openIds.filter((tabId) => tabId !== id);

  if (index === -1 || activeId !== id) {
    return { openIds: remaining, nextActiveId: activeId };
  }

  if (remaining.length === 0) {
    return { openIds: remaining, nextActiveId: null };
  }

  const neighbourIndex = Math.min(index, remaining.length - 1);
  return { openIds: remaining, nextActiveId: remaining[neighbourIndex] ?? null };
}
