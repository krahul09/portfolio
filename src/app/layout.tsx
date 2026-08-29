import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile, siteUrl } from "@/data/profile";
import { bootingAttribute, storageKeys } from "@/lib/storage";
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

/**
 * Runs before the browser's first paint.
 *
 * This is the whole trick behind having no flash of the workspace: the server
 * cannot know whether this session has already seen the intro (that lives in
 * sessionStorage), and a React component cannot mount until hydration - long
 * after the first frame is on screen. A tiny synchronous script in <head> is
 * the only code that runs early enough, so it sets an attribute that CSS then
 * uses to reveal the already-server-rendered overlay on frame one.
 *
 * Wrapped in try/catch because sessionStorage throws in some privacy modes;
 * failing here simply means no intro, which is a fine outcome.
 */
const bootFlagScript = `try{if(sessionStorage.getItem(${JSON.stringify(
  storageKeys.bootSeen,
)})!=="1"){document.documentElement.setAttribute(${JSON.stringify(
  bootingAttribute,
)},"")}}catch(e){}`;

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
      {/*
        An explicit <head> is required here: `next/script` only hoists scripts
        with a `src`, so an inline one placed outside <head> renders as a direct
        child of <html> — invalid nesting, and its own hydration error.

        `suppressHydrationWarning` covers this element's attributes because
        browser extensions (LocatorJS, React DevTools and friends) stamp their
        own attributes onto <head> before React hydrates. Nothing here renders
        a dynamic attribute of its own, so there is no real mismatch to hide.
      */}
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: bootFlagScript }} />
      </head>
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
