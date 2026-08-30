import { Code2, ExternalLink } from "lucide-react";
import { leetcode } from "@/data/hobbies";
import { fetchLeetcodeStats } from "@/lib/leetcode";
import type { DifficultyBreakdown } from "@/types";
import { cn } from "@/lib/cn";

interface DifficultyProps {
  label: string;
  data: DifficultyBreakdown;
  className: string;
}

/**
 * One difficulty column.
 *
 * Counts rather than progress bars: solved-against-total here is well under
 * 2%, so a proportional bar renders as an invisible sliver that reads as a
 * broken element rather than as information.
 */
function Difficulty({ label, data, className }: DifficultyProps) {
  return (
    <div className="flex-1">
      <p className={cn("font-display text-lg font-bold tabular-nums", className)}>
        {data.solved}
      </p>
      <p className="text-ink-faint mt-0.5 text-[10px]">
        {label}
        {/* Full `ink-faint`, not an opacity variant: at 70% it measures about
            3.4:1 against this surface, under the 4.5:1 AA minimum. */}
        <span className="text-ink-faint"> / {data.total.toLocaleString("en-US")}</span>
      </p>
    </div>
  );
}

/**
 * LeetCode progress.
 *
 * An async Server Component: the numbers are fetched during render and land in
 * the HTML, so there is no spinner, no layout shift, and no client JavaScript
 * for this section at all. The route revalidates hourly.
 */
export async function LeetcodeStats() {
  const stats = await fetchLeetcodeStats();

  return (
    <a
      href={leetcode.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <p className="text-ink-muted group-hover:text-ink flex items-center gap-2 text-[12px] transition-colors">
        <Code2 size={15} aria-hidden="true" className="text-amber" />
        LeetCode · @{leetcode.username}
        <ExternalLink
          size={12}
          aria-hidden="true"
          className="text-ink-faint group-hover:text-mint transition-colors"
        />
      </p>

      <div className="border-line-soft bg-surface-base mt-2.5 rounded-md border p-2.5">
        <div className="border-line-soft mb-2.5 flex items-baseline justify-between gap-3 border-b pb-2.5">
          <p>
            <span className="font-display text-mint text-xl font-bold tabular-nums">
              {stats.solved}
            </span>
            <span className="text-ink-faint text-[11px]">
              {" / "}
              {stats.total.toLocaleString("en-US")} solved
            </span>
          </p>
          {stats.ranking !== null && (
            <p className="text-ink-faint text-[10px] tabular-nums">
              rank #{stats.ranking.toLocaleString("en-US")}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Difficulty label="easy" data={stats.easy} className="text-mint" />
          <Difficulty label="medium" data={stats.medium} className="text-amber" />
          <Difficulty label="hard" data={stats.hard} className="text-pink" />
        </div>
      </div>
    </a>
  );
}
