import Link from "next/link";
import { HeroUrlInput } from "@/components/hero-url-input";
import { HeroReadout } from "@/components/hero-readout";
import { JsonLd } from "@/components/json-ld";
import {
  faqSchema,
  softwareApplicationSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/site-schema";
import { SITE, siteUrl } from "@/lib/site";
import { GIGS } from "@/lib/gigs";
import { CATEGORY_LABELS, CATEGORY_MAX } from "@/lib/audit/types";
import { listRecentReports } from "@/lib/storage";
import { ArrowUpRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { hostOf } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FAQ = [
  {
    q: "Is the audit really free?",
    a: "Yes. One audit per day, no card. The same engine that runs the paid plan — just rate-limited. The free tier is the trial.",
  },
  {
    q: "What does the score actually mean?",
    a: "It's a composite of six categories that LLMs measurably use to read and cite a page: llms.txt, JSON-LD schema, semantic HTML, meta tags, crawlability with AI bot rules, and E-E-A-T signals. The full math is published at /docs.",
  },
  {
    q: "Will my score change if I fix things?",
    a: "Yes. Re-audit after each change — the diff is visible. Pro re-audits weekly automatically and emails the delta.",
  },
  {
    q: "Why not just trust Google?",
    a: "Google AI Overview is one consumer. ChatGPT, Claude, and Perplexity each crawl differently. This scores readiness across the set, not just one.",
  },
  {
    q: "Who builds this?",
    a: "Abban Nadeem, alone, in public. Methodology and code are open. Inbox is the support channel.",
  },
];

const RUBRIC: {
  id: string;
  label: string;
  points: number;
  checks: string;
}[] = [
  {
    id: "llms-txt",
    label: "llms.txt",
    points: 15,
    checks: "Presence at /llms.txt, spec conformance, and the llms-full.txt pairing.",
  },
  {
    id: "json-ld",
    label: "JSON-LD schema",
    points: 25,
    checks: "Organization/Person identity, page-type schema, FAQ + BreadcrumbList.",
  },
  {
    id: "semantic",
    label: "Semantic HTML",
    points: 15,
    checks: "Single H1, no skipped heading levels, landmarks, alt-text coverage.",
  },
  {
    id: "meta",
    label: "Meta & social",
    points: 15,
    checks: "Title length, description, canonical, og:image, twitter:card.",
  },
  {
    id: "crawl",
    label: "Crawlability",
    points: 15,
    checks: "robots.txt, sitemap, AI bot rules (GPTBot, ClaudeBot, PerplexityBot).",
  },
  {
    id: "eeat",
    label: "E-E-A-T",
    points: 15,
    checks: "Author, freshness, About + Contact, authority links, sameAs.",
  },
];

function Rule({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="rule-label">
        {index} <span className="text-line-strong">/</span> {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default async function Home() {
  const recent = await listRecentReports(12);
  const user = await getCurrentUser();

  // Best-scoring recent report — featured as the sample-report artifact (real data)
  const featured = [...recent].sort((a, b) => b.score - a.score)[0] ?? null;
  // Editorial index: recently scanned, ranked by score (real domains, real scores)
  const indexRows = [...recent].sort((a, b) => b.score - a.score).slice(0, 7);
  const totalPoints = Object.values(CATEGORY_MAX).reduce((a, b) => a + b, 0);

  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <JsonLd data={howToSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: siteUrl("/") }])} />

      <MarketingHeader isAuthed={!!user} />

      <main className="flex-1">
        {/* ─── 01 / SCAN — hero ──────────────────────────────────── */}
        <section className="border-b border-line">
          <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              <div className="lg:col-span-7 max-w-2xl">
                <p className="eyebrow mb-6">The AI-search readiness audit</p>
                <h1 className="tracking-display text-[2.5rem] sm:text-[3.4rem] lg:text-[4.1rem] font-semibold leading-[1.01] text-fg">
                  Your SEO was built for Google.
                  <span className="block text-muted font-medium mt-2">
                    This reads your site the way the machines answering now do.
                  </span>
                </h1>
                <p className="mt-7 text-[1.0625rem] text-muted leading-relaxed max-w-xl">
                  A free, no-signup audit of how ChatGPT, Claude, Perplexity, and
                  Google AI read your pages — scored 0–100 across six categories
                  in under thirty seconds.
                </p>
                <div className="mt-8">
                  <HeroUrlInput />
                </div>
                <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-subtle">
                  {["No card", "No signup", "Shareable report", "Open methodology"].map(
                    (t) => (
                      <li key={t} className="inline-flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-signal-deep" />
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <HeroReadout />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 02 / RUBRIC ───────────────────────────────────────── */}
        <section aria-labelledby="rubric-heading" className="border-b border-line">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
            <Rule index="02" label="Rubric" />
            <div className="max-w-2xl">
              <h2
                id="rubric-heading"
                className="text-3xl sm:text-4xl font-semibold tracking-display text-fg"
              >
                Six categories. Every point traceable to a specific check.
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                No black-box scoring. Each finding shows the evidence, the
                impact, and a concrete fix —{" "}
                <span className="font-mono text-fg">{totalPoints}</span> points
                across {RUBRIC.length} categories.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
              {RUBRIC.map((c, i) => (
                <article
                  key={c.id}
                  className="group relative border-r border-b border-line p-6 transition-colors hover:bg-surface"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full"
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-xs text-subtle tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-xs tabular text-subtle group-hover:text-signal-deep transition-colors">
                      {c.points} pts
                    </span>
                  </div>
                  <h3 className="mt-4 font-mono text-base text-fg tracking-tight">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {c.checks}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 03 / METHOD — how it works ────────────────────────── */}
        <section className="border-b border-line bg-bg2">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
            <Rule index="03" label="Method" />
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-display max-w-2xl text-fg">
              Drop a URL. Get a number. Fix what fails.
            </h2>
            <div className="mt-14 grid sm:grid-cols-3 gap-x-8 gap-y-12">
              {[
                {
                  n: "01",
                  t: "Scan",
                  glyph: <ScanGlyph />,
                  d: "We fetch the homepage, llms.txt, robots, and sitemap — then parse the DOM, JSON-LD, and bot directives.",
                },
                {
                  n: "02",
                  t: "Score",
                  glyph: <ScoreGlyph />,
                  d: "25+ individual checks roll up into six category scores. The composite is a single 0–100 number with a letter grade.",
                },
                {
                  n: "03",
                  t: "Fix",
                  glyph: <FixGlyph />,
                  d: "Every failing check ships with a concrete suggested fix. Share the report URL, or hire the auditor to do the work.",
                },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-5xl tabular text-subtle leading-none">
                      {s.n}
                    </span>
                    <span className="text-fg">{s.glyph}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 04 / INDEX — recent audits / leaderboard ──────────── */}
        {indexRows.length > 0 && (
          <section className="border-b border-line">
            <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
              <Rule index="04" label="Index" />
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-display max-w-xl text-fg">
                  Real sites, recently scanned.
                </h2>
                <Link
                  href="/leaderboard"
                  className="text-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg inline-flex items-center gap-1 group shrink-0"
                >
                  Full leaderboard
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              <div className="border-t border-line">
                {indexRows.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/r/${r.id}`}
                    className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-4 px-1 hover:bg-surface transition-colors"
                  >
                    <span className="font-mono text-sm tabular text-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm text-fg truncate group-hover:underline decoration-line-strong underline-offset-4">
                      {hostOf(r.url)}
                    </span>
                    <div className="flex items-center gap-3">
                      <ScoreBadge score={r.score} grade={r.grade} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 05 / REPORT — sample report artifact ──────────────── */}
        {featured && (
          <section className="border-b border-line bg-bg2">
            <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
              <Rule index="05" label="Report" />
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-display text-fg">
                    Every audit is a shareable, public report.
                  </h2>
                  <p className="mt-4 text-muted leading-relaxed">
                    One URL, one readout: the score, the six category breakdowns,
                    and every passing and failing check with its evidence. Send it
                    to a client, a team, or your own backlog.
                  </p>
                  <Link
                    href={`/r/${featured.id}`}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-mono text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg group"
                  >
                    Open a live report
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="lg:col-span-7">
                  <ReportArtifact report={featured} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── 06 / SERVICES — hire ──────────────────────────────── */}
        <section className="border-b border-line">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
            <Rule index="06" label="Services" />
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-display text-fg">
                The auditor fixes what the audit finds.
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Built by a senior Next.js + Cloudflare developer. The score tells
                you where you stand; these turn the failing checks into shipped
                work.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
              {Object.values(GIGS)
                .slice(0, 6)
                .map((g) => (
                  <a
                    key={g.key}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative border-r border-b border-line p-6 transition-colors hover:bg-surface"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full"
                    />
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[15px] font-semibold tracking-tight text-fg">
                        {g.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-subtle group-hover:text-fg shrink-0 transition-colors" />
                    </div>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {g.blurb}
                    </p>
                    <p className="mt-4 text-xs font-mono tabular text-subtle">
                      from {g.startingPrice}
                    </p>
                  </a>
                ))}
            </div>
          </div>
        </section>

        {/* ─── 07 / FAQ ──────────────────────────────────────────── */}
        <section className="border-b border-line bg-bg2">
          <div className="max-w-3xl mx-auto px-6 py-20 lg:py-24">
            <Rule index="07" label="FAQ" />
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-display text-fg">
              The honest answers.
            </h2>
            <div className="mt-10 border-t border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-line py-5">
                  <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                    <h3 className="text-base font-medium tracking-tight text-fg">
                      {f.q}
                    </h3>
                    <span className="shrink-0 mt-0.5 font-mono text-subtle group-open:text-fg transition-colors">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">–</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted leading-relaxed pr-8">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────────── */}
        <section>
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-display text-fg">
              See where you stand.
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto">
              Sixty seconds. One score. Six categories of concrete fixes. Free,
              forever, for one site.
            </p>
            <div className="mt-10 max-w-xl mx-auto text-left">
              <HeroUrlInput />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}

/* ── Small editorial pieces ─────────────────────────────────── */

function scoreColor(score: number) {
  if (score >= 75) return "text-signal-deep";
  if (score >= 60) return "text-warn";
  return "text-danger";
}

function ScoreBadge({ score, grade }: { score: number; grade: string }) {
  return (
    <span className="font-mono text-sm tabular inline-flex items-baseline gap-1.5">
      <span className={scoreColor(score)}>{score}</span>
      <span className="text-subtle text-xs">{grade}</span>
    </span>
  );
}

function ReportArtifact({
  report,
}: {
  report: Awaited<ReturnType<typeof listRecentReports>>[number];
}) {
  const host = hostOf(report.url);
  return (
    <div className="instrument relative overflow-hidden rounded-xl border border-instrument-line bg-instrument text-instrument-fg shadow-pop">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-instrument-line">
          <span className="font-mono text-xs text-instrument-muted truncate">
            {host}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-instrument-muted">
            citegrade /r/{report.id}
          </span>
        </div>
        <div className="flex items-end gap-5 pt-5">
          <span className="font-mono text-[4rem] leading-none tabular text-instrument-fg">
            {report.score}
          </span>
          <div className="pb-2">
            <span className="font-mono text-2xl text-signal">{report.grade}</span>
            <p className="font-mono text-[11px] text-instrument-muted mt-1">
              {report.verdict}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
          {report.categories.map((c) => {
            const ratio = c.max ? c.earned / c.max : 0;
            return (
              <div key={c.category} className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-instrument-muted w-[72px] shrink-0 truncate">
                  {CATEGORY_LABELS[c.category]}
                </span>
                <div className="flex-1 h-[5px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${ratio * 100}%`,
                      background:
                        ratio >= 0.8
                          ? "var(--signal)"
                          : ratio >= 0.5
                            ? "#e0b341"
                            : "#d97a5c",
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular text-instrument-muted w-9 text-right shrink-0">
                  {c.earned}/{c.max}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Minimal line glyphs for the method steps (no emoji) ────── */

function ScanGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 12h24" stroke="var(--signal-deep)" strokeWidth="1.4" />
      <path d="M9 18h7M9 22h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function ScoreGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M5 22a10 10 0 1 1 20 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 12a10 10 0 0 1 10 10" stroke="var(--signal-deep)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 22l5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FixGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M5 16l6 6L25 8" stroke="var(--signal-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

void SITE;
