import type { BootTone } from "@/types";
import { cn } from "@/lib/cn";

/** A line that has been rendered (or is mid-render) by the boot runner. */
export type RenderedLine =
  | { kind: "command"; text: string; isTyping: boolean }
  | { kind: "output"; text: string; tone: BootTone }
  | { kind: "package"; name: string }
  | { kind: "progress"; label: string; percent: number }
  | { kind: "spacer" };

const toneClass: Record<BootTone, string> = {
  default: "text-[#d9fff2]",
  muted: "text-ink-muted",
  dim: "text-ink-faint",
  success: "text-lime",
  accent: "text-amber",
};

const progressBarWidth = 18;

/** Renders a terminal-style progress bar out of block characters. */
function ProgressBar({ percent }: { percent: number }) {
  const filled = Math.round((percent / 100) * progressBarWidth);
  return (
    <span className="text-mint">
      {"█".repeat(filled)}
      <span className="text-line">{"░".repeat(progressBarWidth - filled)}</span>
    </span>
  );
}

/**
 * One line of boot output.
 *
 * Split out from the runner so the animation logic never has to think about
 * markup, and each output kind renders in exactly one place.
 */
export function BootLine({ line }: { line: RenderedLine }) {
  if (line.kind === "spacer")
    return <div className="h-2.5 shrink-0" aria-hidden="true" />;

  if (line.kind === "command") {
    return (
      <div className="flex shrink-0 flex-wrap items-baseline">
        <span className="text-mint">rahul@portfolio</span>
        <span className="text-ink-faint mx-1.5">:~$</span>
        <span className="text-[#d9fff2]">{line.text}</span>
        {line.isTyping && <span className="animate-caret text-mint ml-0.5">▊</span>}
      </div>
    );
  }

  if (line.kind === "package") {
    return (
      <div className="flex shrink-0 items-baseline gap-2 pl-1">
        <span className="text-lime">✔</span>
        <span className="text-ink-muted">{line.name}</span>
      </div>
    );
  }

  if (line.kind === "progress") {
    const isDone = line.percent >= 100;
    return (
      <div className="flex shrink-0 items-baseline gap-2 pl-1">
        <span className={isDone ? "text-lime" : "text-ink-faint"}>
          {isDone ? "✔" : "▸"}
        </span>
        {/* Fixed width so every bar starts at the same column. Padding the
            label with spaces would not work - HTML collapses them. */}
        <span className="text-ink-muted w-44 shrink-0 truncate">{line.label}</span>
        <ProgressBar percent={line.percent} />
        <span className="text-ink-faint w-10 shrink-0 text-right tabular-nums">
          {line.percent}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn("shrink-0 pl-1 whitespace-pre-wrap", toneClass[line.tone])}>
      {line.tone === "success" && <span className="text-lime">✔ </span>}
      {line.text}
    </div>
  );
}
