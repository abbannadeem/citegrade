import "server-only";
import { and, eq, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { teams, teamMembers, users, type DbTeam } from "./db/schema";

export async function getOwnedTeam(userId: string): Promise<DbTeam | null> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(teams)
    .where(eq(teams.ownerId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTeam(
  userId: string,
  name: string,
  ownerEmail: string,
): Promise<DbTeam> {
  await ensureSchema();
  const db = getDb();
  const existing = await getOwnedTeam(userId);
  if (existing) return existing;
  const id = nanoid(12);
  await db.insert(teams).values({ id, ownerId: userId, name });
  await db.insert(teamMembers).values({
    id: nanoid(12),
    teamId: id,
    userId,
    email: ownerEmail,
    role: "owner",
    status: "active",
  });
  const created = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return created[0];
}

export async function listMembers(teamId: string) {
  await ensureSchema();
  return getDb()
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.teamId, teamId));
}

export async function inviteMember(
  teamId: string,
  email: string,
): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const norm = email.trim().toLowerCase();
  const existing = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.email, norm)))
    .limit(1);
  if (existing[0]) return;
  // link to a user if they already have an account
  const userRows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, norm))
    .limit(1);
  await db.insert(teamMembers).values({
    id: nanoid(12),
    teamId,
    userId: userRows[0]?.id ?? null,
    email: norm,
    role: "member",
    status: userRows[0] ? "active" : "invited",
  });
}

export async function removeMember(
  teamId: string,
  memberId: string,
): Promise<void> {
  await ensureSchema();
  await getDb()
    .delete(teamMembers)
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)));
}

/** Teams the user belongs to but does not own (via email match). */
export async function teamsImIn(
  userId: string,
  email: string,
): Promise<DbTeam[]> {
  await ensureSchema();
  const db = getDb();
  const memberships = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(
      and(
        or(eq(teamMembers.userId, userId), eq(teamMembers.email, email)),
        eq(teamMembers.role, "member"),
      ),
    );
  const teamIds = [...new Set(memberships.map((m) => m.teamId))];
  if (teamIds.length === 0) return [];
  const result: DbTeam[] = [];
  for (const tid of teamIds) {
    const t = await db.select().from(teams).where(eq(teams.id, tid)).limit(1);
    if (t[0]) result.push(t[0]);
  }
  return result;
}
