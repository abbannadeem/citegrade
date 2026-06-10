import { NextRequest } from "next/server";
import { runAudit } from "@/lib/audit";
import { FetchError } from "@/lib/audit/fetch-html";
import { saveReport } from "@/lib/storage";
import { resolveApiKey } from "@/lib/api-keys";
import { checkAuditQuota, recordUsage } from "@/lib/quota";
import { limitsFor } from "@/lib/plans";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  const x = req.headers.get("x-api-key");
  return x?.trim() || null;
}

export async function POST(req: NextRequest) {
  const key = bearer(req);
  if (!key) {
    return Response.json(
      { error: "Missing API key. Send 'Authorization: Bearer cg_...'." },
      { status: 401 },
    );
  }
  const user = await resolveApiKey(key);
  if (!user) {
    return Response.json({ error: "Invalid or revoked API key." }, { status: 401 });
  }
  const limits = limitsFor(user.plan);
  if (!limits.apiAccess) {
    return Response.json(
      { error: "API access requires a Pro plan.", upgrade: siteUrl("/pricing") },
      { status: 403 },
    );
  }

  let url: string;
  try {
    const body = await req.json();
    if (typeof body?.url !== "string") {
      return Response.json(
        { error: "Body must be JSON: { url: string }" },
        { status: 400 },
      );
    }
    url = body.url.trim();
  } catch {
    return Response.json({ error: "Body must be JSON: { url }" }, { status: 400 });
  }
  if (!url) {
    return Response.json({ error: "Missing 'url'." }, { status: 400 });
  }

  const quota = await checkAuditQuota({ userId: user.id, plan: user.plan });
  if (!quota.allowed) {
    return Response.json({ error: quota.reason }, { status: 429 });
  }

  try {
    const report = await runAudit(url);
    await saveReport(report, { ownerId: user.id });
    await recordUsage({ userId: user.id, type: "api_audit" });
    return Response.json({
      id: report.id,
      url: report.url,
      score: report.score,
      grade: report.grade,
      verdict: report.verdict,
      categories: report.categories.map((c) => ({
        category: c.category,
        earned: c.earned,
        max: c.max,
      })),
      reportUrl: siteUrl(`/r/${report.id}`),
      fetchedAt: report.fetchedAt,
    });
  } catch (err) {
    if (err instanceof FetchError) {
      return Response.json({ error: err.message }, { status: 422 });
    }
    return Response.json(
      { error: err instanceof Error ? err.message : "Audit failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    name: "Citegrade Audit API",
    version: "v1",
    usage: "POST /api/v1/audit with { url } and 'Authorization: Bearer cg_...'",
    docs: siteUrl("/docs"),
  });
}
