import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card, generated at build time.
 *
 * This is the image LinkedIn, X, Slack and WhatsApp show when the link is
 * shared — worth far more than it costs, since none of those crawlers run the
 * page's JavaScript.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#0a0d13",
        padding: "72px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", color: "#5eead4", fontSize: 26 }}>
        rahul@portfolio:~$ whoami
      </div>
      <div
        style={{
          display: "flex",
          color: "#e6e8eb",
          fontSize: 82,
          fontWeight: 700,
          marginTop: 20,
        }}
      >
        {profile.name}
      </div>
      <div style={{ display: "flex", color: "#82aaff", fontSize: 36, marginTop: 12 }}>
        {profile.headline}
      </div>
      <div
        style={{
          display: "flex",
          color: "#9aa4b5",
          fontSize: 24,
          marginTop: 28,
          maxWidth: 900,
        }}
      >
        Founding Engineer · React · Next.js · TypeScript · AI/LLM Systems
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 44,
          gap: 12,
          color: "#5b6472",
          fontSize: 22,
        }}
      >
        <span style={{ color: "#f5a623" }}>▍</span>
        {profile.location}
      </div>
    </div>,
    size,
  );
}
