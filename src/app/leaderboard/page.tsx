import Link from "next/link";
import { listRecentReports } from "@/lib/storage";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScorePill } from "@/components/score-pill";
import { hostOf } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Leaderboard",
  description:
    "The Citegrade Index — top sites ranked by AI search visibility. Updated continuously from public audits.",
};

export const dynamic = "force-dynamic";

interface Row {
  rank: number;
  host: string;
  score: number;
  grade: string;
  reportId: string;
}

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  const reports = await listRecentReports(500);
  // dedupe by host, keep latest per host, then sort by score desc
  const latestByHost = new Map<string, (typeof reports)[number]>();
  for (const r of reports) {
    const h = hostOf(r.url);
    const ex = latestByHost.get(h);
    if (!ex || ex.fetchedAt < r.fetchedAt) latestByHost.set(h, r);
  }
  const ranked: Row[] = [...latestByHost.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 100)
    .map((r, i) => ({
      rank: i + 1,
      host: hostOf(r.url),
      score: r.score,
      grade: r.grade,
      reportId: r.id,
    }));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Citegrade Leaderboard",
    description: "Top sites by AI search visibility score.",
    numberOfItems: ranked.length,
    itemListElement: ranked.slice(0, 20).map((r) => ({
      "@type": "ListItem",
      position: r.rank,
      url: siteUrl(`/r/${r.reportId}`),
      name: r.host,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-20 sm:py-28">
          <div className="absolute inset-0 bg-aurora pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <Trophy className="w-3 h-3" /> The Citegrade Index
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Who&apos;s winning at{" "}
              <span className="text-primary">AI search?</span>
            </h1>
            <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
              A continuously-updated ranking of the highest-scoring sites on
              the Citegrade 100-point rubric. Anyone can audit — only the best
              make the board.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            {ranked.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-fg">
                  No audits yet. Be the first on the board.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-sm text-primary hover:text-primary"
                >
                  Run an audit →
                </Link>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-line text-[10px] uppercase tracking-widest text-subtle">
                    <tr>
                      <th className="text-left font-medium px-5 py-3 w-16">#</th>
                      <th className="text-left font-medium px-5 py-3">Site</th>
                      <th className="text-right font-medium px-5 py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {ranked.map((r) => (
                      <tr
                        key={r.host}
                        className="hover:bg-surface2 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <span
                            className={
                              r.rank <= 3
                                ? "text-primary font-mono tabular font-bold text-base"
                                : "text-subtle font-mono tabular text-sm"
                            }
                          >
                            {String(r.rank).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/r/${r.reportId}`}
                            className="font-mono text-fg group-hover:text-primary transition-colors"
                          >
                            {r.host}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <ScorePill score={r.score} grade={r.grade} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
            <p className="text-center text-xs text-subtle mt-6">
              Want to climb the board?{" "}
              <Link
                href="/"
                className="text-primary hover:text-primary"
              >
                Run an audit
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
