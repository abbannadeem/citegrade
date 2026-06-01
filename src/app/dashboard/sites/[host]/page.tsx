import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { auditsForHost } from "@/lib/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScorePill } from "@/components/score-pill";
import { Sparkline } from "@/components/sparkline";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowUpRight, ArrowLeft, Bell, BellOff } from "lucide-react";
import { hostOf, relativeTime } from "@/lib/utils";
import { getSite } from "@/lib/sites";
import { limitsFor } from "@/lib/plans";
import { toggleMonitoringAction } from "@/app/dashboard/site-actions";

interface Params {
  params: Promise<{ host: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { host } = await params;
  return { title: `${decodeURIComponent(host)} · Site` };
}

export default async function SitePage({ params }: Params) {
  const user = await requireUser();
  const { host: hostParam } = await params;
  const host = decodeURIComponent(hostParam);
  const audits = await auditsForHost(host, user.id);
  if (audits.length === 0) notFound();

  const latest = audits[0];
  const prev = audits[1];
  const sparkline = [...audits].reverse().map((a) => a.score);
  const site = await getSite(user.id, host);
  const canMonitor = limitsFor(user.plan).monitoring;
  const monitoring = site?.monitorEnabled ?? false;

  const issues = latest.categories.flatMap((c) =>
    c.findings.filter((f) => f.severity !== "pass"),
  );

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl">
      <Link
        href="/dashboard/sites"
        className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-fg mb-6"
      >
        <ArrowLeft className="w-3 h-3" /> All sites
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-subtle mb-1">
            Site
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono">
            {host}
          </h1>
          <p className="text-sm text-subtle mt-1 font-mono">
            {audits.length} audits · latest {relativeTime(latest.fetchedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canMonitor && (
            <form action={toggleMonitoringAction}>
              <input type="hidden" name="host" value={host} />
              <input type="hidden" name="enable" value={monitoring ? "0" : "1"} />
              <Button
                type="submit"
                variant={monitoring ? "secondary" : "outline"}
                title={
                  monitoring
                    ? "Weekly auto re-scan is on"
                    : "Enable weekly auto re-scan"
                }
              >
                {monitoring ? (
                  <>
                    <Bell className="w-3.5 h-3.5" /> Monitoring on
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5" /> Monitor
                  </>
                )}
              </Button>
            </form>
          )}
          <Button variant="secondary" asChild>
            <Link href={`/r/${latest.id}`}>
              View latest <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
          <Button asChild>
            <a href={`/?url=${encodeURIComponent(`https://${host}`)}`}>
              <Play className="w-3.5 h-3.5" />
              Re-run audit
            </a>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-10">
        <Card className="p-6">
          <p className="text-xs text-subtle mb-2">Latest score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular">{latest.score}</span>
            <span className="text-subtle">/100</span>
            <ScorePill score={latest.score} grade={latest.grade} size="sm" />
          </div>
          {prev && (
            <p className="text-xs text-subtle mt-3 font-mono">
              {latest.score > prev.score ? "+" : ""}
              {latest.score - prev.score} since previous
            </p>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-xs text-subtle mb-2">Score history</p>
          <Sparkline values={sparkline} width={320} height={64} className="w-full" />
          <p className="text-[10px] text-subtle font-mono mt-3">
            last {audits.length} audits
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-subtle mb-2">Open issues</p>
          <p className="text-5xl font-bold tabular text-fg">
            {issues.length}
          </p>
          <p className="text-xs text-subtle font-mono mt-3">
            from latest audit
          </p>
        </Card>
      </div>

      <Tabs defaultValue="audits">
        <TabsList>
          <TabsTrigger value="audits">Audits ({audits.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="audits">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-line text-[10px] uppercase tracking-widest text-subtle">
                <tr>
                  <th className="text-left font-medium px-5 py-3">When</th>
                  <th className="text-left font-medium px-5 py-3">Score</th>
                  <th className="text-left font-medium px-5 py-3">Duration</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-right font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-surface2">
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {new Date(a.fetchedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <ScorePill score={a.score} grade={a.grade} size="sm" />
                    </td>
                    <td className="px-5 py-3 text-subtle font-mono text-xs">
                      {a.durationMs}ms
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={a.metadata.statusCode === 200 ? "success" : "warn"}
                      >
                        HTTP {a.metadata.statusCode}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/r/${a.id}`}
                        className="text-subtle hover:text-primary"
                      >
                        <ArrowUpRight className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          {issues.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted">
              No open issues. Latest audit passed everything.
            </Card>
          ) : (
            <ul className="space-y-2">
              {issues.map((f) => (
                <li key={f.id}>
                  <Card className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-fg font-medium">
                        {f.title}
                      </p>
                      {f.evidence && (
                        <p className="text-xs text-subtle mt-1 font-mono break-all">
                          {f.evidence}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={f.severity === "warn" ? "warn" : "danger"}
                    >
                      -{f.max - f.earned} pts
                    </Badge>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

void hostOf;
