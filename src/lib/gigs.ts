import type { GigKey } from "./audit/types";

export interface Gig {
  key: GigKey;
  title: string;
  blurb: string;
  startingPrice: string;
  url: string;
}

const UPWORK_PROFILE =
  process.env.NEXT_PUBLIC_UPWORK_URL || "https://www.upwork.com/freelancers/abban";

export const GIGS: Record<GigKey, Gig> = {
  "landing-page": {
    key: "landing-page",
    title: "Next.js landing page with perfect SEO",
    blurb: "High-converting one-pager, Lighthouse 95+, schema-ready, deployed to Cloudflare in 5 days.",
    startingPrice: "$200",
    url: UPWORK_PROFILE,
  },
  "full-site": {
    key: "full-site",
    title: "Full Next.js + TypeScript website with full SEO",
    blurb: "Up to 5 pages, CMS, complete technical + AI SEO, dynamic OG, 14-day post-launch support.",
    startingPrice: "$500",
    url: UPWORK_PROFILE,
  },
  "seo-audit": {
    key: "seo-audit",
    title: "Technical SEO audit & fix",
    blurb: "Full audit + implementation of Core Web Vitals, crawlability, schema, and metadata fixes.",
    startingPrice: "$150",
    url: UPWORK_PROFILE,
  },
  "ai-seo": {
    key: "ai-seo",
    title: "AI SEO setup (llms.txt, schema, E-E-A-T)",
    blurb: "Get cited by ChatGPT, Perplexity, and Google AI Overview. llms.txt, schema suite, content restructure.",
    startingPrice: "$250",
    url: UPWORK_PROFILE,
  },
  "wp-migration": {
    key: "wp-migration",
    title: "WordPress → Next.js migration",
    blurb: "Preserve content + URLs + admin experience. 10× faster, deployed to Cloudflare Pages.",
    startingPrice: "$600",
    url: UPWORK_PROFILE,
  },
};

export const PRIMARY_GIG_FOR_CATEGORY: Record<string, GigKey> = {
  "llms-txt": "ai-seo",
  schema: "ai-seo",
  semantic: "full-site",
  meta: "seo-audit",
  crawlability: "seo-audit",
  eeat: "ai-seo",
};
