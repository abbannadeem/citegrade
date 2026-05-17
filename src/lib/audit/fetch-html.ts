const UA =
  "CitegradeBot/1.0 (+https://citegrade.dev/bot) AI-SEO-Audit-Tool";

const MAX_BYTES = 2_000_000;
const TIMEOUT_MS = 12_000;

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

export class FetchError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export interface FetchResult {
  url: string;
  finalUrl: string;
  status: number;
  body: string;
  contentLength: number;
  redirected: boolean;
}

function isPrivateHost(hostname: string): boolean {
  return BLOCKED_HOST_PATTERNS.some((p) => p.test(hostname));
}

export function normalizeInputUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new FetchError("URL is empty");
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new FetchError("Not a valid URL");
  }
  if (!/^https?:$/i.test(url.protocol)) {
    throw new FetchError("Only http and https URLs are supported");
  }
  if (isPrivateHost(url.hostname) && process.env.CITEGRADE_ALLOW_PRIVATE !== "1") {
    throw new FetchError("Private / loopback hosts are not allowed");
  }
  return url;
}

export async function fetchHtml(rawUrl: string): Promise<FetchResult> {
  const url = normalizeInputUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    const reader = res.body?.getReader();
    if (!reader) {
      throw new FetchError("No response body", res.status);
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        try {
          await reader.cancel();
        } catch {}
        break;
      }
      chunks.push(value);
    }
    const buf = new Uint8Array(total > MAX_BYTES ? MAX_BYTES : total);
    let offset = 0;
    for (const c of chunks) {
      const room = buf.length - offset;
      if (room <= 0) break;
      const slice = c.byteLength > room ? c.subarray(0, room) : c;
      buf.set(slice, offset);
      offset += slice.byteLength;
    }
    const body = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    return {
      url: url.toString(),
      finalUrl: res.url || url.toString(),
      status: res.status,
      body,
      contentLength: total,
      redirected: res.redirected,
    };
  } catch (err) {
    if (err instanceof FetchError) throw err;
    const msg = err instanceof Error ? err.message : "Fetch failed";
    if (msg.includes("aborted") || msg.includes("AbortError")) {
      throw new FetchError(`Request timed out after ${TIMEOUT_MS / 1000}s`);
    }
    throw new FetchError(msg);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchText(
  url: string,
  timeoutMs = 8_000,
): Promise<{ status: number; body: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: controller.signal,
    });
    const body = await res.text();
    return { status: res.status, body: body.slice(0, 500_000) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
