"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { claimReport } from "@/lib/storage";
import {
  AuthError,
  signUp,
  signIn,
  signOut,
  signInOrCreateByEmail,
} from "@/lib/auth";
import { sendWelcome, sendMagicLink } from "@/lib/email";
import { getDb, ensureSchema } from "@/lib/db/client";
import { magicLinks } from "@/lib/db/schema";
import { randomToken } from "@/lib/crypto";
import { siteUrl } from "@/lib/site";

export type AuthState = { error?: string } | undefined;

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const next = String(formData.get("next") || "") || "/dashboard";
  const claim = String(formData.get("claim") || "");

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  let user;
  try {
    user = await signUp(email, password, name || undefined);
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    return { error: "Could not create account. Try again." };
  }
  if (claim) await claimReport(claim, user.id);
  await sendWelcome(user.email, user.name);
  redirect(next);
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "") || "/dashboard";
  const claim = String(formData.get("claim") || "");

  if (!email || !password) return { error: "Email and password are required." };

  let user;
  try {
    user = await signIn(email, password);
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    return { error: "Could not sign in. Try again." };
  }
  if (claim) await claimReport(claim, user.id);
  redirect(next);
}

export async function signOutAction() {
  await signOut();
  redirect("/");
}

/** Request a magic link — emailed via Resend, or logged in dev. */
export async function requestMagicLinkAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const claim = String(formData.get("claim") || "");
  if (!email) return { error: "Enter your email." };
  await ensureSchema();
  const token = randomToken(24);
  await getDb().insert(magicLinks).values({
    token,
    email,
    claimReportId: claim || null,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  const link = siteUrl(`/api/auth/magic?token=${token}`);
  await sendMagicLink(email, link);
  return { error: undefined };
}

/** Consume a magic link token (called by the /api/auth/magic route). */
export async function consumeMagicLink(token: string): Promise<string> {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(magicLinks)
    .where(eq(magicLinks.token, token))
    .limit(1);
  const ml = rows[0];
  if (!ml || ml.usedAt || ml.expiresAt < Date.now()) {
    return "/sign-in?error=link_expired";
  }
  await db
    .update(magicLinks)
    .set({ usedAt: new Date().toISOString() })
    .where(eq(magicLinks.token, token));
  const user = await signInOrCreateByEmail(ml.email, ml.name ?? undefined);
  if (ml.claimReportId) await claimReport(ml.claimReportId, user.id);
  return "/dashboard";
}

void nanoid;
