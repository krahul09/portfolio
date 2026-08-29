import { CheckCircle2, GitBranch } from "lucide-react";
import { LiveDot } from "@/components/ui/live-dot";
import { languageByKind } from "@/data/workspace";
import { profile } from "@/data/profile";
import type { WorkspaceFile } from "@/types";

interface StatusBarProps {
  activeFile: WorkspaceFile | undefined;
}

/**
 * The editor status bar. Purely informational, so it is an `aside`.
 *
 * Every item is `whitespace-nowrap`: this is a single-line strip, and a
 * wrapping label would push the bar to two rows and eat content height. The
 * lower-value items drop out entirely on narrow screens rather than squeezing.
 */
export function StatusBar({ activeFile }: StatusBarProps) {
  const language = activeFile ? languageByKind[activeFile.kind] : "Plain Text";

  return (
    <aside className="border-line bg-surface-raised text-ink-muted flex shrink-0 items-center justify-between gap-4 border-t px-3 py-1.5 text-[11px] whitespace-nowrap">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <GitBranch size={12} aria-hidden="true" />
          main
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <CheckCircle2 size={12} aria-hidden="true" />0 problems
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline">{language}</span>
        <span className="text-mint flex items-center gap-1.5">
          <LiveDot />
          <span className="xs:inline hidden">{profile.availability}</span>
          <span className="xs:hidden">available</span>
        </span>
      </div>
    </aside>
  );
}
