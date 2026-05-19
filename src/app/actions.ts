"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { runAudit } from "@/lib/audit";
import { FetchError } from "@/lib/audit/fetch-html";
import { saveReport } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";

const FormSchema = z.object({
  url: z.string().min(1, "Enter a URL").max(2048),
});

export type AuditFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; reportId: string };

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
  let reportId: string;
  try {
    const report = await runAudit(parsed.data.url);
    const user = await getCurrentUser();
    await saveReport(report, user ? { ownerId: user.id } : {});
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
