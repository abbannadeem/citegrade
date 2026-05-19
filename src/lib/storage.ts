import { promises as fs } from "fs";
import path from "path";
import { AuditReport } from "./audit/types";

const DATA_DIR = path.join(process.cwd(), ".data", "reports");

// Serverless filesystem is read-only on Vercel. Detect once and fall back to
// an in-memory Map so audits don't crash. Reports won't survive cold starts
// or instance fan-out — that's a v1.1 problem we solve with Vercel KV /
// Neon Postgres. For soft launch this is enough: the score renders, the
// /r/[slug] page resolves within the same instance.
type StoredReport = AuditReport & { _meta?: ReportMeta };
const memoryStore = new Map<string, StoredReport>();
const isServerless =
  process.env.VERCEL === "1" ||
  process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
  process.env.CITEGRADE_FORCE_MEMORY === "1";

async function ensureDir() {
  if (isServerless) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export interface ReportMeta {
  ownerId?: string;
  siteName?: string;
}

export async function saveReport(
  report: AuditReport,
  meta: ReportMeta = {},
): Promise<void> {
  const payload: StoredReport = { ...report, _meta: meta };
  if (isServerless) {
    memoryStore.set(report.id, payload);
    if (memoryStore.size > 200) {
      const firstKey = memoryStore.keys().next().value;
      if (firstKey) memoryStore.delete(firstKey);
    }
    return;
  }
  await ensureDir();
  const file = path.join(DATA_DIR, `${report.id}.json`);
  await fs.writeFile(file, JSON.stringify(payload, null, 2), "utf8");
}

export async function claimReport(
  reportId: string,
  ownerId: string,
): Promise<boolean> {
  if (isServerless) {
    const existing = memoryStore.get(reportId);
    if (!existing) return false;
    existing._meta = { ...(existing._meta ?? {}), ownerId };
    memoryStore.set(reportId, existing);
    return true;
  }
  const file = path.join(DATA_DIR, `${reportId}.json`);
  try {
    const buf = await fs.readFile(file, "utf8");
    const data = JSON.parse(buf);
    data._meta = { ...(data._meta ?? {}), ownerId };
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function listReportsForUser(
  ownerId: string,
  limit = 50,
): Promise<AuditReport[]> {
  if (isServerless) {
    return [...memoryStore.values()]
      .filter((r) => r._meta?.ownerId === ownerId)
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  }
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const reports = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const buf = await fs.readFile(path.join(DATA_DIR, f), "utf8");
            const r = JSON.parse(buf);
            if (r._meta?.ownerId === ownerId) return r as AuditReport;
            return null;
          } catch {
            return null;
          }
        }),
    );
    return reports
      .filter((r): r is AuditReport => !!r)
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function reportsByHost(
  host: string,
  limit = 50,
): Promise<AuditReport[]> {
  const matchHost = (r: AuditReport) => {
    try {
      return new URL(r.url).host === host;
    } catch {
      return false;
    }
  };
  if (isServerless) {
    return [...memoryStore.values()]
      .filter(matchHost)
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  }
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const reports = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const buf = await fs.readFile(path.join(DATA_DIR, f), "utf8");
            return JSON.parse(buf) as AuditReport;
          } catch {
            return null;
          }
        }),
    );
    return reports
      .filter((r): r is AuditReport => !!r)
      .filter(matchHost)
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function loadReport(id: string): Promise<AuditReport | null> {
  if (!/^[A-Za-z0-9_-]{4,32}$/.test(id)) return null;
  if (isServerless) {
    return memoryStore.get(id) ?? null;
  }
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf8");
    return JSON.parse(buf) as AuditReport;
  } catch {
    return null;
  }
}

export async function listRecentReports(limit = 10): Promise<AuditReport[]> {
  if (isServerless) {
    return [...memoryStore.values()]
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  }
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const reports = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const buf = await fs.readFile(path.join(DATA_DIR, f), "utf8");
            return JSON.parse(buf) as AuditReport;
          } catch {
            return null;
          }
        }),
    );
    return reports
      .filter((r): r is AuditReport => !!r)
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}
