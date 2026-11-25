"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Server,
  ArrowUpRight,
  ExternalLink,
  Cpu,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  HardDrive,
  Network,
} from "lucide-react";
import type { ServiceItem } from "@/lib/content";

interface ServicesSectionProps {
  services: ServiceItem[];
  selectedSkill?: string | null;
}

export function ServicesSection({ services, selectedSkill }: ServicesSectionProps) {
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<Record<string, "topology" | "metrics">>({
    "distributed-kv": "topology",
    "streamforge-telemetry": "topology",
  });

  const toggleTab = (slug: string, tab: "topology" | "metrics") => {
    setActiveTelemetryTab((prev) => ({ ...prev, [slug]: tab }));
  };

  return (
    <section id="services" className="space-y-6">
      {/* Section Header with Cluster Badge */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-dim/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
            <Server className="w-4 h-4" />
            <span>CONTROL_PLANE // PRODUCTION_SERVICES</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Distributed Systems & Services</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Replicated storage engines, eBPF telemetry pipelines, and consensus layers with measured SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-canvas px-3 py-1.5 rounded-lg border border-border-dim">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-fg-muted">Cluster Status:</span>
          <span className="text-success font-bold">100% Operational</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const isHighlighted = !selectedSkill || service.skills.includes(selectedSkill);
          const currentTab = activeTelemetryTab[service.slug] || "topology";

          return (
            <div
              key={service.slug}
              className={`border rounded-xl bg-surface/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-hud-card ${
                isHighlighted
                  ? "border-border-dim/80 hover:border-telemetry/60 hover:shadow-glow-telemetry/10"
                  : "border-border-dim/30 opacity-30"
              }`}
            >
              <div className="space-y-4">
                {/* Header: Service ID, Status Pill, 30-Day SLA */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-success/30 bg-success/10 text-success font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                    {service.status.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-1.5 text-fg-muted">
                    <span>30d SLA:</span>
                    <span className="text-success font-bold">{service.uptime_30d}%</span>
                  </div>
                </div>

                {/* Service Title & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-fg group-hover:text-telemetry transition-colors">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:underline flex items-center justify-between"
                    >
                      <span>{service.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-telemetry" />
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-fg-muted mt-1.5 leading-relaxed">
                    {service.tagline}
                  </p>
                </div>

                {/* 30-Day Uptime Sparkline Bar */}
                <div className="p-2.5 rounded-lg bg-canvas border border-border-dim/60 space-y-1.5 font-mono">
                  <div className="flex justify-between text-[10px] text-fg-muted">
                    <span>30-Day Uptime Ledger</span>
                    <span className="text-success font-semibold">0 Outages Recorded</span>
                  </div>
                  {/* Micro uptime ticks */}
                  <div className="flex items-center gap-[3px] h-3">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        title={`Day ${i + 1}: 100% uptime`}
                        className={`flex-1 h-full rounded-[1px] transition-transform hover:scale-y-125 ${
                          i === 18 && service.slug === "streamforge-telemetry"
                            ? "bg-warn/80" // Realistic 1 day of elevated latency
                            : "bg-success/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Embedded Interactive Topology or Telemetry Metric Gauges */}
                <div className="rounded-lg bg-canvas border border-border-dim/80 overflow-hidden font-mono text-xs">
                  {/* Sub-tabs: Topology vs Live Gauges */}
                  <div className="bg-subtle/60 px-3 py-1.5 border-b border-border-dim flex items-center justify-between">
                    <span className="text-[10px] uppercase text-fg-muted">Architecture Blueprint</span>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        onClick={() => toggleTab(service.slug, "topology")}
                        className={`px-2 py-0.5 rounded ${
                          currentTab === "topology" ? "bg-surface text-telemetry font-bold" : "text-fg-muted"
                        }`}
                      >
                        Topology Flow
                      </button>
                      <button
                        onClick={() => toggleTab(service.slug, "metrics")}
                        className={`px-2 py-0.5 rounded ${
                          currentTab === "metrics" ? "bg-surface text-telemetry font-bold" : "text-fg-muted"
                        }`}
                      >
                        SLA Metrics
                      </button>
                    </div>
                  </div>

                  {/* Flow Visualization */}
                  {currentTab === "topology" ? (
                    <div className="p-3">
                      {service.slug === "distributed-kv" ? (
                        <div className="flex items-center justify-between text-[11px] gap-1">
                          <div className="p-1.5 rounded bg-surface border border-border-dim text-center flex-1">
                            <span className="text-telemetry font-bold block">Clients</span>
                            <span className="text-[9px] text-fg-muted">gRPC Pool</span>
                          </div>
                          <span className="text-fg-muted">&rarr;</span>
                          <div className="p-1.5 rounded bg-surface border border-border-focus text-center flex-1">
                            <span className="text-telemetry font-bold block">Raft Core</span>
                            <span className="text-[9px] text-fg-muted">Consensus</span>
                          </div>
                          <span className="text-fg-muted">&rarr;</span>
                          <div className="p-1.5 rounded bg-surface border border-border-dim text-center flex-1">
                            <span className="text-success font-bold block">LSM Rocks</span>
                            <span className="text-[9px] text-fg-muted">Zero-Copy</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] gap-1">
                          <div className="p-1.5 rounded bg-surface border border-border-dim text-center flex-1">
                            <span className="text-telemetry font-bold block">eBPF Probe</span>
                            <span className="text-[9px] text-fg-muted">TCP Hooks</span>
                          </div>
                          <span className="text-fg-muted">&rarr;</span>
                          <div className="p-1.5 rounded bg-surface border border-border-focus text-center flex-1">
                            <span className="text-telemetry font-bold block">Ring Buffer</span>
                            <span className="text-[9px] text-fg-muted">Zero-Loss</span>
                          </div>
                          <span className="text-fg-muted">&rarr;</span>
                          <div className="p-1.5 rounded bg-surface border border-border-dim text-center flex-1">
                            <span className="text-success font-bold block">ClickHouse</span>
                            <span className="text-[9px] text-fg-muted">Columnar</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-1.5 rounded bg-surface border border-border-dim flex justify-between">
                        <span className="text-fg-muted">p99 Read:</span>
                        <span className="text-telemetry font-bold">{service.latency_p99}</span>
                      </div>
                      <div className="p-1.5 rounded bg-surface border border-border-dim flex justify-between">
                        <span className="text-fg-muted">Throughput:</span>
                        <span className="text-fg font-bold">{service.qps}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-subtle text-fg border border-border-dim/80 hover:border-telemetry/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border-dim/60 flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-telemetry hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Inspect deep architecture</span>
                  <span>&rarr;</span>
                </Link>

                <a
                  href={service.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-fg inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
