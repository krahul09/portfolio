"use client";

import { useCallback, useEffect, useState } from "react";
import { bootSequence } from "@/data/boot-sequence";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { bootCompleted, selectHasBooted } from "@/store/workspace-slice";
import { bootingAttribute, storageKeys, writeStorage } from "@/lib/storage";
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
 * Server-rendered, and deliberately so. Whether it plays is decided by CSS via
 * the `data-booting` attribute that a blocking script in <head> sets before the
 * first paint (see `layout.tsx`). That is what removes the flash of the
 * workspace: if the overlay only mounted after hydration — as it did when this
 * was a client-only component — the portfolio underneath would already have
 * been painted.
 *
 * React therefore never decides *visibility*; it only fills in the animated
 * lines afterwards and clears the attribute when the sequence ends. Server and
 * client both render the same empty terminal, so there is no hydration
 * mismatch and no sessionStorage read during render.
 */
export function BootScreen() {
  const dispatch = useAppDispatch();
  const hasBooted = useAppSelector(selectHasBooted);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [lines, setLines] = useState<RenderedLine[]>([]);

  const finish = useCallback(() => {
    writeStorage(storageKeys.bootSeen, "1", "session");
    setIsFadingOut(true);
    window.setTimeout(() => {
      // Clearing the attribute hides the overlay via CSS; unmounting then
      // removes it from the DOM. Both, so neither ordering can flash.
      document.documentElement.removeAttribute(bootingAttribute);
      dispatch(bootCompleted());
    }, timing.fadeOutMs);
  }, [dispatch]);

  // Sessions that have already seen the intro never had the attribute set, so
  // the overlay was never visible - just unmount it. Dispatching to Redux is
  // not React state, so this does not cause a cascading render.
  useEffect(() => {
    if (!document.documentElement.hasAttribute(bootingAttribute)) {
      dispatch(bootCompleted());
    }
  }, [dispatch]);

  // Any keypress skips — the classic "press any key" affordance.
  useEffect(() => {
    if (hasBooted) return;
    const onKeyDown = () => finish();
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasBooted, finish]);

  useEffect(() => {
    if (hasBooted) return;
    // The pre-paint script decides whether this session plays the intro.
    if (!document.documentElement.hasAttribute(bootingAttribute)) return;

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
  }, [hasBooted, prefersReducedMotion, finish]);

  if (hasBooted) return null;

  const visibleLines = prefersReducedMotion ? completedLines : lines;

  return (
    <div
      className={cn(
        // `boot-overlay` carries the display rule - see globals.css.
        "boot-overlay fixed inset-0 z-50 place-items-center bg-[#05070a] px-4",
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
