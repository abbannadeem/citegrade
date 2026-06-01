import "server-only";
import { desc, sql } from "drizzle-orm";
import { getDb, ensureSchema } from "./db/client";
import { users, audits, sites } from "./db/schema";

export interface PlatformStats {
  totalUsers: number;
  proUsers: number;
  totalAudits: number;
  totalSites: number;
  avgScore: number;
  auditsLast7d: number;
  signupsLast7d: number;
}

export async function platformStats(): Promise<PlatformStats> {
  await ensureSchema();
  const db = getDb();
  const since = new Date(Date.now() - 7 * 864e5).toISOString();

  const [u] = await db.select({ n: sql<number>`count(*)` }).from(users);
  const [pu] = await db
    .select({ n: sql<number>`count(*)` })
    .from(users)
    .where(sql`plan != 'free'`);
  const [a] = await db.select({ n: sql<number>`count(*)` }).from(audits);
  const [s] = await db.select({ n: sql<number>`count(*)` }).from(sites);
  const [avg] = await db.select({ v: sql<number>`avg(score)` }).from(audits);
  const [a7] = await db
    .select({ n: sql<number>`count(*)` })
    .from(audits)
    .where(sql`fetched_at >= ${since}`);
  const [u7] = await db
    .select({ n: sql<number>`count(*)` })
    .from(users)
    .where(sql`created_at >= ${since}`);

  return {
    totalUsers: Number(u?.n ?? 0),
    proUsers: Number(pu?.n ?? 0),
    totalAudits: Number(a?.n ?? 0),
    totalSites: Number(s?.n ?? 0),
    avgScore: Math.round(Number(avg?.v ?? 0)),
    auditsLast7d: Number(a7?.n ?? 0),
    signupsLast7d: Number(u7?.n ?? 0),
  };
}

export interface DayPoint {
  day: string;
  audits: number;
}

export async function auditsPerDay(days = 14): Promise<DayPoint[]> {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select({
      day: sql<string>`substr(fetched_at, 1, 10)`,
      n: sql<number>`count(*)`,
    })
    .from(audits)
    .groupBy(sql`substr(fetched_at, 1, 10)`)
    .orderBy(sql`substr(fetched_at, 1, 10) desc`)
    .limit(days);
  return rows
    .map((r) => ({ day: r.day, audits: Number(r.n) }))
    .reverse();
}

export interface Band {
  band: string;
  count: number;
}

export async function scoreDistribution(): Promise<Band[]> {
  await ensureSchema();
  const db = getDb();
  const rows = await db.select({ score: audits.score }).from(audits);
  const bands = [
    { band: "0–39 (F)", count: 0 },
    { band: "40–59 (D)", count: 0 },
    { band: "60–74 (C)", count: 0 },
    { band: "75–89 (B)", count: 0 },
    { band: "90–100 (A)", count: 0 },
  ];
  for (const r of rows) {
    const s = r.score;
    if (s >= 90) bands[4].count++;
    else if (s >= 75) bands[3].count++;
    else if (s >= 60) bands[2].count++;
    else if (s >= 40) bands[1].count++;
    else bands[0].count++;
  }
  return bands;
}

export async function recentUsers(limit = 20) {
  await ensureSchema();
  return getDb()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      plan: users.plan,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function recentAuditsAll(limit = 20) {
  await ensureSchema();
  return getDb()
    .select({
      id: audits.id,
      host: audits.host,
      score: audits.score,
      grade: audits.grade,
      fetchedAt: audits.fetchedAt,
    })
    .from(audits)
    .orderBy(desc(audits.fetchedAt))
    .limit(limit);
}
