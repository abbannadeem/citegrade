import Link from "next/link";
import { HeroUrlInput } from "@/components/hero-url-input";
import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/site-schema";
import { siteUrl } from "@/lib/site";
import { CATEGORY_LABELS, CATEGORY_MAX } from "@/lib/audit/types";
import { listRecentReports } from "@/lib/storage";
import { ScorePill } from "@/components/score-pill";
import { Sparkline } from "@/components/sparkline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { hostOf, relativeTime } from "@/lib/utils";
import {
  Bot,
  Check,
  FileCode,
  Gauge,
  Layers,
  Radar,
  Sparkles,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

const FAQS = [
  {
    q: "What is AI SEO?",
    a: "AI SEO (also called GEO — Generative Engine Optimization) is the practice of structuring a website so that LLMs like ChatGPT, Claude, Perplexity, and Google AI Overview can read, understand, and cite its content. It extends classical SEO with llms.txt, richer JSON-LD schema, and content patterns optimized for extractive citation.",
  },
  {
    q: "Why does this score matter?",
    a: "Search is splitting. Traditional search rewards keyword authority; AI search rewards entity clarity, structured data, and citation-ready content. Sites that score below 60 on Citegrade routinely fail to appear in LLM answers — even when they rank #1 on Google for the same query.",
  },
  {
    q: "Is llms.txt actually used by ChatGPT or Claude?",
    a: "No major LLM provider has publicly committed to consuming llms.txt during training or retrieval as of May 2026. It is currently signal-without-consumer, used mainly by agent frameworks and RAG pipelines. Citegrade scores it because (1) adoption is climbing, (2) it costs nothing to ship, and (3) shipping a high-quality one correlates with other signals LLMs do use.",
  },
  {
    q: "How accurate is the score?",
    a: "The 100-point rubric is opinionated and open. Every point is traceable. It reflects best-practice consensus on what makes content LLM-readable as of May 2026. A high score does not guarantee citation, but a low score reliably predicts that LLMs will struggle to parse and reuse your content.",
  },
  {
    q: "Do I need an account?",
    a: "No. The audit runs free, no signup, no credit card. Create an account only if you want to save reports, track scores over time, or monitor multiple sites with weekly auto-scans.",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "100-point transparent score",
    desc: "Every point is traceable to a specific check. No black-box scoring, no \"AI confidence\" hand-waving.",
  },
  {
    icon: Radar,
    title: "Six-category breakdown",
    desc: "llms.txt · JSON-LD schema · semantic HTML · meta tags · crawlability · E-E-A-T signals. Each scored independently.",
  },
  {
    icon: Bot,
    title: "AI-bot-aware",
    desc: "Checks for explicit rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and Applebot-Extended in robots.txt.",
  },
  {
    icon: Layers,
    title: "Schema for LLM citation",
    desc: "Validates Organization + Person + sameAs networks — what LLMs actually use to disambiguate your identity.",
  },
  {
    icon: FileCode,
    title: "llms.txt spec validation",
    desc: "Not just presence — checks the file follows llmstxt.org spec, has a real summary, and ships with llms-full.txt.",
  },
  {
    icon: Zap,
    title: "Results in under 30 seconds",
    desc: "We fetch your homepage and parse it server-side. Shareable report URL, dynamic OG card per report.",
  },
];

export default async function Home() {
  const recent = await listRecentReports(5);
  const user = await getCurrentUser();
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <JsonLd data={howToSchema()} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Home", url: siteUrl("/") }])}
      />

      <MarketingHeader isAuthed={!!user} />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 px-6">
          <div className="absolute inset-0 bg-aurora pointer-events-none" />
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <Sparkles className="w-3 h-3" /> v1.0 · open beta · free forever
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
              Score your site&apos;s{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
                AI search visibility
              </span>{" "}
              in 60 seconds.
            </h1>
            <p className="mt-6 text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Citegrade runs a 100-point audit across the signals that decide
              whether ChatGPT, Perplexity, Claude, and Google AI cite your
              pages — free, no signup, transparent rubric.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <HeroUrlInput />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" /> No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" /> No email required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" /> Shareable report
              </span>
            </div>
          </div>
        </section>

        {recent.length > 0 && (
          <section className="px-6 -mt-12 mb-24 relative">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-xs uppercase tracking-widest text-zinc-500 mb-6">
                Recent public audits
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recent.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    href={`/r/${r.id}`}
                    className="block rounded-xl border border-white/[0.06] bg-[#0d0d14]/80 backdrop-blur hover:border-indigo-500/40 hover:bg-[#11111a] px-4 py-3 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-zinc-200 truncate group-hover:text-indigo-300 transition-colors">
                        {hostOf(r.url)}
                      </span>
                      <ScorePill score={r.score} grade={r.grade} size="sm" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Sparkline values={[r.score]} width={80} height={20} />
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {relativeTime(r.fetchedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          aria-labelledby="features"
          className="px-6 py-24 border-t border-white/[0.04]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                What we measure
              </p>
              <h2
                id="features"
                className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight"
              >
                Six categories. Every check{" "}
                <span className="text-zinc-500">explained, scored, fixable.</span>
              </h2>
            </div>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-[#0a0a0f] p-6 hover:bg-[#0d0d14] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <h3 className="text-zinc-100 font-medium">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="rubric-heading"
          className="px-6 py-24 border-t border-white/[0.04]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                  The 100-point rubric
                </p>
                <h2
                  id="rubric-heading"
                  className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
                >
                  Transparent. Open. No black box.
                </h2>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Every category contributes a fixed share of the 100. Every
                  check is documented. Every failure includes a concrete fix.
                  Read the full methodology in{" "}
                  <Link
                    href="/docs"
                    className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
                  >
                    /docs
                  </Link>
                  .
                </p>
              </div>
              <div className="space-y-2">
                {(
                  Object.entries(CATEGORY_LABELS) as [
                    keyof typeof CATEGORY_LABELS,
                    string,
                  ][]
                ).map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center justify-between"
                  >
                    <span className="text-zinc-200">{label}</span>
                    <span className="font-mono text-sm text-indigo-300 tabular">
                      {CATEGORY_MAX[key]} pts
                    </span>
                  </div>
                ))}
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-4 py-3 flex items-center justify-between">
                  <span className="text-zinc-100 font-medium">Total</span>
                  <span className="font-mono text-sm text-indigo-300 tabular">
                    100 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="cta-heading"
          className="px-6 py-24 border-t border-white/[0.04]"
        >
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />
            <div className="relative">
              <h2
                id="cta-heading"
                className="text-3xl sm:text-5xl font-semibold tracking-tight"
              >
                Stop guessing.{" "}
                <span className="text-indigo-300">Get your score.</span>
              </h2>
              <p className="mt-4 text-zinc-400">
                The audit takes under a minute. Pricing later, score first.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button size="xl" asChild>
                  <Link href="#top">Run free audit</Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/pricing">See pricing →</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="px-6 py-24 border-t border-white/[0.04]"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
              Frequently asked
            </p>
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10"
            >
              Questions, answered honestly.
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4 hover:bg-white/[0.02]">
                    <span className="font-medium text-zinc-100">{f.q}</span>
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
