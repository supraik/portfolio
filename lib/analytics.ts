import crypto from "crypto";
import { z } from "zod";

// 1. Zod schemas for ingestion
export const CollectEventPayloadSchema = z.object({
  type: z.enum(["pageview", "event"]),
  path: z.string().max(256),
  title: z.string().max(256).optional(),
  referrer: z.string().max(512).optional(),
  shareLink: z.string().max(64).optional(),
  durationMs: z.number().nonnegative().optional(),
  scrollPct: z.number().min(0).max(100).optional(),
  eventName: z.string().max(64).optional(),
  eventProps: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
});
export type CollectEventPayload = z.infer<typeof CollectEventPayloadSchema>;

// 2. Bot & Scraper Filter
const BOT_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /headless/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /lighthouse/i,
  /postman/i,
  /insomnia/i,
  /wget/i,
  /httpie/i,
  /curl/i,
];

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim() === "") return true;
  return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

export function isCliTool(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /curl|wget|httpie/i.test(userAgent);
}

// 3. Truncate IP (mask last octet for IPv4, last 80 bits for IPv6)
export function truncateIp(ip: string): string {
  if (!ip || ip === "::1" || ip === "127.0.0.1") return "127.0.0.0";
  if (ip.includes(":")) {
    // IPv6: keep first 3 segments
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + "::0";
  }
  // IPv4: mask last octet
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  return "0.0.0.0";
}

// 4. Daily rotating salt calculation
export function getDailySalt(baseSecret: string, date: Date = new Date()): string {
  const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
  return crypto.createHmac("sha256", baseSecret).update(dayKey).digest("hex");
}

// 5. Visitor Hash (Plausible-style anonymized daily hash)
export function computeVisitorHash(params: {
  salt: string;
  ip: string;
  userAgent: string;
  site: string;
}): string {
  const truncated = truncateIp(params.ip);
  const normalizedUa = (params.userAgent || "").trim().toLowerCase();
  const input = `${params.salt}:${truncated}:${normalizedUa}:${params.site}`;
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

// 6. Organization classification from ASN / header
export function classifyNetwork(orgName?: string | null): {
  orgName: string;
  orgType: "corporate" | "residential" | "datacenter" | "unknown";
} {
  if (!orgName || orgName.trim() === "") {
    return { orgName: "Unknown Network", orgType: "unknown" };
  }
  const lower = orgName.toLowerCase();
  const datacenterKeywords = ["amazon", "aws", "digitalocean", "google cloud", "ovh", "hetzner", "cloudflare", "linode", "vultr", "microsoft azure", "oracle cloud"];
  const residentialKeywords = ["broadband", "telecom", "comcast", "verizon", "airtel", "jio", "vodafone", "spectrum", "at&t", "charter", "isp", "residential"];

  if (datacenterKeywords.some((k) => lower.includes(k))) {
    return { orgName, orgType: "datacenter" };
  }
  if (residentialKeywords.some((k) => lower.includes(k))) {
    return { orgName: "Residential / ISP", orgType: "residential" };
  }
  return { orgName, orgType: "corporate" };
}

// 7. In-memory Rate Limiter (with fallback for testing/serverless)
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();

export function checkInMemoryRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  let bucket = rateLimitMap.get(key);

  if (!bucket || now - bucket.lastRefill > windowMs) {
    bucket = { tokens: maxRequests - 1, lastRefill: now };
    rateLimitMap.set(key, bucket);
    return { success: true, remaining: bucket.tokens };
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { success: true, remaining: bucket.tokens };
  }

  return { success: false, remaining: 0 };
}
