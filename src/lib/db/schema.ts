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
    plan: text("plan", { enum: ["free", "pro"] }).notNull().default("free"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  }),
);

export const sites = sqliteTable(
  "sites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    label: text("label"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userUrlIdx: uniqueIndex("sites_user_url_idx").on(t.userId, t.url),
    userIdx: index("sites_user_idx").on(t.userId),
  }),
);

export const audits = sqliteTable(
  "audits",
  {
    id: text("id").primaryKey(),
    siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
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
    payload: text("payload").notNull(),
    fetchedAt: text("fetched_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    urlIdx: index("audits_url_idx").on(t.url),
    userIdx: index("audits_user_idx").on(t.userId),
    siteIdx: index("audits_site_idx").on(t.siteId),
    fetchedIdx: index("audits_fetched_idx").on(t.fetchedAt),
  }),
);

export type DbUser = typeof users.$inferSelect;
export type NewDbUser = typeof users.$inferInsert;
export type DbSite = typeof sites.$inferSelect;
export type NewDbSite = typeof sites.$inferInsert;
export type DbAudit = typeof audits.$inferSelect;
export type NewDbAudit = typeof audits.$inferInsert;
