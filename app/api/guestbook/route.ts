import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkInMemoryRateLimit } from "@/lib/analytics";
import { memoryDb } from "@/lib/db";

const guestbookPayloadSchema = z.object({
  githubLogin: z.string().min(1).max(64),
  displayName: z.string().min(1).max(100),
  message: z.string().min(2).max(280),
});

export async function GET() {
  const entries = Array.from(memoryDb.guestbook.values())
    .filter((e) => e.approved)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = guestbookPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid guestbook message format." }, { status: 400 });
    }
    const data = parsed.data;

    // Rate limit: 1 entry / day per IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkInMemoryRateLimit(`guestbook:${clientIp}`, 1, 86400 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Rate limit: 1 guestbook entry per day allowed." }, { status: 429 });
    }

    const sanitizedMessage = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const id = "gb-" + Math.random().toString(36).substring(2, 9);

    const entry = {
      id,
      githubLogin: data.githubLogin,
      displayName: data.displayName,
      message: sanitizedMessage,
      approved: true,
      createdAt: new Date(),
    };
    memoryDb.guestbook.set(id, entry);

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to record guestbook entry." }, { status: 500 });
  }
}
