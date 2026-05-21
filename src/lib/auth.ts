import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { users, sessions, type DbUser } from "./db/schema";
import { hashPassword, verifyPassword, randomToken } from "./crypto";

const COOKIE_NAME = "citegrade_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "agency";
  image: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
}

function toSessionUser(u: DbUser): SessionUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name || u.email.split("@")[0],
    plan: u.plan,
    image: u.image,
    stripeCustomerId: u.stripeCustomerId,
    createdAt: u.createdAt,
  };
}

export class AuthError extends Error {}

function deriveName(email: string, name?: string): string {
  if (name?.trim()) return name.trim();
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function createSession(userId: string): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const token = randomToken(32);
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await db.insert(sessions).values({ id: token, userId, expiresAt });
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  await ensureSchema();
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, token))
    .limit(1);
  const session = rows[0];
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, token));
    return null;
  }
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (!userRows[0]) return null;
  return toSessionUser(userRows[0]);
}

export async function signUp(
  email: string,
  password: string,
  name?: string,
): Promise<SessionUser> {
  await ensureSchema();
  const db = getDb();
  const normEmail = email.trim().toLowerCase();
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, normEmail))
    .limit(1);
  if (existing[0]) {
    throw new AuthError("An account with this email already exists. Sign in.");
  }
  const passwordHash = await hashPassword(password);
  const user = {
    id: nanoid(14),
    email: normEmail,
    name: deriveName(normEmail, name),
    passwordHash,
    plan: "free" as const,
  };
  await db.insert(users).values(user);
  await createSession(user.id);
  const created = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  return toSessionUser(created[0]);
}

export async function signIn(
  email: string,
  password: string,
): Promise<SessionUser> {
  await ensureSchema();
  const db = getDb();
  const normEmail = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, normEmail))
    .limit(1);
  const user = rows[0];
  if (!user || !user.passwordHash) {
    throw new AuthError("No account with that email, or password not set.");
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new AuthError("Incorrect email or password.");
  await createSession(user.id);
  return toSessionUser(user);
}

/** Used by magic-link consumption: sign in (or create) a user by email. */
export async function signInOrCreateByEmail(
  email: string,
  name?: string,
): Promise<SessionUser> {
  await ensureSchema();
  const db = getDb();
  const normEmail = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, normEmail))
    .limit(1);
  let user = rows[0];
  if (!user) {
    const newUser = {
      id: nanoid(14),
      email: normEmail,
      name: deriveName(normEmail, name),
      plan: "free" as const,
    };
    await db.insert(users).values(newUser);
    user = (
      await db.select().from(users).where(eq(users.id, newUser.id)).limit(1)
    )[0];
  }
  await createSession(user.id);
  return toSessionUser(user);
}

export async function signOut(): Promise<void> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await ensureSchema();
      await getDb().delete(sessions).where(eq(sessions.id, token));
    } catch {}
  }
  c.delete(COOKIE_NAME);
}

export async function setPlan(
  userId: string,
  plan: "free" | "pro" | "agency",
  extra: Partial<Pick<DbUser, "stripeCustomerId" | "stripeSubscriptionId" | "planRenewsAt">> = {},
): Promise<void> {
  await ensureSchema();
  await getDb()
    .update(users)
    .set({ plan, ...extra })
    .where(eq(users.id, userId));
}

export async function updateProfile(
  userId: string,
  name: string,
): Promise<void> {
  await ensureSchema();
  await getDb().update(users).set({ name }).where(eq(users.id, userId));
}
