"use client";

import React from "react";
import Link from "next/link";
import { useMode } from "@/components/mode-context";
import { OWNER_CONFIG } from "@/lib/owner";
import {
  Terminal,
  Activity,
  Sun,
  Moon,
  Command,
  UserCheck,
  Radio,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const { mode, toggleMode, theme, toggleTheme } = useMode();

  const openPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-dim/80 bg-canvas/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4 font-mono text-xs">
        {/* Left: Host Indicator & Beacon */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-fg hover:text-telemetry font-bold group">
            <span className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
              <span className="absolute w-4 h-4 rounded-full bg-success/40 animate-ping"></span>
            </span>
            <span className="tracking-wide text-sm">{OWNER_CONFIG.domain}</span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-fg-muted bg-surface px-2 py-0.5 rounded-md border border-border-dim">
            <Radio className="w-3 h-3 text-telemetry" />
            <span>NODE-01 // PRODUCTION</span>
          </span>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recruiter vs Engineer Mode Toggle */}
          <button
            onClick={toggleMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              mode === "recruiter"
                ? "bg-telemetry/15 border-telemetry text-telemetry font-bold shadow-glow-telemetry/20"
                : "border-border-dim bg-surface/80 text-fg hover:bg-subtle"
            }`}
            title="Toggle Recruiter Mode (30s scan) / Engineer Mode (Deep specs)"
          >
            {mode === "recruiter" ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recruiter Mode</span>
                <span className="sm:hidden">TL;DR</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-telemetry" />
                <span className="hidden sm:inline">Engineer Mode</span>
                <span className="sm:hidden">Eng</span>
              </>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg border border-border-dim bg-surface/80 text-fg hover:bg-subtle transition-colors"
            title="Toggle theme (Light / Dark)"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-warn" /> : <Moon className="w-3.5 h-3.5 text-telemetry" />}
          </button>

          {/* Command palette button */}
          <button
            onClick={openPalette}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-dim bg-surface/80 hover:bg-subtle text-fg-muted hover:text-fg transition-colors"
            title="Open Command Palette (Cmd+K / Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cmd+K</span>
          </button>
        </div>
      </div>
    </header>
  );
}
