"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitCommit, Activity, ShieldCheck, Cpu, Clock, Terminal } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export function StatusBar() {
  const buildSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "1310747";
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          timeZone: OWNER_CONFIG.timezone,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border-dim/80 bg-canvas/90 backdrop-blur-md mt-20 text-xs font-mono text-fg-muted">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Real-time status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-border-dim/60">
          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Commit SHA</span>
            <span className="text-telemetry font-bold flex items-center gap-1">
              <GitCommit className="w-3 h-3" />
              {buildSha}
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Audit Score</span>
            <span className="text-success font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              99/100/100/100
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">System Clock ({OWNER_CONFIG.timezone})</span>
            <span className="text-fg font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-telemetry" />
              {currentTime || "23:05:00"} IST
            </span>
          </div>

          <div>
            <span className="text-fg-muted block text-[10px] uppercase">Telemetry Cluster</span>
            <span className="text-success font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-success animate-pulse" />
              100% Operational
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
              className="text-telemetry hover:underline font-bold"
            >
              resume.pdf
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
