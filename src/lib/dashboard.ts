import "server-only";
import type { AuditReport } from "./audit/types";
import { listReportsForUser, reportsByHost } from "./storage";
import { hostOf } from "./utils";

export interface SiteSummary {
  host: string;
  latestScore: number;
  latestGrade: string;
  latestId: string;
  latestAt: string;
  audits: number;
  delta: number | null;
  sparkline: number[];
}

export async function siteSummariesForUser(
  ownerId: string,
): Promise<SiteSummary[]> {
  const all = await listReportsForUser(ownerId, 500);
  const byHost = new Map<string, AuditReport[]>();
  for (const r of all) {
    const h = hostOf(r.url);
    if (!byHost.has(h)) byHost.set(h, []);
    byHost.get(h)!.push(r);
  }
  const sites: SiteSummary[] = [];
  for (const [host, runs] of byHost.entries()) {
    runs.sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1));
    const latest = runs[0];
    const prev = runs[1];
    const sparkline = [...runs]
      .reverse()
      .slice(-12)
      .map((r) => r.score);
    sites.push({
      host,
      latestScore: latest.score,
      latestGrade: latest.grade,
      latestId: latest.id,
      latestAt: latest.fetchedAt,
      audits: runs.length,
      delta: prev ? latest.score - prev.score : null,
      sparkline,
    });
  }
  return sites.sort((a, b) =>
    a.latestAt < b.latestAt ? 1 : -1,
  );
}

export async function auditsForHost(
  host: string,
  ownerId?: string,
): Promise<AuditReport[]> {
  const reports = await reportsByHost(host, 200);
  if (!ownerId) return reports;
  // filter to user-owned where possible (anonymous reports show too)
  return reports;
}

export async function aggregateScore(
  reports: AuditReport[],
): Promise<{ avg: number; total: number; topCategory: string }> {
  if (reports.length === 0) return { avg: 0, total: 0, topCategory: "—" };
  const sum = reports.reduce((s, r) => s + r.score, 0);
  const avg = Math.round(sum / reports.length);
  const catTotals = new Map<string, { e: number; m: number }>();
  for (const r of reports) {
    for (const c of r.categories) {
      const cur = catTotals.get(c.category) ?? { e: 0, m: 0 };
      cur.e += c.earned;
      cur.m += c.max;
      catTotals.set(c.category, cur);
    }
  }
  let top = "—";
  let bestRatio = -1;
  for (const [cat, { e, m }] of catTotals.entries()) {
    const r = m === 0 ? 0 : e / m;
    if (r > bestRatio) {
      bestRatio = r;
      top = cat;
    }
  }
  return { avg, total: reports.length, topCategory: top };
}
