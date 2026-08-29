import { Calendar, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import type { Job } from "@/types";
import { CodeFrame } from "@/components/ui/code-frame";
import { Reveal } from "@/components/ui/reveal";
import { TagList } from "@/components/ui/tag";
import { Token } from "@/components/ui/syntax";
import { cn } from "@/lib/cn";

interface JobEntryProps {
  job: Job;
  index: number;
  isLast: boolean;
}

/** One role on the timeline. */
function JobEntry({ job, index, isLast }: JobEntryProps) {
  return (
    <Reveal as="li" index={index} className="relative flex gap-4">
      {/* Timeline rail */}
      <div aria-hidden="true" className="relative flex w-3 shrink-0 justify-center">
        <span
          className={cn(
            "ring-surface-base absolute top-2 size-2.5 rounded-full ring-4",
            job.current ? "animate-pulse-soft bg-mint" : "bg-ink-faint",
          )}
        />
        {!isLast && <span className="bg-line absolute top-6 bottom-0 w-px" />}
      </div>

      <article className="min-w-0 flex-1 pb-10">
        <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-display text-ink text-base font-semibold">
            {job.company}
            {job.current && (
              <span className="border-mint/30 bg-mint/10 text-mint ml-2 rounded border px-1.5 py-0.5 align-middle text-[10px] font-medium">
                current
              </span>
            )}
          </h3>
          <p className="text-ink-faint flex items-center gap-1.5 text-[11px]">
            <Calendar size={12} aria-hidden="true" />
            <time dateTime={job.startDate}>{job.dates}</time>
          </p>
        </header>

        <p className="text-blue mt-1 text-sm">{job.role}</p>

        <p className="text-ink-faint mt-1 flex items-center gap-1.5 text-[11px]">
          <MapPin size={12} aria-hidden="true" />
          {job.location}
        </p>

        <ul className="mt-4 space-y-2.5">
          {job.bullets.map((bullet) => (
            <li key={bullet} className="text-[13px] leading-6">
              <Token kind="string">&quot;{bullet}&quot;</Token>
              <Token kind="punctuation">,</Token>
            </li>
          ))}
        </ul>

        <TagList
          items={job.tags}
          className="mt-4"
          label={`Technologies used at ${job.company}`}
        />
      </article>
    </Reveal>
  );
}

export function ExperiencePane() {
  return (
    <CodeFrame name="Experience">
      <h2 className="sr-only">Work experience</h2>
      <ol className="max-w-3xl">
        {experience.map((job, index) => (
          <JobEntry
            key={job.id}
            job={job}
            index={index}
            isLast={index === experience.length - 1}
          />
        ))}
      </ol>
    </CodeFrame>
  );
}
