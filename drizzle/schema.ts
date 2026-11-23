import { pgTable, text, timestamp, integer, boolean, jsonb, date, uuid } from "drizzle-orm/pg-core";

export const visitors = pgTable("visitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  visitorHash: text("visitor_hash").notNull().unique(),
  firstSeen: timestamp("first_seen").defaultNow().notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  orgName: text("org_name"),
  orgType: text("org_type", { enum: ["corporate", "residential", "datacenter", "unknown"] }).default("unknown").notNull(),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
});

export const shareLinks = pgTable("share_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  archived: boolean("archived").default(false).notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  visitorId: uuid("visitor_id").references(() => visitors.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  entryPath: text("entry_path").notNull(),
  exitPath: text("exit_path"),
  referrerHost: text("referrer_host"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  shareLinkId: uuid("share_link_id").references(() => shareLinks.id, { onDelete: "set null" }),
  isBot: boolean("is_bot").default(false).notNull(),
});

export const pageviews = pgTable("pageviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  ts: timestamp("ts").defaultNow().notNull(),
  durationMs: integer("duration_ms").default(0).notNull(),
  scrollPct: integer("scroll_pct").default(0).notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  props: jsonb("props"),
  ts: timestamp("ts").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  severity: text("severity", { enum: ["low", "normal", "high", "urgent"] }).default("normal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status", { enum: ["new", "replied", "archived"] }).default("new").notNull(),
});

export const guestbook = pgTable("guestbook", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubLogin: text("github_login").notNull(),
  displayName: text("display_name").notNull(),
  message: text("message").notNull(),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyRollups = pgTable("daily_rollups", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull(),
  path: text("path").notNull(),
  views: integer("views").default(0).notNull(),
  uniques: integer("uniques").default(0).notNull(),
  avgDurationMs: integer("avg_duration_ms").default(0).notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userHandle: text("user_handle").notNull(),
  action: text("action").notNull(),
  location: text("location"),
  ipTruncated: text("ip_truncated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
