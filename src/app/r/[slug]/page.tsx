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
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Bookmark, ArrowUpRight, FileDown } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { limitsFor } from "@/lib/plans";
import { CATEGORY_MAX, type CheckCategory, CATEGORY_LABELS } from "@/lib/audit/types";
import { hostOf, relativeTime } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const report = await loadReport(slug);
  if (!report) return { title: "Report not found" };
  const host = hostOf(report.url);
  const title = `${host} scored ${report.score}/100 (${report.grade}) on AI SEO`;
  const desc = `${report.verdict}. Audited against 100 points of AI SEO: llms.txt, JSON-LD schema, semantic HTML, meta, crawlability, and E-E-A-T signals.`;
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
    headline: `AI SEO audit: ${hostOf(report.url)} scored ${report.score}/100`,
    description: report.verdict,
    url,
    datePublished: report.fetchedAt,
    dateModified: report.fetchedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${SITE.url}#person` },
    publisher: { "@id": `${SITE.url}#organization` },
  } as const;
}

export default async function ReportPage({ params }: Params) {
  const { slug } = await params;
  const report = await loadReport(slug);
  if (!report) notFound();
  const user = await getCurrentUser();
  const host = hostOf(report.url);

  return (
    <>
      <JsonLd data={reportJsonLd(report)} />
      <MarketingHeader isAuthed={!!user} />

      <main className="flex-1 px-6 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
            <div>
              <Badge variant="primary" className="mb-3">
                <Sparkles className="w-3 h-3" /> AI SEO report
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <a
                  href={report.finalUrl || report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline underline-offset-4 break-all"
                >
                  {host}
                </a>
              </h1>
              <p className="mt-2 text-sm text-subtle font-mono">
                Scanned{" "}
                <time dateTime={report.fetchedAt}>
                  {relativeTime(report.fetchedAt)}
                </time>{" "}
                · {report.durationMs}ms · HTTP {report.metadata.statusCode}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShareLink url={siteUrl(`/r/${report.id}`)} />
              {user && limitsFor(user.plan).pdfExport && (
                <Button asChild variant="secondary" size="sm">
                  <a
                    href={`/api/report/${report.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileDown className="w-3 h-3" /> PDF
                  </a>
                </Button>
              )}
              <Button asChild variant="secondary" size="sm">
                <Link href={`/?url=${encodeURIComponent(report.url)}`}>
                  <Play className="w-3 h-3" /> Re-run
                </Link>
              </Button>
            </div>
          </div>

          {!user && (
            <Card className="mb-8 p-5 border-primary/30 bg-primary-soft">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Bookmark className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-fg font-medium">
                      Save this report and track changes over time
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Free account · weekly re-scans on Pro · 1-click claim.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" className="shrink-0">
                  <Link
                    href={`/sign-up?claim=${report.id}&next=${encodeURIComponent(`/r/${report.id}`)}`}
                  >
                    Claim report <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6 sm:p-10 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
            <div className="relative">
              <ScoreGauge
                score={report.score}
                grade={report.grade}
                verdict={report.verdict}
              />
              <dl className="mt-8 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                {report.categories.map((c) => {
                  const pct = c.earned / c.max;
                  const tone =
                    pct >= 0.9
                      ? "text-success"
                      : pct >= 0.6
                        ? "text-warn"
                        : "text-danger";
                  return (
                    <div key={c.category}>
                      <dt className="text-subtle text-[10px] uppercase tracking-widest">
                        {CATEGORY_LABELS[c.category as CheckCategory]}
                      </dt>
                      <dd className={`mt-1 font-mono tabular text-lg ${tone}`}>
                        {c.earned}
                        <span className="text-subtle text-sm">
                          /{CATEGORY_MAX[c.category as CheckCategory]}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </Card>

          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-subtle">
              Detailed findings
            </h2>
            {report.categories.map((c) => (
              <CategoryCard key={c.category} data={c} />
            ))}
          </section>

          <section className="mt-12">
            <HireCTA
              categories={report.categories}
              reportId={report.id}
              siteHost={host}
              currentScore={report.score}
            />
          </section>

          <p className="mt-12 text-xs text-subtle text-center">
            Scored using Citegrade&apos;s public{" "}
            <Link href="/docs" className="underline underline-offset-2">
              100-point rubric
            </Link>
            .
          </p>
        </div>
      </main>

      <MarketingFooter />
    </>
  );
}
