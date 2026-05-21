import { and, eq, gte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { usageEvents, sites } from "./db/schema";
import { ANON_AUDITS_PER_DAY, limitsFor, type Plan } from "./plans";

const DAY_MS = 1000 * 60 * 60 * 24;

export interface QuotaResult {
  allowed: boolean;
  reason?: string;
  used: number;
  limit: number; // -1 = unlimited
}

async function countEvents(opts: {
  userId?: string;
  ip?: string;
  type: string;
  sinceMs: number;
}): Promise<number> {
  const db = getDb();
  const conds = [
    eq(usageEvents.type, opts.type),
    gte(usageEvents.createdAt, opts.sinceMs),
  ];
  if (opts.userId) conds.push(eq(usageEvents.userId, opts.userId));
  if (opts.ip && !opts.userId) conds.push(eq(usageEvents.ip, opts.ip));
  const rows = await db
    .select({ n: sql<number>`count(*)` })
    .from(usageEvents)
    .where(and(...conds));
  return Number(rows[0]?.n ?? 0);
}

export async function recordUsage(opts: {
  userId?: string | null;
  ip?: string | null;
  type?: string;
}): Promise<void> {
  await ensureSchema();
  await getDb()
    .insert(usageEvents)
    .values({
      id: nanoid(16),
      userId: opts.userId ?? null,
      ip: opts.ip ?? null,
      type: opts.type ?? "audit",
      createdAt: Date.now(),
    });
}

/** Check whether an audit is allowed for an authed user or anonymous IP. */
export async function checkAuditQuota(opts: {
  userId?: string | null;
  plan?: Plan;
  ip?: string | null;
}): Promise<QuotaResult> {
  await ensureSchema();
  const since = Date.now() - DAY_MS;

  if (opts.userId) {
    const limits = limitsFor(opts.plan ?? "free");
    if (limits.auditsPerDay === -1) {
      return { allowed: true, used: 0, limit: -1 };
    }
    const used = await countEvents({
      userId: opts.userId,
      type: "audit",
      sinceMs: since,
    });
    return {
      allowed: used < limits.auditsPerDay,
      used,
      limit: limits.auditsPerDay,
      reason:
        used >= limits.auditsPerDay
          ? `Daily limit of ${limits.auditsPerDay} audits reached. Upgrade to Pro for unlimited.`
          : undefined,
    };
  }

  // anonymous
  const ip = opts.ip ?? "unknown";
  const used = await countEvents({ ip, type: "audit", sinceMs: since });
  return {
    allowed: used < ANON_AUDITS_PER_DAY,
    used,
    limit: ANON_AUDITS_PER_DAY,
    reason:
      used >= ANON_AUDITS_PER_DAY
        ? `You've used your ${ANON_AUDITS_PER_DAY} free audits today. Sign up for more.`
        : undefined,
  };
}

/** Check whether a user can add another monitored site. */
export async function checkSiteQuota(
  userId: string,
  plan: Plan,
): Promise<QuotaResult> {
  await ensureSchema();
  const limits = limitsFor(plan);
  const rows = await getDb()
    .select({ n: sql<number>`count(*)` })
    .from(sites)
    .where(eq(sites.userId, userId));
  const used = Number(rows[0]?.n ?? 0);
  return {
    allowed: limits.sites === -1 || used < limits.sites,
    used,
    limit: limits.sites,
    reason:
      limits.sites !== -1 && used >= limits.sites
        ? `Your plan allows ${limits.sites} site${limits.sites === 1 ? "" : "s"}. Upgrade for more.`
        : undefined,
  };
}
