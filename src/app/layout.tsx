import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile, siteUrl } from "@/data/profile";
import { StoreProvider } from "@/store/store-provider";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import "./globals.css";

/**
 * next/font self-hosts these at build time: no request to Google's CDN at
 * runtime, no render-blocking stylesheet, and no layout shift, because the
 * fallback metrics are matched automatically.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    // Each pane supplies only its own name; this appends the rest.
    template: `%s · ${profile.name}`,
  },
  description: profile.summary,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Rahul Kumar",
    "Frontend Engineer",
    "Founding Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "AI Engineer",
    "Gurugram",
  ],
  openGraph: {
    type: "profile",
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — ${profile.headline}`,
    description: profile.summary,
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.headline}`,
    description: profile.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0d13",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <a
          href="#content"
          className="sr-only-focusable bg-mint text-surface-base absolute top-2 left-2 z-[60] rounded px-3 py-2 text-sm font-medium"
        >
          Skip to content
        </a>

        <StoreProvider>
          <WorkspaceShell>{children}</WorkspaceShell>
        </StoreProvider>

        <PersonJsonLd />
      </body>
    </html>
  );
}
