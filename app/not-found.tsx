"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Command, ArrowLeft } from "lucide-react";

export default function NotFound() {
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
    <div className="min-h-screen bg-canvas text-fg flex flex-col items-center justify-center px-4 font-mono">
      <div className="max-w-md w-full border border-border-dim rounded bg-surface p-6 shadow-lg space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-warn/15 text-warn mx-auto flex items-center justify-center">
          <Terminal className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-fg">404: ROUTE_NOT_FOUND</h1>
          <p className="text-xs text-fg-muted">
            The requested resource could not be located in the ingress routing table.
          </p>
        </div>

        <div className="bg-canvas p-3 rounded border border-border-dim/60 text-xs text-fg-muted text-left">
          <code>&gt; HTTP/2.0 404 Not Found</code><br />
          <code>&gt; Err: URI path resolution fault</code>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-border-focus text-white text-xs font-bold hover:opacity-90"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Ingress</span>
          </Link>

          <button
            onClick={openPalette}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded border border-border-dim bg-canvas hover:bg-subtle text-fg text-xs"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Press Cmd+K to Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
