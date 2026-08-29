import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  className?: string;
}

/** A single technology chip. Used by experience, projects and interests. */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "border-line-soft inline-flex items-center gap-1.5 rounded-md border",
        "bg-surface-overlay/70 text-ink-muted px-2 py-1 text-[11px] leading-none",
        "hover:border-mint/40 hover:text-ink transition-colors duration-200",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface TagListProps {
  items: readonly string[];
  className?: string;
  /** Accessible label, since a bare list of chips has no context on its own. */
  label?: string;
}

/** Renders a list of technology tags as a real `<ul>` for screen readers. */
export function TagList({ items, className, label = "Technologies" }: TagListProps) {
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
