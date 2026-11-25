"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Mail,
  Github,
  Linkedin,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Zap,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
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
    <div className="space-y-10 py-6 max-w-4xl mx-auto font-sans">
      {/* 30-Second Executive Summary Card */}
      <div className="border border-border-dim/80 hover:border-telemetry/40 rounded-2xl bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-hud-card space-y-6 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-telemetry font-bold px-2.5 py-1 rounded-md bg-telemetry/10 border border-telemetry/20 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            RECRUITER_EXECUTIVE_BRIEF // 30-SECOND_SCAN
          </span>
          <span className="text-fg-muted font-mono">{OWNER_CONFIG.location} &bull; Open to Senior / Staff Roles</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
            {OWNER_CONFIG.name}
          </h1>
          <p className="text-lg font-bold text-telemetry mt-1.5 font-mono">
            {OWNER_CONFIG.role}
          </p>
          <p className="text-base text-fg-muted mt-3 max-w-prose leading-relaxed">
            Staff Systems and Full-Stack Engineer with 6+ years building resilient distributed architectures, real-time telemetry fabrics, and high-throughput microservices. Experienced in leading architectural migrations, decreasing recovery times, and operating mission-critical infrastructure.
          </p>
        </div>

        {/* Key Career Metrics Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
          <div className="p-3 rounded-xl bg-canvas border border-border-dim/80">
            <span className="text-telemetry font-bold text-base block">4.2m &rarr; 18s</span>
            <span className="text-[11px] text-fg-muted">Recovery time reduced via Raft failover coordinator</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-border-dim/80">
            <span className="text-success font-bold text-base block">140M Daily Events</span>
            <span className="text-[11px] text-fg-muted">Scaled streaming pipeline with zero data loss</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-border-dim/80">
            <span className="text-purple font-bold text-base block">$120k / Year Saved</span>
            <span className="text-[11px] text-fg-muted">Custom eBPF telemetry replacing third-party APM</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
          <a
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-border-focus text-white text-xs font-bold hover:opacity-90 transition-all shadow-glow-telemetry/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Résumé (PDF)</span>
          </a>

          <a
            href={`mailto:${OWNER_CONFIG.email_public}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-semibold transition-colors"
          >
            <Mail className="w-4 h-4 text-telemetry" />
            <span>{OWNER_CONFIG.email_public}</span>
          </a>

          <a
            href={OWNER_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-semibold"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          <a
            href={OWNER_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs font-semibold"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Top 3 Featured Projects / Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-dim/80 pb-2 text-xs font-mono">
          <span className="font-bold text-fg">TOP 3 PRODUCTION DELIVERIES</span>
          <span className="text-fg-muted">Measured under production workloads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {topServices.map((srv) => (
            <div
              key={srv.slug}
              className="border border-border-dim/80 rounded-xl bg-surface/90 backdrop-blur-md p-5 flex flex-col justify-between space-y-4 shadow-hud-card"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-fg-muted mb-2">
                  <span className="text-success font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {srv.status.toUpperCase()}
                  </span>
                  <span>{srv.uptime_30d}% SLA</span>
                </div>
                <h3 className="font-bold text-fg text-sm">{srv.title}</h3>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed font-sans">
                  {srv.tagline}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border-dim/60 text-xs">
                <div className="flex justify-between text-telemetry font-bold">
                  <span>Latency: {srv.latency_p99}</span>
                  <span>QPS: {srv.qps}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {srv.stack.slice(0, 3).map((st) => (
                    <span key={st} className="text-[10px] px-1.5 py-0.5 rounded bg-subtle text-fg-muted border border-border-dim">
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
      <div className="border border-telemetry/40 rounded-xl bg-telemetry/5 p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="font-bold text-fg text-sm block">Want deep architectural specifications?</span>
          <p className="text-fg-muted text-xs mt-1">
            Switch to Engineer Mode to inspect the live request trace waterfall, multi-branch git log, postmortems, and force graph topology.
          </p>
        </div>
        <button
          onClick={() => setMode("engineer")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-telemetry text-canvas font-bold hover:opacity-90 transition-opacity"
        >
          <span>Switch to Engineer Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
