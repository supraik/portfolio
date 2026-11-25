"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Layers,
  Flame,
  Info,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Radio,
} from "lucide-react";

interface SpanTiming {
  id: string;
  name: string;
  durationMs: number;
  offsetMs: number;
  service: string;
  category: "edge" | "security" | "database" | "compute";
  status: string;
  color: string;
  attributes: Record<string, string>;
}

export function TraceWaterfall() {
  const [activeTab, setActiveTab] = useState<"waterfall" | "flamegraph" | "raw">("waterfall");
  const [hoveredSpan, setHoveredSpan] = useState<SpanTiming | null>(null);
  const [selectedSpan, setSelectedSpan] = useState<SpanTiming | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [traceKey, setTraceKey] = useState(0);
  const [traceId, setTraceId] = useState("tr-b49f28a1");
  const [clientIp, setClientIp] = useState("103.21.244.0 (Anonymized /24)");
  const [edgeRegion, setEdgeRegion] = useState("Asia-South1 (BOM)");

  const baseSpans: SpanTiming[] = [
    {
      id: "sp-01",
      name: "edge_ingress_routing",
      durationMs: 8,
      offsetMs: 0,
      service: "edge-gateway",
      category: "edge",
      status: "200 OK",
      color: "var(--accent-telemetry)",
      attributes: {
        "http.flavor": "HTTP/3 (QUIC)",
        "tls.version": "TLS 1.3",
        "net.transport": "ip_tcp",
        "edge.pop": "BOM-IN",
        "asn.org": "Cloudflare Anycast",
      },
    },
    {
      id: "sp-02",
      name: "security_nonce_gate",
      durationMs: 4,
      offsetMs: 7,
      service: "shield-proxy",
      category: "security",
      status: "PASS",
      color: "var(--accent-success)",
      attributes: {
        "csp.nonce": "sha256-4b8c...e19f",
        "rate_limit.bucket": "tokens_ok (59/60)",
        "bot_score": "0.02 (human)",
        "audit.ip_retention": "DISCARDED",
      },
    },
    {
      id: "sp-03",
      name: "db_pool_lease_neon",
      durationMs: 16,
      offsetMs: 11,
      service: "postgres-cluster",
      category: "database",
      status: "HEALTHY",
      color: "var(--accent-purple)",
      attributes: {
        "db.system": "postgresql",
        "db.name": "portfolio_prod",
        "pool.active_connections": "3/20",
        "query.read_replica": "lease_granted (1.4ms)",
      },
    },
    {
      id: "sp-04",
      name: "rsc_hydration_stream",
      durationMs: 21,
      offsetMs: 25,
      service: "nextjs-ssr",
      category: "compute",
      status: "STREAMING",
      color: "var(--accent-telemetry)",
      attributes: {
        "node.version": "v20.18.0",
        "react.render": "React 19 Server Component",
        "bundle.first_load": "110 KB (Raw) / 38 KB (Gzip)",
        "cache.status": "STALE_WHILE_REVALIDATE",
      },
    },
  ];

  const totalDuration = 48; // ms

  const handleRetrace = () => {
    setIsTracing(true);
    setTraceId("tr-" + Math.random().toString(16).substring(2, 10));
    setTraceKey((k) => k + 1);
    setTimeout(() => setIsTracing(false), 800);
  };

  useEffect(() => {
    // Initial random trace ID
    setTraceId("tr-" + Math.random().toString(16).substring(2, 10));
  }, []);

  const activeFocus = hoveredSpan || selectedSpan || baseSpans[0];

  return (
    <div className="relative border border-border-dim/80 hover:border-telemetry/40 transition-all rounded-xl bg-surface/90 backdrop-blur-md shadow-hud-card overflow-hidden">
      {/* Laser scan line animation on trigger */}
      {isTracing && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-telemetry to-transparent shadow-glow-telemetry animate-laser-draw z-30" />
      )}

      {/* Top Telemetry Header Bar */}
      <div className="bg-canvas/90 border-b border-border-dim/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span className="absolute w-4 h-4 rounded-full bg-success/40 animate-ping"></span>
          </div>
          <span className="font-bold text-fg tracking-wide flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-telemetry" />
            LIVE_REQUEST_TRACE
          </span>
          <span className="text-telemetry font-mono bg-telemetry/10 border border-telemetry/20 px-2 py-0.5 rounded text-[11px]">
            {traceId}
          </span>
        </div>

        {/* View Switchers & Refresh Button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border-dim bg-canvas p-0.5 text-[11px]">
            <button
              onClick={() => setActiveTab("waterfall")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "waterfall"
                  ? "bg-surface text-telemetry font-bold shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Waterfall</span>
            </button>
            <button
              onClick={() => setActiveTab("flamegraph")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "flamegraph"
                  ? "bg-surface text-telemetry font-bold shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Flamegraph</span>
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "raw"
                  ? "bg-surface text-telemetry font-bold shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <Info className="w-3 h-3" />
              <span>Span Metadata</span>
            </button>
          </div>

          <button
            onClick={handleRetrace}
            disabled={isTracing}
            title="Re-execute request trace"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-dim bg-surface hover:bg-subtle text-fg-muted hover:text-fg transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isTracing ? "animate-spin text-telemetry" : ""}`} />
            <span className="hidden sm:inline">Trace Now</span>
          </button>
        </div>
      </div>

      {/* Main Trace Instrument Substrate */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Metric Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-canvas/70 border border-border-dim/60 flex items-center justify-between">
            <span className="text-fg-muted text-[10px] uppercase">Latency</span>
            <span className="font-bold text-success flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {totalDuration}ms (p50)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-canvas/70 border border-border-dim/60 flex items-center justify-between">
            <span className="text-fg-muted text-[10px] uppercase">Edge PoP</span>
            <span className="font-bold text-telemetry flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {edgeRegion}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-canvas/70 border border-border-dim/60 flex items-center justify-between">
            <span className="text-fg-muted text-[10px] uppercase">Protocol</span>
            <span className="font-bold text-fg">HTTP/3 QUIC</span>
          </div>
          <div className="p-2.5 rounded-lg bg-canvas/70 border border-border-dim/60 flex items-center justify-between">
            <span className="text-fg-muted text-[10px] uppercase">Zero-IP Leak</span>
            <span className="font-bold text-success flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              W3C Verified
            </span>
          </div>
        </div>

        {/* TAB 1: WATERFALL SPANS VIEW */}
        {activeTab === "waterfall" && (
          <div className="space-y-2.5 font-mono text-xs">
            {/* Timeline ruler */}
            <div className="grid grid-cols-12 text-[10px] text-fg-muted/60 pb-1 border-b border-border-dim/40 px-2">
              <span className="col-span-4 sm:col-span-3">SPAN IDENTIFIER</span>
              <div className="col-span-6 sm:col-span-7 flex justify-between px-1">
                <span>0ms</span>
                <span>12ms</span>
                <span>24ms</span>
                <span>36ms</span>
                <span>48ms</span>
              </div>
              <span className="col-span-2 text-right">DURATION</span>
            </div>

            {/* Spans */}
            {baseSpans.map((span) => {
              const leftPct = (span.offsetMs / totalDuration) * 100;
              const widthPct = Math.max(12, (span.durationMs / totalDuration) * 100);
              const isHovered = activeFocus.id === span.id;

              return (
                <div
                  key={span.id}
                  onMouseEnter={() => setHoveredSpan(span)}
                  onClick={() => setSelectedSpan(span)}
                  className={`grid grid-cols-12 items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    isHovered
                      ? "bg-subtle border border-border-focus/60 shadow-sm"
                      : "hover:bg-subtle/40 border border-transparent"
                  }`}
                >
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: span.color }}
                    />
                    <span className="text-fg font-medium truncate">{span.name}</span>
                  </div>

                  {/* Waterfall Bar Track */}
                  <div className="col-span-6 sm:col-span-7 relative h-5 bg-canvas/80 rounded-md border border-border-dim/60 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded flex items-center px-2 text-[10px] text-white font-bold transition-all duration-300"
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.min(100 - leftPct, widthPct)}%`,
                        backgroundColor: span.color,
                        opacity: isHovered ? 1 : 0.85,
                        boxShadow: isHovered ? "0 0 12px rgba(56, 189, 248, 0.4)" : "none",
                      }}
                    >
                      <span className="truncate">{span.durationMs}ms</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right text-fg-muted tabular-nums">
                    {span.durationMs}ms
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: FLAMEGRAPH VIEW */}
        {activeTab === "flamegraph" && (
          <div className="p-4 rounded-lg bg-canvas border border-border-dim space-y-2 font-mono text-xs">
            <div className="text-[11px] text-fg-muted mb-2">Hierarchical Execution Stack (Flamegraph):</div>
            {/* Level 0: Total Request */}
            <div className="w-full bg-border-dim/80 text-fg text-center py-2 rounded font-bold border border-border-dim">
              root_http_request (48ms total)
            </div>
            {/* Level 1: Edge & Ingress */}
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-3 bg-telemetry/40 text-telemetry text-center py-1.5 rounded font-semibold border border-telemetry/30 truncate">
                edge (8ms)
              </div>
              <div className="col-span-9 bg-purple/30 text-purple text-center py-1.5 rounded font-semibold border border-purple/30 truncate">
                origin_execution (40ms)
              </div>
            </div>
            {/* Level 2: DB & Compute */}
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-3" />
              <div className="col-span-4 bg-success/30 text-success text-center py-1.5 rounded font-semibold border border-success/30 truncate">
                neon_db (16ms)
              </div>
              <div className="col-span-5 bg-telemetry/40 text-telemetry text-center py-1.5 rounded font-semibold border border-telemetry/30 truncate">
                react_stream (21ms)
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPAN METADATA INSPECTOR */}
        {activeTab === "raw" && (
          <div className="p-4 rounded-lg bg-canvas border border-border-dim font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-telemetry font-bold border-b border-border-dim pb-2">
              <span>SPAN ATTRIBUTES // {activeFocus.name}</span>
              <span className="text-fg-muted text-[11px]">{activeFocus.service}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {Object.entries(activeFocus.attributes).map(([k, v]) => (
                <div key={k} className="p-2 rounded bg-surface border border-border-dim flex justify-between">
                  <span className="text-fg-muted">{k}:</span>
                  <span className="text-fg font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected / Hovered Span Deep Breakdown Footer */}
        <div className="pt-3 border-t border-border-dim/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono bg-canvas/50 -mx-4 -mb-4 p-3 rounded-b-xl">
          <div className="flex items-center gap-2">
            <span className="text-fg-muted">Active Span:</span>
            <span className="font-bold text-fg flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-telemetry" />
              {activeFocus.name} ({activeFocus.durationMs}ms)
            </span>
          </div>
          <div className="text-fg-muted flex items-center gap-4">
            <span>Status: <strong className="text-success">{activeFocus.status}</strong></span>
            <span>Service: <strong className="text-fg">{activeFocus.service}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
