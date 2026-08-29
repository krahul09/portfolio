import type { MetadataRoute } from "next";
import { files, siteUrl } from "@/data";

/** Generated from the same file tree that drives the explorer. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return files.map((file) => ({
    url: new URL(file.href, siteUrl).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: file.href === "/" ? 1 : 0.8,
  }));
}
