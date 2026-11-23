import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkInMemoryRateLimit } from "@/lib/analytics";
import { memoryDb } from "@/lib/db";
import { OWNER_CONFIG } from "@/lib/owner";

const contactPayloadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(120),
  subject: z.string().min(3).max(150),
  body: z.string().min(10).max(4000),
  severity: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  turnstileToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = contactPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error: Check that all required ticket fields are properly formatted." },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Rate limiting: 3 tickets per hour per IP / client hash
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkInMemoryRateLimit(`contact:${clientIp}`, 3, 3600 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Maximum 3 tickets per hour allowed." },
        { status: 429 }
      );
    }

    // Turnstile validation (if configured in production)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileSecret !== "TODO_TURNSTILE_SECRET_KEY" && data.turnstileToken) {
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: data.turnstileToken,
            remoteip: clientIp,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json({ error: "Turnstile bot challenge verification failed." }, { status: 403 });
        }
      } catch {}
    }

    // Sanitize body as escaped plain text (zero HTML execution)
    const sanitizedBody = data.body
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const ticketId = "TICK-" + Math.floor(100000 + Math.random() * 900000);

    // Persist ticket
    memoryDb.messages.set(ticketId, {
      id: ticketId,
      name: data.name,
      email: data.email,
      subject: data.subject,
      body: sanitizedBody,
      severity: data.severity,
      createdAt: new Date(),
      status: "new",
    });

    // Mark current session as having sent a message
    const activeSession = Array.from(memoryDb.sessions.values()).find(
      (s) => Date.now() - s.startedAt.getTime() < 30 * 60 * 1000
    );
    if (activeSession) {
      activeSession.sentMessage = true;
    }

    // Dispatch asynchronous notification (via Resend if key exists)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "TODO_RESEND_API_KEY") {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "tickets@yourname.dev",
          to: OWNER_CONFIG.email_public,
          subject: `[${data.severity.toUpperCase()}] New Portfolio Ticket: ${data.subject}`,
          text: `Ticket: ${ticketId}\nReporter: ${data.name} <${data.email}>\nSeverity: ${data.severity}\n\n${sanitizedBody}`,
        }),
      }).catch((e) => console.warn("[EMAIL_DISPATCH_FAILED]", e));
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Ticket successfully enqueued in production dispatch.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal ticket dispatch fault." }, { status: 500 });
  }
}
