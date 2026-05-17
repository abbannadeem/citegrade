import { nanoid } from "nanoid";
import { fetchHtml, normalizeInputUrl } from "./fetch-html";
import { parseHtml } from "./parse";
import {
  checkCrawlability,
  checkEEAT,
  checkLlmsTxt,
  checkMeta,
  checkSchema,
  checkSemantic,
  loadExternals,
} from "./checks";
import {
  AuditReport,
  CATEGORY_MAX,
  CategoryScore,
  CheckCategory,
  Finding,
  gradeFor,
  verdictFor,
} from "./types";

function bucket(
  findings: Finding[],
  category: CheckCategory,
): CategoryScore {
  const cat = findings.filter((f) => f.category === category);
  const earned = cat.reduce((s, f) => s + f.earned, 0);
  return {
    category,
    earned,
    max: CATEGORY_MAX[category],
    findings: cat,
  };
}

export async function runAudit(inputUrl: string): Promise<AuditReport> {
  const started = Date.now();
  const url = normalizeInputUrl(inputUrl);
  const [pageRes, externals] = await Promise.all([
    fetchHtml(url.toString()),
    loadExternals(url),
  ]);
  const parsed = parseHtml(pageRes.body);
  const ctx = { parsed, url };

  const all: Finding[] = [
    ...checkLlmsTxt(externals),
    ...checkSchema(ctx),
    ...checkSemantic(ctx),
    ...checkMeta(ctx),
    ...checkCrawlability(ctx, externals),
    ...checkEEAT(ctx),
  ];

  const categories: CategoryScore[] = (
    [
      "llms-txt",
      "schema",
      "semantic",
      "meta",
      "crawlability",
      "eeat",
    ] as CheckCategory[]
  ).map((c) => bucket(all, c));

  const totalEarned = categories.reduce((s, c) => s + c.earned, 0);
  const totalMax = categories.reduce((s, c) => s + c.max, 0);
  const score = Math.round((totalEarned / totalMax) * 100);

  return {
    id: nanoid(10),
    url: pageRes.url,
    finalUrl: pageRes.finalUrl,
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    score,
    grade: gradeFor(score),
    verdict: verdictFor(score),
    categories,
    metadata: {
      title: parsed.title,
      description: parsed.description,
      statusCode: pageRes.status,
      contentLength: pageRes.contentLength,
    },
  };
}
