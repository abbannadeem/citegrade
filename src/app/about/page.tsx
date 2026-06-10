import Image from "next/image";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { Eyebrow } from "@/components/eyebrow";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "About",
  description: `${SITE.name} is built by ${SITE.authorName}, alone, in public.`,
};

const FOUNDER_IMG =
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=900&q=80&auto=format&fit=crop";

export default async function AboutPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl font-medium tracking-[-0.03em]">
            One builder, in public.
          </h1>

          <div className="mt-12 grid sm:grid-cols-[200px_1fr] gap-8 items-start">
            <div className="relative rounded-2xl overflow-hidden border border-line shadow-card aspect-square">
              <Image
                src={FOUNDER_IMG}
                alt="Abban's workspace"
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-multiply" />
            </div>
            <div className="text-fg leading-relaxed">
              <p className="text-lg">
                I&apos;m Abban Nadeem. I build Citegrade alone, between client
                projects.
              </p>
              <p className="mt-4 text-muted">
                My day job is shipping Next.js apps on Cloudflare and helping
                companies stop being invisible to AI search — Citegrade is that
                work, productized. The methodology is open at{" "}
                <Link href="/docs" className="text-primary hover:underline">
                  /docs
                </Link>
                . The code is on{" "}
                <a
                  href="https://github.com/abbannadeem/citegrade"
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                .
              </p>
              <p className="mt-4 text-muted">
                No team. No roadmap theater. No &quot;AI-powered&quot;
                anything. Just one developer trying to make AI visibility
                measurable. If a check feels wrong, the math is auditable, and
                my inbox is the support channel.
              </p>
            </div>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            <Card
              eyebrow="Why I built this"
              body="Every client kept asking the same question: 'why doesn't ChatGPT mention us?' There was no honest tool to answer it. So I built one."
            />
            <Card
              eyebrow="What's next"
              body="Live citation testing against Perplexity. Multi-page deep crawl. An AI assistant that explains each fix in plain English."
            />
            <Card
              eyebrow="How to reach me"
              body="Email: support@citegrade.dev. Or just open a GitHub issue. I read every one."
            />
          </div>

          <div className="mt-16 pt-10 border-t border-line">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a
                href={SITE.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-fg inline-flex items-center gap-1"
              >
                Upwork <ArrowUpRight className="w-3 h-3" />
              </a>
              <span className="text-line">·</span>
              <a
                href="https://github.com/abbannadeem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-fg inline-flex items-center gap-1"
              >
                GitHub <ArrowUpRight className="w-3 h-3" />
              </a>
              <span className="text-line">·</span>
              <a
                href="https://www.linkedin.com/in/abban"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-fg inline-flex items-center gap-1"
              >
                LinkedIn <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}

function Card({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-card p-5">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
