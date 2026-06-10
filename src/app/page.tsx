import Image from "next/image";
import Link from "next/link";
import { HeroUrlInput } from "@/components/hero-url-input";
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
import { ArrowUpRight, Check, FileText, Layers, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Eyebrow } from "@/components/eyebrow";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { hostOf } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&q=80&auto=format&fit=crop";

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

export default async function Home() {
  const recent = await listRecentReports(6);
  const user = await getCurrentUser();
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <JsonLd data={howToSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: siteUrl("/") }])} />

      <MarketingHeader isAuthed={!!user} />

      <main className="flex-1">
        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="bg-aurora relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-line bg-surface/70 backdrop-blur-sm text-[11px] font-mono text-muted mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  v1.2 · free for one site, forever
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-medium leading-[1.02] tracking-[-0.03em] text-fg">
                  See your site
                  <br />
                  <span className="bg-gradient-to-br from-fg via-fg to-muted bg-clip-text text-transparent">
                    through an AI&apos;s eyes.
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
                  A 100-point audit of how ChatGPT, Claude, Perplexity, and
                  Google AI read your pages — across llms.txt, schema, semantic
                  HTML, meta, crawlability, and E-E-A-T. Free, sixty seconds, no
                  signup.
                </p>
                <div className="mt-9">
                  <HeroUrlInput />
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" /> No card
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" /> No signup
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" /> Shareable
                    report
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" /> Auditor
                    scores 95/100 itself
                  </span>
                </div>
              </div>

              {/* Hero visual — Unsplash photo with brand wash */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden border border-line shadow-card aspect-[4/5] bg-surface2">
                  <Image
                    src={HERO_IMG}
                    alt="A focused workspace — the kind of attention modern AI search demands"
                    fill
                    sizes="(max-width: 1024px) 0px, 500px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/15" />
                  <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_left,transparent,rgba(0,0,0,0.18))]" />
                  {/* Floating score card */}
                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-line bg-surface/95 backdrop-blur-xl shadow-pop p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-subtle">
                          your-site.com
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular text-fg tracking-tight">
                          78<span className="text-subtle text-sm">/100</span>{" "}
                          <span className="text-success text-sm font-normal">
                            B
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-medium text-fg">
                          AI-friendly
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-6 gap-1">
                      {[1, 1, 0.6, 0.85, 1, 0.45].map((v, i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full bg-line overflow-hidden"
                        >
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${v * 100}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── BY THE NUMBERS ─────────────────────────────────────── */}
        <section className="py-16 border-t border-line bg-surface/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <Eyebrow className="mb-6">By the numbers</Eyebrow>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6">
              {[
                { v: "100", l: "Point rubric" },
                { v: "6", l: "Audit categories" },
                { v: "25+", l: "Individual checks" },
                { v: "<15s", l: "Avg run time" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-4xl sm:text-5xl font-medium tabular text-fg tracking-[-0.03em]">
                    {s.v}
                  </p>
                  <p className="mt-1 text-xs text-subtle uppercase tracking-wider">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BENTO RUBRIC ─────────────────────────────────────── */}
        <section
          aria-labelledby="rubric-heading"
          className="py-24 border-t border-line"
        >
          <div className="max-w-6xl mx-auto px-6">
            <Eyebrow>The rubric</Eyebrow>
            <h2
              id="rubric-heading"
              className="mt-3 text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-2xl"
            >
              Six categories. Every point traceable to a specific check.
            </h2>
            <p className="mt-3 text-muted max-w-xl">
              No black-box scoring. Each finding shows the evidence, the impact,
              and a concrete fix.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-6 gap-4">
              {/* llms.txt — large card */}
              <BentoCard
                area="sm:col-span-3 sm:row-span-2"
                icon={<FileText className="w-4 h-4" />}
                eyebrow="15 points"
                title="llms.txt"
                body="A Markdown index for LLMs at /llms.txt. We check presence, spec conformance, and llms-full.txt pairing. Most sites fail this single check."
                tone="primary"
              />
              <BentoCard
                area="sm:col-span-3"
                icon={<Layers className="w-4 h-4" />}
                eyebrow="25 points"
                title="JSON-LD schema"
                body="Organization/Person identity, page-type schema, FAQ + BreadcrumbList."
              />
              <BentoCard
                area="sm:col-span-3"
                icon={<Search className="w-4 h-4" />}
                eyebrow="15 points"
                title="Semantic HTML"
                body="Single H1, no skipped heading levels, landmarks, alt-text coverage."
              />
              <BentoCard
                area="sm:col-span-2"
                icon={<Zap className="w-4 h-4" />}
                eyebrow="15 points"
                title="Meta + social"
                body="Title length, description, canonical, og:image, twitter:card."
              />
              <BentoCard
                area="sm:col-span-2"
                icon={<ShieldCheck className="w-4 h-4" />}
                eyebrow="15 points"
                title="Crawlability"
                body="robots.txt, sitemap, AI bot directives (GPTBot, ClaudeBot, PerplexityBot)."
              />
              <BentoCard
                area="sm:col-span-2"
                icon={<Sparkles className="w-4 h-4" />}
                eyebrow="15 points"
                title="E-E-A-T"
                body="Author, freshness, About + Contact, authority links, sameAs."
              />
            </div>
            <p className="mt-8 text-xs text-subtle font-mono">
              Total: {Object.values(CATEGORY_MAX).reduce((a, b) => a + b, 0)}{" "}
              points across {Object.keys(CATEGORY_LABELS).length} categories.
            </p>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="py-24 border-t border-line bg-bg2/50">
          <div className="max-w-6xl mx-auto px-6">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-2xl">
              Drop a URL. Get a number. Fix what fails.
            </h2>
            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  t: "Scan",
                  d: "We fetch the homepage, llms.txt, robots, and sitemap. Then we parse the DOM, JSON-LD, and bot directives.",
                },
                {
                  n: "02",
                  t: "Score",
                  d: "25+ individual checks roll up into six category scores. The composite is a single 0–100 number with a letter grade.",
                },
                {
                  n: "03",
                  t: "Fix",
                  d: "Every failing check ships with a concrete suggested fix. Share the report URL or hire the auditor to do the work.",
                },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <span className="text-[10px] font-mono text-subtle tracking-wider">
                    {s.n}
                  </span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-fg">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── RECENT PUBLIC AUDITS ─────────────────────────────── */}
        {recent.length > 0 && (
          <section className="py-20 border-t border-line">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <Eyebrow>Recent audits</Eyebrow>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em]">
                    Real sites, scanned in the last few days.
                  </h2>
                </div>
                <Link
                  href="/leaderboard"
                  className="text-sm text-primary hover:text-primary-hover font-medium inline-flex items-center gap-1 group"
                >
                  Full leaderboard
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/r/${r.id}`}
                      className="block rounded-xl border border-line bg-surface hover:border-line-strong hover:shadow-card transition-all px-4 py-3 group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-sm text-fg truncate">
                          {hostOf(r.url)}
                        </span>
                        <span
                          className={`text-sm font-medium tabular ${
                            r.score >= 75
                              ? "text-success"
                              : r.score >= 50
                                ? "text-warn"
                                : "text-danger"
                          }`}
                        >
                          {r.score}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ─── HIRE / SERVICES TEASER ──────────────────────────── */}
        <section className="py-24 border-t border-line">
          <div className="max-w-6xl mx-auto px-6">
            <Eyebrow>Hire the auditor</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-2xl">
              Built by a senior Next.js + Cloudflare developer who fixes what
              the audit finds.
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(GIGS).slice(0, 6).map((g) => (
                <a
                  key={g.key}
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-line bg-surface hover:border-primary/40 hover:shadow-card px-4 py-4 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-tight text-fg group-hover:text-primary transition-colors">
                      {g.title}
                    </h3>
                    <ArrowUpRight className="w-3.5 h-3.5 text-subtle group-hover:text-primary shrink-0 transition-colors" />
                  </div>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {g.blurb}
                  </p>
                  <p className="mt-3 text-xs font-mono tabular text-primary">
                    from {g.startingPrice}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section className="py-24 border-t border-line bg-bg2/50">
          <div className="max-w-3xl mx-auto px-6">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-[-0.03em]">
              The honest answers.
            </h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                    <h3 className="text-base font-medium tracking-tight text-fg">
                      {f.q}
                    </h3>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-line flex items-center justify-center text-subtle group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted leading-relaxed pr-10">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────── */}
        <section className="py-24 border-t border-line">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em]">
              See where you stand.
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Sixty seconds. One score. Six categories of concrete fixes. Free,
              forever, for one site.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <HeroUrlInput />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}

function BentoCard({
  area,
  icon,
  eyebrow,
  title,
  body,
  tone,
}: {
  area: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  tone?: "primary";
}) {
  return (
    <article
      className={`${area} rounded-2xl border border-line bg-surface shadow-card p-6 hover:border-line-strong hover:shadow-pop transition-all ${
        tone === "primary"
          ? "bg-gradient-to-br from-primary-soft/40 via-surface to-surface"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
          {icon}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-subtle">
          {eyebrow}
        </span>
      </div>
      <h3 className="text-lg font-medium tracking-tight text-fg">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </article>
  );
}

void SITE;
