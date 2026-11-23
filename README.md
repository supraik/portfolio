# Portfolio Production System

> **"This portfolio is not a static brochure. It is a live, observable production system."**
> Built with Next.js App Router, TypeScript strict mode, Tailwind CSS tokens, Server-Timing telemetry, Drizzle ORM, and privacy-first analytics.

---

## 1. The Production Concept & Core Mapping

| Traditional Portfolio Section | This Production System | How It Operates |
|---|---|---|
| Hero | **Live Request Trace Waterfall** | Evaluates the actual edge-to-server page request using real W3C `Server-Timing` headers, showing latencies for edge routing, auth verification, database pool lease, and SSR rendering. |
| About | **`README.md`** | Styled like an engineering repository README with an active research sprint indicator. |
| Experience | **`git log --graph`** | Career represented as a branch commit history with commit hashes, messages, additions/deletions diffs, and skill wiring. |
| Projects | **Production Services** | Architectural topologies, 30-day SLA uptimes, p99 latencies, measured QPS, and architectural trade-offs. |
| Failures & Learnings | **Incident Postmortems** | Blameless postmortems documenting severity, impact, root causes, timelines, and action items. |
| Skills | **Dependency Graph** | Interactive topology linking skills to dependent production services (no arbitrary progress bars). |
| Writing / Notes | **Runbooks** | Technical field notes and reliability playbooks. |
| Contact | **Dispatch Ticket** | Issue submission workflow with honeypots, rate limiting, and time-to-submit bot traps. |
| Footer | **Status Bar** | Live commit SHA, Lighthouse audit scores (99/100/100/100), and p75 page load telemetry. |

### Two Reading Modes
- **Recruiter Mode (TL;DR)**: Collapses the entire portfolio to a 30-second executive scan (core value proposition, top 3 production services, résumé download, direct contact).
- **Engineer Mode (Default)**: Full deep-dive experience with interactive waterfalls, commit trees, and architecture specs.
- Selection persisted in `localStorage` with try/catch fallback.

### CLI Delights
- **`curl yourname.dev`**: Automatically detects CLI user agents (`curl`, `wget`, `httpie`) and streams an ANSI-colored text résumé directly to the terminal.
- **Command Palette (`⌘K` / `Ctrl K`)**: Fuzzy search to jump to any section, switch modes, toggle themes, or copy public contact details.

---

## 2. Configuration & Required `TODO_` Placeholders

All missing credentials use obvious `TODO_` placeholders. Below is the complete catalog of placeholders that need to be populated for your production deployment:

| Placeholder Key | Location | Purpose & Action Required |
|---|---|---|
| `TODO_ADMIN_GITHUB_USER` | `lib/owner.ts` | Your GitHub username for granting exclusive access to `/admin`. |
| `TODO_GENERATE_RANDOM_SECRET_MIN_32_CHARS` | `.env.example` | Secret string for NextAuth session signing (`openssl rand -base64 32`). |
| `TODO_GITHUB_OAUTH_CLIENT_ID` | `.env.example` | Client ID from your GitHub OAuth App settings. |
| `TODO_GITHUB_OAUTH_CLIENT_SECRET` | `.env.example` | Client Secret from your GitHub OAuth App settings. |
| `TODO_UPSTASH_REDIS_REST_URL` | `.env.example` | REST URL from your Upstash Redis database console. |
| `TODO_UPSTASH_REDIS_REST_TOKEN` | `.env.example` | REST token from your Upstash Redis database console. |
| `TODO_TURNSTILE_SITE_KEY` | `.env.example` | Public site key from Cloudflare Turnstile dashboard. |
| `TODO_TURNSTILE_SECRET_KEY` | `.env.example` | Secret key from Cloudflare Turnstile dashboard. |
| `TODO_RESEND_API_KEY` | `.env.example` | API key from Resend for email dispatch notifications. |
| `TODO_DAILY_SALT_SECRET_32_CHARS` | `.env.example` | Secret used to derive daily rotating salt for visitor hashing. |

---

## 3. Step-by-Step Production Deployment Guide

### Step 1: Database Setup (PostgreSQL with Neon or Supabase)
1. Create a PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled connection string into your `.env.local` or host environment variables:
   ```env
   DATABASE_URL="postgres://user:password@ep-cool-forest.neon.tech/portfolio?sslmode=require"
   ```
3. Push schema migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### Step 2: GitHub OAuth App Setup (Admin Console Protection)
1. Go to **GitHub Settings &rarr; Developer Settings &rarr; OAuth Apps &rarr; New OAuth App**.
2. Set **Application Name**: `Portfolio Admin Console`.
3. Set **Homepage URL**: `https://yourname.dev`.
4. Set **Authorization callback URL**: `https://yourname.dev/api/auth/callback/github`.
5. Generate a Client Secret and add to your production environment:
   ```env
   GITHUB_ID="your_client_id"
   GITHUB_SECRET="your_client_secret"
   ```

### Step 3: Deploying to Vercel
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete production system portfolio"
   git push origin main
   ```
2. Import the project in [Vercel](https://vercel.com).
3. Populate all environment variables from Section 2.
4. Deploy.

### Step 4: Custom Domain, DNS & HSTS Preload
1. Configure DNS records on your domain registrar:
   - `CNAME` for `@` pointing to `cname.vercel-dns.com`.
2. This system automatically sets:
   `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
3. After deployment, submit your domain to the official [HSTS Preload List](https://hstspreload.org) to enforce HTTPS at the browser level.

---

## 4. How to Add Content (Services & Incidents)

All site content is version-controlled MDX in `/content`. Adding new entries requires no database edits.

### Adding a New Production Service
Create `/content/services/your-service.mdx`:
```markdown
---
title: "Distributed KV Store"
slug: "distributed-kv"
tagline: "High-throughput replicated LSM key-value engine with Raft consensus."
status: "operational" # operational | degraded | maintenance | archived
uptime_30d: 99.98
latency_p99: "14ms"
qps: "12,500"
github_url: "https://github.com/yourhandle/distributed-kv"
live_url: "https://kv.yourname.dev"
stack: ["Rust", "gRPC", "Raft", "Tokio"]
skills: ["Distributed Systems", "Rust", "Consensus"]
featured_order: 1
---

## Service Overview
Detailed architectural breakdown, trade-offs, and operational telemetry.
```

### Adding a New Incident Postmortem
Create `/content/incidents/inc-2024-03-outage.mdx`:
```markdown
---
id: "INC-2024-03"
title: "Connection Pool Exhaustion in Redis Sentinel"
date: "2024-03-14"
severity: "SEV-1" # SEV-0 | SEV-1 | SEV-2
duration: "22m"
impact: "40% HTTP 504 Gateway Timeouts across auth-service"
root_cause: "Missing client socket timeout caused threads to hang."
status: "resolved"
services_affected: ["auth-service", "session-store"]
---

## Summary
Timeline, diagnostic steps, root cause analysis, and preventative action items.
```

---

## 5. Verification & Test Suite

Run the automated test matrix:
```bash
# Strict TypeScript Compilation
npx tsc --noEmit

# Unit & Security Headers Test Suite
npm test

# Production Build Verification
npm run build

# End-to-End & Accessibility Suite
npm run test:e2e
```
