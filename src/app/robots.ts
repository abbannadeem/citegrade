import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/r/"] },
      // Explicit AI crawler directives — allow indexing of the marketing
      // pages, but keep individual report pages out of mass crawls.
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/r/"],
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/r/"],
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/r/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/r/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/r/"],
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
