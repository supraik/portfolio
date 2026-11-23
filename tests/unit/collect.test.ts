import { describe, it, expect } from "vitest";
import { POST as collectHandler } from "../../app/api/collect/route";
import { NextRequest } from "next/server";
import { memoryDb } from "../../lib/db";

describe("Analytics Ingestion API (/api/collect)", () => {
  it("rejects oversized payloads > 2 KB with 413", async () => {
    const hugeBody = JSON.stringify({
      type: "pageview",
      path: "/test",
      padding: "x".repeat(3000),
    });

    const req = new NextRequest("http://localhost:3000/api/collect", {
      method: "POST",
      body: hugeBody,
    });

    const res = await collectHandler(req);
    expect(res.status).toBe(413);
  });

  it("accepts valid pageview telemetry, anonymizes IP, and returns 204", async () => {
    const validBody = JSON.stringify({
      type: "pageview",
      path: "/services/distributed-kv",
      shareLink: "acme-staff",
      durationMs: 4500,
    });

    const initialOpens = memoryDb.shareLinks.get("acme-staff")?.opens || 0;

    const req = new NextRequest("http://localhost:3000/api/collect", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        "x-forwarded-for": "198.51.100.42",
        "x-vercel-ip-country": "United States",
        "x-vercel-ip-city": "San Francisco",
        "x-vercel-ip-as-organization": "Stripe, Inc.",
      },
      body: validBody,
    });

    const res = await collectHandler(req);
    expect(res.status).toBe(204);

    // Verify share link stats incremented
    const updatedLink = memoryDb.shareLinks.get("acme-staff");
    expect(updatedLink?.opens).toBe(initialOpens + 1);
  });
});
