export type Severity = "pass" | "warn" | "fail";

export type CheckCategory =
  | "llms-txt"
  | "schema"
  | "semantic"
  | "meta"
  | "crawlability"
  | "eeat";

export const CATEGORY_LABELS: Record<CheckCategory, string> = {
  "llms-txt": "llms.txt",
  schema: "Structured data",
  semantic: "Semantic HTML",
  meta: "Meta & social",
  crawlability: "Crawlability",
  eeat: "E-E-A-T signals",
};

export const CATEGORY_MAX: Record<CheckCategory, number> = {
  "llms-txt": 15,
  schema: 25,
  semantic: 15,
  meta: 15,
  crawlability: 15,
  eeat: 15,
};

export const GIG_FOR_CATEGORY: Record<CheckCategory, GigKey> = {
  "llms-txt": "ai-seo",
  schema: "ai-seo",
  semantic: "full-site",
  meta: "seo-audit",
  crawlability: "seo-audit",
  eeat: "ai-seo",
};

export type GigKey =
  | "landing-page"
  | "full-site"
  | "seo-audit"
  | "ai-seo"
  | "wp-migration";

export interface Finding {
  id: string;
  category: CheckCategory;
  title: string;
  severity: Severity;
  earned: number;
  max: number;
  evidence?: string;
  fix?: string;
}

export interface CategoryScore {
  category: CheckCategory;
  earned: number;
  max: number;
  findings: Finding[];
}

export interface AuditReport {
  id: string;
  url: string;
  finalUrl: string;
  fetchedAt: string;
  durationMs: number;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  verdict: string;
  categories: CategoryScore[];
  metadata: {
    title: string | null;
    description: string | null;
    statusCode: number;
    contentLength: number;
  };
}

export function gradeFor(score: number): AuditReport["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function verdictFor(score: number): string {
  if (score >= 90) return "AI-optimized";
  if (score >= 75) return "AI-friendly";
  if (score >= 60) return "Partially discoverable";
  if (score >= 40) return "AI-invisible";
  return "Critical gaps — invisible to AI";
}
