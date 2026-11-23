"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, CheckCircle2, ArrowRight } from "lucide-react";
import type { IncidentItem } from "@/lib/content";

interface IncidentsSectionProps {
  incidents: IncidentItem[];
}

export function IncidentsSection({ incidents }: IncidentsSectionProps) {
  return (
    <section id="incidents" className="space-y-6">
      <div className="border-b border-border-dim pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-warn mb-1">
          <AlertOctagon className="w-4 h-4" />
          <span>BLAMELESS_POSTMORTEMS // LEARNING_FROM_FAILURES</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-fg">Incident Postmortems</h2>
        <p className="text-xs font-mono text-fg-muted mt-1">
          Production systems fail. What defines an engineer is how they diagnose, mitigate, and engineer out future failure modes.
        </p>
      </div>

      <div className="border border-border-dim rounded bg-surface divide-y divide-border-dim shadow-sm">
        {incidents.map((incident) => (
          <div key={incident.id} className="p-5 space-y-3 hover:bg-subtle/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded border border-crit/40 bg-crit/10 text-crit font-bold">
                  {incident.severity}
                </span>
                <span className="text-telemetry font-bold">{incident.id}</span>
                <span className="text-fg-muted">[{incident.date}]</span>
              </div>
              <div className="flex items-center gap-2 text-fg-muted">
                <span>Downtime: <span className="text-fg">{incident.duration}</span></span>
                <span className="text-success inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {incident.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-fg hover:text-telemetry">
                <Link href={`/incidents/${incident.slug}`} className="hover:underline">
                  {incident.title}
                </Link>
              </h3>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed">
                <strong className="text-fg">Impact:</strong> {incident.impact}
              </p>
            </div>

            <div className="text-xs font-mono bg-canvas/70 p-3 rounded border border-border-dim/60 space-y-1">
              <span className="text-warn font-semibold block text-[11px]">Root Cause Summary:</span>
              <p className="text-fg-muted leading-relaxed">{incident.root_cause}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-fg-muted">
                Affected: {incident.services_affected.join(", ")}
              </span>
              <Link
                href={`/incidents/${incident.slug}`}
                className="text-telemetry hover:underline inline-flex items-center gap-1"
              >
                Read full timeline & action items
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
