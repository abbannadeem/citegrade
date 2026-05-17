# Citegrade

> A free 100-point AI SEO audit for the LLM era.

Paste any public URL, and within ~15 seconds Citegrade scores it across six
categories — llms.txt, JSON-LD schema, semantic HTML, meta tags, crawlability,
and E-E-A-T signals — and tells you exactly what ChatGPT, Claude, and
Perplexity can't read on your site.

**Status:** v0 — core audit engine + minimal marketing page. v1 (auth,
dashboard, multi-site tracking, billing, polished SaaS UI/UX) in active
development.

## What it checks

| Category | Points | What |
| --- | --- | --- |
| **llms.txt** | 15 | File presence, llmstxt.org spec conformance, llms-full.txt companion |
| **Structured data** | 25 | JSON-LD parseability, Organization/Person + sameAs, page-type schemas, relational schemas |
| **Semantic HTML** | 15 | Single H1, no skipped heading levels, `<main>` / `<article>` / `<section>`, image alt coverage |
| **Meta & social** | 15 | Title length, description length, canonical, og:image, twitter:card |
| **Crawlability** | 15 | robots.txt, sitemap.xml, explicit AI bot rules (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended), `<html lang>` |
| **E-E-A-T** | 15 | Person schema or byline, freshness (`<time>` + last-updated), About + Contact, outbound authority links, sameAs network |

## Stack

- **Framework:** Next.js 16 (App Router, React 19, Server Actions)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, Geist + Geist Mono
- **HTML parsing:** cheerio
- **Validation:** zod
- **Icons:** lucide-react
- **Storage:** filesystem JSON (MVP) — production target is Cloudflare D1

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Run a self-audit from the CLI:

```bash
npx tsx scripts/self-audit.ts https://stripe.com
CITEGRADE_ALLOW_PRIVATE=1 npx tsx scripts/self-audit.ts http://localhost:3000
npx tsx scripts/self-audit.ts https://example.com --save
```

## Configuration

| Env var | Default | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Used for `metadataBase`, canonical, OG, sitemap, llms.txt |
| `NEXT_PUBLIC_UPWORK_URL` | placeholder | The "Hire me" link target |
| `NEXT_PUBLIC_AUTHOR_URL` | placeholder | Person schema URL |
| `CITEGRADE_ALLOW_PRIVATE` | unset | When `1`, the SSRF guard allows loopback / RFC1918 hosts (dev only) |

## Self-audit

Citegrade scores **96 / 100** on its own audit.

## License

MIT.
