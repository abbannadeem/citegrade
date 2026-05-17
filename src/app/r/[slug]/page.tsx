import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { loadReport } from "@/lib/storage";
import { ScoreGauge } from "@/components/score-gauge";
import { CategoryCard } from "@/components/category-card";
import { HireCTA } from "@/components/hire-cta";
import { ShareLink } from "@/components/share-link";
import { JsonLd } from "@/components/json-ld";
import { siteUrl, SITE } from "@/lib/site";
import { ArrowLeft } from "lucide-react";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const report = await loadReport(slug);
  if (!report) return { title: "Report not found" };
  const host = (() => {
    try {
      return new URL(report.url).host;
    } catch {
      return report.url;
    }
  })();
  const title = `${host} scored ${report.score}/100 (${report.grade}) on AI SEO`;
  const desc = `${report.verdict}. Citegrade audited ${host} against 100 points of AI SEO: llms.txt, JSON-LD schema, semantic HTML, meta, crawlability, and E-E-A-T signals.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/r/${slug}` },
    openGraph: {
      type: "article",
      title,
      description: desc,
      url: `/r/${slug}`,
      publishedTime: report.fetchedAt,
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

function reportJsonLd(report: Awaited<ReturnType<typeof loadReport>>) {
  if (!report) return null;
  const url = siteUrl(`/r/${report.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `AI SEO audit: ${new URL(report.url).host} scored ${report.score}/100`,
    description: report.verdict,
    url,
    datePublished: report.fetchedAt,
    dateModified: report.fetchedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${SITE.url}#person` },
    publisher: { "@id": `${SITE.url}#organization` },
    about: {
      "@type": "WebSite",
      url: report.url,
      name: (() => {
        try {
          return new URL(report.url).host;
        } catch {
          return report.url;
        }
      })(),
    },
  } as const;
}

export default async function ReportPage({ params }: Params) {
  const { slug } = await params;
  const report = await loadReport(slug);
  if (!report) notFound();

  const host = (() => {
    try {
      return new URL(report.url).host;
    } catch {
      return report.url;
    }
  })();

  return (
    <>
      <JsonLd data={reportJsonLd(report)} />

      <main className="flex-1 px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8" aria-label="Breadcrumb">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              New audit
            </Link>
          </nav>

          <header className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  AI SEO report
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  <a
                    href={report.finalUrl || report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-300 hover:underline underline-offset-4 break-all"
                  >
                    {host}
                  </a>
                </h1>
                <p className="mt-2 text-sm text-zinc-500 font-mono">
                  Scanned <time dateTime={report.fetchedAt}>{new Date(report.fetchedAt).toLocaleString()}</time>
                  {" · "}
                  {report.durationMs}ms · HTTP {report.metadata.statusCode}
                </p>
              </div>
              <ShareLink url={siteUrl(`/r/${report.id}`)} />
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
              <ScoreGauge
                score={report.score}
                grade={report.grade}
                verdict={report.verdict}
              />
              <dl className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {report.categories.map((c) => (
                  <div key={c.category}>
                    <dt className="text-zinc-500 text-xs uppercase tracking-wider">
                      {labelFor(c.category)}
                    </dt>
                    <dd className="mt-1 text-zinc-200 font-mono tabular-nums">
                      {c.earned}
                      <span className="text-zinc-600">/{c.max}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </header>

          <section className="mt-12 space-y-6" aria-label="Detailed findings">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500">
              Detailed findings
            </h2>
            {report.categories.map((c) => (
              <CategoryCard key={c.category} data={c} />
            ))}
          </section>

          <section className="mt-12">
            <HireCTA categories={report.categories} />
          </section>

          <p className="mt-12 text-xs text-zinc-600 text-center">
            Scored using Citegrade&apos;s public{" "}
            <Link href="/" className="underline underline-offset-2">
              100-point rubric
            </Link>
            . Re-run on the homepage to track improvements.
          </p>
        </div>
      </main>
    </>
  );
}

function labelFor(c: string): string {
  const map: Record<string, string> = {
    "llms-txt": "llms.txt",
    schema: "Schema",
    semantic: "Semantic",
    meta: "Meta",
    crawlability: "Crawl",
    eeat: "E-E-A-T",
  };
  return map[c] ?? c;
}
