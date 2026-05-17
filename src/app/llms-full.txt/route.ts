import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# ${SITE.name} — Complete Site Content

> ${SITE.tagline}

${SITE.description}

---

## What ${SITE.name} does

${SITE.name} is a free web tool that scores any public URL against a 100-point AI SEO rubric. Paste a URL, and within 5–15 seconds you get a graded report showing exactly which AI-discoverability signals are present, missing, or broken on your site.

The rubric is opinionated and open. Every point is traceable to a specific check, and every failure includes a concrete fix.

## The 100-point rubric

### llms.txt (15 points)

The llms.txt file at the site root is a Markdown index that lets LLMs ingest a curated, token-efficient summary of your site. We check that the file exists, follows the llmstxt.org spec (H1, blockquote summary, sectioned link lists), and is paired with a companion llms-full.txt containing the actual prose of priority pages.

- File present at /llms.txt: 8 points
- Valid llmstxt.org structure (H1, blockquote, sections, ≥3 links): 4 points
- llms-full.txt companion present: 3 points

### JSON-LD structured data (25 points)

JSON-LD is how LLMs and search engines disambiguate your content into entities. We check that JSON-LD is present and parseable, that you have an identity entity (Organization or Person) with sameAs links to authoritative profiles (LinkedIn, GitHub, Wikidata), a page-type schema (Article, Product, WebSite, SoftwareApplication), and bonus relational schemas (FAQPage, HowTo, BreadcrumbList) that LLMs use for extractive citation.

- JSON-LD present and parseable: 10 points
- Identity entity (Organization or Person) with sameAs: 5 points
- Page-type schema (Article / Product / WebSite / SoftwareApplication): 5 points
- Relational schema (FAQPage / HowTo / BreadcrumbList): 5 points

### Semantic HTML (15 points)

LLMs use HTML structure to chunk and prioritize content. We check that there is exactly one descriptive H1, no skipped heading levels (no jumping H2 → H4), a single <main> landmark, <article> or <section> elements for primary content, and that images carry alt text.

- Exactly one H1: 4 points
- No skipped heading levels: 3 points
- <main> landmark present: 3 points
- <article> or <section> used: 3 points
- ≥90% of images have alt text: 2 points

### Meta and social (15 points)

Classical SEO that LLMs still consume. Title length 30–60 characters, meta description 70–160 characters, canonical URL, og:image, and a twitter:card directive.

- <title> 30–60 chars: 3 points
- <meta description> 70–160 chars: 3 points
- <link rel="canonical">: 3 points
- og:image set: 3 points
- twitter:card set: 3 points

### Crawlability (15 points)

We check that /robots.txt and /sitemap.xml exist, that <html lang> is set, and that robots.txt explicitly names the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended). Naming bots signals intent and prevents future surprises.

- robots.txt present: 4 points
- sitemap.xml present: 4 points
- ≥3 AI crawlers explicitly addressed in robots.txt: 4 points
- <html lang> set: 3 points

### E-E-A-T signals (15 points)

Experience, Expertise, Authoritativeness, Trust — the modern relevance signals LLMs use to weight your content. We check for Person schema or visible byline, freshness signals (<time> tag or "Updated" date), reachable About and Contact pages, outbound links to authoritative sources (Wikipedia, .gov, .edu, primary research), and the sameAs network on your identity entity.

- Person schema + visible byline: 5 points
- Freshness signals (<time> + last-updated text): 3 points
- About + Contact visible: 3 points
- ≥2 outbound authoritative citations: 2 points
- ≥3 sameAs links on identity entity: 2 points

## Why this rubric

The rubric is built on the published behavior of GPT-5, Claude, Perplexity, and Google AI Overview as of May 2026. It reflects best-practice consensus from Aleyda Solis, Lily Ray, Andrea Volpini (WordLift), and Google's own structured-data documentation.

A high score does not guarantee citation. But a low score reliably predicts that LLMs will struggle to parse, identify, and reuse your content.

## Who built this

${SITE.name} is built by ${SITE.authorName}, a ${SITE.authorTitle}.

Every failed check in your report links to the matching freelance service: landing pages, full websites, technical SEO audits, AI SEO setups, and WordPress → Next.js migrations. You can fix the issues yourself using the suggested fix, or hire the auditor.

Contact via Upwork: ${SITE.authorUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
