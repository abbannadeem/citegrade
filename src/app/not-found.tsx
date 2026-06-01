import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-6 py-24 flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-widest text-subtle mb-3">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Report not found
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          Reports expire after 90 days, or the link may be malformed. Run a
          fresh audit on the homepage.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block h-12 px-6 rounded-lg bg-emerald-500 text-white font-semibold tracking-tight hover:bg-emerald-400 transition-colors leading-[3rem]"
        >
          New audit
        </Link>
      </div>
    </main>
  );
}
