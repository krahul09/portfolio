"use client";

import { useCallback, useEffect, useState } from "react";
import { bootSequence } from "@/data/boot-sequence";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { bootCompleted, selectHasBooted } from "@/store/workspace-slice";
import { readStorage, storageKeys, writeStorage } from "@/lib/storage";
import { cn } from "@/lib/cn";
import { BootLine, type RenderedLine } from "./boot-line";

/**
 * Pacing. Tuned so the whole sequence reads at a comfortable pace (~6.5s)
 * rather than flashing past — it is the first thing a visitor sees, and it is
 * skippable at any point.
 */
const timing = {
  typeCharMs: 34,
  /** Beat after a command finishes typing, before its output appears. */
  afterCommandMs: 260,
  betweenOutputsMs: 150,
  packageIntervalMs: 120,
  progressMs: 400,
  /** Frames per progress bar — more is smoother, not slower. */
  progressTicks: 14,
  finalHoldMs: 520,
  fadeOutMs: 420,
  reducedMotionHoldMs: 1400,
} as const;

/** The finished state, used for reduced-motion and as the fade-out snapshot. */
function buildCompletedLines(): RenderedLine[] {
  const lines: RenderedLine[] = [];
  for (const step of bootSequence) {
    switch (step.kind) {
      case "command":
        lines.push({ kind: "command", text: step.text, isTyping: false });
        break;
      case "output":
        lines.push({ kind: "output", text: step.text, tone: step.tone ?? "default" });
        break;
      case "packages":
        for (const name of step.items) lines.push({ kind: "package", name });
        break;
      case "progress":
        lines.push({ kind: "progress", label: step.label, percent: 100 });
        break;
      case "spacer":
        lines.push({ kind: "spacer" });
        break;
    }
  }
  return lines;
}

/** Computed once — the reduced-motion view is derived from it, never set. */
const completedLines: RenderedLine[] = buildCompletedLines();

/**
 * Terminal boot animation, shown once per browser session.
 *
 * Loaded with `ssr: false` (see WorkspaceShell), which is what makes the lazy
 * `useState` initialiser below safe: it reads sessionStorage, which only exists
 * on the client and would otherwise cause a hydration mismatch.
 *
 * It renders *over* the workspace rather than replacing it, so the real page is
 * already in the DOM while the animation plays. Skippable by click or keypress —
 * an intro nobody can dismiss is a bug, not a flourish.
 */
export function BootScreen() {
  const dispatch = useAppDispatch();
  const hasBooted = useAppSelector(selectHasBooted);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Already seen this session? Then never show it at all.
  const [shouldPlay] = useState(
    () => readStorage(storageKeys.bootSeen, "session") !== "1",
  );
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [lines, setLines] = useState<RenderedLine[]>([]);

  const finish = useCallback(() => {
    writeStorage(storageKeys.bootSeen, "1", "session");
    setIsFadingOut(true);
    window.setTimeout(() => dispatch(bootCompleted()), timing.fadeOutMs);
  }, [dispatch]);

  // Dispatching to Redux is not React state, so this does not trigger the
  // cascading-render problem that a setState here would.
  useEffect(() => {
    if (!shouldPlay) dispatch(bootCompleted());
  }, [shouldPlay, dispatch]);

  // Any keypress skips — the classic "press any key" affordance.
  useEffect(() => {
    if (!shouldPlay || hasBooted) return;
    const onKeyDown = () => finish();
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shouldPlay, hasBooted, finish]);

  useEffect(() => {
    if (!shouldPlay || hasBooted) return;

    // Reduced motion renders the finished output directly (see `visibleLines`
    // below) rather than animating to it, so no state is written here.
    if (prefersReducedMotion) {
      const timer = window.setTimeout(finish, timing.reducedMotionHoldMs);
      return () => window.clearTimeout(timer);
    }

    // One cancellable timer chain: unmounting mid-animation can never leave a
    // pending callback writing to dead state.
    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    // A local array the runner owns outright. Every mutation is followed by a
    // flush of a fresh copy, which keeps the async logic linear and readable
    // instead of threading functional updates through every step.
    const rendered: RenderedLine[] = [];
    const flush = () => setLines([...rendered]);
    const replaceLast = (line: RenderedLine) => {
      rendered[rendered.length - 1] = line;
      flush();
    };

    void (async () => {
      for (const step of bootSequence) {
        if (cancelled) return;

        switch (step.kind) {
          case "command": {
            rendered.push({ kind: "command", text: "", isTyping: true });
            flush();
            for (let chars = 1; chars <= step.text.length; chars += 1) {
              if (cancelled) return;
              replaceLast({
                kind: "command",
                text: step.text.slice(0, chars),
                isTyping: true,
              });
              await wait(timing.typeCharMs);
            }
            if (cancelled) return;
            replaceLast({ kind: "command", text: step.text, isTyping: false });
            await wait(timing.afterCommandMs);
            break;
          }

          case "output": {
            rendered.push({
              kind: "output",
              text: step.text,
              tone: step.tone ?? "default",
            });
            flush();
            await wait(timing.betweenOutputsMs);
            break;
          }

          case "packages": {
            for (const name of step.items) {
              if (cancelled) return;
              rendered.push({ kind: "package", name });
              flush();
              await wait(timing.packageIntervalMs);
            }
            break;
          }

          case "progress": {
            rendered.push({ kind: "progress", label: step.label, percent: 0 });
            flush();
            for (let tick = 1; tick <= timing.progressTicks; tick += 1) {
              if (cancelled) return;
              replaceLast({
                kind: "progress",
                label: step.label,
                percent: Math.round((tick / timing.progressTicks) * 100),
              });
              await wait(timing.progressMs / timing.progressTicks);
            }
            break;
          }

          case "spacer": {
            rendered.push({ kind: "spacer" });
            flush();
            break;
          }
        }
      }

      if (cancelled) return;
      await wait(timing.finalHoldMs);
      if (!cancelled) finish();
    })();

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [shouldPlay, hasBooted, prefersReducedMotion, finish]);

  if (!shouldPlay || hasBooted) return null;

  const visibleLines = prefersReducedMotion ? completedLines : lines;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-center bg-[#05070a] px-4",
        "transition-opacity duration-500",
        isFadingOut ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {/* A full-bleed button is the accessible way to make "click anywhere to
          skip" work for pointer and keyboard users alike. It sits behind the
          terminal, which is pointer-events-none, so every click reaches it. */}
      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro animation"
        className="absolute inset-0 cursor-pointer"
      />

      {/* Decorative: the real page is already in the DOM underneath, so there
          is nothing here worth announcing over it. */}
      <div
        aria-hidden="true"
        className="border-line bg-surface-raised pointer-events-none w-full max-w-2xl overflow-hidden rounded-lg border shadow-2xl"
      >
        <div className="border-line-soft flex items-center gap-2 border-b px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="text-ink-faint flex-1 text-center text-[11px]">
            rahul@portfolio — install
          </span>
          <span className="w-12" />
        </div>

        {/* Fixed height with the content pinned to the bottom: new lines push
            older ones up, exactly like a real terminal, and the window never
            resizes mid-animation. */}
        <div className="flex h-80 flex-col justify-end overflow-hidden p-4 font-mono text-[12.5px] leading-6 sm:h-96">
          {visibleLines.map((line, index) => (
            <BootLine key={index} line={line} />
          ))}
        </div>
      </div>

      <p className="text-ink-faint pointer-events-none absolute right-6 bottom-5 text-[10px] tracking-wide">
        click anywhere to skip
      </p>
    </div>
  );
}
