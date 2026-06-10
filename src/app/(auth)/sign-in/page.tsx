import Link from "next/link";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { SocialButtons } from "@/components/social-buttons";
import { AuthSplit } from "@/components/auth-split";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; claim?: string }>;
}) {
  const { next, claim } = await searchParams;
  if (await getCurrentUser()) redirect(next || "/dashboard");
  return (
    <AuthSplit side="left">
      <Link
        href="/"
        className="lg:hidden flex items-center gap-2 mb-10 justify-center"
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary-fg" />
        </div>
        <span className="text-base font-semibold tracking-tight">Citegrade</span>
      </Link>
      <h1 className="text-3xl font-medium tracking-[-0.02em] text-fg">
        Welcome back.
      </h1>
      <p className="mt-2 mb-8 text-sm text-muted">
        Sign in to track your sites and re-audits.
      </p>
      <SocialButtons />
      <AuthForm mode="sign-in" next={next} claim={claim} />
    </AuthSplit>
  );
}
