import { ImageResponse } from "next/og";
import { loadReport } from "@/lib/storage";

export const runtime = "nodejs";
export const alt = "AI SEO report card from Citegrade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function color(score: number) {
  if (score >= 75) return "#c6f24e"; // signal-lime
  if (score >= 60) return "#e0b341"; // amber
  if (score >= 40) return "#e08a4e"; // orange
  return "#e0675a"; // red
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await loadReport(slug);
  if (!report) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#14161b",
            color: "#ededea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            fontSize: 48,
          }}
        >
          Citegrade
        </div>
      ),
      size,
    );
  }
  const host = (() => {
    try {
      return new URL(report.url).host;
    } catch {
      return report.url;
    }
  })();
  const scoreColor = color(report.score);
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
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "#c6f24e",
            }}
          />
          <span
            style={{
              color: "#9a9ca4",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Citegrade · AI SEO Report
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
          }}
        >
          <span style={{ fontSize: 36, color: "#a1a1aa" }}>{host}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginTop: 32,
            gap: 40,
          }}
        >
          <span
            style={{
              fontSize: 240,
              fontWeight: 800,
              color: scoreColor,
              lineHeight: 1,
              letterSpacing: -8,
            }}
          >
            {report.score}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: 24,
            }}
          >
            <span style={{ fontSize: 56, color: "#fafafa", lineHeight: 1 }}>
              / 100
            </span>
            <span style={{ marginTop: 16, fontSize: 36, color: scoreColor }}>
              Grade {report.grade}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#71717a",
            fontSize: 22,
          }}
        >
          <span>{report.verdict}</span>
          <span style={{ fontFamily: "monospace" }}>citegrade.dev</span>
        </div>
      </div>
    ),
    size,
  );
}
