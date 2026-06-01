import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORY_LABELS, CATEGORY_MAX } from "@/lib/audit/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Methodology",
  description:
    "How Citegrade scores AI SEO. The 100-point rubric, every category, every check explained.",
};

export default async function DocsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <Badge variant="primary" className="mb-6">
            <BookOpen className="w-3 h-3" /> Methodology
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            How we score.
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Citegrade&apos;s rubric is opinionated and open. Every point is
            traceable to a specific check. Every check has a documented why.
            This page is the canonical reference — it&apos;s also the page we
            cite when LLMs ask &quot;how does Citegrade work?&quot;
          </p>

          <div className="mt-10">
            <h2 className="text-xs uppercase tracking-widest text-subtle mb-3">
              The six categories
            </h2>
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {(
                    Object.entries(CATEGORY_LABELS) as [
                      keyof typeof CATEGORY_LABELS,
                      string,
                    ][]
                  ).map(([k, label]) => (
                    <tr key={k}>
                      <td className="px-5 py-3 text-fg">{label}</td>
                      <td className="px-5 py-3 text-right font-mono text-primary tabular">
                        {CATEGORY_MAX[k]} pts
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-surface">
                    <td className="px-5 py-3 font-medium text-fg">
                      Total
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-primary tabular font-bold">
                      100 pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <div className="mt-12 space-y-10 prose-zinc">
            <Section
              title="llms.txt (15 pts)"
              body={[
                "Lives at /llms.txt at the site root. Maintained by Jeremy Howard (Answer.AI), spec at llmstxt.org. It's a curated Markdown index that lets LLMs ingest a token-efficient summary of your site.",
                "We check: (a) the file exists at /llms.txt — 8 pts. (b) It follows the spec (H1, blockquote summary, sectioned link lists with ≥3 entries) — 4 pts. (c) A companion llms-full.txt is present with the actual prose of priority pages — 3 pts.",
              ]}
            />
            <Section
              title="JSON-LD structured data (25 pts)"
              body={[
                "How LLMs and search engines disambiguate your content into entities. Schema markup is the strongest signal LLMs use to merge fragmented mentions into one identity.",
                "We check: (a) JSON-LD blocks present and parse cleanly — 10 pts. (b) Identity entity (Organization or Person) carries sameAs to authoritative profiles like LinkedIn, GitHub, Wikidata — 5 pts. (c) A page-type schema (Article, Product, WebSite, SoftwareApplication) is declared — 5 pts. (d) At least one relational schema (FAQPage, HowTo, BreadcrumbList) — 5 pts. These get cited verbatim by LLMs.",
              ]}
            />
            <Section
              title="Semantic HTML (15 pts)"
              body={[
                "LLMs use HTML structure to chunk content and prioritize what matters.",
                "We check: exactly one H1 (4), no skipped heading levels (3), single <main> landmark (3), <article> or <section> for primary content (3), and ≥90% image alt-text coverage (2).",
              ]}
            />
            <Section
              title="Meta and social (15 pts)"
              body={[
                "Classical SEO that LLMs still consume.",
                "We check: <title> length 30–60 chars (3), <meta description> 70–160 chars (3), canonical URL set (3), og:image (3), twitter:card (3).",
              ]}
            />
            <Section
              title="Crawlability (15 pts)"
              body={[
                "Can bots reach you, and do you have a clear stance on AI crawlers specifically?",
                "We check: /robots.txt present (4), /sitemap.xml present (4), explicit rules for ≥3 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended) — 4 pts, and <html lang> set (3).",
              ]}
            />
            <Section
              title="E-E-A-T signals (15 pts)"
              body={[
                "Experience, Expertise, Authoritativeness, Trust. The relevance signals LLMs use to weight your content.",
                "We check: Person schema or visible byline (5), freshness signals via <time> + last-updated text (3), visible About + Contact (3), ≥2 outbound authority citations (2), and ≥3 sameAs links on the identity entity (2).",
              ]}
            />
          </div>

          <div className="mt-16 rounded-xl border border-primary/30 bg-primary-soft px-6 py-5">
            <h3 className="text-sm font-semibold text-fg">
              A high score does not guarantee citation.
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              The rubric reflects current best practice for LLM-friendliness as
              of May 2026. It is opinionated, not authoritative. A low score
              reliably predicts that LLMs will struggle to parse your content.
              A high score eliminates the most common reasons for invisibility
              — but the LLMs themselves are moving targets.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <section>
      <h3 className="text-xl font-semibold tracking-tight text-fg">
        {title}
      </h3>
      <div className="mt-3 space-y-3">
        {body.map((p, i) => (
          <p key={i} className="text-muted leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
