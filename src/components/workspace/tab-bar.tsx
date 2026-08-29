"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { PaneId, WorkspaceFile } from "@/types";
import { cn } from "@/lib/cn";
import { FileIcon } from "@/components/ui/file-icon";

interface TabBarProps {
  openFiles: readonly WorkspaceFile[];
  activeId: PaneId | null;
  onClose: (id: PaneId) => void;
}

/**
 * Editor tabs.
 *
 * Deliberately *not* `role="tablist"`. ARIA tabs describe panels swapped
 * within one document; these are links to separate routes, so navigation
 * semantics are the honest description - and `aria-current="page"` tells a
 * screen reader which one is open.
 *
 * Each tab is a link with a sibling close button, never a button nested inside
 * a button: that markup is invalid and browsers resolve the click target
 * unpredictably.
 */
export function TabBar({ openFiles, activeId, onClose }: TabBarProps) {
  if (openFiles.length === 0) return null;

  return (
    <nav
      aria-label="Open files"
      className="border-line bg-surface-raised shrink-0 border-b"
    >
      <ul className="flex overflow-x-auto">
        {openFiles.map((file) => {
          const isActive = activeId === file.id;
          return (
            <li
              key={file.id}
              className={cn(
                "group border-line-soft flex shrink-0 items-center border-r border-b-2",
                "transition-colors duration-150",
                isActive
                  ? "border-b-mint bg-surface-base"
                  : "hover:bg-surface-overlay border-b-transparent",
              )}
            >
              <Link
                href={file.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 py-2.5 pr-2 pl-4 text-[12.5px] whitespace-nowrap",
                  isActive ? "text-ink" : "text-ink-faint group-hover:text-ink-muted",
                )}
              >
                <FileIcon kind={file.kind} size={13} />
                {file.label}
              </Link>

              <button
                type="button"
                onClick={() => onClose(file.id)}
                aria-label={`Close ${file.label}`}
                className={cn(
                  "text-ink-faint mr-2 grid size-[18px] place-items-center rounded",
                  "hover:bg-pink/15 hover:text-pink transition-colors",
                )}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
