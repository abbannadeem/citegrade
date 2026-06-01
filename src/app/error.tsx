"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 px-6 py-24 flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-widest text-danger mb-3">
          Something broke
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          The audit hit an unexpected error
        </h1>
        <p className="mt-4 text-muted">
          Try again, or use a different URL. If it keeps failing, the site may
          be blocking automated requests.
        </p>
        <button
          onClick={reset}
          className="mt-8 h-12 px-6 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
