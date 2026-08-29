"use client";

import { useEffect } from "react";
import { CodeLine, Token } from "@/components/ui/syntax";

/**
 * Route-level error boundary. Catches render errors in any pane so a single
 * broken component degrades to this instead of a blank page.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pane failed to render:", error);
  }, [error]);

  return (
    <div className="max-w-2xl font-mono">
      <CodeLine n={1}>
        <Token kind="comment">{"// something threw while rendering"}</Token>
      </CodeLine>

      <p className="text-ink-muted mt-6 text-sm">
        This pane failed to load. The rest of the workspace still works.
      </p>

      <button
        type="button"
        onClick={reset}
        className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 mt-4 inline-flex rounded-md border px-3.5 py-2 text-[13px] font-medium transition-colors"
      >
        retry
      </button>
    </div>
  );
}
