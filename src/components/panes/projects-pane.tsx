import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { CodeFrame } from "@/components/ui/code-frame";
import { Reveal } from "@/components/ui/reveal";
import { TagList } from "@/components/ui/tag";

export function ProjectsPane() {
  return (
    <CodeFrame name="Projects">
      <h2 className="sr-only">Projects</h2>

      <ul className="grid max-w-4xl gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.id} index={index} className="h-full">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-line-soft bg-surface-raised hover:border-mint/40 hover:bg-surface-overlay flex h-full flex-col rounded-lg border p-5 transition-colors duration-200"
            >
              <h3 className="font-display text-ink flex items-center justify-between gap-2 text-base font-semibold">
                {project.name}
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-ink-faint group-hover:text-mint shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </h3>

              <p className="text-mint/70 mt-0.5 text-[11px]">{project.domain}</p>

              <p className="text-ink-muted mt-3 flex-1 text-[13px] leading-6">
                {project.description}
              </p>

              <TagList
                items={project.tags}
                className="mt-4"
                label={`${project.name} tech stack`}
              />

              {/* Screen readers should know this leaves the site. */}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        ))}
      </ul>
    </CodeFrame>
  );
}
