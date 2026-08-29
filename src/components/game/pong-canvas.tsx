"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  advance,
  createPongState,
  movePaddleTo,
  pongConfig,
  resetRally,
  resize,
  type PongState,
} from "@/lib/pong-engine";

interface PongCanvasProps {
  isRunning: boolean;
  onScore: () => void;
  onGameOver: () => void;
  /** Bumping this value starts a fresh rally. */
  roundKey: number;
}

const colors = {
  paddle: "#f5a623",
  paddleGlow: "rgba(245, 166, 35, 0.55)",
  ball: "#5eead4",
  ballGlow: "rgba(94, 234, 212, 0.7)",
  grid: "rgba(255, 255, 255, 0.035)",
} as const;

function paint(ctx: CanvasRenderingContext2D, state: PongState): void {
  const { width, height, ball, paddle } = state;
  ctx.clearRect(0, 0, width, height);

  // Dotted backdrop
  ctx.fillStyle = colors.grid;
  const gap = 26;
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Paddle
  ctx.fillStyle = colors.paddle;
  ctx.shadowColor = colors.paddleGlow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(
    paddle.x,
    height - pongConfig.paddleOffset,
    paddle.width,
    paddle.height,
    5,
  );
  ctx.fill();

  // Ball
  ctx.fillStyle = colors.ball;
  ctx.shadowColor = colors.ballGlow;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/**
 * Renders the Pong simulation.
 *
 * The animation loop reads and mutates a ref, never state, so the sixty frames
 * a second never touch React. Only genuine events — a rally scored, a ball
 * missed — call back up to Redux.
 */
export function PongCanvas({
  isRunning,
  onScore,
  onGameOver,
  roundKey,
}: PongCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<PongState>(createPongState());

  // Callbacks live in a ref so the animation loop can stay mounted for the
  // component's whole lifetime instead of restarting on every render.
  const handlersRef = useRef({ onScore, onGameOver });
  useEffect(() => {
    handlersRef.current = { onScore, onGameOver };
  }, [onScore, onGameOver]);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    // Cap DPR at 2: beyond that the extra pixels cost more than they show.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    resize(stateRef.current, width, height);
  }, []);

  // Start a new rally whenever the round changes.
  useEffect(() => {
    if (!isRunning) return;
    resetRally(stateRef.current);
    stateRef.current.running = true;
  }, [isRunning, roundKey]);

  useEffect(() => {
    syncCanvasSize();

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let frame = requestAnimationFrame(function loop() {
      const result = advance(stateRef.current);
      if (result.scored) handlersRef.current.onScore();
      if (result.lost) handlersRef.current.onGameOver();
      paint(ctx, stateRef.current);
      frame = requestAnimationFrame(loop);
    });

    const observer = new ResizeObserver(syncCanvasSize);
    observer.observe(container);

    const pointerToPaddle = (clientX: number) => {
      const { left } = canvas.getBoundingClientRect();
      movePaddleTo(stateRef.current, clientX - left);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerToPaddle(event.clientX);
    };

    // Arrow keys are scoped to the canvas, not the window: a global listener
    // would swallow arrow-key scrolling on every other pane.
    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      const { keys } = stateRef.current;
      if (event.key === "ArrowLeft") keys.left = pressed;
      if (event.key === "ArrowRight") keys.right = pressed;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => setKey(event, true);
    const handleKeyUp = (event: KeyboardEvent) => setKey(event, false);

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("keyup", handleKeyUp);
    };
  }, [syncCanvasSize]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="Pong. Move the paddle with your mouse, a touch drag, or the arrow keys."
        className="size-full touch-none rounded-md outline-none"
      />
    </div>
  );
}
