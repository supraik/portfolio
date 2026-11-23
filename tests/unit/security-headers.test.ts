import { describe, it, expect } from "vitest";
import { middleware } from "../../middleware";
import { NextRequest } from "next/server";

describe("Production Security Headers & Middleware", () => {
  it("enforces strict CSP with per-request nonces", () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = middleware(req);

    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).not.toBeNull();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("nonce-");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("serves real Server-Timing header for telemetry waterfall", () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = middleware(req);

    const serverTiming = res.headers.get("Server-Timing");
    expect(serverTiming).not.toBeNull();
    expect(serverTiming).toContain("edge");
    expect(serverTiming).toContain("dur=");
  });

  it("serves ANSI colored text resume when request comes from curl / wget", () => {
    const req = new NextRequest("http://localhost:3000/", {
      headers: { "user-agent": "curl/8.4.0" },
    });
    const res = middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    expect(res.headers.get("X-Cli-Client")).toBe("true");
  });
});
