/**
 * Pong simulation - pure TypeScript, no React and no DOM.
 *
 * Keeping the physics out of the component means the game loop never causes a
 * re-render: the component owns a single mutable `PongState` in a ref, calls
 * `advance()` once per animation frame, and only touches React state when the
 * score actually changes.
 */

export interface Vector {
  x: number;
  y: number;
}

export interface Ball extends Vector {
  radius: number;
  vx: number;
  vy: number;
}

export interface Paddle {
  x: number;
  width: number;
  height: number;
}

export interface PongState {
  ball: Ball;
  paddle: Paddle;
  width: number;
  height: number;
  running: boolean;
  score: number;
  keys: { left: boolean; right: boolean };
}

/** Outcome of a single simulation tick, so the caller can react to events. */
export interface TickResult {
  scored: boolean;
  lost: boolean;
}

export const pongConfig = {
  paddleOffset: 18,
  paddleSpeed: 6.2,
  maxBallSpeed: 7.5,
  /** Multiplier applied to vertical speed on every successful return. */
  speedRamp: 1.02,
  /** How much of the paddle offset translates into horizontal spin. */
  spin: 1.6,
} as const;

export function createPongState(width = 0, height = 0): PongState {
  return {
    ball: { x: width / 2, y: height * 0.4, radius: 7, vx: 0, vy: 0 },
    paddle: { x: width / 2 - 42, width: 84, height: 10 },
    width,
    height,
    running: false,
    score: 0,
    keys: { left: false, right: false },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Re-centre the ball and paddle for a fresh rally. */
export function resetRally(state: PongState): void {
  const direction = Math.random() > 0.5 ? 1 : -1;
  state.ball.x = state.width / 2;
  state.ball.y = state.height * 0.35;
  state.ball.vx = direction * (2.1 + Math.random() * 0.6);
  state.ball.vy = 2.6;
  state.paddle.x = state.width / 2 - state.paddle.width / 2;
  state.score = 0;
}

/** Keep geometry valid after a container resize. */
export function resize(state: PongState, width: number, height: number): void {
  state.width = width;
  state.height = height;

  if (state.running) {
    state.paddle.x = clamp(state.paddle.x, 0, Math.max(0, width - state.paddle.width));
    return;
  }

  // Idle: re-centre both. The state is created before the canvas has been
  // measured, so without this the paddle stays pinned to the left edge at the
  // clamped x of a zero-width board.
  state.paddle.x = Math.max(0, (width - state.paddle.width) / 2);
  state.ball.x = width / 2;
  state.ball.y = height * 0.4;
}

export function movePaddleTo(state: PongState, centerX: number): void {
  state.paddle.x = clamp(
    centerX - state.paddle.width / 2,
    0,
    Math.max(0, state.width - state.paddle.width),
  );
}

/**
 * Advance the simulation by one frame.
 * Returns which notable events occurred so the caller can sync React state.
 */
export function advance(state: PongState): TickResult {
  const result: TickResult = { scored: false, lost: false };
  if (!state.running) return result;

  const { ball, paddle } = state;

  if (state.keys.left) paddle.x -= pongConfig.paddleSpeed;
  if (state.keys.right) paddle.x += pongConfig.paddleSpeed;
  paddle.x = clamp(paddle.x, 0, Math.max(0, state.width - paddle.width));

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Side walls.
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx *= -1;
  } else if (ball.x + ball.radius >= state.width) {
    ball.x = state.width - ball.radius;
    ball.vx *= -1;
  }

  // Ceiling.
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }

  // Paddle return: only while travelling downwards, and only within the band
  // just above the paddle so the ball can never tunnel through it.
  const paddleY = state.height - pongConfig.paddleOffset;
  const withinBand =
    ball.y + ball.radius >= paddleY &&
    ball.y + ball.radius <= paddleY + paddle.height + 8;
  const withinPaddle =
    ball.x >= paddle.x - ball.radius && ball.x <= paddle.x + paddle.width + ball.radius;

  if (ball.vy > 0 && withinBand && withinPaddle) {
    const hitOffset = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.y = paddleY - ball.radius;
    ball.vy = -Math.abs(ball.vy);
    ball.vx += hitOffset * pongConfig.spin;

    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > pongConfig.maxBallSpeed) {
      const scale = pongConfig.maxBallSpeed / speed;
      ball.vx *= scale;
      ball.vy *= scale;
    }
    ball.vy *= pongConfig.speedRamp;

    state.score += 1;
    result.scored = true;
  }

  // Missed.
  if (ball.y - ball.radius > state.height) {
    state.running = false;
    result.lost = true;
  }

  return result;
}
