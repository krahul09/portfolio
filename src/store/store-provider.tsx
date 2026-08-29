"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { makeStore, type AppStore, type RootState } from "./index";
import { readJson, storageKeys } from "@/lib/storage";
import { bestScoreRestored } from "./game-slice";
import workspaceSlice, { tabsRestored } from "./workspace-slice";
import type { PaneId } from "@/types";
import { findFileByPath, findFileById } from "@/lib/tabs";

function isPaneId(value: unknown): value is PaneId {
  return typeof value === "string" && findFileById(value as PaneId) !== undefined;
}

/**
 * Seed the store from the URL alone.
 *
 * The current route is the one piece of state the server and the client agree
 * on before hydration, so opening its tab here means the tab bar and the
 * explorer's open-file dot are present in the server HTML - no empty flash,
 * and no mismatch.
 */
function createPreloadedState(pathname: string): Partial<RootState> | undefined {
  const activeId = findFileByPath(pathname)?.id;
  if (!activeId) return undefined;

  return {
    workspace: { ...workspaceSlice.getInitialState(), openTabIds: [activeId] },
  };
}

interface PersistedState {
  openTabIds: PaneId[];
  bestScore: number;
}

/**
 * Read persisted state during render, without using it for rendering.
 *
 * The timing matters. Effects run child-first, so `useWorkspaceTabs` dispatches
 * `tabOpened` - and the persistence middleware writes the current route back to
 * sessionStorage - before this provider's own effect would get a chance to read
 * it. Taking the snapshot in the render phase captures the value before any
 * effect can clobber it.
 *
 * Reading storage here is safe precisely because the result never reaches the
 * rendered output; it is only dispatched after mount. On the server every read
 * returns the fallback.
 */
function readPersistedState(): PersistedState {
  const storedTabs = readJson<unknown>(storageKeys.openTabs, [], "session");
  const storedBest = readJson<unknown>(storageKeys.pongBest, 0, "local");

  return {
    openTabIds: Array.isArray(storedTabs) ? storedTabs.filter(isPaneId) : [],
    bestScore: typeof storedBest === "number" ? storedBest : 0,
  };
}

/** Apply the snapshot once the tree has mounted. */
function applyPersistedState(store: AppStore, persisted: PersistedState): void {
  if (persisted.openTabIds.length > 0) {
    store.dispatch(tabsRestored(persisted.openTabIds));
  }
  if (persisted.bestScore > 0) {
    store.dispatch(bestScoreRestored(persisted.bestScore));
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // A lazy initialiser, not a module constant: the factory runs exactly once
  // per mount, so there is one store per browser tab and never a store shared
  // between concurrent server requests.
  const [store] = useState<AppStore>(() => makeStore(createPreloadedState(pathname)));

  // Snapshot taken during render, dispatched after mount - see above.
  const [persisted] = useState<PersistedState>(readPersistedState);

  useEffect(() => {
    applyPersistedState(store, persisted);
  }, [store, persisted]);

  return <Provider store={store}>{children}</Provider>;
}
