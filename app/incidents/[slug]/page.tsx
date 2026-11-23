import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllIncidents, getIncidentBySlug } from "@/lib/content";
import { Navbar } from "@/components/navbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { ArrowLeft, AlertOctagon, CheckCircle2, Clock } from "lucide-react";

export function generateStaticParams() {
  const incidents = getAllIncidents();
  return incidents.map((inc) => ({ slug: inc.slug }));
}

export default function IncidentPage({ params }: { params: { slug: string } }) {
  const incident = getIncidentBySlug(params.slug);
  if (!incident) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <CommandPalette />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/#incidents"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Incident Postmortems</span>
        </Link>

        {/* Incident Header */}
        <div className="border border-border-dim rounded bg-surface p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded border border-crit/40 bg-crit/10 text-crit font-bold">
                {incident.severity}
              </span>
              <span className="text-telemetry font-bold">{incident.id}</span>
              <span className="text-fg-muted">[{incident.date}]</span>
            </div>
            <span className="text-success inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              STATUS: {incident.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            {incident.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-canvas p-3 rounded border border-border-dim/60">
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">Outage Duration</span>
              <span className="text-warn font-bold">{incident.duration}</span>
            </div>
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">Services Affected</span>
              <span className="text-fg font-bold">{incident.services_affected.join(", ")}</span>
            </div>
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">Classification</span>
              <span className="text-telemetry font-bold">Blameless Postmortem</span>
            </div>
          </div>
        </div>

        {/* Incident Breakdown */}
        <div className="border border-border-dim rounded bg-surface p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase text-crit font-bold tracking-wider">
              [CRITICAL_IMPACT]
            </h2>
            <p className="text-sm text-fg leading-relaxed bg-canvas p-3 rounded border border-border-dim/50">
              {incident.impact}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase text-warn font-bold tracking-wider">
              [ROOT_CAUSE_ANALYSIS]
            </h2>
            <p className="text-sm text-fg-muted leading-relaxed bg-canvas p-3 rounded border border-border-dim/50">
              {incident.root_cause}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-dim/60">
            <h2 className="text-base font-bold font-mono text-fg">
              CHRONOLOGICAL TIMELINE & REMEDIATION ACTION ITEMS
            </h2>
            <div className="prose prose-invert max-w-none text-sm text-fg leading-relaxed whitespace-pre-line font-sans">
              {incident.content}
            </div>
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
