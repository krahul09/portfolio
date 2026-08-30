"use client";

import { useCallback, useState } from "react";
import { Gamepad2, RotateCcw, Trophy } from "lucide-react";
import { PongCanvas } from "./pong-canvas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  gameEnded,
  gameStarted,
  rallyScored,
  selectBestScore,
  selectPhase,
  selectScore,
} from "@/store/game-slice";

/**
 * Scoreboard, overlay and controls around the canvas.
 *
 * Score and personal best live in Redux — the best score is persisted by the
 * store's listener middleware, so this component never touches storage itself.
 */
export function PongGame() {
  const dispatch = useAppDispatch();
  const score = useAppSelector(selectScore);
  const bestScore = useAppSelector(selectBestScore);
  const phase = useAppSelector(selectPhase);

  // Local, because it is a render trigger rather than shared state.
  const [round, setRound] = useState(0);

  const startRound = useCallback(() => {
    setRound((current) => current + 1);
    dispatch(gameStarted());
  }, [dispatch]);

  const handleScore = useCallback(() => dispatch(rallyScored()), [dispatch]);
  const handleGameOver = useCallback(() => dispatch(gameEnded()), [dispatch]);

  return (
    <section
      aria-label="Pong"
      className="border-line-soft bg-surface-raised flex h-full flex-col rounded-xl border p-4"
    >
      <header className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-ink font-display text-[13px] font-semibold">rally.tsx</h2>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-ink-muted flex items-center gap-1.5">
            <Gamepad2 size={14} aria-hidden="true" />
            score
            <span aria-live="polite" className="text-mint tabular-nums">
              {score}
            </span>
          </span>
          <span className="text-ink-muted flex items-center gap-1.5">
            <Trophy size={13} aria-hidden="true" />
            best
            <span className="text-amber tabular-nums">{bestScore}</span>
          </span>
        </div>
      </header>

      {/*
        `flex-1` with a minimum: the board grows to match the hobbies card
        beside it on wide screens, instead of leaving a gap under a fixed
        height, but never collapses on short ones.
      */}
      <div className="border-line-soft bg-surface-base relative min-h-[15rem] flex-1 overflow-hidden rounded-lg border">
        <PongCanvas
          isRunning={phase === "playing"}
          roundKey={round}
          onScore={handleScore}
          onGameOver={handleGameOver}
        />

        {phase !== "playing" && (
          <div className="bg-surface-base/85 absolute inset-0 grid place-items-center px-6 text-center backdrop-blur-[2px]">
            <div>
              <p className="text-ink font-display text-lg font-semibold">
                {phase === "idle" ? "fancy a rally?" : "game over"}
              </p>
              <p className="text-ink-muted mx-auto mt-2 max-w-[17rem] text-[12px] leading-5">
                {phase === "idle"
                  ? "Mouse, touch drag, or arrow keys — keep the ball alive."
                  : `You scored ${score}. Personal best is ${bestScore}.`}
              </p>
              <button
                type="button"
                onClick={startRound}
                className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 mt-4 inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[12px] font-medium transition-colors"
              >
                {phase === "idle" ? (
                  <Gamepad2 size={14} aria-hidden="true" />
                ) : (
                  <RotateCcw size={14} aria-hidden="true" />
                )}
                {phase === "idle" ? "start game" : "play again"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-ink-faint mt-3 text-center text-[10px]">
        click the board, then ← → to move
      </p>
    </section>
  );
}
