# Citegrade

> A 100-point AI SEO audit for the LLM era. Score any site's AI search
> visibility — llms.txt, JSON-LD, semantic HTML, meta, crawlability, E-E-A-T.

**Status:** v1.1 — full SaaS. Real auth, database, quotas, billing, email,
public API, and scheduled monitoring. External services (Stripe, Resend,
Turso) activate when their keys are present; without keys, the app runs fully
with sensible local fallbacks.

## What it checks

| Category | Points |
| --- | --- |
| llms.txt (presence, spec, llms-full.txt) | 15 |
| JSON-LD structured data (identity, page-type, relational) | 25 |
| Semantic HTML (H1, hierarchy, landmarks, alt) | 15 |
| Meta & social (title, description, canonical, OG, twitter) | 15 |
| Crawlability (robots, sitemap, AI bot rules, lang) | 15 |
| E-E-A-T (author, freshness, contact, authority, sameAs) | 15 |

## Features

**Audit** — 100-point engine, shareable `/r/[slug]` reports, animated score
gauge, dynamic OG cards, "claim this report" for anonymous users.

**Accounts** — real email + password auth (scrypt + DB sessions), magic-link
sign-in, per-user dashboard.

**Dashboard** — overview KPIs, sites tracking, per-site history + issues,
side-by-side comparison, settings.

**Plans & quotas** — Free (3 audits/day, 1 site, 7-day history) and Pro
($29/mo: unlimited audits, 10 sites, monitoring, comparison, PDF, API).
Anonymous audits rate-limited per IP.

**Billing** — Stripe Checkout + webhook + Customer Portal. Dev-stub upgrade
when keys absent.

**Email** — Resend for magic links, welcome, score-change alerts. Logs to
console when no key.

**Public API** — `POST /api/v1/audit` with `Authorization: Bearer cg_...`,
key management in settings, Pro-gated.

**Monitoring** — weekly auto re-scans via `/api/cron/rescan` (Vercel Cron),
score-change email alerts.

**Leaderboard** — public ranking of audited sites by score.

## Stack

- Next.js 16 (App Router, React 19, Server Actions)
- TypeScript 5, Tailwind v4, Radix + shadcn-style components, motion
- libSQL / Drizzle ORM (local SQLite file → Turso in prod, same code)
- Stripe, Resend, scrypt (node:crypto)

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — works without any keys
npm run dev
# http://localhost:3000
```

Self-audit from the CLI:

```bash
CITEGRADE_ALLOW_PRIVATE=1 npx tsx scripts/self-audit.ts http://localhost:3000
npx tsx scripts/self-audit.ts https://stripe.com --save
```

## Configuration

All optional — see `.env.example`. Without keys: SQLite file storage,
dev-stub billing, console email. With keys: Turso DB, real Stripe billing,
Resend email.

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` / `DATABASE_AUTH_TOKEN` | Turso libSQL (else local file) |
| `STRIPE_SECRET_KEY` / `STRIPE_PRICE_PRO` / `STRIPE_WEBHOOK_SECRET` | Billing |
| `RESEND_API_KEY` / `EMAIL_FROM` | Transactional email |
| `CRON_SECRET` | Protects the re-scan cron |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL |

## Deploy (Vercel)

1. Import the repo on Vercel (Next.js auto-detected).
2. Add env vars (at minimum `NEXT_PUBLIC_SITE_URL`).
3. For persistence in production, create a free Turso DB and set
   `DATABASE_URL` + `DATABASE_AUTH_TOKEN`.
4. `vercel.json` wires the weekly monitoring cron automatically.

## License

MIT. Built by [Abban Nadeem](https://www.upwork.com/freelancers/abban).
