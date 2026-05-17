import { promises as fs } from "fs";
import path from "path";
import { AuditReport } from "./audit/types";

const DATA_DIR = path.join(process.cwd(), ".data", "reports");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function saveReport(report: AuditReport): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${report.id}.json`);
  await fs.writeFile(file, JSON.stringify(report, null, 2), "utf8");
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
