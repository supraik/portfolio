"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { IncidentItem } from "@/lib/content";

interface IncidentsSectionProps {
  incidents: IncidentItem[];
}

export function IncidentsSection({ incidents }: IncidentsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="incidents" className="space-y-6">
      {/* SRE Command Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-dim/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-crit mb-1">
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>INCIDENT_WAR_ROOM // BLAMELESS_POSTMORTEMS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Engineering Failures & Incidents</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Complex distributed systems fail in non-trivial ways. What distinguishes senior engineering is diagnosis speed, root cause depth, and architectural prevention.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-canvas px-3 py-1.5 rounded-lg border border-border-dim">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="text-fg-muted">Current MTTR:</span>
          <span className="text-success font-bold">&lt; 25m</span>
        </div>
      </div>

      {/* Incidents Command Cards */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const isExpanded = expandedId === incident.id;

          return (
            <div
              key={incident.id}
              className="border border-border-dim/80 hover:border-crit/40 rounded-xl bg-surface/90 backdrop-blur-md overflow-hidden transition-all shadow-hud-card"
            >
              {/* Card Summary Banner */}
              <div
                onClick={() => toggleExpand(incident.id)}
                className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-subtle/30 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded border border-crit/40 bg-crit/15 text-crit font-bold flex items-center gap-1 shadow-glow-crit/20">
                      <Flame className="w-3 h-3" />
                      {incident.severity}
                    </span>
                    <span className="text-telemetry font-bold">{incident.id}</span>
                    <span className="text-fg-muted">[{incident.date}]</span>
                    <span className="text-success font-semibold flex items-center gap-1 ml-auto sm:ml-0">
                      <CheckCircle2 className="w-3 h-3" />
                      {incident.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-fg group-hover:text-telemetry transition-colors">
                    {incident.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-fg-muted">
                    <strong className="text-fg">Customer Impact:</strong> {incident.impact}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-fg-muted block text-[10px] uppercase">Outage Duration</span>
                    <span className="text-warn font-bold">{incident.duration}</span>
                  </div>
                  <button className="p-2 rounded-lg bg-canvas border border-border-dim text-fg-muted hover:text-fg">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Incident War Room Timeline & Root Cause */}
              {isExpanded && (
                <div className="border-t border-border-dim/80 p-5 bg-canvas/80 space-y-5 font-mono text-xs">
                  {/* Root Cause Box */}
                  <div className="p-4 rounded-lg bg-surface border border-warn/30 space-y-1.5">
                    <div className="text-warn font-bold flex items-center gap-1.5 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>DIAGNOSED ROOT CAUSE:</span>
                    </div>
                    <p className="text-fg leading-relaxed font-sans text-sm">
                      {incident.root_cause}
                    </p>
                  </div>

                  {/* Incident Triage Timeline */}
                  <div className="space-y-2">
                    <div className="text-fg-muted uppercase text-[10px] tracking-wider font-bold">
                      Incident Timeline & Intervention:
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-border-dim">
                      <div className="relative pl-3">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-warn" />
                        <span className="text-warn font-bold">T-00:00:</span> Planned Sentinel failover exposed unconfigured socket connection timeout.
                      </div>
                      <div className="relative pl-3">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-crit" />
                        <span className="text-crit font-bold">T-00:02:</span> Worker thread pool saturated at 100% in SYN_SENT socket states.
                      </div>
                      <div className="relative pl-3">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-telemetry" />
                        <span className="text-telemetry font-bold">T-00:14:</span> Hotfix deployed enforcing 250ms socket timeouts + jittered backoff.
                      </div>
                      <div className="relative pl-3">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-success" />
                        <span className="text-success font-bold">T-00:24:</span> Quorum restored. All error rates returned to baseline &lt; 0.02%.
                      </div>
                    </div>
                  </div>

                  {/* Remediation Checkpoints */}
                  <div className="space-y-2">
                    <div className="text-fg-muted uppercase text-[10px] tracking-wider font-bold">
                      Preventative Architectural Actions:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded bg-surface border border-border-dim flex items-center gap-2 text-success">
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>Enforced strict non-zero client connect timeouts</span>
                      </div>
                      <div className="p-2.5 rounded bg-surface border border-border-dim flex items-center gap-2 text-success">
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>Added chaos test simulating Sentinel packet drops</span>
                      </div>
                    </div>
                  </div>

                  {/* Link to Full Postmortem */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/incidents/${incident.slug}`}
                      className="text-telemetry hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>Read complete postmortem document & full logs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
