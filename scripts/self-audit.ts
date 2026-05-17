import { runAudit } from "../src/lib/audit/index";
import { saveReport } from "../src/lib/storage";

const target = process.argv[2] || "http://localhost:3000";
const shouldSave = process.argv.includes("--save");

async function main() {
  console.log(`Auditing: ${target}`);
  const start = Date.now();
  const report = await runAudit(target);
  if (shouldSave) {
    await saveReport(report);
    console.log(`Saved report → /r/${report.id}`);
  }
  console.log("");
  console.log(`Score: ${report.score} / 100  (grade ${report.grade})`);
  console.log(`Verdict: ${report.verdict}`);
  console.log(`Duration: ${Date.now() - start}ms`);
  console.log("");
  for (const c of report.categories) {
    console.log(`  ${c.category.padEnd(14)}  ${c.earned} / ${c.max}`);
    for (const f of c.findings) {
      const icon = f.severity === "pass" ? " ok " : f.severity === "warn" ? "warn" : "FAIL";
      console.log(`    [${icon}] (${f.earned}/${f.max}) ${f.title}`);
      if (f.severity !== "pass" && f.evidence) {
        console.log(`           ${f.evidence.slice(0, 120)}`);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
