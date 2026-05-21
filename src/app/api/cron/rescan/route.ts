import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, ensureSchema } from "@/lib/db/client";
import { sites, users } from "@/lib/db/schema";
import { runAudit } from "@/lib/audit";
import { saveReport, reportsByHostForUser } from "@/lib/storage";
import { sendScoreAlert } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Weekly re-scan of all monitored sites (Pro feature). Wire to Vercel Cron:
 *   vercel.json -> { "crons": [{ "path": "/api/cron/rescan", "schedule": "0 9 * * 1" }] }
 * Protected by CRON_SECRET when set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  await ensureSchema();
  const db = getDb();
  const monitored = await db
    .select()
    .from(sites)
    .where(eq(sites.monitorEnabled, true));

  let scanned = 0;
  let alerts = 0;
  for (const site of monitored) {
    try {
      const prevRuns = await reportsByHostForUser(site.host, site.userId, 1);
      const prevScore = prevRuns[0]?.score ?? null;

      const report = await runAudit(site.url);
      await saveReport(report, { ownerId: site.userId });
      scanned++;

      if (prevScore !== null && prevScore !== report.score) {
        const userRows = await db
          .select()
          .from(users)
          .where(eq(users.id, site.userId))
          .limit(1);
        const email = userRows[0]?.email;
        if (email) {
          await sendScoreAlert(
            email,
            site.host,
            prevScore,
            report.score,
            report.id,
          );
          alerts++;
        }
      }
    } catch (err) {
      console.error(`[cron] rescan failed for ${site.host}:`, err);
    }
  }

  return Response.json({ ok: true, scanned, alerts, total: monitored.length });
}
