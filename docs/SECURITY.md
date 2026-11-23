# SECURITY.md — Production Security Posture & Architecture

This portfolio operates as an observable, hardened production system. Security is built into the architecture, not retrofitted.

---

## 1. Security Headers & CSP

All incoming HTTP responses pass through strict security headers configured in `middleware.ts` and `next.config.mjs`:

- **Content-Security-Policy (CSP)**:
  - Cryptographic per-request nonces applied to inline scripts and styles.
  - `default-src 'self'`.
  - Disallows `unsafe-inline` and `unsafe-eval` in production.
  - `frame-ancestors 'none'` to block clickjacking.
  - `object-src 'none'`.
  - `base-uri 'self'`.
  - `form-action 'self'`.
- **Strict-Transport-Security (HSTS)**:
  - `max-age=63072000; includeSubDomains; preload` (Qualifies for HSTS Preload list).
- **X-Content-Type-Options**:
  - `nosniff` preventing MIME confusion attacks.
- **Referrer-Policy**:
  - `strict-origin-when-cross-origin` protecting query strings and referrers.
- **Permissions-Policy**:
  - Strict lockdown: `camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()`.
- **Cross-Origin-Opener-Policy (COOP)**:
  - `same-origin`.

---

## 2. Privacy & Data Handling (GDPR & DPDP Act 2023)

- **Zero Raw IP Storage**: Raw IP addresses are inspected strictly in-memory at the network edge to determine coarse geography (Country, Region, City) and ASN organization type (Corporate vs ISP). The IP is immediately discarded and never persisted to disks or logs.
- **Plauisble-Style Daily Rotating Salt**:
  - Unique visitor hash = `SHA256(daily_rotating_salt + truncated_ip + user_agent + domain)`.
  - Salts rotate every 24 hours. Old salts are deleted, preventing cross-day user tracking.
- **Cookieless Analytics**:
  - Analytics requires no tracking cookies or cross-site fingerprinting.
  - DNT (Do Not Track) and `Sec-GPC` (Global Privacy Control) headers are honored unconditionally: pageviews are counted anonymously without session linking.
- **Right to Erasure & Export**:
  - The admin panel provides an explicit Data Deletion and CSV Export tool for any self-identified visitor session.

---

## 3. Input Validation & Mutation Hardening

- **Zod Strict Schemas**:
  - Every API endpoint (`/api/collect`, `/api/contact`, `/api/guestbook`) validates incoming payloads with strict Zod parsing.
  - Unknown fields are stripped or rejected.
  - Request payloads capped at 2 KB.
- **Build-Time MDX Only**:
  - All content (services, incidents, runbooks, git logs) is compiled statically at build time from the version-controlled repository.
  - User-submitted inputs (contact messages, guestbook entries) are sanitized and rendered as strictly escaped plain text—never raw HTML or executable JSX.
- **SQL Injection Prevention**:
  - Database access is strictly conducted via Drizzle ORM parameterized queries. No raw concatenated SQL strings.

---

## 4. Abuse Protection & Rate Limiting

- **Multi-Tier Rate Limiting**:
  - Contact endpoint: 3 requests / hour per visitor hash.
  - Guestbook: 1 submission / day per visitor.
  - Analytics ingestion (`/api/collect`): 60 requests / minute per hash.
- **Bot Mitigation**:
  - Automated bot filtering in edge middleware (detects headless browser signatures, known crawlers, datacenter ASNs).
  - Honeypot fields and submission duration checks (< 2 seconds flags programmatic spam).
  - Cloudflare Turnstile CAPTCHA alternative for ticket submissions.

---

## 5. Administrative Authorization

- **Multi-Layer Server-Side Authorization**:
  - Authorization is verified in `middleware.ts` AND explicitly re-verified in every admin API route handler and server action.
  - Admin access is restricted to GitHub OAuth logins explicitly listed in `admin_github_usernames`.
  - Admin session cookies: `HttpOnly`, `SameSite=Lax`, `Secure`, max-age ≤ 7 days.
  - Audit logging of all admin login events (timestamp, coarse location, user handle).
