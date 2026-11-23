import React from "react";
import Link from "next/link";
import { getUsesContent } from "@/lib/content";
import { Navbar } from "@/components/navbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { ArrowLeft, Laptop } from "lucide-react";

export default function UsesPage() {
  const { content, updated } = getUsesContent();

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <CommandPalette />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Portfolio</span>
        </Link>

        <div className="border border-border-dim rounded bg-surface p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-fg-muted">
            <span className="text-telemetry font-bold">SYSTEM_PROFILE // USES</span>
            <span>Last audit: {updated}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-fg">
            Workstation, Hardware & Production Tools (/uses)
          </h1>
          <p className="text-sm text-fg-muted leading-relaxed">
            The hardware, terminal configuration, development editor, and infrastructure tooling I rely on to ship production software daily.
          </p>
        </div>

        <div className="border border-border-dim rounded bg-surface p-6">
          <div className="max-w-prose text-sm text-fg leading-relaxed whitespace-pre-line font-sans">
            {content}
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
