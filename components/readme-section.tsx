"use client";

import React from "react";
import { FileText, Cpu, CheckSquare } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export function ReadmeSection() {
  return (
    <section id="about" className="border border-border-dim rounded bg-surface shadow-sm overflow-hidden">
      {/* README Header tab bar */}
      <div className="bg-canvas border-b border-border-dim px-4 py-2.5 flex items-center justify-between text-xs font-mono text-fg-muted">
        <div className="flex items-center gap-2 text-fg">
          <FileText className="w-4 h-4 text-telemetry" />
          <span className="font-semibold">README.md</span>
        </div>
        <span>branch: main &bull; 1.2 KB</span>
      </div>

      <div className="p-6 space-y-6 max-w-prose">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-fg mb-3">
            ## Overview
          </h2>
          <p className="text-sm text-fg leading-relaxed">
            I am a Staff Systems & Full-Stack Engineer based in {OWNER_CONFIG.location}.
            My engineering focus centers on high-throughput backend services, distributed consensus algorithms, eBPF network telemetry, and bulletproof zero-downtime database operations.
          </p>
        </div>

        {/* Currently Working On Callout */}
        <div className="border-l-2 border-telemetry bg-subtle/50 p-4 rounded-r text-xs font-mono space-y-2">
          <div className="text-telemetry font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>&gt; CURRENTLY_DEPLOYING // RESEARCH_SPRINT</span>
          </div>
          <p className="text-fg-muted leading-relaxed">
            Investigating Raft consensus log compaction efficiency with memory-mapped zero-copy allocators and exploring eBPF kernel socket tracing for automated incident discovery.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-fg mb-2">
            ### Core Operating Principles
          </h3>
          <ul className="space-y-2 text-xs font-mono text-fg-muted">
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong>Observability is not optional:</strong> If a service isn't instrumented with metrics, logs, and distributed traces, it does not exist in production.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong>Blameless retrospective posture:</strong> Systems fail because processes and guardrails allow them to; engineer failures into non-events.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span><strong>Radical clarity:</strong> Code should read like plain documentation; interfaces must be impossible to misuse.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
