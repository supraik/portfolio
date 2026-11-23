import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

const databaseUrl = process.env.DATABASE_URL;

let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (databaseUrl && !databaseUrl.includes("localhost:5432/portfolio")) {
  try {
    client = postgres(databaseUrl, { max: 10, idle_timeout: 20 });
    dbInstance = drizzle(client, { schema });
  } catch (err) {
    console.warn("[DB_INIT] Postgres connection failed, using in-memory store", err);
  }
}

// In-Memory Storage Engine for development, testing, and offline modes
export interface StoredVisitor {
  id: string;
  visitorHash: string;
  firstSeen: Date;
  lastSeen: Date;
  country: string;
  region: string;
  city: string;
  orgName: string;
  orgType: "corporate" | "residential" | "datacenter" | "unknown";
  device: string;
  browser: string;
  os: string;
}

export interface StoredSession {
  id: string;
  visitorId: string;
  startedAt: Date;
  endedAt?: Date;
  entryPath: string;
  exitPath?: string;
  referrerHost?: string;
  shareLinkId?: string;
  isBot: boolean;
  pagesCount: number;
  durationMs: number;
  downloadedResume: boolean;
  sentMessage: boolean;
}

export interface StoredShareLink {
  id: string;
  slug: string;
  label: string;
  company: string;
  role: string;
  notes: string;
  createdAt: Date;
  archived: boolean;
  opens: number;
  uniqueVisitors: number;
  lastOpenedAt?: Date;
}

export interface StoredMessage {
  id: string;
  sessionId?: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  severity: "low" | "normal" | "high" | "urgent";
  createdAt: Date;
  status: "new" | "replied" | "archived";
}

export interface StoredGuestbook {
  id: string;
  githubLogin: string;
  displayName: string;
  message: string;
  approved: boolean;
  createdAt: Date;
}

export interface StoredAuditLog {
  id: string;
  userHandle: string;
  action: string;
  location?: string;
  ipTruncated?: string;
  createdAt: Date;
}

class InMemoryDb {
  visitors = new Map<string, StoredVisitor>();
  sessions = new Map<string, StoredSession>();
  shareLinks = new Map<string, StoredShareLink>();
  messages = new Map<string, StoredMessage>();
  guestbook = new Map<string, StoredGuestbook>();
  auditLogs: StoredAuditLog[] = [];

  constructor() {
    // Seed initial tracked share links for demonstration
    this.createShareLink({
      slug: "acme-staff",
      label: "Acme Infrastructure Staff Role",
      company: "Acme Corp",
      role: "Staff Systems Engineer",
      notes: "Application sent via referral link",
    });

    this.createShareLink({
      slug: "google-infra",
      label: "Google SRE / Cloud Systems",
      company: "Google LLC",
      role: "Senior SRE / Distributed Systems",
      notes: "Direct hiring manager contact",
    });

    // Seed realistic sample sessions
    const sampleVisitorId = "vis-sample-1";
    this.visitors.set(sampleVisitorId, {
      id: sampleVisitorId,
      visitorHash: "d7a8f9c2e1b304a9f8e7d6c5b4a39281",
      firstSeen: new Date(Date.now() - 3600000 * 4),
      lastSeen: new Date(Date.now() - 1000 * 60 * 12),
      country: "United States",
      region: "California",
      city: "Mountain View",
      orgName: "Google LLC",
      orgType: "corporate",
      device: "Desktop",
      browser: "Chrome",
      os: "macOS",
    });

    this.sessions.set("sess-sample-1", {
      id: "sess-sample-1",
      visitorId: sampleVisitorId,
      startedAt: new Date(Date.now() - 1000 * 60 * 25),
      endedAt: new Date(Date.now() - 1000 * 60 * 12),
      entryPath: "/?r=google-infra",
      exitPath: "/services/distributed-kv",
      referrerHost: "linkedin.com",
      shareLinkId: "google-infra",
      isBot: false,
      pagesCount: 4,
      durationMs: 245000,
      downloadedResume: true,
      sentMessage: false,
    });
  }

  createShareLink(data: Omit<StoredShareLink, "id" | "createdAt" | "archived" | "opens" | "uniqueVisitors">) {
    const id = data.slug;
    const link: StoredShareLink = {
      id,
      ...data,
      createdAt: new Date(),
      archived: false,
      opens: 0,
      uniqueVisitors: 0,
    };
    this.shareLinks.set(id, link);
    return link;
  }
}

// Global in-memory singleton across hot-reloads
const globalDbKey = Symbol.for("portfolio.inmemory.db");
const globalObj = globalThis as unknown as { [globalDbKey]?: InMemoryDb };
if (!globalObj[globalDbKey]) {
  globalObj[globalDbKey] = new InMemoryDb();
}
export const memoryDb = globalObj[globalDbKey]!;

export const db = dbInstance;
