"use client";

import React from "react";
import Link from "next/link";
import { useMode } from "@/components/mode-context";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertOctagon, Terminal } from "lucide-react";

export default function StyleguidePage() {
  const { mode, toggleMode, theme, toggleTheme } = useMode();

  return (
    <div className="min-h-screen bg-canvas text-fg px-4 py-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dim pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
            <Terminal className="w-4 h-4" />
            <span>DEV_ENVIRONMENT // DESIGN_TOKENS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Styleguide & Visual Tokens</h1>
          <p className="text-sm text-fg-muted mt-1">
            Visual inspection suite for typography, color matrices, telemetry markers, and reduced-motion states.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 text-xs font-mono border border-border-dim rounded bg-surface hover:bg-subtle transition-colors"
          >
            Theme: {theme}
          </button>
          <button
            onClick={toggleMode}
            className="px-3 py-1.5 text-xs font-mono border border-border-dim rounded bg-surface hover:bg-subtle transition-colors"
          >
            Mode: {mode}
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-border-focus text-telemetry rounded hover:bg-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Color Palette Matrix */}
      <section className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-fg">01. PALETTE TOKENS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded border border-border-dim bg-canvas space-y-1">
            <div className="font-bold">--bg-canvas</div>
            <div className="text-fg-muted">Substrate Canvas</div>
          </div>
          <div className="p-4 rounded border border-border-dim bg-surface space-y-1">
            <div className="font-bold">--bg-surface</div>
            <div className="text-fg-muted">Instrument Panel</div>
          </div>
          <div className="p-4 rounded border border-border-dim bg-subtle space-y-1">
            <div className="font-bold">--bg-subtle</div>
            <div className="text-fg-muted">Hover / Gutter</div>
          </div>
          <div className="p-4 rounded border border-border-focus bg-surface space-y-1">
            <div className="font-bold text-telemetry">--border-focus</div>
            <div className="text-fg-muted">Focus & Active</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded border border-border-dim bg-surface flex items-center justify-between">
            <span className="text-telemetry font-bold">Telemetry (Blue)</span>
            <span className="w-4 h-4 rounded-full bg-telemetry"></span>
          </div>
          <div className="p-3 rounded border border-border-dim bg-surface flex items-center justify-between">
            <span className="text-success font-bold">Success (Green)</span>
            <span className="w-4 h-4 rounded-full bg-success"></span>
          </div>
          <div className="p-3 rounded border border-border-dim bg-surface flex items-center justify-between">
            <span className="text-warn font-bold">Warning (Amber)</span>
            <span className="w-4 h-4 rounded-full bg-warn"></span>
          </div>
          <div className="p-3 rounded border border-border-dim bg-surface flex items-center justify-between">
            <span className="text-crit font-bold">Critical (Red)</span>
            <span className="w-4 h-4 rounded-full bg-crit"></span>
          </div>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-fg">02. TYPOGRAPHY SCALE & LINE LENGTH</h2>
        <div className="border border-border-dim rounded bg-surface p-6 space-y-6">
          <div>
            <div className="text-xs font-mono text-fg-muted mb-1">Display (40px) / Hero</div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight">Production System Engineering</div>
          </div>
          <div>
            <div className="text-xs font-mono text-fg-muted mb-1">Section Heading (28px) / H2</div>
            <div className="text-2xl font-bold">Distributed Systems & Real-time Telemetry</div>
          </div>
          <div>
            <div className="text-xs font-mono text-fg-muted mb-1">Subheading (20px) / H3</div>
            <div className="text-xl font-semibold">Consensus Protocols & Failure Modes</div>
          </div>
          <div>
            <div className="text-xs font-mono text-fg-muted mb-1">Body Text (16px) — Strictly bounded to max-w-prose (72ch)</div>
            <p className="max-w-prose text-fg-muted leading-relaxed">
              Most dev portfolios are a hero, a grid of project cards and a contact form. This system presents the developer the way an engineer presents a service they run in production: live request waterfall, commit-history career progression, postmortems of real failures, and an interactive dependency graph.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-fg-muted mb-1">Micro Monospace Telemetry (12px)</div>
            <div className="telemetry-code text-xs text-telemetry">
              GET /services/distributed-kv HTTP/2.0 200 OK — 14.2ms [p99: 14ms | qps: 12.5k]
            </div>
          </div>
        </div>
      </section>

      {/* Status Badges & Components */}
      <section className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-fg">03. TELEMETRY BADGES & STATUS AFFORDANCES</h2>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OPERATIONAL (99.98%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-warn/30 bg-warn/10 text-warn">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DEGRADED (P2 INVESTIGATION)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-crit/30 bg-crit/10 text-crit">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>SEV-1 OUTAGE MITIGATED</span>
          </span>
        </div>
      </section>

      {/* Button & Focus Standards */}
      <section className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-fg">04. BUTTONS & ACCESSIBLE FOCUS</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium rounded bg-border-focus text-white hover:opacity-90 transition-opacity">
            Download résumé
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded border border-border-dim bg-surface hover:bg-subtle transition-colors">
            Open ticket (Contact)
          </button>
          <button className="px-4 py-2 text-sm font-mono text-xs rounded border border-border-dim bg-subtle text-fg-muted" disabled>
            Archived service (Read-only)
          </button>
        </div>
      </section>
    </div>
  );
}
