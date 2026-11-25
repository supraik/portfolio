"use client";

import React from "react";
import { FileText, Cpu, CheckSquare, Sparkles, Code2, GitFork, Star } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export function ReadmeSection() {
  return (
    <section id="about" className="border border-border-dim/80 rounded-xl bg-surface/90 backdrop-blur-md shadow-hud-card overflow-hidden">
      {/* README Header tab bar */}
      <div className="bg-canvas/90 border-b border-border-dim/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-fg-muted">
        <div className="flex items-center gap-2 text-fg">
          <FileText className="w-4 h-4 text-telemetry" />
          <span className="font-bold">README.md</span>
          <span className="text-fg-muted font-normal text-[11px]">&bull; origin/main &bull; 1.4 KB</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-fg-muted">
            <GitFork className="w-3 h-3" /> 18 forks
          </span>
          <span className="flex items-center gap-1 text-warn">
            <Star className="w-3 h-3" /> 240 stars
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6 max-w-prose">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>EXECUTIVE_PROFILE // SYSTEMS_ENGINEERING</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-fg">
            Engineering Systems for Extreme Reliability
          </h2>
          <p className="text-sm text-fg-muted mt-2 leading-relaxed font-sans">
            I am a Staff Systems & Full-Stack Engineer based in {OWNER_CONFIG.location}.
            I specialize in designing and shipping high-throughput distributed backends, Raft consensus replication, eBPF kernel network observability, and zero-lock database migrations on multi-terabyte datasets.
          </p>
        </div>

        {/* Language Composition Bar */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="text-[10px] text-fg-muted uppercase tracking-wider">Production Language Composition:</div>
          <div className="h-2 rounded-full bg-canvas flex overflow-hidden border border-border-dim/80">
            <div className="bg-telemetry" style={{ width: "42%" }} title="Go: 42%" />
            <div className="bg-purple" style={{ width: "32%" }} title="Rust: 32%" />
            <div className="bg-success" style={{ width: "26%" }} title="TypeScript / Systems: 26%" />
          </div>
          <div className="flex justify-between text-[10px] text-fg-muted pt-0.5">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-telemetry" /> Go (42%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple" /> Rust (32%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> TypeScript (26%)</span>
          </div>
        </div>

        {/* Currently Working On Callout */}
        <div className="border border-telemetry/40 bg-telemetry/5 p-4 rounded-xl text-xs font-mono space-y-2 relative overflow-hidden">
          <div className="text-telemetry font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>&gt; CURRENT_RESEARCH_SPRINT // ACTIVE_DEPLOY</span>
          </div>
          <p className="text-fg-muted leading-relaxed font-sans text-xs">
            Optimizing Raft log compaction efficiency with zero-copy memory-mapped arena allocators and profiling Linux socket lifecycle latencies using custom eBPF ring buffers under 10Gbps line-rate traffic.
          </p>
        </div>

        {/* Principles */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold font-mono text-fg uppercase tracking-wide">
            Operating Axioms
          </h3>
          <ul className="space-y-2.5 text-xs font-mono text-fg-muted">
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong className="text-fg">Observability by construction:</strong> If a service lacks distributed trace propagation and histogram latencies, it does not exist in production.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong className="text-fg">Blameless retrospective posture:</strong> Human error is an outcome, not a cause. Harden system guardrails to make catastrophic states structurally impossible.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong className="text-fg">Radical architectural clarity:</strong> Code is read 10x more than written; build interfaces that are obvious to inspect and impossible to misuse.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
