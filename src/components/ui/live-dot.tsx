import { cn } from "@/lib/cn";

interface LiveDotProps {
  className?: string;
  /** Turns the ambient pulse off for static, non-live indicators. */
  animated?: boolean;
}

/** Small status dot. Decorative — always pair it with real text. */
export function LiveDot({ className, animated = true }: LiveDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-mint inline-block size-1.5 shrink-0 rounded-full",
        animated && "animate-pulse-soft",
        className,
      )}
    />
  );
}
