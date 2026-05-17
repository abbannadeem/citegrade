import * as cheerio from "cheerio";

export type Parsed = ReturnType<typeof parseHtml>;

interface JsonLdNode {
  raw: string;
  data: unknown;
  parseError?: string;
}

export function parseHtml(html: string) {
  const $ = cheerio.load(html);

  const title = $("head > title").first().text().trim() || null;
  const description =
    $('head > meta[name="description"]').attr("content")?.trim() || null;
  const canonical =
    $('head > link[rel="canonical"]').attr("href")?.trim() || null;
  const ogImage =
    $('head > meta[property="og:image"]').attr("content")?.trim() || null;
  const ogTitle =
    $('head > meta[property="og:title"]').attr("content")?.trim() || null;
  const ogDescription =
    $('head > meta[property="og:description"]').attr("content")?.trim() ||
    null;
  const twitterCard =
    $('head > meta[name="twitter:card"]').attr("content")?.trim() || null;
  const lang = $("html").attr("lang")?.trim() || null;
  const robotsMeta =
    $('head > meta[name="robots"]').attr("content")?.trim() || null;

  const headings = {
    h1: $("h1").map((_, el) => $(el).text().trim()).get(),
    h2: $("h2").map((_, el) => $(el).text().trim()).get(),
    h3: $("h3").map((_, el) => $(el).text().trim()).get(),
    h4: $("h4").map((_, el) => $(el).text().trim()).get(),
    h5: $("h5").map((_, el) => $(el).text().trim()).get(),
    h6: $("h6").map((_, el) => $(el).text().trim()).get(),
  };
  const headingOrder: number[] = [];
  $("h1,h2,h3,h4,h5,h6").each((_, el) => {
    const tag =
      "name" in el && typeof el.name === "string" ? el.name.toLowerCase() : "";
    const n = parseInt(tag.slice(1), 10);
    if (!isNaN(n)) headingOrder.push(n);
  });

  const main = $("main").length;
  const article = $("article").length;
  const section = $("section").length;
  const nav = $("nav").length;
  const header = $("header").length;
  const footer = $("footer").length;
  const aside = $("aside").length;

  const images = $("img");
  const imageTotal = images.length;
  const imagesWithAlt = images.filter(
    (_, el) => ($(el).attr("alt") ?? "").trim().length > 0,
  ).length;

  const jsonLdNodes: JsonLdNode[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    try {
      const data = JSON.parse(raw);
      jsonLdNodes.push({ raw, data });
    } catch (e) {
      jsonLdNodes.push({
        raw,
        data: null,
        parseError: e instanceof Error ? e.message : "parse failed",
      });
    }
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("javascript:"))
      return;
    if (/^https?:\/\//i.test(href)) externalLinks.add(href);
    else internalLinks.add(href);
  });

  const bylineHints = [
    /\bby\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/,
    /author[: ]+[A-Z][a-z]+/i,
    /written\s+by/i,
  ];
  const hasByline = bylineHints.some((p) => p.test(bodyText.slice(0, 5000)));

  const datePatterns = [
    /\bupdated\b[^.]{0,40}\b(20\d{2})\b/i,
    /\bpublished\b[^.]{0,40}\b(20\d{2})\b/i,
    /\blast\s+modified\b/i,
  ];
  const hasDateHint = datePatterns.some((p) => p.test(bodyText.slice(0, 8000)));
  const hasTimeTag = $("time").length > 0;

  return {
    title,
    description,
    canonical,
    ogImage,
    ogTitle,
    ogDescription,
    twitterCard,
    lang,
    robotsMeta,
    headings,
    headingOrder,
    landmarks: { main, article, section, nav, header, footer, aside },
    images: { total: imageTotal, withAlt: imagesWithAlt },
    jsonLd: jsonLdNodes,
    bodyText,
    wordCount,
    links: {
      internal: internalLinks.size,
      external: externalLinks.size,
      externalUrls: [...externalLinks].slice(0, 50),
    },
    hasByline,
    hasDateHint,
    hasTimeTag,
  };
}
