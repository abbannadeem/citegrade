import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    image: text("image"),
    passwordHash: text("password_hash"),
    plan: text("plan", { enum: ["free", "pro", "agency"] })
      .notNull()
      .default("free"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    planRenewsAt: text("plan_renews_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    stripeCustomerIdx: index("users_stripe_customer_idx").on(
      t.stripeCustomerId,
    ),
  }),
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(), // session token
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at").notNull(), // epoch ms
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
  }),
);

export const magicLinks = sqliteTable(
  "magic_links",
  {
    token: text("token").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    claimReportId: text("claim_report_id"),
    expiresAt: integer("expires_at").notNull(),
    usedAt: text("used_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    emailIdx: index("magic_links_email_idx").on(t.email),
  }),
);

export const sites = sqliteTable(
  "sites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    host: text("host").notNull(),
    url: text("url").notNull(),
    label: text("label"),
    monitorEnabled: integer("monitor_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    lastAuditAt: text("last_audit_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userHostIdx: uniqueIndex("sites_user_host_idx").on(t.userId, t.host),
    userIdx: index("sites_user_idx").on(t.userId),
  }),
);

export const audits = sqliteTable(
  "audits",
  {
    id: text("id").primaryKey(),
    siteId: text("site_id").references(() => sites.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    host: text("host").notNull(),
    url: text("url").notNull(),
    finalUrl: text("final_url").notNull(),
    score: integer("score").notNull(),
    grade: text("grade").notNull(),
    verdict: text("verdict").notNull(),
    statusCode: integer("status_code").notNull(),
    contentLength: integer("content_length").notNull(),
    durationMs: integer("duration_ms").notNull(),
    title: text("title"),
    description: text("description"),
    payload: text("payload").notNull(), // full AuditReport JSON
    fetchedAt: text("fetched_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    hostIdx: index("audits_host_idx").on(t.host),
    userIdx: index("audits_user_idx").on(t.userId),
    siteIdx: index("audits_site_idx").on(t.siteId),
    fetchedIdx: index("audits_fetched_idx").on(t.fetchedAt),
  }),
);

export const apiKeys = sqliteTable(
  "api_keys",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    keyHash: text("key_hash").notNull(),
    prefix: text("prefix").notNull(),
    name: text("name"),
    lastUsedAt: text("last_used_at"),
    revokedAt: text("revoked_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userIdx: index("api_keys_user_idx").on(t.userId),
    keyHashIdx: uniqueIndex("api_keys_hash_idx").on(t.keyHash),
  }),
);

export const usageEvents = sqliteTable(
  "usage_events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    ip: text("ip"),
    type: text("type").notNull(), // "audit" | "api_audit"
    createdAt: integer("created_at").notNull(), // epoch ms
  },
  (t) => ({
    userIdx: index("usage_events_user_idx").on(t.userId),
    ipIdx: index("usage_events_ip_idx").on(t.ip),
    createdIdx: index("usage_events_created_idx").on(t.createdAt),
  }),
);

export type DbUser = typeof users.$inferSelect;
export type NewDbUser = typeof users.$inferInsert;
export type DbSession = typeof sessions.$inferSelect;
export type DbSite = typeof sites.$inferSelect;
export type NewDbSite = typeof sites.$inferInsert;
export type DbAudit = typeof audits.$inferSelect;
export type NewDbAudit = typeof audits.$inferInsert;
export type DbApiKey = typeof apiKeys.$inferSelect;
