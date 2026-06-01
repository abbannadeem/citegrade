"use server";

import { z } from "zod";
import { createLead } from "@/lib/leads";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
  reportId: z.string().max(40).optional(),
  siteHost: z.string().max(255).optional(),
  currentScore: z.coerce.number().min(0).max(100).optional(),
  potentialScore: z.coerce.number().min(0).max(100).optional(),
  intent: z.enum(["quote", "consult"]).default("quote"),
});

export type HireFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" };

export async function submitHireRequest(
  _prev: HireFormState | undefined,
  formData: FormData,
): Promise<HireFormState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    message: formData.get("message") || undefined,
    reportId: formData.get("reportId") || undefined,
    siteHost: formData.get("siteHost") || undefined,
    currentScore: formData.get("currentScore") || undefined,
    potentialScore: formData.get("potentialScore") || undefined,
    intent: formData.get("intent") || "quote",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message || "Invalid input",
    };
  }
  try {
    await createLead(parsed.data);
    return { status: "ok" };
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Failed to send",
    };
  }
}
