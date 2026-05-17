import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#10b981",
            }}
          />
          <span
            style={{
              color: "#a1a1aa",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {SITE.name}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#fafafa",
            }}
          >
            Is your site
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#10b981",
            }}
          >
            readable by AI?
          </span>
          <span
            style={{
              marginTop: 32,
              fontSize: 28,
              color: "#a1a1aa",
              maxWidth: 880,
            }}
          >
            A free 100-point AI SEO audit. llms.txt · JSON-LD · semantic HTML ·
            meta · crawlability · E-E-A-T.
          </span>
        </div>
      </div>
    ),
    size,
  );
}
