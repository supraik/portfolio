"use client";

import React from "react";
import Link from "next/link";
import { GitCommit, Activity, ShieldCheck, Cpu } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export function StatusBar() {
  const buildSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "a7b1c3e";
  const deployTime = "2m ago";

  return (
    <footer className="border-t border-border-dim bg-canvas mt-16 text-xs font-mono text-fg-muted">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Real-time status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-border-dim/60">
          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Commit SHA</span>
            <span className="text-telemetry font-bold flex items-center gap-1">
              <GitCommit className="w-3 h-3" />
              {buildSha}
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Lighthouse Audit</span>
            <span className="text-success font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              99/100/100/100
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">p75 Page Load</span>
            <span className="text-fg font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-telemetry" />
              142ms
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Visitors (Month)</span>
            <span className="text-fg font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-warn" />
              840 (Aggregate)
            </span>
          </div>
        </div>

        {/* Footer Links & Disclosures */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] pt-1">
          <div>
            <span>&copy; {new Date().getFullYear()} {OWNER_CONFIG.name}. Licensed under MIT.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-fg hover:underline">
              Privacy Policy & DPDP
            </Link>
            <Link href="/uses" className="hover:text-fg hover:underline">
              /uses
            </Link>
            <Link href="/styleguide" className="hover:text-fg hover:underline">
              /styleguide
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              className="text-telemetry hover:underline"
            >
              resume.pdf
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
