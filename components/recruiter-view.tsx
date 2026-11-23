"use client";

import React from "react";
import Link from "next/link";
import { Download, Mail, Github, Linkedin, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";
import type { ServiceItem } from "@/lib/content";
import { useMode } from "@/components/mode-context";

interface RecruiterViewProps {
  services: ServiceItem[];
}

export function RecruiterView({ services }: RecruiterViewProps) {
  const { setMode } = useMode();
  const topServices = services.slice(0, 3);

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      {/* 30-Second Summary Banner */}
      <div className="border border-border-dim rounded-lg bg-surface p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-telemetry font-bold">RECRUITER_OVERVIEW // 30-SECOND_SCAN</span>
          <span className="text-fg-muted">{OWNER_CONFIG.location} &bull; Open to Senior / Staff Roles</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg">
            {OWNER_CONFIG.name}
          </h1>
          <p className="text-lg font-medium text-telemetry mt-1">
            {OWNER_CONFIG.role}
          </p>
          <p className="text-sm text-fg-muted mt-2 max-w-prose leading-relaxed">
            Staff Systems and Full-Stack Engineer with 6+ years specializing in distributed consensus, real-time telemetry fabrics, and zero-downtime database reliability. Ships high-throughput backends and observable systems with production ownership.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-border-focus text-white text-xs font-mono font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Résumé (PDF)</span>
          </a>

          <a
            href={`mailto:${OWNER_CONFIG.email_public}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-mono font-medium transition-colors"
          >
            <Mail className="w-4 h-4 text-telemetry" />
            <span>{OWNER_CONFIG.email_public}</span>
          </a>

          <a
            href={OWNER_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-mono"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>

          <a
            href={OWNER_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-mono"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Top 3 Featured Projects / Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-dim pb-2 text-xs font-mono">
          <span className="font-bold text-fg">TOP 3 PRODUCTION DELIVERIES</span>
          <span className="text-fg-muted">Measured in real production workloads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topServices.map((srv) => (
            <div key={srv.slug} className="border border-border-dim rounded bg-surface p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                  <span className="text-success font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {srv.status.toUpperCase()}
                  </span>
                  <span>{srv.uptime_30d}% SLA</span>
                </div>
                <h3 className="font-bold text-fg text-sm">{srv.title}</h3>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                  {srv.tagline}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border-dim/60">
                <div className="flex justify-between text-xs font-mono text-telemetry">
                  <span>Latency: {srv.latency_p99}</span>
                  <span>QPS: {srv.qps}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {srv.stack.slice(0, 3).map((st) => (
                    <span key={st} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-subtle text-fg-muted">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switch to Engineer Mode Banner */}
      <div className="border border-telemetry/40 rounded bg-telemetry/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="font-bold text-fg">Want deep architectural details?</span>
          <p className="text-fg-muted text-[11px] mt-0.5">
            Switch to Engineer Mode to see the live request waterfall, career git log, postmortems, and interactive dependency graph.
          </p>
        </div>
        <button
          onClick={() => setMode("engineer")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-telemetry text-canvas font-bold hover:opacity-90 transition-opacity"
        >
          <span>Switch to Engineer Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
