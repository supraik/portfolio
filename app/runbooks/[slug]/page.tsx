import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRunbooks, getRunbookBySlug } from "@/lib/content";
import { Navbar } from "@/components/navbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";

export function generateStaticParams() {
  const runbooks = getAllRunbooks();
  return runbooks.map((r) => ({ slug: r.slug }));
}

export default function RunbookPage({ params }: { params: { slug: string } }) {
  const runbook = getRunbookBySlug(params.slug);
  if (!runbook) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <CommandPalette />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/#runbooks"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Runbooks</span>
        </Link>

        {/* Runbook Header */}
        <div className="border border-border-dim rounded bg-surface p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-fg-muted">
            <span className="text-telemetry font-bold">RUNBOOK // SRE_PLAYBOOK</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {runbook.date} &bull; {runbook.read_time}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            {runbook.title}
          </h1>

          <p className="text-base text-fg-muted leading-relaxed">
            {runbook.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {runbook.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-subtle text-fg border border-border-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <article className="border border-border-dim rounded bg-surface p-6 space-y-6">
          <div className="max-w-prose text-sm text-fg leading-relaxed whitespace-pre-line font-sans space-y-4">
            {runbook.content}
          </div>
        </article>
      </main>

      <StatusBar />
    </div>
  );
}
