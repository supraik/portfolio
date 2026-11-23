"use client";

import React, { useState } from "react";
import { GitCommit, GitBranch, ChevronDown, ChevronRight, Plus, Minus, Tag } from "lucide-react";
import type { ExperienceCommitItem } from "@/lib/content";

interface GitLogProps {
  commits: ExperienceCommitItem[];
}

export function GitLog({ commits }: GitLogProps) {
  const [expandedHashes, setExpandedHashes] = useState<Record<string, boolean>>({
    [commits[0]?.hash || ""]: true, // Expand most recent by default
  });

  const toggleDiff = (hash: string) => {
    setExpandedHashes((prev) => ({
      ...prev,
      [hash]: !prev[hash],
    }));
  };

  return (
    <div className="border border-border-dim rounded bg-surface p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border-dim pb-3 mb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-fg">
          <GitBranch className="w-4 h-4 text-telemetry" />
          <span className="font-semibold">git log --graph --oneline --decorate</span>
        </div>
        <span className="text-xs font-mono text-fg-muted">branch: main (tracking origin/main)</span>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-dim">
        {commits.map((commit, index) => {
          const isExpanded = !!expandedHashes[commit.hash];

          return (
            <div key={commit.hash} className="relative group">
              {/* Commit graph dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface border-2 border-telemetry flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-telemetry"></div>
              </div>

              {/* Commit Header Line */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2 font-mono text-xs">
                  <span className="text-telemetry font-bold">commit {commit.hash}</span>
                  <span className="text-fg-muted">({commit.branch})</span>
                  <span className="text-fg-muted ml-auto">{commit.period}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-fg">
                    {commit.role} <span className="text-fg-muted font-normal">@</span> {commit.company}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-success inline-flex items-center gap-0.5">
                      <Plus className="w-3 h-3" />
                      {commit.diff.additions}
                    </span>
                    <span className="text-crit inline-flex items-center gap-0.5">
                      <Minus className="w-3 h-3" />
                      {commit.diff.deletions}
                    </span>
                    <span className="text-fg-muted">in {commit.diff.files_changed} files</span>
                  </div>
                </div>

                {/* Commit message */}
                <p className="text-sm font-mono text-fg-muted bg-canvas/70 px-3 py-1.5 rounded border border-border-dim/60">
                  {commit.message}
                </p>

                {/* Expand diff button */}
                <button
                  onClick={() => toggleDiff(commit.hash)}
                  aria-expanded={isExpanded}
                  className="flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline focus-visible:ring-1 focus-visible:ring-border-focus py-1"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>{isExpanded ? "Collapse diff preview" : "Expand diff preview"}</span>
                </button>

                {/* Diff details drawer */}
                {isExpanded && (
                  <div className="mt-3 border border-border-dim rounded bg-canvas p-4 text-xs font-mono space-y-4">
                    <div className="text-fg-muted leading-relaxed">
                      {commit.summary}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-fg-muted text-[11px] uppercase tracking-wider font-semibold">
                        Impact & Contributions:
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-fg">
                        {commit.highlights.map((h, i) => (
                          <li key={i} className="leading-normal">{h}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills added in this commit */}
                    <div className="pt-2 border-t border-border-dim/60 flex flex-wrap items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-fg-muted" />
                      <span className="text-fg-muted text-[11px]">Skills wired:</span>
                      {commit.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] bg-subtle text-fg border border-border-dim"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
