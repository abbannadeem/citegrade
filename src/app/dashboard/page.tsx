import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { aggregateScore, siteSummariesForUser } from "@/lib/dashboard";
import { listReportsForUser } from "@/lib/storage";
import { ScorePill } from "@/components/score-pill";
import { Sparkline } from "@/components/sparkline";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus, TrendingDown, TrendingUp, Minus, FileX } from "lucide-react";
import { relativeTime, hostOf } from "@/lib/utils";

export const metadata = { title: "Overview" };

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const sites = await siteSummariesForUser(user.id);
  const reports = await listReportsForUser(user.id, 8);
  const agg = await aggregateScore(reports);
  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Good to see you, {user.name.split(" ")[0]}.
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track your sites&apos; AI search visibility over time.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="w-4 h-4" />
            New audit
          </Link>
        </Button>
      </div>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        <Kpi
          label="Sites tracked"
          value={sites.length.toString()}
          hint={`${user.plan === "pro" ? 10 : 1} included`}
        />
        <Kpi
          label="Total audits"
          value={agg.total.toString()}
          hint="all-time"
        />
        <Kpi
          label="Average score"
          value={agg.avg.toString()}
          hint="across your sites"
          tone="primary"
        />
        <Kpi
          label="Plan"
          value={user.plan === "pro" ? "Pro" : "Free"}
          hint={user.plan === "pro" ? "$29 / mo" : "1 audit / day"}
        />
      </section>

      <section aria-labelledby="sites-heading" className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2
            id="sites-heading"
            className="text-xs uppercase tracking-widest text-zinc-500"
          >
            Your sites
          </h2>
          {sites.length > 0 && (
            <Link
              href="/dashboard/sites"
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              View all
            </Link>
          )}
        </div>
        {sites.length === 0 ? (
          <EmptyState />
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Site</th>
                  <th className="text-left font-medium px-5 py-3">Score</th>
                  <th className="text-left font-medium px-5 py-3">Trend</th>
                  <th className="text-left font-medium px-5 py-3">Audits</th>
                  <th className="text-left font-medium px-5 py-3">Last run</th>
                  <th className="text-right font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sites.map((s) => (
                  <tr
                    key={s.host}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/sites/${encodeURIComponent(s.host)}`}
                        className="font-mono text-zinc-200 group-hover:text-indigo-300 transition-colors"
                      >
                        {s.host}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <ScorePill score={s.latestScore} grade={s.latestGrade} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkline values={s.sparkline} />
                        <DeltaBadge delta={s.delta} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 font-mono tabular">
                      {s.audits}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-xs font-mono">
                      {relativeTime(s.latestAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/r/${s.latestId}`}
                        className="text-zinc-500 hover:text-indigo-300"
                      >
                        <ArrowUpRight className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      <section aria-labelledby="recent-heading">
        <h2
          id="recent-heading"
          className="text-xs uppercase tracking-widest text-zinc-500 mb-4"
        >
          Recent activity
        </h2>
        {reports.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No audits yet. Run your first one from the homepage.
          </p>
        ) : (
          <ul className="space-y-2">
            {reports.slice(0, 8).map((r) => (
              <li key={r.id}>
                <Link
                  href={`/r/${r.id}`}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] px-4 py-3 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant="primary">audit</Badge>
                    <span className="font-mono text-sm text-zinc-200 truncate group-hover:text-indigo-300 transition-colors">
                      {hostOf(r.url)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-zinc-500 font-mono">
                      {relativeTime(r.fetchedAt)}
                    </span>
                    <ScorePill score={r.score} grade={r.grade} size="sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "primary";
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p
        className={
          tone === "primary"
            ? "text-3xl font-bold tabular text-indigo-300"
            : "text-3xl font-bold tabular text-zinc-100"
        }
      >
        {value}
      </p>
      {hint && (
        <p className="text-xs text-zinc-500 font-mono mt-1">{hint}</p>
      )}
    </Card>
  );
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <span className="inline-flex items-center text-[10px] text-zinc-600 font-mono">
        first run
      </span>
    );
  }
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-zinc-500 font-mono">
        <Minus className="w-3 h-3" /> 0
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-400 font-mono">
        <TrendingUp className="w-3 h-3" /> +{delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] text-rose-400 font-mono">
      <TrendingDown className="w-3 h-3" /> {delta}
    </span>
  );
}

function EmptyState() {
  return (
    <Card className="px-6 py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <FileX className="w-5 h-5 text-indigo-300" />
      </div>
      <p className="text-zinc-200 font-medium">No sites tracked yet</p>
      <p className="text-sm text-zinc-500 mt-1">
        Run your first audit from the homepage. Sites you audit while signed
        in are automatically saved here.
      </p>
      <Button asChild className="mt-5">
        <Link href="/">
          <Plus className="w-4 h-4" />
          Run your first audit
        </Link>
      </Button>
    </Card>
  );
}
