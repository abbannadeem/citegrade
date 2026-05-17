import { SITE, siteUrl } from "./site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: siteUrl("/icon.png"),
    sameAs: SITE.sameAs,
    founder: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
      name: SITE.authorName,
      jobTitle: SITE.authorTitle,
      url: SITE.authorUrl,
      sameAs: SITE.sameAs,
    },
  } as const;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/?url={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}#app`,
    name: SITE.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: SITE.description,
    url: SITE.url,
    creator: { "@id": `${SITE.url}#person` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  } as const;
}

export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to audit a site for AI SEO with Citegrade",
    description:
      "Run a free 100-point AI SEO audit on any public URL in three steps.",
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your URL",
        text: "On the Citegrade homepage, paste your site's homepage URL (with or without https://) into the input field.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the scan",
        text: "Click Audit. Citegrade fetches your homepage, /llms.txt, /robots.txt, and /sitemap.xml, then runs 25+ checks across six categories.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read the report",
        text: "Within 5–15 seconds you land on a shareable report page with a 0–100 score, category breakdowns, severity-coded findings, and a concrete fix for every failure.",
      },
    ],
  } as const;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  } as const;
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AI SEO?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "AI SEO is the practice of structuring a website so that large language models — ChatGPT, Claude, Perplexity, and Google's AI Overview — can read, understand, and cite its content. It extends classical SEO with llms.txt, richer JSON-LD schema, E-E-A-T signaling, and content patterns optimized for extractive citation.",
        },
      },
      {
        "@type": "Question",
        name: "What does Citegrade check?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Citegrade runs 100 points of checks across six categories: llms.txt (15), JSON-LD schema (25), semantic HTML (15), meta and social tags (15), crawlability and AI bot rules (15), and E-E-A-T signals (15). Each report scores your site, flags failures, and suggests fixes.",
        },
      },
      {
        "@type": "Question",
        name: "Is llms.txt actually used by ChatGPT or Claude?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No major LLM provider has officially committed to consuming llms.txt during training or retrieval as of May 2026. It is currently signal-without-consumer, used mainly by agent frameworks and dev-tool RAG pipelines. Citegrade scores it because (1) adoption is climbing, (2) it costs nothing to ship, and (3) shipping one demonstrates AI-discoverability discipline that correlates with other signals LLMs do use.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the score?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The 100-point rubric is opinionated, not authoritative. It reflects current best practice for LLM-friendliness as of May 2026 and is derived from the published behavior of GPT-5, Claude, Perplexity, and Google AI Overview. A high score does not guarantee citation, but a low score reliably predicts that LLMs will struggle to parse and reuse your content.",
        },
      },
      {
        "@type": "Question",
        name: "Who built Citegrade?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Citegrade is built by Abban Nadeem, a senior Next.js + Cloudflare + AI SEO developer. Each failed check on a report links to the matching freelance service so you can either fix it yourself or hire him to do it.",
        },
      },
    ],
  } as const;
}
