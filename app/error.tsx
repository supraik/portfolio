"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to devtools without PII
    console.error("[INTERNAL_SERVICE_FAULT]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col items-center justify-center px-4 font-mono">
      <div className="max-w-lg w-full border border-crit/40 rounded bg-surface p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border-dim pb-3 text-xs">
          <span className="text-crit font-bold flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            INCIDENT // 500_INTERNAL_SERVICE_EXCEPTION
          </span>
          <span className="text-fg-muted">SEV-1 ALERT</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-lg font-bold text-fg">Unhandled Upstream Execution Fault</h1>
          <p className="text-xs text-fg-muted">
            The service encountered an unhandled exception while evaluating this server component.
          </p>
        </div>

        <div className="bg-canvas p-3 rounded border border-border-dim/60 text-xs text-fg-muted space-y-1 font-mono">
          <div className="text-crit font-semibold">Error Message:</div>
          <div className="text-fg break-all">{error.message || "An unexpected error occurred."}</div>
          {error.digest && (
            <div className="text-[10px] text-fg-muted">Digest Hash: {error.digest}</div>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-border-focus text-white font-bold hover:opacity-90"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Attempt Retry / Re-render</span>
          </button>

          <Link
            href="/"
            className="text-telemetry hover:underline py-2"
          >
            Return to root dashboard &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
