"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PaneId, WorkspaceFile } from "@/types";
import { playgroundFile } from "@/data/workspace";
import { closeTab as resolveClose, findFileById, findFileByPath } from "@/lib/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOpenTabIds, tabClosed, tabOpened } from "@/store/workspace-slice";

interface WorkspaceTabs {
  openFiles: WorkspaceFile[];
  activeFile: WorkspaceFile | undefined;
  activeId: PaneId | null;
  closeTab: (id: PaneId) => void;
}

/**
 * Bridges the editor tab bar to the App Router.
 *
 * The active tab *is* the current route, which makes every pane deep-linkable
 * and the browser back button behave the way people expect. Redux owns only
 * the set of open tabs; persistence is handled by listener middleware.
 */
export function useWorkspaceTabs(): WorkspaceTabs {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const openTabIds = useAppSelector(selectOpenTabIds);

  const activeFile = findFileByPath(pathname);
  const activeId = activeFile?.id ?? null;

  // Navigating to a route always opens its tab - including on first load and
  // when the user arrives from an external deep link.
  useEffect(() => {
    if (activeId) dispatch(tabOpened(activeId));
  }, [activeId, dispatch]);

  const closeTab = useCallback(
    (id: PaneId) => {
      const { nextActiveId } = resolveClose(openTabIds, id, activeId);
      dispatch(tabClosed(id));

      if (nextActiveId === activeId) return;
      const destination = nextActiveId
        ? findFileById(nextActiveId)?.href
        : playgroundFile.href;
      if (destination) router.push(destination);
    },
    [openTabIds, activeId, dispatch, router],
  );

  const openFiles = openTabIds
    .map(findFileById)
    .filter((file): file is WorkspaceFile => file !== undefined);

  return { openFiles, activeFile, activeId, closeTab };
}
