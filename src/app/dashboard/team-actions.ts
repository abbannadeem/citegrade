"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { limitsFor } from "@/lib/plans";
import {
  createTeam,
  getOwnedTeam,
  inviteMember,
  removeMember,
} from "@/lib/teams";
import { sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site";

export async function createTeamAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const name = String(formData.get("name") || "").trim() || `${user.name}'s team`;
  await createTeam(user.id, name, user.email);
  revalidatePath("/dashboard/team");
}

export async function inviteMemberAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  // Teams are an Agency-tier feature; Pro can preview with a small cap.
  if (!limitsFor(user.plan).monitoring) return; // gate behind paid
  const team = await getOwnedTeam(user.id);
  if (!team) return;
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return;
  await inviteMember(team.id, email);
  // Escape user-controlled values before HTML interpolation.
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const safeUserName = escapeHtml(user.name);
  const safeTeamName = escapeHtml(team.name);
  await sendEmail({
    to: email,
    subject: `${user.name} invited you to a team on Citegrade`,
    html: `<p>${safeUserName} added you to their team "<strong>${safeTeamName}</strong>" on Citegrade.</p><p><a href="${siteUrl("/dashboard/team")}">Open Citegrade</a> — sign in with this email to see shared audits.</p>`,
    text: `${user.name} added you to "${team.name}" on Citegrade. Sign in at ${siteUrl("/dashboard/team")} with this email.`,
  });
  revalidatePath("/dashboard/team");
}

export async function removeMemberAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const team = await getOwnedTeam(user.id);
  if (!team) return;
  const memberId = String(formData.get("memberId") || "");
  if (memberId) await removeMember(team.id, memberId);
  revalidatePath("/dashboard/team");
}
