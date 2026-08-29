import type { SocialLink, Stat } from "@/types";

/** Canonical origin. Used for metadataBase, sitemap, robots and JSON-LD. */
export const siteUrl = "https://rahulkumar.dev";

export const profile = {
  name: "Rahul Kumar",
  firstName: "Rahul",
  headline: "Frontend Software Engineer",
  roles: ["Founding Engineer", "Frontend Architect", "Software Engineer", "AI / LLM Systems Engineer"],
  location: "Gurugram, India",
  locality: "Gurugram",
  region: "Haryana",
  country: "IN",
  phone: "+91 7982573017",
  email: "kumar.rahul0525x@gmail.com",
  summary:
    "Frontend-focused Software Engineer with 2+ years of experience architecting and shipping large-scale production web platforms end-to-end — founding platforms from scratch, building AI-powered features, hardening security, and delivering measurable performance gains for six-figure user bases.",
  availability: "available for new opportunities",
} as const;

/**
 * The resume is served from `public/`, not Google Drive.
 *
 * Drive cannot be embedded reliably (it sets X-Frame-Options), shows a consent
 * interstitial for some visitors, and its "download" link is really a viewer
 * page. A same-origin file makes `<a download>` work properly and lets the PDF
 * be embedded directly.
 */
export const resumePath = "/rahul-kumar-resume.pdf";

/** Filename the browser saves as — what a recruiter sees in their downloads. */
export const resumeFileName = "Rahul-Kumar-Resume.pdf";

export const githubUrl = "https://github.com/krahul09";
export const linkedinUrl = "https://www.linkedin.com/in/rahul-kumar-068726199/";

export const socials: readonly SocialLink[] = [
  {
    id: "email",
    label: profile.email,
    href: `mailto:${profile.email}`,
    icon: "mail",
  },
  {
    id: "phone",
    label: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
    icon: "phone",
  },
  {
    id: "linkedin",
    label: "in/rahul-kumar-068726199",
    href: linkedinUrl,
    icon: "linkedin",
    external: true,
  },
  {
    id: "github",
    label: "github.com/krahul09",
    href: githubUrl,
    icon: "github",
    external: true,
  },
];

export const stats: readonly Stat[] = [
  { id: "years", value: 2, suffix: "+", label: "years experience" },
  { id: "customers", value: 50000, suffix: "+", label: "customers served" },
  { id: "messages", value: 15000, suffix: "", label: "AI chat msgs / day" },
  { id: "filings", value: 1260, suffix: "", label: "filings automated / 30d" },
];

export const education = {
  degree: "B.Tech in Electronics & Communication Engineering",
  school: "J.C. Bose University of Science and Technology",
  dates: "2017 — 2021",
} as const;
