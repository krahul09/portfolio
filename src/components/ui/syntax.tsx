import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Syntax-highlight tokens.
 *
 * The panes are styled to read like source code, so the colour for "this is a
 * string" is defined once here rather than as a literal class in twenty JSX
 * files. Swap a colour and every pane follows.
 */
const tokenStyles = {
  keyword: "text-purple",
  fn: "text-blue",
  punctuation: "text-ink-faint",
  string: "text-lime",
  property: "text-mint",
  comment: "text-ink-faint italic",
  number: "text-amber",
} as const;

export type TokenKind = keyof typeof tokenStyles;

interface TokenProps {
  kind: TokenKind;
  children: ReactNode;
  className?: string;
}

export function Token({ kind, children, className }: TokenProps) {
  return <span className={cn(tokenStyles[kind], className)}>{children}</span>;
}

/** A gutter line number. Hidden from assistive tech — it is pure decoration. */
export function LineNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="text-ink-faint/60 w-8 shrink-0 pr-3 text-right text-[11px] tabular-nums select-none"
    >
      {n}
    </span>
  );
}

interface CodeLineProps {
  n?: number;
  indent?: 0 | 1 | 2;
  children: ReactNode;
  className?: string;
}

const indentClass = {
  0: "",
  1: "pl-4 sm:pl-8",
  2: "pl-8 sm:pl-16",
} as const;

/** One line of "source", with an optional gutter number and indent level. */
export function CodeLine({ n, indent = 0, children, className }: CodeLineProps) {
  return (
    <div className={cn("flex items-start text-[13px] leading-6", className)}>
      {n === undefined ? (
        <span aria-hidden="true" className="w-8 shrink-0" />
      ) : (
        <LineNumber n={n} />
      )}
      <div className={cn("min-w-0 flex-1", indentClass[indent])}>{children}</div>
    </div>
  );
}
