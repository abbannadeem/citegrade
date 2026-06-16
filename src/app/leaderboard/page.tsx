import Link from "next/link";
import { listRecentReports } from "@/lib/storage";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { ScorePill } from "@/components/score-pill";
import { hostOf } from "@/lib/utils";
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
        <section className="border-b border-line">
          <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 lg:pt-20">
            <p className="eyebrow mb-5">The Citegrade Index</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-display text-fg max-w-2xl">
              Who&apos;s winning at AI search?
            </h1>
            <p className="mt-5 text-muted max-w-xl leading-relaxed">
              A continuously-updated ranking of the highest-scoring sites on the
              Citegrade 100-point rubric. Anyone can audit — only the best make
              the board.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {ranked.length === 0 ? (
              <div className="border border-line rounded-xl p-10 text-center">
                <p className="text-fg">No audits yet. Be the first on the board.</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-sm font-mono text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
                >
                  Run an audit →
                </Link>
              </div>
            ) : (
              <div className="border-t border-line">
                <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-1 pb-3 rule-label">
                  <span>Rank</span>
                  <span>Site</span>
                  <span>Score</span>
                </div>
                {ranked.map((r) => (
                  <Link
                    key={r.host}
                    href={`/r/${r.reportId}`}
                    className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-t border-line py-4 px-1 hover:bg-surface transition-colors"
                  >
                    <span
                      className={
                        r.rank <= 3
                          ? "font-mono tabular text-fg text-base"
                          : "font-mono tabular text-subtle text-sm"
                      }
                    >
                      {String(r.rank).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm text-fg truncate group-hover:underline decoration-line-strong underline-offset-4">
                      {r.host}
                    </span>
                    <ScorePill score={r.score} grade={r.grade} />
                  </Link>
                ))}
              </div>
            )}
            <p className="mt-8 text-sm text-muted">
              Want to climb the board?{" "}
              <Link
                href="/"
                className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
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
