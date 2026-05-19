import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "citegrade.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function init() {
  const sqlite = new Database(DB_FILE);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      image TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);

    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      label TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS sites_user_url_idx ON sites(user_id, url);
    CREATE INDEX IF NOT EXISTS sites_user_idx ON sites(user_id);

    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
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
      fetched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS audits_url_idx ON audits(url);
    CREATE INDEX IF NOT EXISTS audits_user_idx ON audits(user_id);
    CREATE INDEX IF NOT EXISTS audits_site_idx ON audits(site_id);
    CREATE INDEX IF NOT EXISTS audits_fetched_idx ON audits(fetched_at);
  `);
  return drizzle(sqlite, { schema });
}

export function getDb() {
  if (!_db) _db = init();
  return _db;
}

export { schema };
