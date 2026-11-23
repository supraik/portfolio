import { describe, it, expect } from "vitest";
import { POST as contactHandler } from "../../app/api/contact/route";
import { POST as guestbookHandler, GET as guestbookGetHandler } from "../../app/api/guestbook/route";
import { NextRequest } from "next/server";
import { memoryDb } from "../../lib/db";

describe("Contact & Guestbook Mutation Endpoints", () => {
  it("validates and accepts well-formed contact ticket submissions", async () => {
    const payload = JSON.stringify({
      name: "Engineering Recruiter",
      email: "recruiter@acme.corp",
      subject: "Staff Systems Engineer Lead Role",
      body: "We saw your work on Raft consensus and would love to connect.",
      severity: "high",
    });

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "192.0.2.10",
      },
      body: payload,
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.ticketId).toBeDefined();

    const stored = memoryDb.messages.get(data.ticketId);
    expect(stored?.name).toBe("Engineering Recruiter");
  });

  it("rejects malformed contact ticket submissions with 400", async () => {
    const invalidPayload = JSON.stringify({
      name: "X", // Too short
      email: "not-an-email",
      subject: "hi", // Too short
      body: "short", // Too short
    });

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: invalidPayload,
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(400);
  });

  it("sanitizes HTML injection attempts into escaped text", async () => {
    const xssPayload = JSON.stringify({
      name: "Security Tester",
      email: "tester@security.org",
      subject: "XSS Verification Payload",
      body: "Hello <script>alert('xss')</script> and <img src=x onerror=alert(1)>",
      severity: "normal",
    });

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "192.0.2.15",
      },
      body: xssPayload,
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    const stored = memoryDb.messages.get(data.ticketId);
    expect(stored?.body).not.toContain("<script>");
    expect(stored?.body).toContain("&lt;script&gt;");
  });

  it("handles guestbook submissions and retrieves entries", async () => {
    const gbPayload = JSON.stringify({
      githubLogin: "octocat",
      displayName: "Mona Lisa Octocat",
      message: "Impressive live trace waterfall and architecture breakdown!",
    });

    const postReq = new NextRequest("http://localhost:3000/api/guestbook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "192.0.2.20",
      },
      body: gbPayload,
    });

    const postRes = await guestbookHandler(postReq);
    expect(postRes.status).toBe(201);

    const getRes = await guestbookGetHandler();
    expect(getRes.status).toBe(200);
    const data = await getRes.json();
    expect(data.entries.length).toBeGreaterThanOrEqual(1);
  });
});
