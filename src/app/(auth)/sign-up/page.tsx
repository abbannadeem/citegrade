import Link from "next/link";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { SocialButtons } from "@/components/social-buttons";
import { AuthSplit } from "@/components/auth-split";

export const metadata = { title: "Sign up" };
export const dynamic = "force-dynamic";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; claim?: string }>;
}) {
  const { next, claim } = await searchParams;
  if (await getCurrentUser()) redirect(next || "/dashboard");
  return (
    <AuthSplit side="right">
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
        Create your account.
      </h1>
      <p className="mt-2 mb-8 text-sm text-muted">
        One site free, forever. Re-audit anytime. Cancel anytime.
      </p>
      <SocialButtons />
      <AuthForm mode="sign-up" next={next} claim={claim} />
      <p className="mt-6 text-[11px] text-subtle text-center">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline">
          privacy policy
        </Link>
        .
      </p>
    </AuthSplit>
  );
}
