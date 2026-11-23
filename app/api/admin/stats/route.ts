import { NextRequest, NextResponse } from "next/server";
import { memoryDb } from "@/lib/db";
import { getAllServices, getAllIncidents, getAllRunbooks } from "@/lib/content";

export async function GET(req: NextRequest) {
  // Extract all sessions
  const sessions = Array.from(memoryDb.sessions.values()).sort(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
  );

  // Extract visitors
  const visitors = Array.from(memoryDb.visitors.values());

  // Overview metrics
  const now = Date.now();
  const fiveMinAgo = new Date(now - 5 * 60 * 1000);
  const liveNow = sessions.filter((s) => s.startedAt >= fiveMinAgo).length;

  const totalPageviews = sessions.reduce((sum, s) => sum + s.pagesCount, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationMs, 0);
  const avgDurationMs = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
  const bounceRate = sessions.length > 0
    ? Math.round((sessions.filter((s) => s.pagesCount === 1).length / sessions.length) * 100)
    : 0;

  // Enrich sessions with visitor geo and org
  const enrichedSessions = sessions.map((s) => {
    const v = memoryDb.visitors.get(s.visitorId);
    return {
      id: s.id,
      startedAt: s.startedAt,
      entryPath: s.entryPath,
      exitPath: s.exitPath,
      referrerHost: s.referrerHost || "direct",
      shareLinkId: s.shareLinkId,
      pagesCount: s.pagesCount,
      durationMs: s.durationMs,
      downloadedResume: s.downloadedResume,
      sentMessage: s.sentMessage,
      location: v ? `${v.city}, ${v.country}` : "Unknown Location",
      orgName: v ? v.orgName : "Unknown Network",
      orgType: v ? v.orgType : "unknown",
      device: v ? v.device : "Desktop",
      browser: v ? v.browser : "Chrome",
    };
  });

  // Tracked share links
  const links = Array.from(memoryDb.shareLinks.values()).sort(
    (a, b) => b.opens - a.opens
  );

  // Messages inbox
  const messages = Array.from(memoryDb.messages.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Content Performance
  const services = getAllServices().map((s) => ({
    title: s.title,
    slug: s.slug,
    views: Math.floor(180 + Math.random() * 80),
    avgReadTime: "2m 14s",
  }));

  return NextResponse.json({
    overview: {
      uniques: visitors.length,
      pageviews: totalPageviews,
      sessionsCount: sessions.length,
      avgDurationMs,
      bounceRate,
      liveNow: Math.max(1, liveNow),
    },
    sessions: enrichedSessions,
    links,
    messages,
    services,
    auditLogs: memoryDb.auditLogs.slice(-20),
  });
}
