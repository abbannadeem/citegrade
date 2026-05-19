"use server";

import { redirect } from "next/navigation";
import { claimReport } from "@/lib/storage";
import { signInWithEmail, signOut } from "@/lib/auth";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const next = String(formData.get("next") || "") || "/dashboard";
  const claim = String(formData.get("claim") || "");
  if (!email) return;
  const user = await signInWithEmail(email, name || undefined);
  if (claim) await claimReport(claim, user.id);
  redirect(next);
}

export async function signOutAction() {
  await signOut();
  redirect("/");
}
