"use client";

import React, { useState } from "react";
import { Share2, RotateCcw } from "lucide-react";
import type { ServiceItem } from "@/lib/content";

interface DependencyGraphProps {
  services: ServiceItem[];
  onSelectSkill?: (skill: string | null) => void;
}

export function DependencyGraph({ services, onSelectSkill }: DependencyGraphProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Extract unique skills
  const allSkills = Array.from(new Set(services.flatMap((s) => s.skills)));

  const handleSkillClick = (skill: string) => {
    const next = selectedSkill === skill ? null : skill;
    setSelectedSkill(next);
    if (onSelectSkill) onSelectSkill(next);
  };

  const handleReset = () => {
    setSelectedSkill(null);
    if (onSelectSkill) onSelectSkill(null);
  };

  return (
    <section id="skills" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-dim pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
            <Share2 className="w-4 h-4" />
            <span>TOPOLOGY // DEPENDENCY_GRAPH</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Service & Skill Dependency Graph</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Real skills mapped to the production services that depend on them. Click any skill node to filter services.
          </p>
        </div>
        {selectedSkill && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-border-dim rounded bg-surface hover:bg-subtle text-fg"
          >
            <RotateCcw className="w-3 h-3" />
            Clear selection
          </button>
        )}
      </div>

      <div className="border border-border-dim rounded bg-surface p-6 shadow-sm space-y-6">
        {/* Interactive Skills Node Matrix */}
        <div>
          <div className="text-xs font-mono text-fg-muted mb-3 uppercase tracking-wider font-semibold">
            Primary Competency Nodes (Click to highlight dependents):
          </div>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => {
              const isSelected = selectedSkill === skill;
              // Count dependent services
              const dependents = services.filter((s) => s.skills.includes(skill));

              return (
                <button
                  key={skill}
                  onClick={() => handleSkillClick(skill)}
                  className={`px-3 py-1.5 text-xs font-mono rounded border transition-all flex items-center gap-2 ${
                    isSelected
                      ? "border-border-focus bg-border-focus/20 text-telemetry font-bold shadow-sm"
                      : "border-border-dim bg-canvas hover:border-telemetry/60 text-fg"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-telemetry" : "bg-border-dim"}`} />
                  <span>{skill}</span>
                  <span className="text-[10px] text-fg-muted bg-subtle px-1.5 py-0.2 rounded">
                    {dependents.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Topological Wiring Preview */}
        <div className="border border-border-dim rounded bg-canvas p-4 text-xs font-mono space-y-3">
          <div className="text-fg-muted text-[11px] uppercase tracking-wider">
            Connected Topology Graph:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => {
              const isConnected = !selectedSkill || srv.skills.includes(selectedSkill);

              return (
                <div
                  key={srv.slug}
                  className={`p-3 rounded border transition-colors ${
                    isConnected
                      ? "border-telemetry/40 bg-surface text-fg"
                      : "border-border-dim/40 bg-canvas text-fg-muted opacity-40"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-sm ${isConnected ? "bg-success" : "bg-border-dim"}`} />
                      service/{srv.slug}
                    </span>
                    <span className="text-[10px] text-fg-muted">{srv.qps}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {srv.skills.map((sk) => (
                      <span
                        key={sk}
                        className={`px-1.5 py-0.5 rounded ${
                          selectedSkill === sk
                            ? "bg-telemetry text-canvas font-bold"
                            : "bg-subtle text-fg-muted border border-border-dim/50"
                        }`}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
