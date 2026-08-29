import type { Project } from "@/types";

export const projects: readonly Project[] = [
  {
    id: "careerly",
    name: "Careerly",
    url: "https://careerly.space",
    domain: "careerly.space",
    description:
      "AI job-search platform for automated job discovery and resume tailoring.",
    tags: ["Next.js", "Node.js", "Qwen-based workflows"],
  },
  {
    id: "safedocs",
    name: "SafeDocs",
    url: "https://safedocs.space",
    domain: "safedocs.space",
    description:
      "AI document-intelligence platform for semantic search and conversational querying.",
    tags: ["Next.js", "LLM APIs", "Vector Search"],
  },
  {
    id: "gymbro",
    name: "GymBro",
    url: "https://gym-bro-seven.vercel.app",
    domain: "gym-bro-seven.vercel.app",
    description:
      "Fitness platform for guided exercise discovery, workout generation, and progress-oriented user flows.",
    tags: ["Next.js"],
  },
];
