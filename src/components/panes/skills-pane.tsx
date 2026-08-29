import { skills } from "@/data/skills";
import { CodeFrame } from "@/components/ui/code-frame";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { CodeLine, Token } from "@/components/ui/syntax";

/**
 * Skills, rendered as a literal JSON document.
 *
 * The braces and quotes are decoration; underneath it is a real definition
 * list, so a screen reader announces "Frontend: React, Next.js, …" rather
 * than a soup of punctuation.
 */
export function SkillsPane() {
  return (
    <CodeFrame variant="json">
      <h2 className="sr-only">Technical skills</h2>

      <dl className="max-w-3xl">
        {skills.map((group, groupIndex) => (
          <div key={group.key} className="mb-6 last:mb-0">
            <dt>
              <CodeLine>
                <Token kind="property">&quot;{group.label}&quot;</Token>
                <Token kind="punctuation">: [</Token>
              </CodeLine>
            </dt>

            <dd>
              <Reveal index={groupIndex} stagger={70}>
                <ul className="flex flex-wrap gap-1.5 py-2 pl-4 sm:pl-8">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <CodeLine>
                <Token kind="punctuation">
                  ]{groupIndex === skills.length - 1 ? "" : ","}
                </Token>
              </CodeLine>
            </dd>
          </div>
        ))}
      </dl>
    </CodeFrame>
  );
}
