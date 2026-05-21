"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, updateProfile } from "@/lib/auth";
import { createApiKey, revokeApiKey } from "@/lib/api-keys";
import { cookies } from "next/headers";

const FLASH = "citegrade_new_key";

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const name = String(formData.get("name") || "").trim();
  if (name) await updateProfile(user.id, name);
  revalidatePath("/dashboard/settings");
}

export async function createApiKeyAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const name = String(formData.get("name") || "").trim();
  const created = await createApiKey(user.id, name || undefined);
  // Stash the plaintext (shown once) in a short-lived cookie for the redirect
  const c = await cookies();
  c.set(FLASH, created.plaintext, {
    httpOnly: false,
    sameSite: "lax",
    path: "/dashboard/settings",
    maxAge: 60,
  });
  revalidatePath("/dashboard/settings");
}

export async function revokeApiKeyAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") || "");
  if (id) await revokeApiKey(user.id, id);
  revalidatePath("/dashboard/settings");
}

export async function readNewKeyFlash(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(FLASH)?.value ?? null;
  return v;
}

export async function clearNewKeyFlash() {
  const c = await cookies();
  c.delete(FLASH);
}
