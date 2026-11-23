import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllServices, getServiceBySlug } from "@/lib/content";
import { Navbar } from "@/components/navbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { ArrowLeft, ExternalLink, Server, CheckCircle2, Cpu } from "lucide-react";

export function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <CommandPalette />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/#services"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Services Topology</span>
        </Link>

        {/* Service Header */}
        <div className="border border-border-dim rounded bg-surface p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-telemetry font-bold">service/{service.slug}</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-success/30 bg-success/10 text-success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              STATUS: {service.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            {service.title}
          </h1>

          <p className="text-base text-fg-muted max-w-prose leading-relaxed">
            {service.tagline}
          </p>

          {/* Telemetry Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-canvas p-3 rounded border border-border-dim/60">
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">30-Day SLA Uptime</span>
              <span className="text-success font-bold">{service.uptime_30d}%</span>
            </div>
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">p99 Read Latency</span>
              <span className="text-telemetry font-bold">{service.latency_p99}</span>
            </div>
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">Measured QPS</span>
              <span className="text-fg font-bold">{service.qps}</span>
            </div>
            <div>
              <span className="text-fg-muted block text-[10px] uppercase">Source Code</span>
              <a
                href={service.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-telemetry hover:underline flex items-center gap-1 font-bold"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Architecture Spec & Decisions */}
        <div className="border border-border-dim rounded bg-surface p-6 space-y-6">
          <h2 className="text-lg font-bold font-mono text-fg border-b border-border-dim pb-2">
            ARCHITECTURAL SPECIFICATION & TRADE-OFFS
          </h2>

          {/* Hand-built SVG Architecture Topology Diagram */}
          <div className="border border-border-dim rounded bg-canvas p-4 overflow-x-auto">
            <div className="text-[11px] font-mono text-fg-muted mb-3 uppercase tracking-wider">
              System Topology Diagram:
            </div>
            <svg
              className="w-full min-w-[500px] h-40"
              viewBox="0 0 600 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Clients Node */}
              <rect x="20" y="55" width="110" height="50" rx="4" className="stroke-border-dim fill-surface" strokeWidth="1.5" />
              <text x="75" y="85" textAnchor="middle" className="fill-fg font-mono text-[12px] font-bold">Client Ingress</text>

              {/* Edge Route arrow */}
              <line x1="130" y1="80" x2="210" y2="80" stroke="var(--accent-telemetry)" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="210,80 203,76 203,84" fill="var(--accent-telemetry)" />

              {/* Leader Node */}
              <rect x="210" y="45" width="160" height="70" rx="4" className="stroke-border-focus fill-surface" strokeWidth="2" />
              <text x="290" y="75" textAnchor="middle" className="fill-telemetry font-mono text-[12px] font-bold">Raft Consensus Core</text>
              <text x="290" y="95" textAnchor="middle" className="fill-fg-muted font-mono text-[10px]">Zero-Copy WAL Log</text>

              {/* Replication arrow */}
              <line x1="370" y1="80" x2="450" y2="80" stroke="var(--accent-success)" strokeWidth="1.5" />
              <polygon points="450,80 443,76 443,84" fill="var(--accent-success)" />

              {/* Storage Followers */}
              <rect x="450" y="55" width="130" height="50" rx="4" className="stroke-border-dim fill-surface" strokeWidth="1.5" />
              <text x="515" y="85" textAnchor="middle" className="fill-fg font-mono text-[12px] font-bold">LSM Engine</text>
            </svg>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-fg leading-relaxed space-y-4">
            <div className="whitespace-pre-line font-sans text-fg">
              {service.content}
            </div>
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
