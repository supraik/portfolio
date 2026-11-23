import { NextResponse } from "next/server";
import { generateResumeJson } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  const jsonResume = generateResumeJson();
  return NextResponse.json(jsonResume, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
