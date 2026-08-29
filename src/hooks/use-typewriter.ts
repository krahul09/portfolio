"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  /** How long a completed word stays on screen before deleting. */
  holdMs?: number;
}

type Phase = "typing" | "holding" | "deleting";

/**
 * Cycles through `words`, typing and deleting one character at a time.
 *
 * Implemented as a single self-rescheduling timeout rather than an async loop,
 * so every pending step is cancellable and nothing can write to an unmounted
 * component.
 *
 * When the user prefers reduced motion the full word is *derived* rather than
 * animated - no state is written, the words simply swap on a timer.
 */
export function useTypewriter(
  words: readonly string[],
  { typeSpeed = 45, deleteSpeed = 22, holdMs = 1600 }: TypewriterOptions = {},
): string {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const word = words[wordIndex] ?? "";

  useEffect(() => {
    if (words.length === 0) return;

    // Reduced motion: hold each word, then move on. No per-character state.
    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => {
        setWordIndex((index) => (index + 1) % words.length);
      }, holdMs + 1000);
      return () => window.clearTimeout(timer);
    }

    const delay =
      phase === "holding" ? holdMs : phase === "typing" ? typeSpeed : deleteSpeed;

    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        if (charCount < word.length) setCharCount(charCount + 1);
        else setPhase("holding");
        return;
      }

      if (phase === "holding") {
        setPhase("deleting");
        return;
      }

      if (charCount > 0) {
        setCharCount(charCount - 1);
      } else {
        setWordIndex((index) => (index + 1) % words.length);
        setPhase("typing");
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    charCount,
    phase,
    word,
    words.length,
    typeSpeed,
    deleteSpeed,
    holdMs,
    prefersReducedMotion,
  ]);

  return prefersReducedMotion ? word : word.slice(0, charCount);
}
