import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { searchUserAudits } from "@/lib/dashboard";
import { DashboardSearch } from "@/components/dashboard-search";
import { Card } from "@/components/ui/card";
import { ScorePill } from "@/components/score-pill";
import { Sparkline } from "@/components/sparkline";
import { hostOf, relativeTime } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export const metadata = { title: "Search" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser("/dashboard/search");
  const { q } = await searchParams;
  const query = q ?? "";
  const { sites, audits } = await searchUserAudits(user.id, query);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl">
      <p className="text-xs uppercase tracking-widest text-subtle mb-1">Search</p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
        Find sites & audits
      </h1>
      <DashboardSearch initial={query} />

      {query && (
        <p className="mt-4 text-sm text-subtle">
          {sites.length + audits.length} result
          {sites.length + audits.length === 1 ? "" : "s"} for{" "}
          <span className="text-fg font-mono">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      {query && sites.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs uppercase tracking-widest text-subtle mb-3">
            Sites
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {sites.map((s) => (
              <Link
                key={s.host}
                href={`/dashboard/sites/${encodeURIComponent(s.host)}`}
              >
                <Card className="p-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-fg truncate">
                      {s.host}
                    </span>
                    <ScorePill score={s.latestScore} grade={s.latestGrade} size="sm" />
                  </div>
                  <Sparkline values={s.sparkline} width={220} height={32} className="w-full mt-3" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {query && audits.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-widest text-subtle mb-3">
            Audits
          </h2>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-line">
              {audits.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/r/${a.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-surface2 transition-colors"
                  >
                    <span className="font-mono text-sm text-fg truncate">
                      {hostOf(a.url)}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-subtle font-mono">
                        {relativeTime(a.fetchedAt)}
                      </span>
                      <ScorePill score={a.score} grade={a.grade} size="sm" />
                      <ArrowUpRight className="w-4 h-4 text-subtle" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {query && sites.length === 0 && audits.length === 0 && (
        <p className="mt-8 text-sm text-subtle">
          No matches. Try a different host name.
        </p>
      )}
    </div>
  );
}
