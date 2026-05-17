import { SITE, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# ${SITE.name}

> ${SITE.tagline} — a free 100-point audit covering llms.txt, JSON-LD schema, semantic HTML, meta tags, crawlability, and E-E-A-T signals. Built by ${SITE.authorName}, a senior Next.js + Cloudflare + AI SEO developer.

${SITE.description}

## Core

- [${SITE.name} home](${siteUrl("/")}): Paste any URL, get a scored AI SEO report in under 30 seconds.
- [llms.txt (this file)](${siteUrl("/llms.txt")}): Curated index of the site for LLM ingestion.
- [llms-full.txt](${siteUrl("/llms-full.txt")}): Full prose of the site's primary pages, formatted for direct LLM consumption.

## Services

- [Next.js landing page](${SITE.authorUrl}): High-converting one-pager with full SEO + AI SEO instrumentation. From $200.
- [Full Next.js website](${SITE.authorUrl}): 3–8 pages, CMS, technical and AI SEO baked in. From $500.
- [Technical SEO audit and fix](${SITE.authorUrl}): Full audit plus implementation of the findings. From $150.
- [AI SEO setup](${SITE.authorUrl}): llms.txt, schema suite, E-E-A-T signaling, content restructure for LLM citation. From $250.
- [WordPress → Next.js migration](${SITE.authorUrl}): Preserve content and URLs, 10× faster delivery, deployed to Cloudflare. From $600.

## About

- [Author profile](${SITE.authorUrl}): ${SITE.authorName} — ${SITE.authorTitle}.

## Optional

- [Contact via Upwork](${SITE.authorUrl}): Send a message describing your project; replies within hours.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
