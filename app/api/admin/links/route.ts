import { NextRequest, NextResponse } from "next/server";
import { memoryDb } from "@/lib/db";
import { z } from "zod";

const createLinkSchema = z.object({
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-_]+$/i),
  label: z.string().min(2).max(128),
  company: z.string().min(2).max(128),
  role: z.string().min(2).max(128),
  notes: z.string().max(512).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createLinkSchema.parse(json);

    if (memoryDb.shareLinks.has(parsed.slug)) {
      return NextResponse.json({ error: "Share link slug already exists" }, { status: 409 });
    }

    const newLink = memoryDb.createShareLink({
      slug: parsed.slug,
      label: parsed.label,
      company: parsed.company,
      role: parsed.role,
      notes: parsed.notes || "",
    });

    return NextResponse.json({ success: true, link: newLink }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid payload" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { slug, archived } = await req.json();
    const link = memoryDb.shareLinks.get(slug);
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    link.archived = !!archived;
    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
