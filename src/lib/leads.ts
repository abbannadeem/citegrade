import "server-only";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, ensureSchema } from "./db/client";
import { leads } from "./db/schema";
import { sendEmail } from "./email";
import { siteUrl } from "./site";

export interface LeadInput {
  email: string;
  name?: string;
  message?: string;
  reportId?: string;
  siteHost?: string;
  currentScore?: number;
  potentialScore?: number;
  intent: "quote" | "consult";
}

export async function createLead(input: LeadInput): Promise<string> {
  await ensureSchema();
  const db = getDb();
  const id = nanoid(12);
  await db.insert(leads).values({
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name?.trim() || null,
    message: input.message?.trim() || null,
    reportId: input.reportId || null,
    siteHost: input.siteHost || null,
    currentScore: input.currentScore ?? null,
    potentialScore: input.potentialScore ?? null,
    intent: input.intent,
  });

  // Notify the operator (Abban) — Resend if configured, else console
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (notifyTo) {
    const subject =
      input.intent === "consult"
        ? `📞 Free consult request from ${input.email}`
        : `💼 Quote request from ${input.email}${input.siteHost ? ` (${input.siteHost})` : ""}`;
    const lines = [
      `From: ${input.name ? `${input.name} <${input.email}>` : input.email}`,
      input.siteHost ? `Site: ${input.siteHost}` : null,
      input.currentScore != null
        ? `Current score: ${input.currentScore}/100${input.potentialScore != null ? ` → potential ${input.potentialScore}` : ""}`
        : null,
      input.reportId ? `Report: ${siteUrl(`/r/${input.reportId}`)}` : null,
      "",
      input.message ? `Message:\n${input.message}` : null,
    ].filter(Boolean);
    await sendEmail({
      to: notifyTo,
      subject,
      text: lines.join("\n"),
      html: `<pre style="font-family:ui-monospace,monospace;font-size:13px;line-height:1.6">${lines
        .map((l) => (l ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
        .join("\n")}</pre>`,
    });
  }
  return id;
}

export async function listLeads(limit = 50) {
  await ensureSchema();
  return getDb().select().from(leads).orderBy(leads.createdAt).limit(limit);
}

export async function markLeadStatus(
  id: string,
  status: "new" | "contacted" | "closed",
) {
  await ensureSchema();
  await getDb().update(leads).set({ status }).where(eq(leads.id, id));
}
