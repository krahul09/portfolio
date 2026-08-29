import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type GamePhase = "idle" | "playing" | "over";

export interface GameState {
  score: number;
  bestScore: number;
  phase: GamePhase;
}

const initialState: GameState = {
  score: 0,
  bestScore: 0,
  phase: "idle",
};

/**
 * Pong scoreboard.
 *
 * Only *events* reach Redux - a rally landing, a miss, a restart. The 60fps
 * physics lives in a mutable ref inside the canvas component (see
 * `lib/pong-engine.ts`), because dispatching an action per frame would mean
 * re-rendering the whole tree sixty times a second for no visual gain.
 */
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    gameStarted(state) {
      state.score = 0;
      state.phase = "playing";
    },
    rallyScored(state) {
      state.score += 1;
    },
    gameEnded(state) {
      state.phase = "over";
      if (state.score > state.bestScore) {
        state.bestScore = state.score;
      }
    },
    /** Rehydrate the personal best from storage on mount. */
    bestScoreRestored(state, action: PayloadAction<number>) {
      if (Number.isFinite(action.payload) && action.payload > state.bestScore) {
        state.bestScore = action.payload;
      }
    },
  },
  selectors: {
    selectScore: (state) => state.score,
    selectBestScore: (state) => state.bestScore,
    selectPhase: (state) => state.phase,
  },
});

export const { gameStarted, rallyScored, gameEnded, bestScoreRestored } =
  gameSlice.actions;

export const { selectScore, selectBestScore, selectPhase } = gameSlice.selectors;

export default gameSlice;
