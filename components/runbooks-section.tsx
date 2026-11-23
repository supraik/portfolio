"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Tag } from "lucide-react";
import type { RunbookItem } from "@/lib/content";

interface RunbooksSectionProps {
  runbooks: RunbookItem[];
}

export function RunbooksSection({ runbooks }: RunbooksSectionProps) {
  return (
    <section id="runbooks" className="space-y-6">
      <div className="border-b border-border-dim pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
          <BookOpen className="w-4 h-4" />
          <span>RUNBOOKS // TECHNICAL_WRITING</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-fg">Engineering Runbooks & Field Notes</h2>
        <p className="text-xs font-mono text-fg-muted mt-1">
          Deep-dives into database internals, zero-downtime migrations, and distributed systems architecture.
        </p>
      </div>

      <div className="border border-border-dim rounded bg-surface divide-y divide-border-dim shadow-sm">
        {runbooks.map((runbook) => (
          <div key={runbook.slug} className="p-5 space-y-3 hover:bg-subtle/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-fg-muted">
              <span>{runbook.date} &bull; {runbook.read_time}</span>
              <div className="flex items-center gap-1.5">
                {runbook.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-subtle text-fg border border-border-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-fg hover:text-telemetry">
                <Link href={`/runbooks/${runbook.slug}`} className="hover:underline">
                  {runbook.title}
                </Link>
              </h3>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed max-w-prose">
                {runbook.summary}
              </p>
            </div>

            <div className="pt-1">
              <Link
                href={`/runbooks/${runbook.slug}`}
                className="text-xs font-mono text-telemetry hover:underline inline-flex items-center gap-1 font-medium"
              >
                Read complete technical runbook
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
