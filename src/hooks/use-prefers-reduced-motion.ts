"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(query).matches;
}

/** The server can't know the user's preference, so assume motion is fine. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks the OS "reduce motion" setting and stays in sync if the user changes
 * it mid-session. `useSyncExternalStore` is the React 18+ way to read an
 * external source without tearing during concurrent rendering.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
