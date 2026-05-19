// Dev-mode cookie auth stub. Production target: Clerk.
// Sets a signed-ish cookie on sign-up/sign-in, reads it via next/headers.

import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const COOKIE_NAME = "citegrade_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  createdAt: string;
}

function encode(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decode(raw: string | undefined): SessionUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const c = await cookies();
  return decode(c.get(COOKIE_NAME)?.value);
}

export async function signInWithEmail(
  email: string,
  name?: string,
): Promise<SessionUser> {
  const user: SessionUser = {
    id: nanoid(12),
    email: email.trim().toLowerCase(),
    name:
      name?.trim() ||
      email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  const c = await cookies();
  c.set(COOKIE_NAME, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return user;
}

export async function signOut(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function upgradeToPro(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const updated: SessionUser = { ...user, plan: "pro" };
  const c = await cookies();
  c.set(COOKIE_NAME, encode(updated), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return updated;
}
