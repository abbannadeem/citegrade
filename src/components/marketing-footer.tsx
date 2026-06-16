import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const LEGEND: { grade: string; range: string; verdict: string; color: string }[] =
  [
    { grade: "A", range: "90–100", verdict: "AI-optimized", color: "#4e7a1b" },
    { grade: "B", range: "75–89", verdict: "AI-friendly", color: "#5d7717" },
    { grade: "C", range: "60–74", verdict: "Partially discoverable", color: "#8a6512" },
    { grade: "D", range: "40–59", verdict: "AI-invisible", color: "#b5642a" },
    { grade: "F", range: "0–39", verdict: "Critical gaps", color: "#a8392a" },
  ];

export function MarketingFooter() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <footer className="border-t border-line bg-bg2">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* manifesto */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <BrandMark size={24} />
            <span className="text-[15px] font-semibold tracking-tight text-fg">
              Citegrade
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-medium tracking-tight text-fg leading-snug">
            Search is no longer ten blue links. It&apos;s a machine reading your
            page and answering for you. This measures whether it can.
          </p>
        </div>

        {/* score legend */}
        <div className="mt-12 pt-10 border-t border-line">
          <p className="rule-label mb-5">Score legend</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5">
            {LEGEND.map((l) => (
              <div key={l.grade} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 w-2.5 h-2.5 rounded-[2px] shrink-0"
                  style={{ background: l.color }}
                />
                <div>
                  <p className="font-mono text-sm text-fg">
                    {l.grade}{" "}
                    <span className="text-subtle tabular">{l.range}</span>
                  </p>
                  <p className="text-xs text-muted mt-0.5">{l.verdict}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* links */}
        <div className="mt-12 pt-10 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-8">
          <Col
            title="Product"
            links={[
              { href: "/pricing", label: "Pricing" },
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/docs", label: "Methodology" },
              { href: "/changelog", label: "Changelog" },
            ]}
          />
          <Col
            title="Resources"
            links={[
              { href: "/llms.txt", label: "llms.txt" },
              { href: "/llms-full.txt", label: "llms-full.txt" },
              { href: "/robots.txt", label: "robots.txt" },
              { href: "/sitemap.xml", label: "sitemap.xml" },
            ]}
          />
          <Col
            title="Company"
            links={[
              { href: "/about", label: "About" },
              { href: "/legal/privacy", label: "Privacy" },
              { href: "/legal/terms", label: "Terms" },
              {
                href: "https://github.com/AbbanNadeem-SQA/citegrade",
                label: "GitHub",
              },
            ]}
          />
          <div>
            <h3 className="rule-label mb-3">Audit</h3>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-signal text-signal-fg font-semibold text-sm hover:brightness-[0.96] transition-all"
            >
              Run a free audit
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-subtle font-mono">
          <p>© {new Date().getFullYear()} Citegrade · Built in public.</p>
          <p>
            Last updated <time dateTime={today}>{today}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Col({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="rule-label mb-3">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted hover:text-fg transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
