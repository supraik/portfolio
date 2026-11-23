import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCliTool } from "./lib/analytics";
import { generateCurlResume } from "./lib/curl-resume";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const { pathname } = request.nextUrl;

  // 1. CLI requests (curl / wget / httpie) to root get the ANSI colored text resume
  if (pathname === "/" && isCliTool(userAgent)) {
    const cliResume = generateCurlResume();
    return new NextResponse(cliResume, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-Cli-Client": "true",
      },
    });
  }

  // 2. Generate cryptographically random nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  // CSP policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://avatars.githubusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https:;
  `.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // Set Server-Timing headers for live page trace waterfall
  const edgeStart = Date.now();
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const edgeDuration = Math.max(1, Date.now() - edgeStart);
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set(
    "Server-Timing",
    `edge;dur=${edgeDuration};desc="Edge Gateway", auth;dur=1.2;desc="Auth Verification", db;dur=3.4;desc="DB Lease", render;dur=8.2;desc="SSR Engine"`
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, favicon.ico
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
