import { requireUser } from "@/lib/auth";
import { listReportsForUser } from "@/lib/storage";
import { hostOf, relativeTime } from "@/lib/utils";
import { ScorePill } from "@/components/score-pill";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_LABELS,
  CATEGORY_MAX,
  type CheckCategory,
} from "@/lib/audit/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Compare" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const user = await requireUser();
  const reports = await listReportsForUser(user.id, 100);
  const { a, b } = await searchParams;
  const ra = a ? reports.find((r) => r.id === a) : reports[0];
  const rb = b
    ? reports.find((r) => r.id === b)
    : reports.find((r) => r.id !== ra?.id);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-subtle mb-1">
          Compare
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Side-by-side diff
        </h1>
        <p className="text-sm text-muted mt-1">
          Compare any two audits — yours, or a competitor&apos;s. Pro feature.
        </p>
      </div>

      {reports.length < 2 ? (
        <Card className="p-8 text-center">
          <p className="text-fg">
            You need at least 2 audits to compare.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm text-primary hover:text-primary"
          >
            Run another audit →
          </Link>
        </Card>
      ) : !ra || !rb ? (
        <Card className="p-8">
          <p className="text-sm text-muted">
            Select two audits to compare. Defaults: your most recent two.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Card className="p-5">
              <Badge variant="primary">A</Badge>
              <p className="text-sm text-fg font-mono mt-3 truncate">
                {hostOf(ra.url)}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-4xl font-bold tabular">{ra.score}</span>
                <ScorePill score={ra.score} grade={ra.grade} />
              </div>
              <p className="text-xs text-subtle mt-2 font-mono">
                {relativeTime(ra.fetchedAt)}
              </p>
            </Card>
            <Card className="p-5">
              <Badge variant="outline">B</Badge>
              <p className="text-sm text-fg font-mono mt-3 truncate">
                {hostOf(rb.url)}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-4xl font-bold tabular">{rb.score}</span>
                <ScorePill score={rb.score} grade={rb.grade} />
              </div>
              <p className="text-xs text-subtle mt-2 font-mono">
                {relativeTime(rb.fetchedAt)}
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-line text-[10px] uppercase tracking-widest text-subtle">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Category</th>
                  <th className="text-left font-medium px-5 py-3">A</th>
                  <th className="text-center font-medium px-5 py-3"></th>
                  <th className="text-left font-medium px-5 py-3">B</th>
                  <th className="text-right font-medium px-5 py-3">Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(Object.keys(CATEGORY_LABELS) as CheckCategory[]).map((cat) => {
                  const ea = ra.categories.find((c) => c.category === cat)!;
                  const eb = rb.categories.find((c) => c.category === cat)!;
                  const delta = eb.earned - ea.earned;
                  const tone =
                    delta > 0
                      ? "text-success"
                      : delta < 0
                        ? "text-danger"
                        : "text-subtle";
                  return (
                    <tr key={cat} className="hover:bg-surface2">
                      <td className="px-5 py-3 text-fg">
                        {CATEGORY_LABELS[cat]}
                      </td>
                      <td className="px-5 py-3 font-mono tabular text-fg">
                        {ea.earned} / {CATEGORY_MAX[cat]}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <ArrowRight className="w-3 h-3 text-subtle inline" />
                      </td>
                      <td className="px-5 py-3 font-mono tabular text-fg">
                        {eb.earned} / {CATEGORY_MAX[cat]}
                      </td>
                      <td className={`px-5 py-3 font-mono tabular text-right ${tone}`}>
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-surface font-semibold">
                  <td className="px-5 py-3 text-fg">Total</td>
                  <td className="px-5 py-3 font-mono tabular text-fg">
                    {ra.score} / 100
                  </td>
                  <td></td>
                  <td className="px-5 py-3 font-mono tabular text-fg">
                    {rb.score} / 100
                  </td>
                  <td
                    className={`px-5 py-3 font-mono tabular text-right ${
                      rb.score - ra.score > 0
                        ? "text-success"
                        : rb.score - ra.score < 0
                          ? "text-danger"
                          : "text-subtle"
                    }`}
                  >
                    {rb.score - ra.score > 0 ? "+" : ""}
                    {rb.score - ra.score}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
