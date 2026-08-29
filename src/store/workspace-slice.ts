import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaneId } from "@/types";

export interface WorkspaceState {
  /** Tabs currently open in the editor, in tab-bar order. */
  openTabIds: PaneId[];
  isSidebarOpen: boolean;
  hasBooted: boolean;
}

const initialState: WorkspaceState = {
  openTabIds: [],
  isSidebarOpen: false,
  hasBooted: false,
};

/**
 * Editor chrome state.
 *
 * Note what is *not* here: the active tab. That is derived from the URL, so
 * storing it would create two sources of truth that can disagree after a
 * back-button press.
 */
const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    tabOpened(state, action: PayloadAction<PaneId>) {
      if (!state.openTabIds.includes(action.payload)) {
        state.openTabIds.push(action.payload);
      }
    },
    tabClosed(state, action: PayloadAction<PaneId>) {
      state.openTabIds = state.openTabIds.filter((id) => id !== action.payload);
    },
    /** Replay a persisted tab set after hydration. */
    tabsRestored(state, action: PayloadAction<PaneId[]>) {
      const merged = [...action.payload];
      for (const id of state.openTabIds) {
        if (!merged.includes(id)) merged.push(id);
      }
      state.openTabIds = merged;
    },
    sidebarToggled(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    sidebarClosed(state) {
      state.isSidebarOpen = false;
    },
    bootCompleted(state) {
      state.hasBooted = true;
    },
  },
  selectors: {
    selectOpenTabIds: (state) => state.openTabIds,
    selectIsSidebarOpen: (state) => state.isSidebarOpen,
    selectHasBooted: (state) => state.hasBooted,
  },
});

export const {
  tabOpened,
  tabClosed,
  tabsRestored,
  sidebarToggled,
  sidebarClosed,
  bootCompleted,
} = workspaceSlice.actions;

export const { selectOpenTabIds, selectIsSidebarOpen, selectHasBooted } =
  workspaceSlice.selectors;

export default workspaceSlice;
