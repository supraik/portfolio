# CONTENT_GUIDE.md — Managing MDX Content

All site content is stored in `/content` and parsed statically at build time.

## Directory Structure
- `/content/services/*.mdx`: Services & architecture breakdowns
- `/content/incidents/*.mdx`: Blameless postmortems
- `/content/runbooks/*.mdx`: Technical deep dives and engineering runbooks
- `/content/experience/*.mdx`: Career history modeled as `git log` commits
- `/content/uses.mdx`: Engineering setup, hardware, editor, dotfiles

## Frontmatter Schemas

### Service (`/content/services/distributed-kv.mdx`)
```yaml
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
skills: ["Distributed Systems", "Rust", "Consensus", "Performance Tuning"]
featured_order: 1
```

### Incident (`/content/incidents/inc-2024-03-redis-storm.mdx`)
```yaml
id: "INC-2024-03"
title: "Connection Pool Exhaustion During Redis Sentinel Failover"
date: "2024-03-14"
severity: "SEV-1" # SEV-0 | SEV-1 | SEV-2
duration: "22m"
impact: "40% HTTP 504 Gateway Timeouts across auth-service"
root_cause: "Missing client socket timeout caused threads to hang on socket write."
status: "resolved"
services_affected: ["auth-service", "session-store"]
```
