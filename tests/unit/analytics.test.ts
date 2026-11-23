import { describe, it, expect } from "vitest";
import {
  isBot,
  isCliTool,
  truncateIp,
  getDailySalt,
  computeVisitorHash,
  classifyNetwork,
  checkInMemoryRateLimit,
  CollectEventPayloadSchema,
} from "../../lib/analytics";

describe("Privacy-First Analytics Engine", () => {
  it("truncates IPv4 and IPv6 addresses to mask personal identifiers", () => {
    expect(truncateIp("192.168.1.142")).toBe("192.168.1.0");
    expect(truncateIp("10.0.4.88")).toBe("10.0.4.0");
    expect(truncateIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:0db8:85a3::0");
  });

  it("rotates daily salt based on calendar date", () => {
    const secret = "test-secret-salt-key";
    const date1 = new Date("2026-11-23T10:00:00Z");
    const date2 = new Date("2026-11-23T22:30:00Z");
    const date3 = new Date("2026-11-24T01:00:00Z");

    const salt1 = getDailySalt(secret, date1);
    const salt2 = getDailySalt(secret, date2);
    const salt3 = getDailySalt(secret, date3);

    expect(salt1).toBe(salt2); // Same calendar day
    expect(salt1).not.toBe(salt3); // Different calendar day
  });

  it("produces deterministic visitor hash within the same day", () => {
    const salt = "daily-salt-xyz";
    const hash1 = computeVisitorHash({
      salt,
      ip: "203.0.113.195",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      site: "jagannath.dev",
    });
    const hash2 = computeVisitorHash({
      salt,
      ip: "203.0.113.88", // Same /24 subnet truncated to 203.0.113.0
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      site: "jagannath.dev",
    });
    const hashDifferentSubnet = computeVisitorHash({
      salt,
      ip: "198.51.100.4",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      site: "jagannath.dev",
    });

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashDifferentSubnet);
    expect(hash1.length).toBe(32);
  });

  it("detects automated bots, crawlers, and headless agents", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("Mozilla/5.0 (Playwright; headless)")).toBe(true);
    expect(isBot("PostmanRuntime/7.28.4")).toBe(true);
    expect(isBot("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36")).toBe(false);
  });

  it("identifies CLI tools for ANSI résumé response", () => {
    expect(isCliTool("curl/7.88.1")).toBe(true);
    expect(isCliTool("Wget/1.21.3")).toBe(true);
    expect(isCliTool("HTTPie/3.2.1")).toBe(true);
    expect(isCliTool("Mozilla/5.0 Chrome")).toBe(false);
  });

  it("classifies corporate vs residential vs datacenter networks", () => {
    expect(classifyNetwork("Google LLC").orgType).toBe("corporate");
    expect(classifyNetwork("Amazon Web Services").orgType).toBe("datacenter");
    expect(classifyNetwork("Airtel Broadband Services").orgType).toBe("residential");
    expect(classifyNetwork("").orgType).toBe("unknown");
  });

  it("enforces rate limiting per visitor bucket", () => {
    const key = "visitor-test-key-" + Date.now();
    const limit = 3;
    const r1 = checkInMemoryRateLimit(key, limit, 10000);
    const r2 = checkInMemoryRateLimit(key, limit, 10000);
    const r3 = checkInMemoryRateLimit(key, limit, 10000);
    const r4 = checkInMemoryRateLimit(key, limit, 10000);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r4.success).toBe(false);
  });

  it("validates incoming analytics ingestion payloads", () => {
    const valid = CollectEventPayloadSchema.safeParse({
      type: "pageview",
      path: "/services/distributed-kv",
      durationMs: 12000,
      scrollPct: 75,
      shareLink: "acme-staff",
    });
    expect(valid.success).toBe(true);

    const invalid = CollectEventPayloadSchema.safeParse({
      type: "malicious_type",
      path: "/".repeat(300), // Exceeds max 256
      scrollPct: 150, // Exceeds 100%
    });
    expect(invalid.success).toBe(false);
  });
});
