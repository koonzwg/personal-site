import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link preview for Slack, LinkedIn, iMessage, X…
export const alt = "William Koonz — Design Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [medium, semibold, headshot] = await Promise.all([
    readFile(
      join(process.cwd(), "src/assets/fonts/inter-latin-500-normal.woff"),
    ),
    readFile(
      join(process.cwd(), "src/assets/fonts/inter-latin-600-normal.woff"),
    ),
    readFile(join(process.cwd(), "public/headshot.jpg")),
  ]);
  const photo = `data:image/jpeg;base64,${headshot.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "88px 96px",
        background: "white",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <img
          src={photo}
          width={112}
          height={112}
          style={{ borderRadius: 999 }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 36,
            letterSpacing: -1.1,
            fontWeight: 500,
          }}
        >
          <span style={{ color: "black" }}>William Koonz</span>
          <span style={{ color: "rgba(0,0,0,0.4)" }}>Design Engineer</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 64,
          letterSpacing: -2,
          whiteSpace: "nowrap",
          fontWeight: 600,
          lineHeight: 1.12,
          color: "black",
        }}
      >
        <span>I design and build products</span>
        <span>from first idea to shipped software.</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: medium, weight: 500, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
