# DESIGN.md — System Specification & Visual Language

## 1. Design Principles (What makes this site look like *this* developer and nobody else)

1. **Production System Realism, Not Sci-Fi Hacker Cosplay**: The site does not use CRT scanlines, green terminal rain, or fake typing animations. Instead, it speaks the visual dialect of industrial systems software: Jaeger/OpenTelemetry waterfalls, Git diff gutters, Prometheus metrics panels, and incident runbooks.
2. **Density and Precision Over Airy Fluff**: Information is structured with crisp rules, monospace data tables, status badges, and telemetry bars. Generous whitespace is used strategically around key focal points, but content sections avoid oversized pill cards and marketing copy.
3. **Restraint in Motion**: Exactly one load-time moment has permission to animate: the live request waterfall tracing the current page load. All other motion is strictly interactive (hover diffs, filter clicks, command palette toggles). Motion obeys `prefers-reduced-motion` unconditionally.
4. **Authentic Affordances**: Buttons say what they do ("Download résumé", "Copy commit SHA", "Filter by P1"). Status indicators reflect real states (operational, degraded, archived).
5. **Two Reading Speeds**: The site respects recruiters' tight 30-second scans with a dedicated "Recruiter Mode (TL;DR)" that flattens metrics and showcases core signals, while offering engineers the deep trace-backed architecture specs.

---

## 2. Initial Design Concept & Self-Review

### Initial Proposed Idea
- Dark mode: Near-black slate (#0d1117), neon green accents (#22c55e), card layouts with drop shadows, monospace font everywhere.
- Headings with uppercase tags like `01 // EXPERIENCE`, `02 // SERVICES`.

### Self-Review & Critique
- **Critique against spec**:
  - *Forbidden*: Near-black + acid green "hacker" theme.
  - *Forbidden*: Identical rounded cards with soft shadows.
  - *Forbidden*: ALL-CAPS tracked eyebrow labels and arbitrary `01 / 02 / 03` numbering.
  - *Critique*: Monospace everywhere degrades readability for long-form runbooks and postmortems. We need a dual-typeface system: a clean, neutral grotesque sans-serif for body/UI reading and an engineered monospace for telemetry, hashes, timings, and code diffs.
  - *Critique*: Cards make a portfolio look like a generic template. Replace cards with bordered structural planes, tabular ledgers, and git log gutters with connected branches.

---

## 3. Revised Design Specification

### 3.1 Color Palette

The palette draws inspiration from calibrated phosphor screens, instrumentation oscilloscopes, and clean modern server control planes.

#### Dark Mode (Primary Default)
- **`--bg-canvas`**: `#0e131f` (Deep obsidian navy, avoiding harsh `#000000` or washed out `#1a1a1a`)
- **`--bg-surface`**: `#141b2d` (Instrumentation substrate / panel background)
- **`--bg-subtle`**: `#1b243b` (Hover states, table headers, active gutters)
- **`--border-dim`**: `#24304e` (Structural frame lines, grid separators)
- **`--border-focus`**: `#4f78df` (Focus rings, selected traces, active commit hashes)
- **`--fg-default`**: `#e2e8f0` (High readability, low glare off-white)
- **`--fg-muted`**: `#8899b5` (Metadata, timestamps, trace spans, diff line numbers)
- **`--accent-telemetry`**: `#38bdf8` (Trace edge latency, request paths, primary telemetry)
- **`--accent-success`**: `#34d399` (HTTP 200, healthy services, resolved incidents)
- **`--accent-warn`**: `#fbbf24` (P2 incidents, elevated latency, deprecations)
- **`--accent-crit`**: `#f87171` (P0/P1 incidents, 5xx codes, error traces)

#### Light Mode
- **`--bg-canvas`**: `#f6f8fb` (Clean industrial paper gray)
- **`--bg-surface`**: `#ffffff` (Card / panel white)
- **`--bg-subtle`**: `#edf2f7` (Hover states, secondary code backgrounds)
- **`--border-dim`**: `#d0d7e3` (Subtle boundary lines)
- **`--border-focus`**: `#2563eb` (Deep cobalt focus & links)
- **`--fg-default`**: `#0f172a` (Deep slate neutral text)
- **`--fg-muted`**: `#576882` (Secondary captions, commit metadata)
- **`--accent-telemetry`**: `#0284c7` (Trace edge latency)
- **`--accent-success`**: `#059669` (Status operational)
- **`--accent-warn`**: `#d97706` (Degraded / warnings)
- **`--accent-crit`**: `#dc2626` (Incident alarms / critical)

---

### 3.2 Typography

Two typography families:
1. **Interface & Prose Font**: `Geist Sans` / `Inter`, falling back to `system-ui, -apple-system, sans-serif`.
   - Used for: Headlines, body copy, README prose, runbook articles, postmortem narratives.
   - Line length strictly capped at `68ch` to `75ch`.
2. **Telemetry & Code Font**: `Geist Mono` / `JetBrains Mono`, falling back to `ui-monospace, monospace`.
   - Used for: Live request trace waterfall, Server-Timing measurements, commit hashes, git log tree, dependency node labels, system status metrics.

#### Type Scale (Fluid rems)
- **Micro (Data / Timestamps)**: `0.75rem` (12px) / line-height `1rem` — Monospace
- **Small (Badges / Metrics)**: `0.875rem` (14px) / line-height `1.25rem`
- **Body (Standard Copy)**: `1.0rem` (16px) / line-height `1.65` — Proportional
- **Subheading (H3 / Component Headers)**: `1.25rem` (20px) / line-height `1.4`
- **Section Heading (H2)**: `1.75rem` (28px) / line-height `1.3`
- **Display / Hero (H1)**: `2.5rem` (40px) / line-height `1.15` — Bold, tight tracking

---

## 4. ASCII Wireframes

### 4.1 Home Page (Engineer Mode vs Recruiter Mode)

```
+-----------------------------------------------------------------------------------------+
| [sys: ready]  yourname.dev                 [Mode: Eng / Recruiter]  [Theme: Dark] [Cmd+K] |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  HERO: LIVE REQUEST WATERFALL (Span timings from Server-Timing headers)                 |
|  +-----------------------------------------------------------------------------------+  |
|  | Trace ID: tr-4f8e91d0   Client: 203.0.113.4 -> Edge -> Server: 42ms total        |  |
|  | edge_handshake     |====                                           |  8ms [200]   |  |
|  | auth_bypass_check  |   ===                                         |  4ms [cache] |  |
|  | db_metrics_fetch   |      =========                                | 18ms [neon]  |  |
|  | ssr_render         |               ============                    | 22ms [next]  |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
|  Jagannath Mukherjee                                                                    |
|  Staff / Senior Systems & Full-Stack Engineer                                           |
|  Building resilient distributed services, real-time observability, and developer tools. |
|  [Open Ticket / Contact]  [Download Resume (PDF)]  [View git log]                       |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
| README.md                                                                               |
| ## Overview                                                                             |
| Pragmatic engineer focused on high-throughput backend architecture and clear interfaces.|
| Status: [Active] Exploring distributed consensus & eBPF network telemetry.              |
+-----------------------------------------------------------------------------------------+
| CAREER AS git log --graph --oneline                                                     |
| *  commit c89f2a4 (HEAD -> main) Staff Software Engineer @ Acme Infrastructure          |
| |  Date: 2023 - Present | Added multi-region failover, reduced p99 latency by 45%       |
| |  [+ diff: +3,420 lines Go/Rust, -1,200 lines legacy sync locks] [Expand diff]         |
| *    merge branch 'feature/scale-search'                                                |
| |\                                                                                      |
| | *  commit 3a18e01 Senior Backend Engineer @ DataPlatform Corp                         |
| |    Date: 2021 - 2023 | Event-driven pipeline handling 120M events/day                 |
+-----------------------------------------------------------------------------------------+
| PRODUCTION SERVICES (Projects)                                                          |
| [service: distributed-kv]    [uptime: 99.98%] [p99: 14ms] [status: operational]         |
| Architecture: Raft consensus log over gRPC with zero-copy LSM tree storage.            |
| Key trade-off: Prioritized read-heavy linearizability over write amplification.        |
| [Architecture Diagram] [Source Code] [Live Metrics]                                     |
+-----------------------------------------------------------------------------------------+
| POSTMORTEMS & INCIDENTS (Learning from mistakes)                                        |
| [INC-2024-03-14] Cascading connection pool exhaustion in Redis cache cluster            |
| Severity: P1 | Outage duration: 22m | Root cause: Missing connection timeout on thready |
| Action items: Introduced circuit breaker pattern + jittered exponential retry.          |
+-----------------------------------------------------------------------------------------+
| DEPENDENCY GRAPH (Interactive skill/project topology)                                   |
| (D3 Force Graph linking TypeScript, Go, PostgreSQL, Kafka, Rust -> Services)           |
+-----------------------------------------------------------------------------------------+
| STATUS BAR (Footer)                                                                     |
| SHA: a7b1c3e  Deploy: 2m ago  Lighthouse: 99/100/100/100  p75 load: 142ms  Visitors: 840|
+-----------------------------------------------------------------------------------------+
```

### 4.2 Service Detail Page (`/services/[slug]`)

```
+-----------------------------------------------------------------------------------------+
| <- Back to Services / Cluster Topology                      Status: [HEALTHY - 99.99%]  |
+-----------------------------------------------------------------------------------------+
| service/distributed-kv: Low-latency replicated key-value storage engine                 |
+-----------------------------------------------------------------------------------------+
| TELEMETRY HEADERS                                                                       |
| Target SLA: 99.95% | Current Uptime (30d): 99.99% | p50: 1.2ms | p99: 14.8ms | QPS: 12.4k |
+-----------------------------------------------------------------------------------------+
| ARCHITECTURE TOPOLOGY                                                                   |
|   +----------------+       +-------------------+       +-----------------------+        |
|   | Clients (gRPC) | ----> | Ingress & Routing | ----> | Leader / Raft Cluster |        |
|   +----------------+       +-------------------+       +-----------------------+        |
|                                                            |  WAL Log Replication       |
|                                                            v                            |
|                                                        +-----------------------+        |
|                                                        | Follower Nodes        |        |
|                                                        +-----------------------+        |
+-----------------------------------------------------------------------------------------+
| DECISIONS & TRADE-OFFS                                                                  |
| Decision: Custom memory-mapped arena allocator instead of standard malloc.              |
| Consequence: Prevented GC pauses during burst writes; required explicit bounds checks.  |
+-----------------------------------------------------------------------------------------+
```

### 4.3 Incident Postmortem (`/incidents/[slug]`)

```
+-----------------------------------------------------------------------------------------+
| INCIDENT REPORT: INC-2024-03-14                                 Severity: [SEV-1]       |
+-----------------------------------------------------------------------------------------+
| Impact: Cache miss storm resulting in 40% downstream HTTP 504 gateway timeouts          |
| Duration: 22 minutes (14:02 UTC - 14:24 UTC)                                            |
| Services Affected: auth-service, session-store                                          |
+-----------------------------------------------------------------------------------------+
| TIMELINE OF EVENTS                                                                      |
| 14:00 - Routine deployment of release v2.4.1 initialized.                               |
| 14:02 - Automated alarms trigger on session lookup error rate spike > 5%.               |
| 14:08 - Incident Commander identified Redis socket exhaustion. Rollback command issued.|
| 14:14 - Traffic rerouted to secondary cluster. Connection pool stabilized.              |
| 14:24 - All error rates returned to baseline < 0.01%. Incident closed.                  |
+-----------------------------------------------------------------------------------------+
| ROOT CAUSE & ACTION ITEMS                                                               |
| Root Cause: Redis client driver lacked explicit socket connection timeout, causing      |
| connection threads to hang indefinitely on stalled packets.                             |
| Action 1 (Done): Enforce strict 100ms connection timeout and pool cap.                 |
| Action 2 (Done): Added chaos test simulating unresponsive Redis nodes during deploy.    |
+-----------------------------------------------------------------------------------------+
```

### 4.4 Admin Dashboard (`/admin`)

```
+-----------------------------------------------------------------------------------------+
| ADMIN CONSOLE  [Live Sessions: 4]  [Ingestion: Active]         [User: handle (Owner)]   |
+-----------------------------------------------------------------------------------------+
| [Overview] [Who's Here] [Share Links] [Content Stats] [Sources] [Inbox] [Settings]       |
+-----------------------------------------------------------------------------------------+
| OVERVIEW TELEMETRY (Last 7 Days vs Prior Period)                                        |
| Unique Visitors: 1,420 (+18%) | Pageviews: 4,890 | Avg Session: 3m 42s | Bounce: 28%    |
| [=== Line Chart: Hourly / Daily Traffic with Corporate Network Highlights ============] |
+-----------------------------------------------------------------------------------------+
| WHO'S HERE (Real-time privacy-preserving session stream)                                |
| TIME       ORGANISATION (ASN)   LOCATION          SHARE LINK    PAGES   RESUME  ACTION  |
| 14:22:10   Google LLC (Corp)    Mountain View, US acme-staff    4       Yes     [View]  |
| 14:18:04   Residential / ISP    Bengaluru, IN     direct        2       No      [View]  |
| 14:05:32   Stripe Inc (Corp)    Dublin, IE        fintech-lead  6       Yes     [View]  |
+-----------------------------------------------------------------------------------------+
| TRACKED SHARE LINKS (Recruiter & Outreach tracking)                                     |
| Slug: /?r=acme-staff | Company: Acme Corp | Opens: 7 | First: 18 Nov | Last: 10m ago    |
| [Create New Tracked Link]  [Copy Tracking URL]  [Archive]                               |
+-----------------------------------------------------------------------------------------+
```
