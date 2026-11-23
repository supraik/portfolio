"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "@/components/mode-context";
import { OWNER_CONFIG } from "@/lib/owner";
import {
  Search,
  Terminal,
  FileText,
  Briefcase,
  AlertOctagon,
  Moon,
  Sun,
  Copy,
  Download,
  ExternalLink,
  X,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { mode, toggleMode, theme, toggleTheme } = useMode();
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(OWNER_CONFIG.email_public);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1200);
  };

  const actions = [
    {
      category: "Navigation",
      items: [
        { label: "Jump to Overview (README)", icon: FileText, action: () => router.push("/#about") },
        { label: "Jump to Services (Architecture)", icon: Terminal, action: () => router.push("/#services") },
        { label: "Jump to Career git log", icon: Briefcase, action: () => router.push("/#experience") },
        { label: "Jump to Incident Postmortems", icon: AlertOctagon, action: () => router.push("/#incidents") },
        { label: "Jump to Technical Runbooks", icon: FileText, action: () => router.push("/#runbooks") },
        { label: "Open Contact Ticket", icon: Terminal, action: () => router.push("/#contact") },
        { label: "View Workstation Tools (/uses)", icon: Terminal, action: () => router.push("/uses") },
        { label: "Privacy Policy (/privacy)", icon: FileText, action: () => router.push("/privacy") },
      ],
    },
    {
      category: "System Actions",
      items: [
        {
          label: `Switch Reading Mode (Current: ${mode})`,
          icon: Terminal,
          action: () => toggleMode(),
        },
        {
          label: `Toggle Color Theme (Current: ${theme})`,
          icon: theme === "dark" ? Sun : Moon,
          action: () => toggleTheme(),
        },
        {
          label: copied ? "Email Copied!" : `Copy Public Email (${OWNER_CONFIG.email_public})`,
          icon: Copy,
          action: copyEmail,
        },
        {
          label: "Download Résumé (PDF)",
          icon: Download,
          action: () => window.open("/resume.pdf", "_blank"),
        },
        {
          label: "Inspect Raw JSON Résumé (/resume.json)",
          icon: ExternalLink,
          action: () => window.open("/resume.json", "_blank"),
        },
      ],
    },
  ];

  const filtered = actions
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border-dim rounded-lg shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-dim bg-canvas">
          <Search className="w-4 h-4 text-telemetry shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section... (Esc to close)"
            className="w-full bg-transparent text-fg placeholder:text-fg-muted outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close command palette"
            className="text-fg-muted hover:text-fg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-fg-muted">No commands found for &ldquo;{query}&rdquo;</div>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-3 py-1 text-[10px] text-fg-muted uppercase tracking-wider font-semibold">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        if (!copied) setOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded text-fg hover:bg-subtle text-left transition-colors focus-visible:bg-subtle"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-telemetry shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-fg-muted text-[10px]">&crarr;</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-border-dim bg-canvas/80 flex items-center justify-between text-[10px] text-fg-muted">
          <span>Navigate with &uarr; &darr; &bull; Enter to select</span>
          <span>Antigravity / Next.js Production System</span>
        </div>
      </div>
    </div>
  );
}
