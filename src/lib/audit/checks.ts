import type { Finding, Severity, CheckCategory } from "./types";
import type { Parsed } from "./parse";
import { fetchText } from "./fetch-html";

type CheckCtx = {
  parsed: Parsed;
  url: URL;
};

type ExternalFiles = {
  llmsTxt: { status: number; body: string } | null;
  llmsFullTxt: { status: number; body: string } | null;
  robotsTxt: { status: number; body: string } | null;
  sitemapXml: { status: number; body: string } | null;
};

function rootUrl(u: URL): string {
  return `${u.protocol}//${u.host}`;
}

export async function loadExternals(url: URL): Promise<ExternalFiles> {
  const base = rootUrl(url);
  const [llmsTxt, llmsFullTxt, robotsTxt, sitemapXml] = await Promise.all([
    fetchText(`${base}/llms.txt`),
    fetchText(`${base}/llms-full.txt`),
    fetchText(`${base}/robots.txt`),
    fetchText(`${base}/sitemap.xml`),
  ]);
  const exists = (r: { status: number; body: string } | null) =>
    r && r.status >= 200 && r.status < 300 ? r : null;
  return {
    llmsTxt: exists(llmsTxt),
    llmsFullTxt: exists(llmsFullTxt),
    robotsTxt: exists(robotsTxt),
    sitemapXml: exists(sitemapXml),
  };
}

const make = (
  id: string,
  category: CheckCategory,
  title: string,
  severity: Severity,
  earned: number,
  max: number,
  evidence?: string,
  fix?: string,
): Finding => ({ id, category, title, severity, earned, max, evidence, fix });

function clampSev(earned: number, max: number): Severity {
  const ratio = max === 0 ? 1 : earned / max;
  if (ratio >= 0.9) return "pass";
  if (ratio >= 0.4) return "warn";
  return "fail";
}

// ───────────────────────────── llms.txt (15) ─────────────────────────────
export function checkLlmsTxt(
  externals: ExternalFiles,
): Finding[] {
  const findings: Finding[] = [];
  const llms = externals.llmsTxt;

  if (!llms) {
    findings.push(
      make(
        "llms-txt-missing",
        "llms-txt",
        "llms.txt file at site root",
        "fail",
        0,
        8,
        "GET /llms.txt → 404 or unreachable",
        "Create a Markdown llms.txt at your domain root. Start with an H1 (site name), a blockquote summary, and a curated list of your most important pages grouped by section (Docs, Examples, Optional).",
      ),
    );
    findings.push(
      make(
        "llms-txt-quality",
        "llms-txt",
        "llms.txt structure quality",
        "fail",
        0,
        4,
        "No llms.txt to evaluate",
        "Once created, follow the llmstxt.org spec: # H1 name, > one-line summary, ## section headers with bulleted links.",
      ),
    );
    findings.push(
      make(
        "llms-full-txt-missing",
        "llms-txt",
        "llms-full.txt companion file",
        "fail",
        0,
        3,
        "GET /llms-full.txt → 404",
        "Generate llms-full.txt with the actual prose of your key pages so LLMs can ingest the full content in one fetch.",
      ),
    );
    return findings;
  }

  findings.push(
    make(
      "llms-txt-present",
      "llms-txt",
      "llms.txt file at site root",
      "pass",
      8,
      8,
      `GET /llms.txt → ${llms.status}, ${llms.body.length} bytes`,
    ),
  );

  const body = llms.body;
  const hasH1 = /^\s*#\s+\S/m.test(body);
  const hasBlockquote = /^\s*>\s+\S/m.test(body);
  const hasSection = /^\s*##\s+\S/m.test(body);
  const looksLikeMarkdown = hasH1 && (hasBlockquote || hasSection);
  const linkCount = (body.match(/\[[^\]]+\]\([^)]+\)/g) || []).length;
  const qualityScore =
    (hasH1 ? 1 : 0) +
    (hasBlockquote ? 1 : 0) +
    (hasSection ? 1 : 0) +
    (linkCount >= 3 ? 1 : 0);
  findings.push(
    make(
      "llms-txt-quality",
      "llms-txt",
      "llms.txt follows the llmstxt.org spec",
      clampSev(qualityScore, 4),
      qualityScore,
      4,
      `H1: ${hasH1 ? "yes" : "no"}, blockquote: ${hasBlockquote ? "yes" : "no"}, sections: ${hasSection ? "yes" : "no"}, links: ${linkCount}`,
      looksLikeMarkdown
        ? undefined
        : "Restructure your llms.txt: start with `# Site Name`, follow with `> one-line summary`, then `## Section` headers each containing `- [Title](url): description` links.",
    ),
  );

  const llmsFull = externals.llmsFullTxt;
  if (llmsFull) {
    findings.push(
      make(
        "llms-full-txt-present",
        "llms-txt",
        "llms-full.txt companion file",
        "pass",
        3,
        3,
        `GET /llms-full.txt → ${llmsFull.status}, ${llmsFull.body.length} bytes`,
      ),
    );
  } else {
    findings.push(
      make(
        "llms-full-txt-missing",
        "llms-txt",
        "llms-full.txt companion file",
        "warn",
        0,
        3,
        "GET /llms-full.txt → 404",
        "Ship llms-full.txt with the full Markdown of your priority pages — LLMs can ingest your knowledge base in one request.",
      ),
    );
  }
  return findings;
}

// ───────────────────────── JSON-LD Schema (25) ───────────────────────────
type Block = Record<string, unknown>;
function flatten(node: unknown, acc: Block[] = []): Block[] {
  if (!node) return acc;
  if (Array.isArray(node)) {
    for (const n of node) flatten(n, acc);
    return acc;
  }
  if (typeof node === "object") {
    const obj = node as Block;
    if (obj["@graph"]) flatten(obj["@graph"], acc);
    acc.push(obj);
    if (obj["@type"]) {
      // also flatten nested typed entities
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === "object" && v && !Array.isArray(v) && (v as Block)["@type"]) {
          flatten(v, acc);
        }
      }
    }
  }
  return acc;
}

function typesOf(b: Block): string[] {
  const t = b["@type"];
  if (!t) return [];
  if (Array.isArray(t)) return t.map(String);
  return [String(t)];
}

export function checkSchema({ parsed }: CheckCtx): Finding[] {
  const findings: Finding[] = [];
  const nodes = parsed.jsonLd;
  const parseErrors = nodes.filter((n) => n.parseError).length;

  if (nodes.length === 0) {
    findings.push(
      make(
        "schema-none",
        "schema",
        "JSON-LD structured data present",
        "fail",
        0,
        10,
        "No <script type=\"application/ld+json\"> found in <head> or <body>",
        "Add JSON-LD blocks for Organization (or Person), WebSite, and the page's primary entity (Article / Product / SoftwareApplication). Inject server-side so it lands in the initial HTML.",
      ),
    );
    findings.push(
      make(
        "schema-entity",
        "schema",
        "Identity entity (Organization or Person) with sameAs",
        "fail",
        0,
        5,
        "No JSON-LD to inspect",
      ),
    );
    findings.push(
      make(
        "schema-context",
        "schema",
        "Page-type schema (Article / Product / WebSite / SoftwareApplication)",
        "fail",
        0,
        5,
        "No JSON-LD to inspect",
      ),
    );
    findings.push(
      make(
        "schema-relations",
        "schema",
        "Bonus schema (FAQPage, HowTo, BreadcrumbList)",
        "fail",
        0,
        5,
        "No JSON-LD to inspect",
      ),
    );
    return findings;
  }

  const blocks = nodes
    .filter((n) => !n.parseError)
    .flatMap((n) => flatten(n.data));
  const allTypes = new Set<string>();
  for (const b of blocks) for (const t of typesOf(b)) allTypes.add(t);

  // (a) presence + parse health
  const presentScore = parseErrors > 0 ? 7 : 10;
  findings.push(
    make(
      "schema-present",
      "schema",
      "JSON-LD blocks present and parseable",
      clampSev(presentScore, 10),
      presentScore,
      10,
      `${nodes.length} block(s), ${parseErrors} parse error(s), types: ${[...allTypes].join(", ") || "none"}`,
      parseErrors > 0
        ? "One or more JSON-LD blocks failed to parse. Wrap with `JSON.stringify(...)` server-side rather than hand-writing JSON in HTML."
        : undefined,
    ),
  );

  // (b) Identity entity
  const orgBlock = blocks.find((b) =>
    typesOf(b).some((t) => /Organization|Person|LocalBusiness/.test(t)),
  );
  let identityScore = 0;
  let identityEvidence = "No Organization or Person block found";
  if (orgBlock) {
    identityScore = 3;
    const sameAs = orgBlock["sameAs"];
    const hasSameAs =
      Array.isArray(sameAs) ? sameAs.length >= 2 : !!sameAs;
    if (hasSameAs) identityScore = 5;
    identityEvidence = `Found ${typesOf(orgBlock).join("/")}; sameAs: ${hasSameAs ? (Array.isArray(sameAs) ? sameAs.length : 1) : 0} link(s)`;
  }
  findings.push(
    make(
      "schema-entity",
      "schema",
      "Identity entity (Organization or Person) with sameAs",
      clampSev(identityScore, 5),
      identityScore,
      5,
      identityEvidence,
      identityScore < 5
        ? "Add an Organization or Person JSON-LD with at least two `sameAs` URLs (LinkedIn, GitHub, Wikipedia, Crunchbase). This is what LLMs use to disambiguate your identity in their knowledge graph."
        : undefined,
    ),
  );

  // (c) Page-type schema
  const PAGE_TYPES = [
    "Article",
    "NewsArticle",
    "BlogPosting",
    "TechArticle",
    "Product",
    "WebSite",
    "WebPage",
    "SoftwareApplication",
    "SoftwareSourceCode",
    "CreativeWork",
    "Service",
    "ProfilePage",
  ];
  const matchedPage = [...allTypes].filter((t) => PAGE_TYPES.includes(t));
  const pageScore = matchedPage.length >= 1 ? 5 : 0;
  findings.push(
    make(
      "schema-context",
      "schema",
      "Page-type schema (Article / Product / WebSite / SoftwareApplication)",
      clampSev(pageScore, 5),
      pageScore,
      5,
      matchedPage.length
        ? `Detected: ${matchedPage.join(", ")}`
        : "No page-type schema found",
      pageScore === 0
        ? "Add WebSite schema in the root layout and the correct page-type (Article, Product, SoftwareApplication) per route."
        : undefined,
    ),
  );

  // (d) Bonus relational schema
  const RELATIONAL = ["FAQPage", "HowTo", "BreadcrumbList", "Recipe", "QAPage"];
  const matchedRel = [...allTypes].filter((t) => RELATIONAL.includes(t));
  let relScore = Math.min(matchedRel.length * 2, 5);
  if (matchedRel.length >= 2) relScore = 5;
  findings.push(
    make(
      "schema-relations",
      "schema",
      "Relational schema (FAQPage, HowTo, BreadcrumbList)",
      clampSev(relScore, 5),
      relScore,
      5,
      matchedRel.length
        ? `Detected: ${matchedRel.join(", ")}`
        : "No FAQPage / HowTo / BreadcrumbList found",
      relScore < 5
        ? "Add FAQPage to your landing or docs (highest-value type for LLM extraction) and BreadcrumbList on nested pages."
        : undefined,
    ),
  );

  return findings;
}

// ──────────────────────── Semantic HTML (15) ────────────────────────────
export function checkSemantic({ parsed }: CheckCtx): Finding[] {
  const f: Finding[] = [];
  const h1Count = parsed.headings.h1.length;
  const h1Score = h1Count === 1 ? 4 : h1Count === 0 ? 0 : 1;
  f.push(
    make(
      "sem-h1",
      "semantic",
      "Single, descriptive H1",
      clampSev(h1Score, 4),
      h1Score,
      4,
      h1Count === 0
        ? "No H1 found"
        : `${h1Count} H1 element(s): ${parsed.headings.h1
            .slice(0, 3)
            .map((t) => `"${t.slice(0, 60)}"`)
            .join(", ")}`,
      h1Count !== 1
        ? "Exactly one H1 per page. It should describe the page's primary entity."
        : undefined,
    ),
  );

  // heading hierarchy (no skipped levels going down)
  let skips = 0;
  let lastLevel = 0;
  for (const lvl of parsed.headingOrder) {
    if (lastLevel && lvl > lastLevel + 1) skips++;
    lastLevel = lvl;
  }
  const hierScore = skips === 0 ? 3 : skips === 1 ? 1 : 0;
  f.push(
    make(
      "sem-hier",
      "semantic",
      "Heading hierarchy (no skipped levels)",
      clampSev(hierScore, 3),
      hierScore,
      3,
      `${skips} skipped level(s) detected across ${parsed.headingOrder.length} headings`,
      hierScore < 3
        ? "Never jump from H2 to H4. Headings are a tree — LLMs use them for chunking."
        : undefined,
    ),
  );

  const mainScore = parsed.landmarks.main > 0 ? 3 : 0;
  f.push(
    make(
      "sem-main",
      "semantic",
      "<main> landmark present",
      clampSev(mainScore, 3),
      mainScore,
      3,
      `<main>: ${parsed.landmarks.main}`,
      mainScore === 0
        ? "Wrap primary content in a single <main> landmark."
        : undefined,
    ),
  );

  const aOrS = parsed.landmarks.article + parsed.landmarks.section;
  const aOrSScore = aOrS > 0 ? 3 : 0;
  f.push(
    make(
      "sem-article",
      "semantic",
      "<article> or <section> elements",
      clampSev(aOrSScore, 3),
      aOrSScore,
      3,
      `<article>: ${parsed.landmarks.article}, <section>: ${parsed.landmarks.section}`,
      aOrSScore === 0
        ? "Use <article> for self-contained content and <section> for thematic groupings."
        : undefined,
    ),
  );

  const totalImg = parsed.images.total;
  const withAlt = parsed.images.withAlt;
  const coverage = totalImg === 0 ? 1 : withAlt / totalImg;
  const altScore = coverage >= 0.9 ? 2 : coverage >= 0.5 ? 1 : 0;
  f.push(
    make(
      "sem-alt",
      "semantic",
      "Image alt text coverage",
      clampSev(altScore, 2),
      altScore,
      2,
      totalImg === 0
        ? "No images on page"
        : `${withAlt}/${totalImg} images have alt text (${Math.round(coverage * 100)}%)`,
      altScore < 2 && totalImg > 0
        ? "Every meaningful image needs an alt attribute. Decorative images: alt=\"\"."
        : undefined,
    ),
  );

  return f;
}

// ─────────────────────────── Meta & Social (15) ────────────────────────────
export function checkMeta({ parsed }: CheckCtx): Finding[] {
  const f: Finding[] = [];

  const t = parsed.title || "";
  const tLen = t.length;
  const titleScore = tLen >= 30 && tLen <= 60 ? 3 : tLen > 0 ? 1 : 0;
  f.push(
    make(
      "meta-title",
      "meta",
      "<title> 30–60 characters",
      clampSev(titleScore, 3),
      titleScore,
      3,
      tLen === 0 ? "No <title>" : `${tLen} chars: "${t.slice(0, 80)}"`,
      titleScore < 3 ? "Aim for 30–60 chars: long enough to be descriptive, short enough not to be truncated." : undefined,
    ),
  );

  const d = parsed.description || "";
  const dLen = d.length;
  const descScore = dLen >= 70 && dLen <= 160 ? 3 : dLen > 0 ? 1 : 0;
  f.push(
    make(
      "meta-desc",
      "meta",
      "<meta description> 70–160 characters",
      clampSev(descScore, 3),
      descScore,
      3,
      dLen === 0 ? "No description meta tag" : `${dLen} chars`,
      descScore < 3 ? "Write a 70–160 char description that summarizes the page's primary value." : undefined,
    ),
  );

  const canon = parsed.canonical;
  const canonScore = canon ? 3 : 0;
  f.push(
    make(
      "meta-canonical",
      "meta",
      "Canonical URL set",
      clampSev(canonScore, 3),
      canonScore,
      3,
      canon ? `<link rel="canonical" href="${canon}">` : "No canonical tag",
      canonScore === 0
        ? "Add <link rel=\"canonical\"> to disambiguate duplicate URLs."
        : undefined,
    ),
  );

  const og = parsed.ogImage;
  const ogScore = og ? 3 : 0;
  f.push(
    make(
      "meta-og",
      "meta",
      "Open Graph image",
      clampSev(ogScore, 3),
      ogScore,
      3,
      og ? `og:image: ${og.slice(0, 120)}` : "No og:image",
      ogScore === 0
        ? "Add og:image (1200x630). Use Next.js opengraph-image.tsx convention for per-route OG."
        : undefined,
    ),
  );

  const tw = parsed.twitterCard;
  const twScore = tw ? 3 : 0;
  f.push(
    make(
      "meta-twitter",
      "meta",
      "Twitter card meta",
      clampSev(twScore, 3),
      twScore,
      3,
      tw ? `twitter:card: ${tw}` : "No twitter:card meta",
      twScore === 0
        ? "Add twitter:card=summary_large_image plus twitter:title / twitter:image."
        : undefined,
    ),
  );

  return f;
}

// ─────────────────────── Crawlability (15) ───────────────────────────
const AI_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "anthropic-ai",
  "OAI-SearchBot",
];

export function checkCrawlability(
  ctx: CheckCtx,
  ext: ExternalFiles,
): Finding[] {
  const f: Finding[] = [];

  const robots = ext.robotsTxt;
  const robotsScore = robots ? 4 : 0;
  f.push(
    make(
      "crawl-robots",
      "crawlability",
      "robots.txt present",
      clampSev(robotsScore, 4),
      robotsScore,
      4,
      robots
        ? `GET /robots.txt → ${robots.status}, ${robots.body.length} bytes`
        : "GET /robots.txt → 404",
      robotsScore === 0
        ? "Ship a robots.txt. In Next.js use app/robots.ts with the MetadataRoute.Robots helper."
        : undefined,
    ),
  );

  const sitemap = ext.sitemapXml;
  const sitemapScore = sitemap ? 4 : 0;
  f.push(
    make(
      "crawl-sitemap",
      "crawlability",
      "sitemap.xml present",
      clampSev(sitemapScore, 4),
      sitemapScore,
      4,
      sitemap
        ? `GET /sitemap.xml → ${sitemap.status}, ${sitemap.body.length} bytes`
        : "GET /sitemap.xml → 404",
      sitemapScore === 0
        ? "Generate a sitemap. In Next.js use app/sitemap.ts."
        : undefined,
    ),
  );

  let aiBotsFound = 0;
  if (robots) {
    for (const bot of AI_BOTS) {
      const re = new RegExp(`User-agent:\\s*${bot}`, "i");
      if (re.test(robots.body)) aiBotsFound++;
    }
  }
  const aiScore = aiBotsFound >= 3 ? 4 : aiBotsFound >= 1 ? 2 : 0;
  f.push(
    make(
      "crawl-ai-bots",
      "crawlability",
      "AI crawler rules (GPTBot / ClaudeBot / PerplexityBot)",
      clampSev(aiScore, 4),
      aiScore,
      4,
      `${aiBotsFound} AI bot(s) referenced in robots.txt`,
      aiScore < 4
        ? "Add explicit rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended in robots.txt. Even if you allow all, naming them signals intent and prevents future surprises."
        : undefined,
    ),
  );

  const lang = ctx.parsed.lang;
  const langScore = lang ? 3 : 0;
  f.push(
    make(
      "crawl-lang",
      "crawlability",
      "<html lang> attribute set",
      clampSev(langScore, 3),
      langScore,
      3,
      lang ? `lang="${lang}"` : "No lang attribute on <html>",
      langScore === 0
        ? "Add lang=\"en\" (or your primary language) to the <html> element."
        : undefined,
    ),
  );

  return f;
}

// ─────────────────────── E-E-A-T signals (15) ────────────────────────
export function checkEEAT({ parsed }: CheckCtx): Finding[] {
  const f: Finding[] = [];

  const blocks = parsed.jsonLd
    .filter((n) => !n.parseError)
    .flatMap((n) => flatten(n.data));
  const hasPersonSchema = blocks.some((b) =>
    typesOf(b).some((t) => /Person/.test(t)),
  );

  const authorScore =
    hasPersonSchema && parsed.hasByline
      ? 5
      : hasPersonSchema || parsed.hasByline
        ? 3
        : 0;
  f.push(
    make(
      "eeat-author",
      "eeat",
      "Author identity (Person schema or visible byline)",
      clampSev(authorScore, 5),
      authorScore,
      5,
      `Person schema: ${hasPersonSchema ? "yes" : "no"}, visible byline: ${parsed.hasByline ? "yes" : "no"}`,
      authorScore < 5
        ? "Add a Person JSON-LD with sameAs to LinkedIn/GitHub. Show a byline on content pages."
        : undefined,
    ),
  );

  const dateScore =
    parsed.hasTimeTag && parsed.hasDateHint
      ? 3
      : parsed.hasTimeTag || parsed.hasDateHint
        ? 2
        : 0;
  f.push(
    make(
      "eeat-date",
      "eeat",
      "Freshness signals (last updated / <time>)",
      clampSev(dateScore, 3),
      dateScore,
      3,
      `<time> tag: ${parsed.hasTimeTag ? "yes" : "no"}, date hint in text: ${parsed.hasDateHint ? "yes" : "no"}`,
      dateScore < 3
        ? "Show a visible \"Updated YYYY-MM-DD\" with a <time datetime> tag on every content page."
        : undefined,
    ),
  );

  // contact / about
  const txt = parsed.bodyText.toLowerCase();
  const internalLinks = parsed.links.internal > 0;
  const hasAbout = /\babout\b/.test(txt);
  const hasContact = /\bcontact\b|\bemail\b|\bget\s+in\s+touch\b/.test(txt);
  const contactScore =
    hasAbout && hasContact ? 3 : hasAbout || hasContact ? 2 : 0;
  f.push(
    make(
      "eeat-contact",
      "eeat",
      "Visible About + Contact",
      clampSev(contactScore, 3),
      contactScore,
      3,
      `About: ${hasAbout ? "yes" : "no"}, Contact: ${hasContact ? "yes" : "no"}, internal links: ${parsed.links.internal}`,
      contactScore < 3
        ? "Link About and Contact pages from the global nav or footer. LLMs use these to verify entity legitimacy."
        : undefined,
    ),
  );

  // outbound to authority
  const authority = parsed.links.externalUrls.filter((u) =>
    /(wikipedia\.org|github\.com|wikidata\.org|crunchbase\.com|linkedin\.com|nytimes\.com|bbc\.|reuters\.|nature\.com|ieee\.|arxiv\.org|gov$|\.gov\/|edu$|\.edu\/)/i.test(
      u,
    ),
  ).length;
  const authScore = authority >= 2 ? 2 : authority >= 1 ? 1 : 0;
  f.push(
    make(
      "eeat-authority",
      "eeat",
      "Outbound links to authoritative sources",
      clampSev(authScore, 2),
      authScore,
      2,
      `${authority} authoritative outbound link(s)`,
      authScore < 2
        ? "Cite at least one authoritative source per content page (Wikipedia, official docs, .gov, .edu, primary research)."
        : undefined,
    ),
  );

  // organization sameAs reuse
  const orgBlock = blocks.find((b) =>
    typesOf(b).some((t) => /Organization|Person/.test(t)),
  );
  const sameAs = orgBlock?.["sameAs"];
  const sameAsCount = Array.isArray(sameAs) ? sameAs.length : sameAs ? 1 : 0;
  const sameAsScore = sameAsCount >= 3 ? 2 : sameAsCount >= 1 ? 1 : 0;
  f.push(
    make(
      "eeat-sameas",
      "eeat",
      "Identity sameAs network (LinkedIn, GitHub, Wikidata)",
      clampSev(sameAsScore, 2),
      sameAsScore,
      2,
      `${sameAsCount} sameAs link(s) on identity entity`,
      sameAsScore < 2
        ? "Link Organization/Person to LinkedIn, GitHub, Wikidata, and Crunchbase via sameAs[]. This is what builds entity authority in LLM knowledge graphs."
        : undefined,
    ),
  );

  // ensure max is 15
  void internalLinks;
  return f;
}
