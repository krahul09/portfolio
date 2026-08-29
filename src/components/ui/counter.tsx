"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface CounterProps {
  target: number;
  suffix?: string;
  durationMs?: number;
}

/** Ease-out cubic: fast start, gentle settle. */
function easeOut(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/**
 * Counts up to `target` once the element scrolls into view.
 *
 * The final value is rendered on the server, then animated on the client, so
 * the real number is in the HTML for crawlers and for anyone without JS.
 */
export function Counter({ target, suffix = "", durationMs = 1200 }: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Reset to zero on mount so the count-up has somewhere to start.
    if (!hasAnimated.current) setValue(0);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!inView || prefersReducedMotion || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * easeOut(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, durationMs, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
