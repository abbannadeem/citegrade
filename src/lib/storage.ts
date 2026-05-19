import { promises as fs } from "fs";
import path from "path";
import { AuditReport } from "./audit/types";

const DATA_DIR = path.join(process.cwd(), ".data", "reports");

async function ensureDir() {
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
  await ensureDir();
  const file = path.join(DATA_DIR, `${report.id}.json`);
  const payload = { ...report, _meta: meta };
  await fs.writeFile(file, JSON.stringify(payload, null, 2), "utf8");
}

export async function claimReport(
  reportId: string,
  ownerId: string,
): Promise<boolean> {
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
      .filter((r) => {
        try {
          return new URL(r.url).host === host;
        } catch {
          return false;
        }
      })
      .sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function loadReport(id: string): Promise<AuditReport | null> {
  if (!/^[A-Za-z0-9_-]{4,32}$/.test(id)) return null;
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf8");
    return JSON.parse(buf) as AuditReport;
  } catch {
    return null;
  }
}

export async function listRecentReports(limit = 10): Promise<AuditReport[]> {
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
