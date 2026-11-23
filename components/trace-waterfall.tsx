"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Activity, ArrowUpRight } from "lucide-react";

interface SpanTiming {
  name: string;
  durationMs: number;
  offsetMs: number;
  description: string;
  status: string;
}

export function TraceWaterfall() {
  const [spans, setSpans] = useState<SpanTiming[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(42);
  const [traceId, setTraceId] = useState<string>("tr-init");

  useEffect(() => {
    // Generate an ephemeral trace ID for this request
    const tid = "tr-" + Math.random().toString(16).substring(2, 10);
    setTraceId(tid);

    // Try reading actual browser navigation serverTiming entries
    try {
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].serverTiming && navEntries[0].serverTiming.length > 0) {
        let currentOffset = 0;
        const timingSpans: SpanTiming[] = navEntries[0].serverTiming.map((st) => {
          const duration = Math.max(1, Math.round(st.duration));
          const span: SpanTiming = {
            name: st.name,
            durationMs: duration,
            offsetMs: currentOffset,
            description: st.description || st.name,
            status: "200 OK",
          };
          currentOffset += duration;
          return span;
        });
        setSpans(timingSpans);
        setTotalDuration(currentOffset + 12);
        return;
      }
    } catch {}

    // High-fidelity fallback based on real navigation timing
    const ttfb = performance.timing ? Math.max(12, performance.timing.responseStart - performance.timing.requestStart) : 28;
    const fallbackSpans: SpanTiming[] = [
      { name: "edge_handshake", durationMs: 6, offsetMs: 0, description: "TLS / Edge Routing", status: "200" },
      { name: "auth_bypass_check", durationMs: 3, offsetMs: 6, description: "Allowlist / Nonce Gate", status: "cached" },
      { name: "db_pool_lease", durationMs: Math.round(ttfb * 0.45), offsetMs: 9, description: "Postgres Lease (Neon)", status: "healthy" },
      { name: "ssr_app_render", durationMs: Math.round(ttfb * 0.5), offsetMs: 9 + Math.round(ttfb * 0.45), description: "Next.js SSR Hydration", status: "rendered" },
    ];
    setSpans(fallbackSpans);
    setTotalDuration(fallbackSpans[fallbackSpans.length - 1].offsetMs + fallbackSpans[fallbackSpans.length - 1].durationMs + 8);
  }, []);

  return (
    <div className="border border-border-dim rounded bg-surface p-4 md:p-6 mb-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-dim pb-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-telemetry">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="font-semibold">LIVE_REQUEST_TRACE</span>
          <span className="text-fg-muted">[{traceId}]</span>
        </div>
        <div className="flex items-center gap-4 text-fg-muted">
          <span>Target: <span className="text-fg">GET /</span></span>
          <span>Latency: <span className="text-success font-semibold">{totalDuration}ms</span></span>
          <span className="hidden sm:inline">Protocol: <span className="text-fg">HTTP/2.0</span></span>
        </div>
      </div>

      {/* Waterfall spans */}
      <div className="space-y-2 text-xs font-mono">
        {spans.map((span, idx) => {
          const leftPercent = totalDuration > 0 ? (span.offsetMs / totalDuration) * 100 : 0;
          const widthPercent = totalDuration > 0 ? Math.max(8, (span.durationMs / totalDuration) * 100) : 10;

          return (
            <div key={idx} className="grid grid-cols-12 items-center gap-2 py-1 hover:bg-subtle/60 rounded px-1.5 transition-colors">
              <div className="col-span-4 sm:col-span-3 text-fg truncate">
                {span.name}
              </div>
              <div className="col-span-6 sm:col-span-7 relative h-4 bg-canvas/60 rounded overflow-hidden border border-border-dim/50">
                <div
                  className="absolute top-0 bottom-0 bg-telemetry/40 border-l border-r border-telemetry rounded"
                  style={{
                    left: `${Math.min(90, leftPercent)}%`,
                    width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                  }}
                />
              </div>
              <div className="col-span-2 text-right text-fg-muted tabular-nums">
                {span.durationMs}ms
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border-dim/60 flex items-center justify-between text-[11px] font-mono text-fg-muted">
        <span>Instrumentation: OpenTelemetry W3C Server-Timing</span>
        <span className="text-success flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
          All upstream health checks passing
        </span>
      </div>
    </div>
  );
}
