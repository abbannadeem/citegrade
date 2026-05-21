import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb, ensureSchema } from "./db/client";
import { sites } from "./db/schema";

export async function getSite(userId: string, host: string) {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(sites)
    .where(and(eq(sites.userId, userId), eq(sites.host, host)))
    .limit(1);
  return rows[0] ?? null;
}

export async function setMonitoring(
  userId: string,
  host: string,
  enabled: boolean,
): Promise<void> {
  await ensureSchema();
  await getDb()
    .update(sites)
    .set({ monitorEnabled: enabled })
    .where(and(eq(sites.userId, userId), eq(sites.host, host)));
}
