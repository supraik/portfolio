"use client";

import React, { useState } from "react";
import { Share2, RotateCcw, Cpu, Zap, Network } from "lucide-react";
import type { ServiceItem } from "@/lib/content";

interface DependencyGraphProps {
  services: ServiceItem[];
  onSelectSkill?: (skill: string | null) => void;
}

// Fixed canvas coordinate layout for responsive, deterministic SVG topology
interface GraphNode {
  id: string;
  label: string;
  type: "service" | "skill";
  x: number;
  y: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export function DependencyGraph({ services, onSelectSkill }: DependencyGraphProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Define nodes and link connections
  const serviceNodes: GraphNode[] = [
    { id: "distributed-kv", label: "HydraKV", type: "service", x: 260, y: 160, color: "var(--accent-telemetry)" },
    { id: "streamforge-telemetry", label: "StreamForge", type: "service", x: 540, y: 160, color: "var(--accent-purple)" },
  ];

  const skillNodes: GraphNode[] = [
    { id: "Distributed Systems", label: "Distributed Systems", type: "skill", x: 400, y: 50, color: "var(--accent-success)" },
    { id: "Rust", label: "Rust", type: "skill", x: 120, y: 90, color: "var(--accent-telemetry)" },
    { id: "Consensus", label: "Raft Consensus", type: "skill", x: 120, y: 230, color: "var(--accent-telemetry)" },
    { id: "Performance Tuning", label: "Perf Tuning", type: "skill", x: 260, y: 280, color: "var(--accent-success)" },
    { id: "Go", label: "Go", type: "skill", x: 680, y: 90, color: "var(--accent-purple)" },
    { id: "Kafka", label: "Kafka", type: "skill", x: 680, y: 230, color: "var(--accent-purple)" },
    { id: "Observability", label: "eBPF / Telemetry", type: "skill", x: 540, y: 280, color: "var(--accent-telemetry)" },
    { id: "Systems Architecture", label: "Systems Arch", type: "skill", x: 400, y: 220, color: "var(--accent-warn)" },
  ];

  const links: GraphLink[] = [
    // HydraKV connections
    { source: "Distributed Systems", target: "distributed-kv" },
    { source: "Rust", target: "distributed-kv" },
    { source: "Consensus", target: "distributed-kv" },
    { source: "Performance Tuning", target: "distributed-kv" },
    { source: "Systems Architecture", target: "distributed-kv" },

    // StreamForge connections
    { source: "Distributed Systems", target: "streamforge-telemetry" },
    { source: "Go", target: "streamforge-telemetry" },
    { source: "Kafka", target: "streamforge-telemetry" },
    { source: "Observability", target: "streamforge-telemetry" },
    { source: "Systems Architecture", target: "streamforge-telemetry" },
  ];

  const allNodes = [...serviceNodes, ...skillNodes];

  const handleNodeClick = (nodeId: string, type: "service" | "skill") => {
    if (type === "skill") {
      const next = selectedSkill === nodeId ? null : nodeId;
      setSelectedSkill(next);
      if (onSelectSkill) onSelectSkill(next);
    }
  };

  const handleReset = () => {
    setSelectedSkill(null);
    setHoveredNode(null);
    if (onSelectSkill) onSelectSkill(null);
  };

  const activeTarget = hoveredNode || selectedSkill;

  // Determine if a link is active
  const isLinkActive = (link: GraphLink) => {
    if (!activeTarget) return true;
    return link.source === activeTarget || link.target === activeTarget;
  };

  // Determine if a node is active
  const isNodeActive = (nodeId: string) => {
    if (!activeTarget) return true;
    if (nodeId === activeTarget) return true;
    return links.some(
      (l) => (l.source === activeTarget && l.target === nodeId) || (l.target === activeTarget && l.source === nodeId)
    );
  };

  return (
    <section id="skills" className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-dim/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
            <Network className="w-4 h-4" />
            <span>TOPOLOGY // LIVING_DEPENDENCY_GRAPH</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Service & Skill Force Topology</h2>
          <p className="text-xs font-mono text-fg-muted mt-1">
            Interactive directed acyclic dependency matrix. Click any skill node to pulse electric pathways to dependent services.
          </p>
        </div>

        {selectedSkill && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-border-dim rounded-lg bg-surface hover:bg-subtle text-fg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear selection</span>
          </button>
        )}
      </div>

      <div className="border border-border-dim/80 rounded-xl bg-surface/90 backdrop-blur-md p-5 sm:p-6 shadow-hud-card space-y-4">
        {/* Interactive SVG Canvas */}
        <div className="relative w-full rounded-xl bg-canvas border border-border-dim/80 overflow-hidden select-none">
          {/* Subtle grid pattern inside graph */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(56,189,248,0.06)_1px,transparent_0)] bg-[size:20px_20px] pointer-events-none" />

          <svg
            viewBox="0 0 800 340"
            className="w-full h-auto min-h-[280px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Links / Edges */}
            {links.map((link, idx) => {
              const src = allNodes.find((n) => n.id === link.source)!;
              const tgt = allNodes.find((n) => n.id === link.target)!;
              const active = isLinkActive(link);

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={active ? "var(--accent-telemetry)" : "var(--border-dim)"}
                    strokeWidth={active ? (activeTarget ? 2.5 : 1.5) : 0.8}
                    strokeDasharray={active && activeTarget ? "4 4" : undefined}
                    opacity={active ? (activeTarget ? 1 : 0.6) : 0.15}
                    className="transition-all duration-300"
                  />
                  {active && activeTarget && (
                    <circle r="2.5" fill="var(--accent-telemetry)">
                      <animateMotion
                        path={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {allNodes.map((node) => {
              const isService = node.type === "service";
              const isSelected = selectedSkill === node.id;
              const active = isNodeActive(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node.id, node.type)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-all duration-300"
                  opacity={active ? 1 : 0.25}
                >
                  {isService ? (
                    <>
                      {/* Service Node: Diamond / Rounded Rect */}
                      <rect
                        x="-52"
                        y="-18"
                        width="104"
                        height="36"
                        rx="6"
                        fill="var(--bg-surface)"
                        stroke={node.color}
                        strokeWidth={active ? 2.5 : 1.5}
                        filter={active ? "url(#glow)" : undefined}
                      />
                      <circle cx="-38" cy="0" r="3" fill="var(--accent-success)" />
                      <text
                        x="-26"
                        y="4"
                        fill="var(--fg-default)"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="ui-monospace, monospace"
                      >
                        {node.label}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Skill Node: Pill Capsule */}
                      <rect
                        x="-48"
                        y="-14"
                        width="96"
                        height="28"
                        rx="14"
                        fill={isSelected ? "var(--accent-telemetry)" : "var(--bg-canvas)"}
                        stroke={isSelected ? "var(--accent-telemetry)" : "var(--border-dim)"}
                        strokeWidth={isSelected || active ? 2 : 1}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? "#090d16" : "var(--fg-default)"}
                        fontSize="10"
                        fontWeight={isSelected ? "bold" : "normal"}
                        fontFamily="ui-monospace, monospace"
                      >
                        {node.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Active Dependency Status Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-fg-muted">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-telemetry" />
              <span>Production Service Node</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-telemetry" />
              <span>Technical Competency Node</span>
            </span>
          </div>

          <div>
            {selectedSkill ? (
              <span className="text-telemetry font-bold">
                Isolating subgraph for: &ldquo;{selectedSkill}&rdquo;
              </span>
            ) : (
              <span className="text-fg-muted">Hover or click nodes to trace dependency electrical pulses</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
