"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { setMonitoring } from "@/lib/sites";
import { limitsFor } from "@/lib/plans";

export async function toggleMonitoringAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const host = String(formData.get("host") || "");
  const enable = String(formData.get("enable") || "") === "1";
  if (!host) return;
  // Monitoring is a Pro feature
  if (enable && !limitsFor(user.plan).monitoring) return;
  await setMonitoring(user.id, host, enable);
  revalidatePath(`/dashboard/sites/${encodeURIComponent(host)}`);
}
