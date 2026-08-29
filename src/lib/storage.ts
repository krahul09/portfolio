/**
 * localStorage/sessionStorage access that never throws.
 *
 * Storage access raises in Safari private mode and whenever a browser is set
 * to block site data, so every call is guarded. Reads return `null` on
 * failure and writes fail silently - persistence is a nicety here, never a
 * requirement.
 */

type StorageKind = "local" | "session";

function getStore(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, kind: StorageKind = "local"): string | null {
  try {
    return getStore(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(
  key: string,
  value: string,
  kind: StorageKind = "local",
): void {
  try {
    getStore(kind)?.setItem(key, value);
  } catch {
    // Quota exceeded or storage disabled - nothing to recover from.
  }
}

/** Read a value that was stored as JSON, falling back when absent or corrupt. */
export function readJson<T>(key: string, fallback: T, kind: StorageKind = "local"): T {
  const raw = readStorage(key, kind);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T, kind: StorageKind = "local"): void {
  try {
    writeStorage(key, JSON.stringify(value), kind);
  } catch {
    // Value contained a cycle - not worth crashing the UI over.
  }
}

export const storageKeys = {
  pongBest: "portfolio:pong-best",
  openTabs: "portfolio:open-tabs",
  bootSeen: "portfolio:boot-seen",
} as const;

/**
 * Marks a page load that should play the intro.
 *
 * Set on <html> by a blocking script in the document head - the only code that
 * runs before the browser's first paint - and read by CSS to show the overlay
 * on that very first frame. Without it the intro cannot mount until React has
 * hydrated, by which time the workspace has already been painted.
 */
export const bootingAttribute = "data-booting";
