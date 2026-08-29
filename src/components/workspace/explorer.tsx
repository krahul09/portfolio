"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { files } from "@/data/workspace";
import { cn } from "@/lib/cn";
import { FileIcon } from "@/components/ui/file-icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsSidebarOpen,
  selectOpenTabIds,
  sidebarClosed,
} from "@/store/workspace-slice";
import type { PaneId } from "@/types";

interface ExplorerProps {
  activeId: PaneId | null;
}

/**
 * The file tree.
 *
 * Every entry is a real `<Link>`, so panes are crawlable, middle-clickable and
 * open in a new tab like any other link — which a click handler on a `<button>`
 * would have quietly broken.
 */
export function Explorer({ activeId }: ExplorerProps) {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const openTabIds = useAppSelector(selectOpenTabIds);

  return (
    <>
      {/* Backdrop, mobile only */}
      {isSidebarOpen && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => dispatch(sidebarClosed())}
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
        />
      )}

      <nav
        id="file-explorer"
        aria-label="Portfolio sections"
        className={cn(
          "border-line bg-surface-raised z-30 w-52 shrink-0 border-r px-2.5 py-3.5",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:transition-transform max-md:duration-200",
          isSidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        )}
      >
        <p className="text-ink-faint px-1.5 pb-2.5 text-[10px] tracking-[0.12em]">
          EXPLORER
        </p>

        <p className="text-amber flex items-center gap-1.5 px-1.5 pb-2 text-xs font-semibold">
          <FolderOpen size={14} aria-hidden="true" />
          PORTFOLIO
        </p>

        <ul className="flex flex-col gap-px pl-3.5">
          {files.map((file) => {
            const isActive = activeId === file.id;
            return (
              <li key={file.id}>
                <Link
                  href={file.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => dispatch(sidebarClosed())}
                  className={cn(
                    "flex items-center gap-2 rounded-md border-l-2 px-2 py-1.5 text-[12.5px]",
                    "transition-colors duration-150",
                    isActive
                      ? "border-mint bg-surface-overlay text-ink"
                      : "text-ink-muted hover:bg-surface-overlay hover:text-ink border-transparent",
                  )}
                >
                  <FileIcon kind={file.kind} />
                  <span className="truncate">{file.label}</span>
                  {openTabIds.includes(file.id) && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "ml-auto size-1.5 shrink-0 rounded-full",
                        isActive ? "bg-mint" : "bg-ink-faint",
                      )}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
