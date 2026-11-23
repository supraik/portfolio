import { OWNER_CONFIG } from "./owner";

export function generateCurlResume(): string {
  const c = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
  };

  const lines = [
    `${c.bold}${c.cyan}========================================================================${c.reset}`,
    `${c.bold}${c.cyan}  ${OWNER_CONFIG.name.toUpperCase()}  |  ${OWNER_CONFIG.role.toUpperCase()}${c.reset}`,
    `${c.dim}  ${OWNER_CONFIG.location}  *  https://${OWNER_CONFIG.domain}  *  ${OWNER_CONFIG.email_public}${c.reset}`,
    `${c.bold}${c.cyan}========================================================================${c.reset}`,
    "",
    `${c.bold}${c.yellow}# CAREER GIT LOG${c.reset}`,
    `${c.green}* commit c89f2a4${c.reset} ${c.dim}(HEAD -> main)${c.reset}`,
    `  ${c.bold}Staff Software Engineer${c.reset} @ ${c.cyan}Acme Infrastructure${c.reset}  ${c.dim}[2023 — Present]${c.reset}`,
    `  ${c.gray}feat(core): architect multi-region low-latency consensus and telemetry platform${c.reset}`,
    `  ${c.dim}Diff: +14200 / -3800 lines across 84 files${c.reset}`,
    `    ${c.blue}->${c.reset} Designed multi-region failover coordinator reducing p99 recovery from 4.2m to 18s.`,
    `    ${c.blue}->${c.reset} Implemented custom eBPF telemetry daemon saving $120k/yr in APM licensing.`,
    "",
    `${c.green}* commit 3a18e01${c.reset} ${c.dim}(feature/stream-ingest)${c.reset}`,
    `  ${c.bold}Senior Backend Engineer${c.reset} @ ${c.cyan}DataPlatform Corp${c.reset}  ${c.dim}[2021 — 2023]${c.reset}`,
    `  ${c.gray}feat(pipeline): scale distributed ingest worker pool to 120M events/day${c.reset}`,
    `  ${c.dim}Diff: +28400 / -12100 lines across 142 files${c.reset}`,
    `    ${c.blue}->${c.reset} Cut p95 ingestion pipeline latency from 320ms to 42ms with memory-pooled buffer rings.`,
    "",
    `${c.bold}${c.yellow}# PRODUCTION SERVICES${c.reset}`,
    `  ${c.bold}${c.green}[OPERATIONAL]${c.reset} ${c.bold}Distributed KV Store (HydraKV)${c.reset} (Rust, gRPC, Raft, Tokio)`,
    `  ${c.dim}High-throughput replicated LSM key-value engine with Raft consensus.${c.reset}`,
    `  ${c.gray}Metrics: p99 14ms | 30d Uptime 99.98% | QPS 12,500${c.reset}`,
    `  ${c.blue}Code: https://github.com/jagannath-m/hydra-kv${c.reset}`,
    "",
    `  ${c.bold}${c.green}[OPERATIONAL]${c.reset} ${c.bold}StreamForge Telemetry Pipeline${c.reset} (Go, Kafka, ClickHouse, eBPF)`,
    `  ${c.dim}Distributed streaming engine processing 140M daily metrics events.${c.reset}`,
    `  ${c.gray}Metrics: p99 28ms | 30d Uptime 99.95% | QPS 45,000${c.reset}`,
    `  ${c.blue}Code: https://github.com/jagannath-m/streamforge${c.reset}`,
    "",
    `${c.bold}${c.yellow}# SYSTEM COMMANDS${c.reset}`,
    `  ${c.dim}$ curl -sL https://${OWNER_CONFIG.domain}/resume.json  # Raw JSON Resume${c.reset}`,
    `  ${c.dim}$ curl -sL https://${OWNER_CONFIG.domain}/.well-known/security.txt${c.reset}`,
    `  ${c.dim}$ open https://${OWNER_CONFIG.domain}                   # Browser UI with Live Trace Waterfall${c.reset}`,
    "",
    `${c.gray}-- End of transmission [200 OK] --${c.reset}`,
  ];

  return lines.join("\n");
}
