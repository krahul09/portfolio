import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: a terminal-style caret in the site's accent colour. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0d13",
        color: "#5eead4",
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "monospace",
        borderRadius: 6,
      }}
    >
      {">"}
    </div>,
    size,
  );
}
