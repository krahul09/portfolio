import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/playground",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
