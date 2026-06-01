import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

// libSQL works as a local file in dev and a Turso cloud URL in production.
// Set DATABASE_URL + DATABASE_AUTH_TOKEN for Turso; otherwise we fall back
// to a local SQLite file under .data/.
function resolveUrl(): { url: string; authToken?: string } {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  if (url) return { url, authToken };
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return { url: `file:${path.join(dir, "citegrade.db")}` };
}

let _client: Client | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _migrated = false;

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    image TEXT,
    password_hash TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_renews_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email)`,
  `CREATE INDEX IF NOT EXISTS users_stripe_customer_idx ON users(stripe_customer_id)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id)`,
  `CREATE TABLE IF NOT EXISTS magic_links (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    claim_report_id TEXT,
    expires_at INTEGER NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS magic_links_email_idx ON magic_links(email)`,
  `CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    host TEXT NOT NULL,
    url TEXT NOT NULL,
    label TEXT,
    monitor_enabled INTEGER NOT NULL DEFAULT 0,
    last_audit_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sites_user_host_idx ON sites(user_id, host)`,
  `CREATE INDEX IF NOT EXISTS sites_user_idx ON sites(user_id)`,
  `CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    host TEXT NOT NULL,
    url TEXT NOT NULL,
    final_url TEXT NOT NULL,
    score INTEGER NOT NULL,
    grade TEXT NOT NULL,
    verdict TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    content_length INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    payload TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS audits_host_idx ON audits(host)`,
  `CREATE INDEX IF NOT EXISTS audits_user_idx ON audits(user_id)`,
  `CREATE INDEX IF NOT EXISTS audits_site_idx ON audits(site_id)`,
  `CREATE INDEX IF NOT EXISTS audits_fetched_idx ON audits(fetched_at)`,
  `CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL,
    prefix TEXT NOT NULL,
    name TEXT,
    last_used_at TEXT,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS api_keys_user_idx ON api_keys(user_id)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS api_keys_hash_idx ON api_keys(key_hash)`,
  `CREATE TABLE IF NOT EXISTS usage_events (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    ip TEXT,
    type TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS usage_events_user_idx ON usage_events(user_id)`,
  `CREATE INDEX IF NOT EXISTS usage_events_ip_idx ON usage_events(ip)`,
  `CREATE INDEX IF NOT EXISTS usage_events_created_idx ON usage_events(created_at)`,
  `CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS teams_owner_idx ON teams(owner_id)`,
  `CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    status TEXT NOT NULL DEFAULT 'invited',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS team_members_team_idx ON team_members(team_id)`,
  `CREATE INDEX IF NOT EXISTS team_members_email_idx ON team_members(email)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    message TEXT,
    report_id TEXT,
    site_host TEXT,
    current_score INTEGER,
    potential_score INTEGER,
    intent TEXT NOT NULL DEFAULT 'quote',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at)`,
  `CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status)`,
];

// ALTER statements that may fail if the column already exists — run tolerantly.
const ALTERS = [
  `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`,
];

async function migrate(client: Client) {
  for (const stmt of MIGRATIONS) {
    await client.execute(stmt);
  }
  for (const stmt of ALTERS) {
    try {
      await client.execute(stmt);
    } catch {
      // column already exists — ignore
    }
  }
}

export function getClient(): Client {
  if (!_client) {
    const { url, authToken } = resolveUrl();
    _client = createClient({ url, authToken });
  }
  return _client;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}

/** Ensure schema exists. Safe to call repeatedly; runs once per process. */
export async function ensureSchema() {
  if (_migrated) return;
  await migrate(getClient());
  _migrated = true;
}

export { schema };
