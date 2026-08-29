import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { storageKeys, writeJson } from "@/lib/storage";
import { gameEnded } from "./game-slice";
import { tabClosed, tabOpened, tabsRestored } from "./workspace-slice";
import type { RootState } from "./index";

/**
 * Mirrors the bits of state worth surviving a reload into browser storage.
 *
 * Doing this as listener middleware rather than a `useEffect` keeps components
 * unaware that persistence exists at all, and means a single subscription
 * covers every action that can change the persisted values.
 */
export const persistenceMiddleware = createListenerMiddleware();

const startListening = persistenceMiddleware.startListening.withTypes<RootState>();

startListening({
  matcher: isAnyOf(tabOpened, tabClosed, tabsRestored),
  effect: (_action, api) => {
    writeJson(storageKeys.openTabs, api.getState().workspace.openTabIds, "session");
  },
});

startListening({
  actionCreator: gameEnded,
  effect: (_action, api) => {
    writeJson(storageKeys.pongBest, api.getState().game.bestScore, "local");
  },
});
