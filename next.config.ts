import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Typed routes: `href="/experiance"` becomes a compile error, not a 404.
  typedRoutes: true,

  /**
   * Baseline security headers. The portfolio ships no user input and no
   * third-party scripts, so the policy can stay strict.
   */
  async headers() {
    return [
      {
        // The resume changes rarely but must not stay stale for long when it
        // does: serve from cache for an hour, then revalidate in the
        // background while still serving the cached copy instantly.
        source: "/rahul-kumar-resume.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // SAMEORIGIN, not DENY: DENY blocks framing even by our own pages,
          // which breaks the embedded resume viewer at /resume. This still
          // stops any third-party site from framing us (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // The modern replacement, which supersedes X-Frame-Options where
          // supported. Both are sent so older browsers stay covered.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
