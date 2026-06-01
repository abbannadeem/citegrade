import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { siteSummariesForUser } from "@/lib/dashboard";
import { Card } from "@/components/ui/card";
import { ScorePill } from "@/components/score-pill";
import { Sparkline } from "@/components/sparkline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Sites" };

export default async function SitesPage() {
  const user = await requireUser();
  const sites = await siteSummariesForUser(user.id);
  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-subtle mb-1">
            Sites
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            All tracked sites
          </h1>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="w-4 h-4" />
            Add site
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-fg">No sites yet.</p>
          <Button asChild className="mt-5">
            <Link href="/">Run your first audit</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((s) => (
            <Link
              key={s.host}
              href={`/dashboard/sites/${encodeURIComponent(s.host)}`}
              className="group"
            >
              <Card className="p-5 hover:border-primary/40 transition-colors h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="font-mono text-sm text-fg truncate group-hover:text-primary transition-colors">
                    {s.host}
                  </p>
                  <ScorePill score={s.latestScore} grade={s.latestGrade} size="sm" />
                </div>
                <Sparkline values={s.sparkline} width={200} height={48} className="w-full" />
                <div className="flex items-center justify-between mt-4 text-xs text-subtle font-mono">
                  <span>{s.audits} audits</span>
                  <span>{relativeTime(s.latestAt)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
