import {
  platformStats,
  auditsPerDay,
  scoreDistribution,
  recentUsers,
  recentAuditsAll,
} from "@/lib/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScorePill } from "@/components/score-pill";
import { SimpleBarChart } from "@/components/bar-chart";
import { relativeTime } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stats, perDay, dist, users, recent] = await Promise.all([
    platformStats(),
    auditsPerDay(14),
    scoreDistribution(),
    recentUsers(15),
    recentAuditsAll(15),
  ]);

  const bandColors = ["#e11d48", "#ea580c", "#d97706", "#65a30d", "#10b981"];

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-subtle">
          Admin · platform analytics
        </p>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        Platform overview
      </h1>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Total users" value={stats.totalUsers} hint={`${stats.signupsLast7d} new this week`} />
        <Kpi label="Pro users" value={stats.proUsers} hint="paying" tone />
        <Kpi label="Total audits" value={stats.totalAudits} hint={`${stats.auditsLast7d} this week`} />
        <Kpi label="Avg score" value={stats.avgScore} hint="across all audits" />
      </section>

      <section className="grid lg:grid-cols-2 gap-4 mb-10">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-subtle mb-4">
            Audits — last 14 days
          </p>
          {perDay.length > 0 ? (
            <SimpleBarChart
              data={perDay as unknown as Record<string, string | number>[]}
              xKey="day"
              yKey="audits"
            />
          ) : (
            <p className="text-sm text-subtle py-12 text-center">No data yet.</p>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-subtle mb-4">
            Score distribution
          </p>
          {stats.totalAudits > 0 ? (
            <SimpleBarChart
              data={dist as unknown as Record<string, string | number>[]}
              xKey="band"
              yKey="count"
              colorize={bandColors}
            />
          ) : (
            <p className="text-sm text-subtle py-12 text-center">No data yet.</p>
          )}
        </Card>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Recent users
            </p>
          </div>
          <ul className="divide-y divide-line">
            {users.length === 0 && (
              <li className="px-5 py-4 text-sm text-subtle">No users yet.</li>
            )}
            {users.map((u) => (
              <li key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-fg truncate">{u.name || u.email}</p>
                  <p className="text-xs text-subtle truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {u.role === "admin" && <Badge variant="primary">admin</Badge>}
                  <Badge variant={u.plan === "free" ? "outline" : "success"}>
                    {u.plan}
                  </Badge>
                  <span className="text-[11px] text-subtle font-mono">
                    {relativeTime(u.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <p className="text-xs uppercase tracking-widest text-subtle">
              Recent audits
            </p>
          </div>
          <ul className="divide-y divide-line">
            {recent.length === 0 && (
              <li className="px-5 py-4 text-sm text-subtle">No audits yet.</li>
            )}
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/r/${a.id}`}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-surface2 transition-colors"
                >
                  <span className="text-sm font-mono text-fg truncate">
                    {a.host}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-subtle font-mono">
                      {relativeTime(a.fetchedAt)}
                    </span>
                    <ScorePill score={a.score} grade={a.grade} size="sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
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
  value: number;
  hint?: string;
  tone?: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-subtle mb-1">{label}</p>
      <p className={`text-3xl font-bold tabular ${tone ? "text-primary" : "text-fg"}`}>
        {value}
      </p>
      {hint && <p className="text-xs text-subtle font-mono mt-1">{hint}</p>}
    </Card>
  );
}
