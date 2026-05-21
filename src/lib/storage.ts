import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { audits, sites } from "./db/schema";
import type { AuditReport } from "./audit/types";
import { hostOf } from "./utils";

export interface ReportMeta {
  ownerId?: string;
  siteName?: string;
}

function rowToReport(row: typeof audits.$inferSelect): AuditReport {
  try {
    return JSON.parse(row.payload) as AuditReport;
  } catch {
    // Fallback: reconstruct minimal shape from columns
    return {
      id: row.id,
      url: row.url,
      finalUrl: row.finalUrl,
      fetchedAt: row.fetchedAt,
      durationMs: row.durationMs,
      score: row.score,
      grade: row.grade as AuditReport["grade"],
      verdict: row.verdict,
      categories: [],
      metadata: {
        title: row.title,
        description: row.description,
        statusCode: row.statusCode,
        contentLength: row.contentLength,
      },
    };
  }
}

/** Upsert a site for an owner and return its id. */
async function upsertSite(
  ownerId: string,
  url: string,
): Promise<string> {
  const db = getDb();
  const host = hostOf(url);
  const existing = await db
    .select()
    .from(sites)
    .where(and(eq(sites.userId, ownerId), eq(sites.host, host)))
    .limit(1);
  if (existing[0]) {
    await db
      .update(sites)
      .set({ lastAuditAt: new Date().toISOString() })
      .where(eq(sites.id, existing[0].id));
    return existing[0].id;
  }
  const id = nanoid(12);
  await db.insert(sites).values({
    id,
    userId: ownerId,
    host,
    url,
    lastAuditAt: new Date().toISOString(),
  });
  return id;
}

export async function saveReport(
  report: AuditReport,
  meta: ReportMeta = {},
): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const host = hostOf(report.url);
  let siteId: string | null = null;
  if (meta.ownerId) {
    siteId = await upsertSite(meta.ownerId, report.url);
  }
  await db.insert(audits).values({
    id: report.id,
    siteId,
    userId: meta.ownerId ?? null,
    host,
    url: report.url,
    finalUrl: report.finalUrl,
    score: report.score,
    grade: report.grade,
    verdict: report.verdict,
    statusCode: report.metadata.statusCode,
    contentLength: report.metadata.contentLength,
    durationMs: report.durationMs,
    title: report.metadata.title,
    description: report.metadata.description,
    payload: JSON.stringify(report),
    fetchedAt: report.fetchedAt,
  });
}

export async function loadReport(id: string): Promise<AuditReport | null> {
  if (!/^[A-Za-z0-9_-]{4,32}$/.test(id)) return null;
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(audits)
    .where(eq(audits.id, id))
    .limit(1);
  return rows[0] ? rowToReport(rows[0]) : null;
}

export async function claimReport(
  reportId: string,
  ownerId: string,
): Promise<boolean> {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(audits)
    .where(eq(audits.id, reportId))
    .limit(1);
  const row = rows[0];
  if (!row) return false;
  const siteId = await upsertSite(ownerId, row.url);
  await db
    .update(audits)
    .set({ userId: ownerId, siteId })
    .where(eq(audits.id, reportId));
  return true;
}

export async function listReportsForUser(
  ownerId: string,
  limit = 50,
): Promise<AuditReport[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(audits)
    .where(eq(audits.userId, ownerId))
    .orderBy(desc(audits.fetchedAt))
    .limit(limit);
  return rows.map(rowToReport);
}

export async function reportsByHost(
  host: string,
  limit = 50,
): Promise<AuditReport[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(audits)
    .where(eq(audits.host, host))
    .orderBy(desc(audits.fetchedAt))
    .limit(limit);
  return rows.map(rowToReport);
}

export async function reportsByHostForUser(
  host: string,
  ownerId: string,
  limit = 50,
): Promise<AuditReport[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(audits)
    .where(and(eq(audits.host, host), eq(audits.userId, ownerId)))
    .orderBy(desc(audits.fetchedAt))
    .limit(limit);
  return rows.map(rowToReport);
}

export async function listRecentReports(limit = 10): Promise<AuditReport[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(audits)
    .orderBy(desc(audits.fetchedAt))
    .limit(limit);
  return rows.map(rowToReport);
}
