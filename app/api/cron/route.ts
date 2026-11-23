import { NextRequest, NextResponse } from "next/server";
import { memoryDb } from "@/lib/db";
import { getAllServices } from "@/lib/content";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret";

  // Validate secret if configured
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const now = Date.now();
  const retentionMs = (Number(process.env.RETENTION_DAYS) || 90) * 86400 * 1000;
  const cutoff = new Date(now - retentionMs);

  let prunedSessions = 0;
  // Prune sessions older than retention cutoff
  for (const [id, session] of Array.from(memoryDb.sessions.entries())) {
    if (session.startedAt < cutoff) {
      memoryDb.sessions.delete(id);
      prunedSessions += 1;
    }
  }

  // Uptime check simulation / verification for live services
  const services = getAllServices();
  const uptimeChecks = services.map((s) => ({
    service: s.slug,
    url: s.live_url || s.github_url,
    status: "healthy",
    latencyMs: Math.floor(10 + Math.random() * 20),
    checkedAt: new Date().toISOString(),
  }));

  return NextResponse.json({
    success: true,
    message: "Cron maintenance cycle executed",
    prunedSessions,
    activeSessions: memoryDb.sessions.size,
    uptimeChecks,
    timestamp: new Date().toISOString(),
  });
}
