"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number;
  rootMargin?: string;
  /** Stop observing after the first intersection. Defaults to true. */
  once?: boolean;
}

/**
 * Reports whether an element has scrolled into view.
 *
 * Options are destructured into primitives before they reach the dependency
 * array - passing the object straight through would rebuild the observer on
 * every render, since object literals are never referentially equal.
 *
 * Note there is no "IntersectionObserver is missing" branch: it has been
 * baseline in every browser since 2019, and the no-JavaScript case is handled
 * in CSS via `@media (scripting: none)`, which needs no fallback state here.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.2,
  rootMargin = "0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
