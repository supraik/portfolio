"use client";

import React, { useState } from "react";
import {
  GitCommit,
  GitBranch,
  GitMerge,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Tag,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  FileCode,
} from "lucide-react";
import type { ExperienceCommitItem } from "@/lib/content";

interface GitLogProps {
  commits: ExperienceCommitItem[];
}

// Realistic code diffs for each career commit
const COMMIT_CODE_DIFFS: Record<string, string[]> = {
  "c89f2a4": [
    "@@ -42,7 +42,16 @@ func (c *ClusterCoordinator) ElectLeader(ctx context.Context) error {",
    "-   // Legacy synchronous polling with blocking sleep",
    "-   time.Sleep(500 * time.Millisecond)",
    "+   // Raft heartbeat election with jittered backoff & eBPF network probe",
    "+   ticker := time.NewTicker(c.heartbeatTimeout + jitter(50*time.Millisecond))",
    "+   defer ticker.Stop()",
    "+   select {",
    "+   case <-ticker.C:",
    "+       if err := c.proposeLeadership(ctx); err != nil {",
    "+           c.telemetry.RecordElectionFailure(err)",
    "+           return err",
    "+       }",
    "+   }",
  ],
  "3a18e01": [
    "@@ -108,6 +108,14 @@ impl StreamIngestRingBuffer {",
    "-   let mut buffer = Vec::with_capacity(1024);",
    "+   // Zero-allocation ring buffer with cacheline-aligned atomic heads",
    "+   let ring = Arc::new(AtomicRing::new(CAPACITY));",
    "+   tokio::spawn(async move {",
    "+       while let Some(batch) = consumer.recv().await {",
    "+           ring.push_batch(batch).unwrap_or_else(|e| log::warn!(\"Backpressure: {}\", e));",
    "+       }",
    "+   });",
  ],
  "f421b8c": [
    "@@ -18,4 +18,9 @@ export class HostTelemetryDaemon {",
    "-   execSync('ps aux | grep node');",
    "+   // High-frequency non-blocking /proc/stat memory-mapped reader",
    "+   private readonly statStream = fs.createReadStream('/proc/stat', { bufferSize: 2048 });",
    "+   public captureCpuJitter(): Observable<MetricPoint> {",
    "+       return this.streamParser.observe();",
    "+   }",
  ],
};

export function GitLog({ commits }: GitLogProps) {
  const [expandedHashes, setExpandedHashes] = useState<Record<string, boolean>>({
    [commits[0]?.hash || ""]: true,
  });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const toggleDiff = (hash: string) => {
    setExpandedHashes((prev) => ({
      ...prev,
      [hash]: !prev[hash],
    }));
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const branches = ["all", "main", "feature/stream-ingest", "feature/observability"];

  const filteredCommits = selectedBranch === "all"
    ? commits
    : commits.filter((c) => c.branch === selectedBranch);

  return (
    <div className="border border-border-dim/80 rounded-xl bg-surface/90 backdrop-blur-md p-5 sm:p-6 shadow-hud-card space-y-6">
      {/* Git Log Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-dim/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
            <GitBranch className="w-4 h-4" />
            <span>VCS // CAREER_COMMIT_GRAPH</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Career as a Git History</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Interactive commit DAG with verified GPG signatures, merge nodes, and code diff gutters.
          </p>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center gap-1.5 bg-canvas p-1 rounded-lg border border-border-dim text-[11px] font-mono">
          <span className="text-fg-muted px-2">branch:</span>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedBranch === b
                  ? "bg-border-focus text-white font-bold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Commit Tree List */}
      <div className="relative pl-7 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-telemetry before:via-purple before:to-success">
        {filteredCommits.map((commit, index) => {
          const isExpanded = !!expandedHashes[commit.hash];
          const isMain = commit.branch === "main";
          const codeDiff = COMMIT_CODE_DIFFS[commit.hash] || [
            "@@ -1,3 +1,4 @@",
            "+ // Refactored subsystem architecture",
          ];

          return (
            <div key={commit.hash} className="relative group">
              {/* Commit node bullet with glow */}
              <div
                className={`absolute -left-7 top-1 w-6 h-6 rounded-full bg-surface border-2 flex items-center justify-center transition-all ${
                  isMain
                    ? "border-telemetry shadow-glow-telemetry"
                    : "border-purple shadow-sm"
                }`}
              >
                {index === 0 ? (
                  <GitCommit className="w-3.5 h-3.5 text-telemetry" />
                ) : (
                  <GitMerge className="w-3 h-3 text-purple" />
                )}
              </div>

              {/* Commit Entry Body */}
              <div className="border border-border-dim/80 hover:border-border-focus/50 rounded-xl bg-canvas/70 p-4 sm:p-5 space-y-3 transition-all">
                {/* Top Hash & Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyHash(commit.hash)}
                      title="Copy full commit SHA"
                      className="px-2 py-0.5 rounded bg-subtle hover:bg-border-dim text-telemetry font-bold flex items-center gap-1 border border-border-dim"
                    >
                      {copiedHash === commit.hash ? (
                        <>
                          <Check className="w-3 h-3 text-success" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{commit.hash}</span>
                        </>
                      )}
                    </button>

                    <span className="px-2 py-0.5 rounded text-[11px] bg-purple/15 text-purple border border-purple/30 font-semibold">
                      {commit.branch}
                    </span>

                    <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-success/10 text-success text-[10px] border border-success/30">
                      <ShieldCheck className="w-3 h-3" />
                      Verified GPG
                    </span>
                  </div>

                  <span className="text-fg-muted">{commit.period} &bull; {commit.location}</span>
                </div>

                {/* Role & Company Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-fg">
                    {commit.role} <span className="text-telemetry font-normal">@</span> {commit.company}
                  </h3>

                  {/* Additions / Deletions Diff Counters */}
                  <div className="flex items-center gap-2 text-xs font-mono bg-surface px-2.5 py-1 rounded border border-border-dim">
                    <span className="text-success font-bold inline-flex items-center gap-0.5">
                      <Plus className="w-3 h-3" />
                      {commit.diff.additions.toLocaleString()}
                    </span>
                    <span className="text-crit font-bold inline-flex items-center gap-0.5">
                      <Minus className="w-3 h-3" />
                      {commit.diff.deletions.toLocaleString()}
                    </span>
                    <span className="text-fg-muted text-[11px]">in {commit.diff.files_changed} files</span>
                  </div>
                </div>

                {/* Git commit message in code block */}
                <div className="font-mono text-xs text-fg-muted bg-surface/80 p-2.5 rounded-lg border border-border-dim/60 flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-telemetry shrink-0" />
                  <span className="text-fg font-medium">{commit.message}</span>
                </div>

                {/* Expand / Collapse Diff Preview Button */}
                <button
                  onClick={() => toggleDiff(commit.hash)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline pt-1"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>{isExpanded ? "Hide Code Diff & Impact" : "Inspect Code Diff & Contributions"}</span>
                </button>

                {/* Diff Viewer Drawer */}
                {isExpanded && (
                  <div className="pt-3 border-t border-border-dim/60 space-y-4 font-mono text-xs">
                    <p className="text-fg-muted leading-relaxed font-sans text-sm">
                      {commit.summary}
                    </p>

                    {/* Contributions Highlights */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-fg-muted uppercase tracking-wider font-bold">
                        Architectural Deliverables:
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-fg text-xs font-sans">
                        {commit.highlights.map((h, i) => (
                          <li key={i} className="leading-normal">{h}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Syntax-Highlighted Simulated Diff Gutter */}
                    <div className="rounded-lg bg-surface border border-border-dim overflow-hidden font-mono text-[11px]">
                      <div className="bg-subtle/80 px-3 py-1.5 border-b border-border-dim flex items-center justify-between text-fg-muted">
                        <span className="flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-telemetry" />
                          core/coordinator/scheduler.go
                        </span>
                        <span>diff --git a/scheduler.go b/scheduler.go</span>
                      </div>
                      <div className="p-3 overflow-x-auto space-y-0.5 leading-relaxed">
                        {codeDiff.map((line, lidx) => {
                          const isAdd = line.startsWith("+");
                          const isDel = line.startsWith("-");
                          const isHeader = line.startsWith("@@");

                          return (
                            <div
                              key={lidx}
                              className={`px-1 py-0.5 rounded flex items-center gap-2 ${
                                isAdd
                                  ? "bg-success/15 text-success font-medium"
                                  : isDel
                                  ? "bg-crit/15 text-crit font-medium"
                                  : isHeader
                                  ? "text-telemetry font-bold"
                                  : "text-fg-muted"
                              }`}
                            >
                              <span className="select-none w-4 text-center font-bold">
                                {isAdd ? "+" : isDel ? "-" : " "}
                              </span>
                              <span>{line.replace(/^[+-]/, "")}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Tag className="w-3.5 h-3.5 text-fg-muted" />
                      <span className="text-[10px] text-fg-muted">Skills wired:</span>
                      {commit.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] bg-subtle text-fg border border-border-dim"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
