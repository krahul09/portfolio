"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Stagger index — each step delays the animation by `stagger` ms. */
  index?: number;
  stagger?: number;
  className?: string;
  /** Render as a different element, e.g. `li` inside a list. */
  as?: ElementType;
}

/**
 * Fades and lifts its children into view on first scroll.
 *
 * This replaces the observer-plus-class-plus-inline-delay boilerplate that was
 * otherwise repeated in every card component. One place to change the easing,
 * and reduced-motion is handled globally in `globals.css`.
 */
export function Reveal({
  children,
  index = 0,
  stagger = 90,
  className,
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${index * stagger}ms` }}
      className={cn(
        "reveal-base",
        inView ? "reveal-shown" : "reveal-hidden",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
