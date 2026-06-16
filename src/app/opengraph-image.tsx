import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SAMPLE = [0.4, 0.88, 0.87, 0.8, 0.93, 0.73];

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f6f2",
          color: "#15141a",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#15141a",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              padding: "0 10px",
            }}
          >
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.34)" }} />
            <div style={{ height: 4, width: 12, borderRadius: 2, background: "#c6f24e" }} />
          </div>
          <span
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#6b6a72",
            }}
          >
            Citegrade · AI-SEO audit
          </span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>
            See your site the way
          </span>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2, color: "#54535b" }}>
            the machines now do.
          </span>
        </div>

        {/* instrument strip */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#14161b",
            borderRadius: 16,
            padding: "28px 36px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontFamily: "monospace", fontSize: 22, color: "#9a9ca4" }}>
              your-site.com
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {SAMPLE.map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: 64,
                    height: 8,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${v * 100}%`,
                      height: 8,
                      borderRadius: 4,
                      background: v >= 0.8 ? "#c6f24e" : v >= 0.5 ? "#e0b341" : "#e0675a",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <span style={{ fontFamily: "monospace", fontSize: 96, color: "#c6f24e", lineHeight: 1 }}>
              78
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 30, color: "#9a9ca4", paddingBottom: 14 }}>
              / 100 · B
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
