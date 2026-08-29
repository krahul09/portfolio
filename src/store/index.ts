import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { chessApi } from "./chess-api";
import gameSlice from "./game-slice";
import workspaceSlice from "./workspace-slice";
import { persistenceMiddleware } from "./persistence-middleware";

/**
 * Combined up front rather than inline in `configureStore`, so `RootState` can
 * be derived from it without depending on `makeStore` - which needs the type
 * for its own `preloadedState` parameter.
 */
const rootReducer = combineReducers({
  [workspaceSlice.reducerPath]: workspaceSlice.reducer,
  [gameSlice.reducerPath]: gameSlice.reducer,
  [chessApi.reducerPath]: chessApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Builds a fresh store.
 *
 * In the App Router a module-level store singleton would be shared across
 * concurrent server requests, leaking one visitor's state into another's HTML.
 * Creating the store per request - and once per browser tab on the client -
 * is the supported pattern.
 *
 * `preloadedState` must be derivable identically on the server and the client
 * (the URL qualifies; browser storage does not), otherwise the first client
 * render disagrees with the server HTML and hydration fails.
 */
export function makeStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(persistenceMiddleware.middleware)
        .concat(chessApi.middleware),
  });

  // Enables RTK Query's refetchOnFocus / refetchOnReconnect behaviour.
  setupListeners(store.dispatch);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
