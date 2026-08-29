import { education, profile, githubUrl, linkedinUrl, siteUrl } from "@/data/profile";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";

/**
 * Schema.org structured data.
 *
 * This is what lets Google show a knowledge panel, and what LLM-based search
 * tools read to answer "who is Rahul Kumar and what does he do". Rendered from
 * the same data modules the UI uses, so it can never drift out of sync.
 */
export function PersonJsonLd() {
  const currentJob = experience.find((job) => job.current);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    jobTitle: profile.headline,
    description: profile.summary,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.locality,
      addressRegion: profile.region,
      addressCountry: profile.country,
    },
    sameAs: [githubUrl, linkedinUrl],
    knowsAbout: skills.flatMap((group) => group.items),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    ...(currentJob && {
      worksFor: {
        "@type": "Organization",
        name: currentJob.company,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not user input and contains no markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
