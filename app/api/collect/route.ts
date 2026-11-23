import { NextRequest, NextResponse } from "next/server";
import {
  CollectEventPayloadSchema,
  isBot,
  truncateIp,
  getDailySalt,
  computeVisitorHash,
  classifyNetwork,
  checkInMemoryRateLimit,
} from "@/lib/analytics";
import { memoryDb } from "@/lib/db";
import { OWNER_CONFIG } from "@/lib/owner";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    // Cap payload size at 2 KB
    if (rawBody.length > 2048) {
      return new NextResponse(null, { status: 413 });
    }

    const json = JSON.parse(rawBody);
    const parseResult = CollectEventPayloadSchema.safeParse(json);
    if (!parseResult.success) {
      return new NextResponse(null, { status: 400 });
    }
    const payload = parseResult.data;

    const userAgent = req.headers.get("user-agent") || "";
    // Filter bots
    const botDetected = isBot(userAgent);

    // Extract IP from forward headers
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Daily rotating salt
    const baseSecret = process.env.ANALYTICS_SALT_SECRET || "dev-salt-key-default";
    const salt = getDailySalt(baseSecret);

    // Compute privacy hash and DISCARD raw IP immediately
    const visitorHash = computeVisitorHash({
      salt,
      ip: rawIp,
      userAgent,
      site: OWNER_CONFIG.domain,
    });

    // Rate limit check: 60 requests / minute per hashed visitor
    const rateCheck = checkInMemoryRateLimit(`collect:${visitorHash}`, 60, 60000);
    if (!rateCheck.success) {
      return new NextResponse(null, { status: 429 });
    }

    // Coarse Geo from edge headers
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "India";
    const region = req.headers.get("x-vercel-ip-country-region") || req.headers.get("cf-region") || "Haryana";
    const city = req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity") || "Gurugram";
    const orgHeader = req.headers.get("x-vercel-ip-as-organization") || req.headers.get("cf-asn-name") || "Corporate Network";
    const { orgName, orgType } = classifyNetwork(orgHeader);

    // Device / browser parsing (simple heuristics)
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const device = isMobile ? "Mobile" : "Desktop";
    const browser = /chrome/i.test(userAgent)
      ? "Chrome"
      : /firefox/i.test(userAgent)
      ? "Firefox"
      : /safari/i.test(userAgent)
      ? "Safari"
      : "Browser";
    const os = /windows/i.test(userAgent)
      ? "Windows"
      : /macintosh|mac os/i.test(userAgent)
      ? "macOS"
      : /linux/i.test(userAgent)
      ? "Linux"
      : "OS";

    // Asynchronously record into data store
    let visitor = Array.from(memoryDb.visitors.values()).find((v) => v.visitorHash === visitorHash);
    if (!visitor) {
      visitor = {
        id: "vis-" + visitorHash.slice(0, 8),
        visitorHash,
        firstSeen: new Date(),
        lastSeen: new Date(),
        country,
        region,
        city,
        orgName,
        orgType,
        device,
        browser,
        os,
      };
      memoryDb.visitors.set(visitor.id, visitor);
    } else {
      visitor.lastSeen = new Date();
    }

    // Upsert or create active session
    let session = Array.from(memoryDb.sessions.values()).find(
      (s) => s.visitorId === visitor!.id && Date.now() - s.startedAt.getTime() < 30 * 60 * 1000
    );

    if (!session) {
      session = {
        id: "sess-" + Math.random().toString(36).substring(2, 9),
        visitorId: visitor.id,
        startedAt: new Date(),
        entryPath: payload.path,
        referrerHost: payload.referrer ? new URL(payload.referrer, "https://local").hostname : undefined,
        shareLinkId: payload.shareLink,
        isBot: botDetected,
        pagesCount: 1,
        durationMs: payload.durationMs || 0,
        downloadedResume: false,
        sentMessage: false,
      };
      memoryDb.sessions.set(session.id, session);

      // Tracked share link opens
      if (payload.shareLink && memoryDb.shareLinks.has(payload.shareLink)) {
        const link = memoryDb.shareLinks.get(payload.shareLink)!;
        link.opens += 1;
        link.uniqueVisitors += 1;
        link.lastOpenedAt = new Date();
      }
    } else {
      session.pagesCount += 1;
      session.exitPath = payload.path;
      if (payload.durationMs && payload.durationMs > session.durationMs) {
        session.durationMs = payload.durationMs;
      }
    }

    // Track specific custom events
    if (payload.type === "event" && payload.eventName === "resume_download") {
      session.downloadedResume = true;
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return new NextResponse(null, { status: 500 });
  }
}
