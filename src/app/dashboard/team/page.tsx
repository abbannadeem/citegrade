import { requireUser } from "@/lib/auth";
import { limitsFor } from "@/lib/plans";
import {
  getOwnedTeam,
  listMembers,
  teamsImIn,
} from "@/lib/teams";
import { siteSummariesForUser } from "@/lib/dashboard";
import {
  createTeamAction,
  inviteMemberAction,
  removeMemberAction,
} from "@/app/dashboard/team-actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScorePill } from "@/components/score-pill";
import { Users, UserPlus, Trash2, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await requireUser("/dashboard/team");
  const canUseTeams = limitsFor(user.plan).monitoring; // paid feature
  const team = await getOwnedTeam(user.id);
  const members = team ? await listMembers(team.id) : [];
  const memberTeams = await teamsImIn(user.id, user.email);
  const sharedTeams = await Promise.all(
    memberTeams.map(async (t) => ({
      team: t,
      sites: await siteSummariesForUser(t.ownerId),
    })),
  );

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-subtle">Team</p>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        Your workspace
      </h1>

      {!canUseTeams && (
        <Card className="mb-6 border-primary/30 bg-primary-soft">
          <CardContent className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-fg">
                  Teams are a paid feature
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Upgrade to Pro to create a team and invite members to view
                  your audits.
                </p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/pricing/checkout">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Owned team */}
      {!team ? (
        <Card>
          <CardHeader>
            <CardTitle>Create a team</CardTitle>
            <CardDescription>
              Invite teammates or clients to view your audits read-only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createTeamAction} className="flex gap-2">
              <Input name="name" placeholder="Team name (e.g. Acme Marketing)" className="flex-1" />
              <Button type="submit" disabled={!canUseTeams}>
                Create team
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {members.length} member{members.length === 1 ? "" : "s"}
                </CardDescription>
              </div>
              <Badge variant="primary">Owner</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form action={inviteMemberAction} className="flex gap-2">
              <Input
                name="email"
                type="email"
                placeholder="teammate@company.com"
                className="flex-1"
              />
              <Button type="submit" variant="secondary" disabled={!canUseTeams}>
                <UserPlus className="w-4 h-4" /> Invite
              </Button>
            </form>

            <ul className="divide-y divide-line rounded-lg border border-line">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-fg truncate">{m.email}</p>
                    <p className="text-[11px] text-subtle">
                      {m.role === "owner" ? "Owner" : "Member"} ·{" "}
                      {m.status === "active" ? "active" : "invited"}
                    </p>
                  </div>
                  {m.role !== "owner" && (
                    <form action={removeMemberAction}>
                      <input type="hidden" name="memberId" value={m.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove member"
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Teams I'm a member of — shared visibility */}
      {sharedTeams.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-subtle mb-3">
            Shared with you
          </h2>
          <div className="space-y-6">
            {sharedTeams.map(({ team: t, sites }) => (
              <Card key={t.id}>
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>
                    {sites.length} site{sites.length === 1 ? "" : "s"} shared
                    with you (read-only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sites.length === 0 ? (
                    <p className="text-sm text-subtle">No sites yet.</p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {sites.map((s) => (
                        <li key={s.host}>
                          <Link
                            href={`/r/${s.latestId}`}
                            className="flex items-center justify-between py-2.5"
                          >
                            <span className="font-mono text-sm text-fg">
                              {s.host}
                            </span>
                            <ScorePill
                              score={s.latestScore}
                              grade={s.latestGrade}
                              size="sm"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
