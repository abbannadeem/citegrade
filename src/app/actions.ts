"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { runAudit } from "@/lib/audit";
import { FetchError } from "@/lib/audit/fetch-html";
import { saveReport } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { checkAuditQuota, recordUsage } from "@/lib/quota";

const FormSchema = z.object({
  url: z.string().min(1, "Enter a URL").max(2048),
});

export type AuditFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; reportId: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function startAudit(
  _prev: AuditFormState,
  formData: FormData,
): Promise<AuditFormState> {
  const parsed = FormSchema.safeParse({ url: formData.get("url") });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const user = await getCurrentUser();
  const ip = await clientIp();

  const quota = await checkAuditQuota({
    userId: user?.id ?? null,
    plan: user?.plan,
    ip,
  });
  if (!quota.allowed) {
    return { status: "error", message: quota.reason || "Rate limit reached." };
  }

  let reportId: string;
  try {
    const report = await runAudit(parsed.data.url);
    await saveReport(report, user ? { ownerId: user.id } : {});
    await recordUsage({ userId: user?.id ?? null, ip, type: "audit" });
    reportId = report.id;
  } catch (err) {
    if (err instanceof FetchError) {
      return { status: "error", message: err.message };
    }
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Audit failed",
    };
  }
  redirect(`/r/${reportId}`);
}
