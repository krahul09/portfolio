"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceTabs } from "@/hooks/use-workspace-tabs";
import { Explorer } from "./explorer";
import { StatusBar } from "./status-bar";
import { TabBar } from "./tab-bar";
import { TitleBar } from "./title-bar";

import { BootScreen } from "@/components/boot/boot-screen";

/**
 * The persistent editor chrome.
 *
 * This is a Client Component, but `children` arrives as an already-rendered
 * Server Component tree. That boundary is the whole trick: the panes stay
 * server-rendered — so their content is in the initial HTML for crawlers and
 * link previews — while the interactive shell around them hydrates normally.
 * The chrome also survives navigation, so switching tabs never re-mounts it.
 */
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { openFiles, activeFile, activeId, closeTab } = useWorkspaceTabs();

  return (
    <div className="bg-surface-base flex h-dvh flex-col overflow-hidden">
      <BootScreen />

      <TitleBar />

      <div className="relative flex min-h-0 flex-1">
        <Explorer activeId={activeId} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TabBar openFiles={openFiles} activeId={activeId} onClose={closeTab} />

          {/* tabIndex makes this scroll container reachable by keyboard: panes
              such as Experience contain no focusable elements, so without it a
              keyboard user could not scroll the content at all. It doubles as
              the skip-link target. */}
          <main
            id="content"
            tabIndex={0}
            className="bg-surface-base flex-1 overflow-y-auto focus-visible:outline-none"
          >
            {/*
              Keying on the route restarts the enter animation per pane.

              `min-h-full` and not `h-full`: a fixed height would let a tall
              pane's content overflow *outside* the wrapper box, which keeps it
              out of `main`'s scrollHeight — so the page would clip instead of
              scrolling. `min-h` grows with content, while still giving a flex
              child (the resume viewer) a full-height box to expand into.
            */}
            <div
              key={pathname}
              className="animate-in flex min-h-full flex-col px-4 py-5 sm:px-6"
            >
              {children}
            </div>
          </main>

          <StatusBar activeFile={activeFile} />
        </div>
      </div>
    </div>
  );
}
