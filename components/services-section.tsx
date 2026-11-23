"use client";

import React from "react";
import Link from "next/link";
import { Server, ArrowUpRight, CheckCircle, ExternalLink, Cpu } from "lucide-react";
import type { ServiceItem } from "@/lib/content";

interface ServicesSectionProps {
  services: ServiceItem[];
  selectedSkill?: string | null;
}

export function ServicesSection({ services, selectedSkill }: ServicesSectionProps) {
  return (
    <section id="services" className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-dim pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Production Services</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Replicated backends, telemetry fabrics, and distributed systems running in production.
          </p>
        </div>
        {selectedSkill && (
          <span className="text-xs font-mono px-2 py-1 rounded bg-telemetry/10 text-telemetry border border-telemetry/30">
            Filtering by dependency: {selectedSkill}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const isHighlighted = !selectedSkill || service.skills.includes(selectedSkill);

          return (
            <div
              key={service.slug}
              className={`border rounded bg-surface p-5 transition-all space-y-4 flex flex-col justify-between ${
                isHighlighted
                  ? "border-border-dim hover:border-border-focus"
                  : "border-border-dim/40 opacity-40"
              }`}
            >
              <div className="space-y-3">
                {/* Header: Status & Uptime */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-success/30 bg-success/10 text-success font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {service.status.toUpperCase()}
                  </span>
                  <span className="text-fg-muted">
                    SLA: <span className="text-fg">{service.uptime_30d}%</span> (30d)
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-fg group-hover:text-telemetry transition-colors">
                    <Link href={`/services/${service.slug}`} className="hover:underline flex items-center justify-between">
                      <span>{service.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-fg-muted" />
                    </Link>
                  </h3>
                  <p className="text-sm text-fg-muted mt-1 leading-relaxed">
                    {service.tagline}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-canvas/60 p-2.5 rounded border border-border-dim/50">
                  <div>
                    <span className="text-fg-muted block text-[11px]">p99 Latency:</span>
                    <span className="font-semibold text-telemetry">{service.latency_p99}</span>
                  </div>
                  <div>
                    <span className="text-fg-muted block text-[11px]">Throughput:</span>
                    <span className="font-semibold text-fg">{service.qps}</span>
                  </div>
                </div>

                {/* Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-subtle text-fg border border-border-dim"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-border-dim/60 flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-telemetry hover:underline font-medium"
                >
                  Inspect architecture spec &rarr;
                </Link>
                <a
                  href={service.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-fg inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Source
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
