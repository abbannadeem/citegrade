export const SITE = {
  name: "Citegrade",
  tagline: "AI SEO audit for the LLM era",
  description:
    "Free 100-point AI SEO audit. Citegrade scores llms.txt, JSON-LD, semantic HTML, meta, crawlability, and E-E-A-T — and tells you what ChatGPT, Claude, and Perplexity can't read on your site.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  authorName: "Abban Nadeem",
  authorTitle: "Senior Next.js + Cloudflare + AI SEO developer",
  authorUrl:
    process.env.NEXT_PUBLIC_AUTHOR_URL || "https://www.upwork.com/freelancers/abban",
  sameAs: [
    "https://github.com/abban",
    "https://www.linkedin.com/in/abban",
    "https://www.upwork.com/freelancers/abban",
  ],
} as const;

export function siteUrl(path = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
