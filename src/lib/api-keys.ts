import { and, desc, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { apiKeys, users } from "./db/schema";
import { randomToken, sha256 } from "./crypto";
import type { SessionUser } from "./auth";

export interface CreatedKey {
  id: string;
  plaintext: string; // shown once
  prefix: string;
}

export async function createApiKey(
  userId: string,
  name?: string,
): Promise<CreatedKey> {
  await ensureSchema();
  const raw = `cg_${randomToken(24)}`;
  const prefix = raw.slice(0, 11);
  const id = nanoid(12);
  await getDb().insert(apiKeys).values({
    id,
    userId,
    keyHash: sha256(raw),
    prefix,
    name: name || "Default key",
  });
  return { id, plaintext: raw, prefix };
}

export async function listApiKeys(userId: string) {
  await ensureSchema();
  return getDb()
    .select({
      id: apiKeys.id,
      prefix: apiKeys.prefix,
      name: apiKeys.name,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
      revokedAt: apiKeys.revokedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
}

export async function revokeApiKey(userId: string, id: string) {
  await ensureSchema();
  await getDb()
    .update(apiKeys)
    .set({ revokedAt: new Date().toISOString() })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
}

/** Resolve an API key to its owning user, or null. Updates lastUsedAt. */
export async function resolveApiKey(
  raw: string,
): Promise<SessionUser | null> {
  if (!raw?.startsWith("cg_")) return null;
  await ensureSchema();
  const db = getDb();
  const hash = sha256(raw);
  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
    .limit(1);
  const key = rows[0];
  if (!key) return null;
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, key.id));
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, key.userId))
    .limit(1);
  const u = userRows[0];
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    name: u.name || u.email,
    plan: u.plan,
    role: u.role,
    image: u.image,
    stripeCustomerId: u.stripeCustomerId,
    createdAt: u.createdAt,
  };
}
