import { UrlInput } from "@/components/url-input";
import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/site-schema";
import { SITE, siteUrl } from "@/lib/site";
import { GIGS } from "@/lib/gigs";
import { CATEGORY_LABELS, CATEGORY_MAX } from "@/lib/audit/types";
import { listRecentReports } from "@/lib/storage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recent = await listRecentReports(5);
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <JsonLd data={howToSchema()} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Home", url: siteUrl("/") }])}
      />

      <main className="flex-1">
        <section className="px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v1.0 · open beta
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              Is your site{" "}
              <span className="text-emerald-400">readable by AI?</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              ChatGPT, Claude, and Perplexity now answer 40% of queries without
              sending a click. Citegrade scans your homepage against{" "}
              <strong className="text-zinc-200">100 points of AI SEO</strong>{" "}
              — llms.txt, JSON-LD, semantic HTML, meta tags, crawl rules, and
              E-E-A-T signals — and tells you exactly what to fix.
            </p>
            <div className="mt-10">
              <UrlInput />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="rubric-heading"
          className="px-6 py-16 border-t border-zinc-900"
        >
          <div className="max-w-5xl mx-auto">
            <h2
              id="rubric-heading"
              className="text-xs uppercase tracking-widest text-zinc-500 mb-2"
            >
              The 100-point rubric
            </h2>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-2xl">
              Six categories. Every point traceable to a specific check. No
              black-box scoring.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                Object.entries(CATEGORY_LABELS) as [
                  keyof typeof CATEGORY_LABELS,
                  string,
                ][]
              ).map(([key, label]) => (
                <article
                  key={key}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-zinc-100">{label}</h3>
                    <span className="text-emerald-400 font-mono text-sm tabular-nums">
                      / {CATEGORY_MAX[key]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {DESCRIPTIONS[key]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="services-heading"
          className="px-6 py-16 border-t border-zinc-900"
        >
          <div className="max-w-5xl mx-auto">
            <h2
              id="services-heading"
              className="text-xs uppercase tracking-widest text-zinc-500 mb-2"
            >
              Hire the auditor
            </h2>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-2xl">
              Built by a senior Next.js + Cloudflare developer who fixes what
              the audit finds.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {Object.values(GIGS).map((g) => (
                <a
                  key={g.key}
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-zinc-800 hover:border-emerald-500/40 px-5 py-5 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                      {g.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {g.blurb}
                  </p>
                  <p className="mt-3 text-emerald-400 font-mono text-sm tabular-nums">
                    from {g.startingPrice}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {recent.length > 0 && (
          <section
            aria-labelledby="recent-heading"
            className="px-6 py-16 border-t border-zinc-900"
          >
            <div className="max-w-3xl mx-auto">
              <h2
                id="recent-heading"
                className="text-xs uppercase tracking-widest text-zinc-500 mb-4"
              >
                Recent audits
              </h2>
              <ul className="divide-y divide-zinc-900">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/r/${r.id}`}
                      className="flex items-center justify-between py-3 group"
                    >
                      <span className="text-zinc-300 font-mono text-sm truncate group-hover:text-emerald-300 transition-colors">
                        {(() => {
                          try {
                            return new URL(r.url).host;
                          } catch {
                            return r.url;
                          }
                        })()}
                      </span>
                      <span className="text-zinc-500 font-mono tabular-nums text-sm">
                        {r.score} / 100
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <footer className="px-6 py-10 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-zinc-500">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Built by{" "}
            <a
              href={SITE.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-emerald-300 transition-colors"
            >
              {SITE.authorName}
            </a>
            . Rubric inspired by the{" "}
            <a
              href="https://llmstxt.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              llmstxt.org spec
            </a>{" "}
            and{" "}
            <a
              href="https://schema.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              schema.org
            </a>
            . Last updated{" "}
            <time dateTime={new Date().toISOString().slice(0, 10)}>
              {new Date().toISOString().slice(0, 10)}
            </time>
            .
          </p>
          <nav className="flex gap-5 font-mono text-xs" aria-label="Resources">
            <a
              href="/llms.txt"
              className="hover:text-zinc-300 transition-colors"
            >
              /llms.txt
            </a>
            <a
              href="/robots.txt"
              className="hover:text-zinc-300 transition-colors"
            >
              /robots.txt
            </a>
            <a
              href="/sitemap.xml"
              className="hover:text-zinc-300 transition-colors"
            >
              /sitemap.xml
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

const DESCRIPTIONS: Record<keyof typeof CATEGORY_LABELS, string> = {
  "llms-txt":
    "Does /llms.txt exist? Is it well-structured (H1, blockquote, sections, links)? Is there a llms-full.txt companion?",
  schema:
    "JSON-LD presence, parseability, Organization/Person identity with sameAs, page-type schemas (Article, Product, WebSite), and bonus relational schemas (FAQPage, BreadcrumbList).",
  semantic:
    "Single H1, no skipped heading levels, <main> landmark, <article>/<section> usage, image alt-text coverage.",
  meta:
    "Title length (30–60), description length (70–160), canonical URL, og:image, twitter:card.",
  crawlability:
    "robots.txt + sitemap.xml present, explicit rules for AI bots (GPTBot, ClaudeBot, PerplexityBot), <html lang>.",
  eeat:
    "Author identity (Person schema + byline), freshness signals (<time>, last-updated text), About + Contact reachability, outbound authority citations, sameAs network.",
};
