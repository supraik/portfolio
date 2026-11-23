# ANALYTICS.md — Privacy-First Telemetry Architecture

## Architecture Overview

```
Visitor Browser
      │
      │  (navigator.sendBeacon or fetch POST)
      ▼
Edge Middleware & Ingestion (/api/collect)
      │
      ├── 1. Bot & Scraper Filter (UA regex, headless checks, datacenter IP flag)
      ├── 2. Extract Coarse Geo & ASN (Country, Region, City, Org Name, Org Type)
      ├── 3. Daily Hash Generator: sha256(daily_salt + truncated_ip + ua + site)
      ├── 4. DISCARD IP IMMEDIATELY from memory
      └── 5. Push to Async Queue / Database (visitors, sessions, pageviews, events)
```

## Key Metrics & Privacy Safeguards

1. **Unique Visitors**: Calculated via daily rotating salt. Hash cannot be correlated across different calendar days.
2. **Tracked Share Links**: Admin can issue query strings like `?r=google-staff-eng`. Tracks engagement funnel (page depth, resume downloads) without tracking individual identity.
3. **Session Aggregation**: 30-minute inactivity boundary.
4. **Data Retention**: Raw pageviews pruned after 90 days; rolled up into `daily_rollups` table.
