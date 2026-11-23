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
  FileText,
  UserCheck,
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
    <header className="sticky top-0 z-40 w-full border-b border-border-dim bg-canvas/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4 font-mono text-xs">
        {/* Left: Host Indicator */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-fg hover:text-telemetry font-bold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>{OWNER_CONFIG.domain}</span>
          </Link>
          <span className="hidden sm:inline text-fg-muted text-[11px]">
            [sys: operational]
          </span>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recruiter vs Engineer Mode Toggle */}
          <button
            onClick={toggleMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              mode === "recruiter"
                ? "bg-telemetry/10 border-telemetry text-telemetry font-bold"
                : "border-border-dim bg-surface text-fg hover:bg-subtle"
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
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Engineer Mode</span>
                <span className="sm:hidden">Eng</span>
              </>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-1.5 rounded border border-border-dim bg-surface text-fg hover:bg-subtle"
            title="Toggle theme (Light / Dark)"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-warn" /> : <Moon className="w-3.5 h-3.5 text-telemetry" />}
          </button>

          {/* Command palette button */}
          <button
            onClick={openPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border-dim bg-surface hover:bg-subtle text-fg-muted hover:text-fg"
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
