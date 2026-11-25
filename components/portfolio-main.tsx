"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TraceWaterfall } from "@/components/trace-waterfall";
import { ReadmeSection } from "@/components/readme-section";
import { GitLog } from "@/components/git-log";
import { ServicesSection } from "@/components/services-section";
import { IncidentsSection } from "@/components/incidents-section";
import { DependencyGraph } from "@/components/dependency-graph";
import { RunbooksSection } from "@/components/runbooks-section";
import { TicketForm } from "@/components/ticket-form";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { RecruiterView } from "@/components/recruiter-view";
import { useMode } from "@/components/mode-context";
import { OWNER_CONFIG } from "@/lib/owner";
import type { ServiceItem, IncidentItem, RunbookItem, ExperienceCommitItem } from "@/lib/content";
import { Download, Terminal, ChevronRight, Zap, Radio, Globe } from "lucide-react";

interface PortfolioMainProps {
  services: ServiceItem[];
  incidents: IncidentItem[];
  runbooks: RunbookItem[];
  experience: ExperienceCommitItem[];
}

export function PortfolioMain({ services, incidents, runbooks, experience }: PortfolioMainProps) {
  const { mode } = useMode();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg selection:bg-border-focus selection:text-white">
      <Navbar />
      <CommandPalette />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">
        {mode === "recruiter" ? (
          <RecruiterView services={services} />
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {/* HERO SECTION */}
            <section className="space-y-8 pt-2">
              {/* Live OpenTelemetry Request Trace Waterfall */}
              <TraceWaterfall />

              {/* Headline & Identity */}
              <div className="space-y-5 max-w-prose">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-telemetry/10 border border-telemetry/30 text-xs font-mono text-telemetry">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  <span className="font-bold">SYSTEM_OPERATOR // {OWNER_CONFIG.role.toUpperCase()}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-fg leading-tight">
                  {OWNER_CONFIG.name}
                </h1>

                <p className="text-base sm:text-lg text-fg-muted leading-relaxed font-sans">
                  Staff Systems and Full-Stack Engineer architecting resilient distributed consensus engines, real-time eBPF telemetry fabrics, and zero-downtime database platforms.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                  <a
                    href="#contact"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-border-focus text-white font-bold hover:opacity-90 transition-all shadow-glow-telemetry/20"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Open a ticket</span>
                  </a>

                  <a
                    href="/resume.pdf"
                    target="_blank"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-dim bg-surface hover:bg-subtle text-fg font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download résumé</span>
                  </a>

                  <a
                    href="#experience"
                    className="flex items-center gap-1.5 px-3 py-2 text-telemetry hover:underline font-bold"
                  >
                    <span>Inspect git log</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* README SECTION */}
            <ReadmeSection />

            {/* CAREER AS GIT LOG */}
            <section id="experience">
              <GitLog commits={experience} />
            </section>

            {/* PRODUCTION SERVICES */}
            <ServicesSection services={services} selectedSkill={selectedSkill} />

            {/* INCIDENTS POSTMORTEMS */}
            <IncidentsSection incidents={incidents} />

            {/* LIVING DEPENDENCY GRAPH */}
            <DependencyGraph services={services} onSelectSkill={setSelectedSkill} />

            {/* RUNBOOKS / TECHNICAL WRITING */}
            <RunbooksSection runbooks={runbooks} />

            {/* OPEN A TICKET (CONTACT) */}
            <TicketForm />
          </div>
        )}
      </main>

      <StatusBar />
    </div>
  );
}
