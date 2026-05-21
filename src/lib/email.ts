import { Resend } from "resend";
import { SITE, siteUrl } from "./site";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || "Citegrade <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends an email via Resend when RESEND_API_KEY is set; otherwise logs to the
 * server console so flows (magic links, alerts) remain testable in dev.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendArgs): Promise<{ ok: boolean; dev: boolean }> {
  if (!resend) {
    console.log(
      `\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n[email:dev] ${text}\n`,
    );
    return { ok: true, dev: true };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html, text });
    return { ok: true, dev: false };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { ok: false, dev: false };
  }
}

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#07070b;font-family:-apple-system,Segoe UI,sans-serif;color:#fafafa;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#0d0d14;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px">
    <div style="font-size:18px;font-weight:600;margin-bottom:8px">Citegrade</div>
    <h1 style="font-size:22px;margin:16px 0">${title}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0">
    <p style="font-size:12px;color:#71717a">Citegrade — the 100-point AI SEO audit. ${siteUrl("/")}</p>
  </div></body></html>`;
}

export async function sendMagicLink(to: string, link: string) {
  return sendEmail({
    to,
    subject: "Sign in to Citegrade",
    html: shell(
      "Your sign-in link",
      `<p style="color:#a1a1aa;font-size:14px;line-height:1.6">Click below to sign in. This link expires in 15 minutes.</p>
       <a href="${link}" style="display:inline-block;margin-top:16px;background:#5e5ce6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Sign in to Citegrade</a>
       <p style="color:#71717a;font-size:12px;margin-top:16px;word-break:break-all">${link}</p>`,
    ),
    text: `Sign in to Citegrade: ${link} (expires in 15 minutes)`,
  });
}

export async function sendWelcome(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Citegrade",
    html: shell(
      `Welcome, ${name}`,
      `<p style="color:#a1a1aa;font-size:14px;line-height:1.6">Your account is ready. Run audits, track your sites' AI search visibility over time, and see exactly what ChatGPT, Claude, and Perplexity can't read.</p>
       <a href="${siteUrl("/dashboard")}" style="display:inline-block;margin-top:16px;background:#5e5ce6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Open dashboard</a>`,
    ),
    text: `Welcome to Citegrade, ${name}. Open your dashboard: ${siteUrl("/dashboard")}`,
  });
}

export async function sendScoreAlert(
  to: string,
  host: string,
  oldScore: number,
  newScore: number,
  reportId: string,
) {
  const dir = newScore < oldScore ? "dropped" : "improved";
  return sendEmail({
    to,
    subject: `${host} score ${dir}: ${oldScore} → ${newScore}`,
    html: shell(
      `${host} ${dir}`,
      `<p style="color:#a1a1aa;font-size:14px;line-height:1.6">Your weekly re-scan of <strong>${host}</strong> moved from <strong>${oldScore}</strong> to <strong>${newScore}</strong>.</p>
       <a href="${siteUrl(`/r/${reportId}`)}" style="display:inline-block;margin-top:16px;background:#5e5ce6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">View report</a>`,
    ),
    text: `${host} ${dir}: ${oldScore} -> ${newScore}. ${siteUrl(`/r/${reportId}`)}`,
  });
}

void SITE;
