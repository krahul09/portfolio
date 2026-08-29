import { Download, Eye, GraduationCap, Mail, Phone } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  education,
  profile,
  resumeFileName,
  resumePath,
  socials,
} from "@/data/profile";
import type { SocialLink } from "@/types";
import { CodeFrame } from "@/components/ui/code-frame";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

/** Maps a social link's `icon` key to a component. Exhaustive by construction. */
const iconByName = {
  mail: Mail,
  phone: Phone,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  resume: Download,
} as const satisfies Record<SocialLink["icon"], ComponentType<{ size?: number }>>;

function ContactLink({ link, index }: { link: SocialLink; index: number }) {
  const Icon = iconByName[link.icon];

  return (
    <Reveal as="li" index={index} stagger={70}>
      <a
        href={link.href}
        {...(link.external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
        className="group border-line-soft bg-surface-raised text-ink-muted hover:border-mint/40 hover:text-ink flex items-center gap-3 rounded-lg border px-4 py-3 text-[13px] transition-colors duration-200"
      >
        <span className="text-ink-faint group-hover:text-mint transition-colors">
          <Icon size={16} />
        </span>
        <span className="truncate">{link.label}</span>
      </a>
    </Reveal>
  );
}

export function ContactPane() {
  return (
    <CodeFrame name="Contact">
      <div className="max-w-3xl">
        <h2 className="font-display text-ink text-2xl font-bold sm:text-3xl">
          Let&apos;s build something.
        </h2>
        <p className="text-ink-muted mt-2 text-sm">
          Reach out directly, or find me on the platforms below.
        </p>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {socials.map((link, index) => (
            <ContactLink key={link.id} link={link} index={index} />
          ))}
        </ul>

        {/*
          Two distinct actions rather than one ambiguous link: `download` saves
          the file (same-origin, so the attribute is honoured by the browser),
          while the viewer opens it inline at /resume.
        */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <a
            href={resumePath}
            download={resumeFileName}
            className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-medium transition-colors duration-200"
          >
            <Download size={15} aria-hidden="true" />
            Download resume
          </a>

          <Link
            href="/resume"
            className="border-line-soft text-ink-muted hover:border-mint/40 hover:text-ink inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] transition-colors duration-200"
          >
            <Eye size={15} aria-hidden="true" />
            View resume
          </Link>
        </div>

        <section className="border-line-soft bg-surface-raised mt-10 rounded-lg border p-5">
          <h3 className="text-ink-faint flex items-center gap-2 text-xs tracking-wide uppercase">
            <GraduationCap size={16} aria-hidden="true" />
            Education
          </h3>
          <p className="text-ink mt-3 text-sm">{education.degree}</p>
          <p className="text-ink-muted mt-1 text-[13px]">
            {education.school}
            <span className="text-ink-faint"> · {education.dates}</span>
          </p>
        </section>

        <p className="text-ink-faint mt-8 text-[13px]">
          Based in {profile.location}. Open to remote and hybrid roles.
        </p>
      </div>
    </CodeFrame>
  );
}
